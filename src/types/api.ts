/**
 * d类型定义
 */
declare namespace Api {
  /** 分页结果 */
  export interface PageResult<T> {
    list: T[]
    total: number
    current: number
    pages: number
    size: number
  }
}

declare namespace Api.Auth {

}

/** 认证相关 API */
export namespace AuthApi {
  /** 登录参数 */
  export interface Wechat {
    username: string
    password: string
    captchaId?: string
    captchaCode?: string
  }

  /** 登录响应 */
  export interface LoginResponse {
    accessToken: string
    refreshToken: string
    userInfo: UserInfo
  }

  /** 用户信息 */
  export interface UserInfo {
    id: string
    username: string
    nickname?: string
    avatar?: string
    email?: string
    phone?: string
    roles?: string[]
    permissions?: string[]
  }

  /** 验证码配置响应 */
  export interface CaptchaConfigResponse {
    enabled: boolean
    type: string
  }

  /** 验证码响应 */
  export interface CaptchaResponse {
    id: string
    image: string
  }
}

/** 用户相关 API */
export namespace UserApi {
  /** 用户列表查询参数 */
  export interface UserListParams {
    pageNo?: number
    pageSize?: number
    username?: string
    nickname?: string
    status?: number
  }

  /** 用户信息 */
  export interface UserInfo {
    id: string
    username: string
    nickname?: string
    avatar?: string
    email?: string
    phone?: string
    status: number
    createTime?: string
  }

  /** 分页响应 */
  export interface PageResponse<T> {
    list: T[]
    total: number
    pageNo: number
    pageSize: number
  }
}

