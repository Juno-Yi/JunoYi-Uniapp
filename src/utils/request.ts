/**
 * 简单的 uni.request 封装
 */

import { getApiUrl } from '@/config'
import { useUserStore } from '@/stores'

type UserStore = ReturnType<typeof useUserStore>

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  url: string
  method?: RequestMethod
  data?: any
  params?: Record<string, any>
  header?: Record<string, any>
  _retry?: boolean
}

interface RequestConfig {
  url: string
  method?: RequestMethod
  data?: any
  params?: Record<string, any>
  header?: Record<string, any>
}
interface ApiResponse<T = any> {
  code: number
  data: T
  msg?: string
}

const SUCCESS_CODE = 200
const SESSION_EXPIRED_CODE = 401
const REFRESH_TOKEN_ENDPOINT = '/wechat/mp/refresh'
const DEFAULT_ERROR_MESSAGE = '请求失败'
const SESSION_EXPIRED_MESSAGE = '会话已失效，请重新登录'

// 防止重复弹窗
let isShowingLoginModal = false

/**
 * 显示登录授权弹窗
 */
function showLoginModal(userStore: UserStore) {
  console.log('[Request] 准备显示登录弹窗, isShowingLoginModal:', isShowingLoginModal)

  if (isShowingLoginModal) {
    console.log('[Request] 登录弹窗已在显示中，跳过')
    return Promise.reject(new Error('用户取消登录'))
  }

  isShowingLoginModal = true
  console.log('[Request] 开始显示登录弹窗')

  return new Promise<void>((resolve, reject) => {
    uni.showModal({
      title: '登录提示',
      content: '登录已过期，请重新授权登录',
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        console.log('[Request] 登录弹窗用户操作:', res.confirm ? '确定' : '取消')
        isShowingLoginModal = false
        if (res.confirm) {
          // 用户点击确定，跳转到登录页
          userStore.logout()
          uni.reLaunch({
            url: '/pages/auth/index'
          })
          resolve()
        } else {
          // 用户点击取消
          userStore.logout()
          reject(new Error('用户取消登录'))
        }
      },
      fail: (err) => {
        console.error('[Request] 登录弹窗显示失败:', err)
        isShowingLoginModal = false
        reject(new Error('弹窗显示失败'))
      }
    })
  })
}

function refreshAccessToken(userStore: UserStore) {
  console.log('[Request] 开始刷新 token')
  return new Promise<string>((resolve, reject) => {
    const token = userStore.refreshToken
    if (!token) {
      console.log('[Request] 没有 refreshToken，退出登录')
      userStore.logout()
      reject(new Error(SESSION_EXPIRED_MESSAGE))
      return
    }

    console.log('[Request] 发送刷新 token 请求')
    uni.request({
      url: `${getApiUrl()}${REFRESH_TOKEN_ENDPOINT}`,
      method: 'POST',
      data: {
        refreshToken: token,
      },
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        console.log('[Request] 刷新 token 响应:', res.statusCode, res.data)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const response = res.data as ApiResponse<Api.Auth.AuthVO>
          const tokenData = response?.data
          if (response?.code === SUCCESS_CODE && tokenData?.accessToken) {
            console.log('[Request] 刷新 token 成功')
            userStore.setToken(tokenData.accessToken, tokenData.refreshToken)
            resolve(tokenData.accessToken)
            return
          }
        }
        console.log('[Request] 刷新 token 失败，退出登录')
        userStore.logout()
        reject(new Error(SESSION_EXPIRED_MESSAGE))
      },
      fail: (err) => {
        console.error('[Request] 刷新 token 请求失败:', err)
        userStore.logout()
        reject(err instanceof Error ? err : new Error(SESSION_EXPIRED_MESSAGE))
      },
    })
  })
}

function handleSessionExpired<T>(
  options: RequestOptions,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
  userStore: UserStore,
) {
  console.log('[Request] 处理会话过期, _retry:', options._retry)

  // 如果已经重试过，直接显示登录弹窗
  if (options._retry) {
    console.log('[Request] 已重试过，显示登录弹窗')
    showLoginModal(userStore)
      .then(() => reject(new Error(SESSION_EXPIRED_MESSAGE)))
      .catch((error) => reject(error))
    return
  }

  // 首次遇到 401，尝试刷新 token
  console.log('[Request] 首次遇到 401，尝试刷新 token')
  refreshAccessToken(userStore)
    .then(() => {
      console.log('[Request] token 刷新成功，重试请求')
      return request<T>({ ...options, _retry: true })
    })
    .then(resolve)
    .catch((error) => {
      // 刷新 token 失败，显示登录弹窗
      console.log('[Request] token 刷新失败，显示登录弹窗')
      showLoginModal(userStore)
        .then(() => reject(error instanceof Error ? error : new Error(SESSION_EXPIRED_MESSAGE)))
        .catch((err) => reject(err))
    })
}


/**
 * 请求封装
 */
export async function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, params, header = {} } = options

  let fullUrl = url.startsWith('http') ? url : `${getApiUrl()}${url}`

  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')

    if (queryString) {
      fullUrl += fullUrl.includes('?') ? `&${queryString}` : `?${queryString}`
    }
  }

  const userStore = useUserStore()
  const token = userStore?.accessToken
  const authHeader = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data,
      header: {
        'content-type': 'application/json',
        ...authHeader,
        ...header,
      },
      success: (res) => {
        console.log('[Request] 请求响应:', fullUrl, 'statusCode:', res.statusCode, 'code:', (res.data as any)?.code)

        // 先检查业务状态码（无论 HTTP 状态码是什么）
        const response = res.data as ApiResponse<T>

        // 处理 401 会话过期（优先级最高）
        if (response?.code === SESSION_EXPIRED_CODE) {
          console.log('[Request] 检测到业务码 401，处理会话过期')
          handleSessionExpired(options, resolve, reject, userStore)
          return
        }

        // 处理 HTTP 状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (response?.code === SUCCESS_CODE) {
            resolve(response.data)
          } else {
            reject(new Error(response?.msg || DEFAULT_ERROR_MESSAGE))
          }
        } else if (res.statusCode === 401) {
          // HTTP 401 也当作会话过期处理
          console.log('[Request] 检测到 HTTP 401，处理会话过期')
          handleSessionExpired(options, resolve, reject, userStore)
        } else {
          reject(new Error(`请求错误 [${res.statusCode}]`))
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

function formatConfig(method: RequestMethod, url: string | RequestConfig, data?: any) {
  if (typeof url === 'string') {
    return { url, method, data }
  }
  return { ...url, method }
}

/**
 * GET 请求
 */
export function get<T = any>(
  config: string | RequestConfig,
  data?: any,
): Promise<T> {
  return request<T>(formatConfig('GET', config, data))
}

/**
 * POST 请求
 */
export function post<T = any>(
  config: string | RequestConfig,
  data?: any,
): Promise<T> {
  return request<T>(formatConfig('POST', config, data))
}

/**
 * PUT 请求
 */
export function put<T = any>(
  config: string | RequestConfig,
  data?: any,
): Promise<T> {
  return request<T>(formatConfig('PUT', config, data))
}

/**
 * DELETE 请求
 */
export function del<T = any>(
  config: string | RequestConfig,
  data?: any,
): Promise<T> {
  return request<T>(formatConfig('DELETE', config, data))
}

export default {
  request,
  get,
  post,
  put,
  del,
  delete: del,
}

