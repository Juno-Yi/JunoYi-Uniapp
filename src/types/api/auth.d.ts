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

    /** 登录用户信息 VO */
    interface OauthUserInfoVO {
        userId: number
        userName: string
        nickName: string
        avatar: string
        phoneNumber: string
        email: string
    }
}