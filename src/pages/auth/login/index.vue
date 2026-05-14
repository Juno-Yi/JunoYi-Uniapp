<!-- 小程序一键登录 -->
<script setup lang="ts">
/**
 * 登录
 */
const login = () => {

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