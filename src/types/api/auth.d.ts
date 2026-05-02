/**
 * 认证类型
 */
declare namespace Api.Auth {

    /** 小程序登录传输请求 */
    interface WeChatMpLoginDTO {
        code: string
    }

    /** 登录成功响应 */
    interface AuthVO {
        accessToken: string,
        refreshToken: string
    }

    
}