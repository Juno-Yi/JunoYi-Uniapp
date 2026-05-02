<script setup lang="ts">
import { onLoad, onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app'

// 页面加载
onLoad(() => {

})

// 页面显示
onShow(() => {

})

// 分享给朋友
onShareAppMessage(() => {
  return {
    title: '分享给好朋友',
    path: '/pages/home/index',
    imageUrl: ''
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: '分享到朋友圈',
    query: '',
    imageUrl: ''
  }
})

</script>

<template>
  <app-page nav-title="首页" show-tabbar :nav-scroll-change="true" @scrolltolower="">
    <view class="home-page">
      
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
