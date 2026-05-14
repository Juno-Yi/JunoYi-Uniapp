<script setup lang="ts">
import { computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const displayName = computed(() => userStore.nickName || userStore.userName || '未登录')
const displayPhone = computed(() => userStore.phoneNumber || (userStore.isLogin ? '未绑定手机号' : '点击前往登录'))
const avatarText = computed(() => (displayName.value || '未').slice(0, 1))

function goLogin() {
  if (userStore.isLogin)
    return

  uni.navigateTo({
    url: '/pages/auth/login/index',
  })
}

onShow(() => {
  // 页面展示时依赖用户状态自动刷新
})

watch(() => userStore.isLogin, () => {
  // 监听登录状态变化，页面展示内容自动更新
})
</script>

<template>
  <app-page show-tabbar :nav-scroll-change="true" :disable-scroll="true">
    <view class="mine-page">
      <view class="user-card" @click="goLogin">
        <u-avatar
          :src="userStore.avatar"
          :text="avatarText"
          size="72"
          shape="circle"
          class="user-avatar"
        />

        <view class="user-content">
          <view class="user-name" :class="{ 'is-guest': !userStore.isLogin }">
            {{ displayName }}
          </view>
          <view class="user-phone">
            {{ displayPhone }}
          </view>
        </view>

        <view v-if="!userStore.isLogin" class="user-action">
          去登录
        </view>
      </view>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
