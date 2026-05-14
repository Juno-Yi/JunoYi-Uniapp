<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const displayAvatar = computed(() => userStore.avatar || '')
const displayName = computed(() => userStore.nickName || '')
const displayPhone = computed(() => userStore.phoneNumber || '')

/**
 * 跳转登录页面
 */
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/auth/login/index'
  })
}
</script>

<template>
  <app-page show-tabbar :nav-scroll-change="true" :disable-scroll="true">
    <view class="mine-page">
     
      <!-- 用于JunoYi框架配套小程序登录Demo演示 -->
      <view class="header-box">
        <!-- 用户未登录 -->
        <view v-if="!userStore.isLogin" class="not-login">
          <text>【调试】：未登录</text>
          <button @click="goToLogin">登录</button>
        </view>
      </view>

      <!-- 用户登录 -->
      <view class="is-login" v-if="userStore.isLogin">
          <text>【调试】：已登录</text>
          <u-avatar :src="displayAvatar"></u-avatar>
          <text>用户昵称：{{ displayName }}</text>
          <text>用户手机号：{{ displayPhone }}</text>
      </view>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
