<!-- 小程序一键登录 -->
<script setup lang="ts">
import { fetchGetInfo, fetchLogin } from '@/api/auth'
import { ref } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

type TokenPair = Api.Auth.AuthVO

// 登录协议是否勾选
const checkbox = ref(false)
// 是否在登录中
const isLogging = ref(false)


/**
 * 登录
 */
const login = () => {

  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      try {
        if (!loginRes.code)
          throw new Error('未获取到登录凭证')

        uni.showLoading({ title: '登录中' })

        const tokenPair = await getTokenPair(loginRes.code)
        if (!tokenPair.accessToken)
          throw new Error('登录失败，token 无效')

        userStore.setToken(tokenPair.accessToken, tokenPair.refreshToken)

        // 等待用户信息加载完成
        await loadUserInfo()

        uni.hideLoading()
        uni.showToast({ title: '登录成功', icon: 'success' })

        setTimeout(() => {
          uni.switchTab({ url: '/pages/home/index' })
        }, 500)
      }
      catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
        console.error(error)
      }
      finally {
        isLogging.value = false
      }
    }
  })
}

/**
 * 获取 Token 对
 * @param code 小程序登录凭证
 */
async function getTokenPair(code: string): Promise<TokenPair> {
  try {
    const res = await fetchLogin({ code })
    if (!res || !res.accessToken || !res.refreshToken) {
      throw new Error('登录结果异常')
    }

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    }
  } catch (error) {
    uni.showToast({
      title: '登录失败，请稍后再试',
      icon: 'none',
    })

    return {
      accessToken: '',
      refreshToken: '',
    }
  }
}

/**
 * 加载用户信息
 */
async function loadUserInfo(){
  try {
    const res = await fetchGetInfo()
    userStore.setUserInfo({
      userId: String(res.userId ?? ''),
      userName: res.userName,
      nickName: res.nickName,
      avatar: res.avatar,
      phoneNumber: res.phoneNumber,
      email: res.email,
    })
  } catch (error) {
    console.error('信息加载失败：',error)
    uni.showToast({
      title: '信息加载失败！',
      icon: 'error'
    })
  }

}

/**
 * 返回上一页
 */
const goBack = () => {
  uni.navigateBack();
}
</script>

<template>
  <view class="login-page">

    <!--  一键授权登录页面样式模版开发  -->
    <text>【调试】：点击登录一键授权登录</text>
    <button @click="login">登录</button>
    <button @click="goBack">暂不登录</button>

  </view>
</template>



<style scoped lang="scss">
@import './style';
</style>