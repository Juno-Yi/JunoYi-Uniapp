<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores'
import { onLoad, onShow } from '@dcloudio/uni-app'

const userStore = useUserStore()


onLoad(() => {

})

// 页面显示时候加载数据
onShow(() => {

})

// 监听登录状态变化
watch(() => userStore.isLogin, (isLogin) => {

})

</script>

<template>
  <app-page show-tabbar :nav-scroll-change="true" :disable-scroll="true">
    <view class="mine-page">
      
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
