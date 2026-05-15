import request from '@/utils/request'

/**
 * 登录
 */
export function fetchLogin(data: Api.Auth.WeChatMpLoginDTO) {
  return request.post<Api.Auth.AuthVO>({
    url: '/auth/wechat/mp/login',
    data: data,
  })
}

/**
 * 刷新accessToken
 */
export function fetchRefreshToken(refreshToken: string){
  return request.post<Api.Auth.AuthVO>({
    url: '/auth/wechat/mp/refresh',
    params: { refreshToken: refreshToken }
  })
}

/**
 * 退出当前会话登录
 */
export function fetchLogout(){
  return request.post<void>({
    url: '/auth/wechat/mp/logout'
  })
}

/**
 * 获取用户信息
 */
export function fetchGetInfo(){
  return request.get<Api.Auth.OauthUserInfoVO>({
    url: '/auth/wechat/mp/info'
  })
}