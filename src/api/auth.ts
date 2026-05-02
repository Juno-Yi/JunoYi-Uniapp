import request from '@/utils/request'

/**
 * 登录
 */
export function fetchLogin(data: Api.Auth.WeChatMpLoginDTO) {
  return request.post<Api.Auth.AuthVO>({
    url: '/wechat/mp/login',
    data: data,
  })
}

/**
 * 刷新accessToken
 */
export function fetchRefreshToken(refreshToken: string){
  return request.post<Api.Auth.AuthVO>({
    url: '/wechat/mp/refresh',
    params: { refreshToken: refreshToken }
  })
}

/**
 * 退出当前会话登录
 */
export function fetchLogout(){
  return request.post<void>({
    url: '/wechat/mp/logout'
  })
}