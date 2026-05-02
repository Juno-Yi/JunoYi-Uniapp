<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  title?: string
  showBack?: boolean
  scrollChange?: boolean // 是否启用滚动变化效果
  navColor?: string
  navBgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  scrollChange: false,
  navColor: '',
  navBgColor: '',
})

// 状态栏高度
const statusBarHeight = ref(0)
// 胶囊按钮信息
const menuButtonInfo = ref({
  width: 87,
  height: 32,
  top: 0,
  right: 0,
})
// 导航栏高度
const navBarHeight = ref(0)
// 滚动距离
const scrollTop = ref(0)

// 计算导航栏总高度
const totalHeight = computed(() => {
  return statusBarHeight.value + navBarHeight.value
})

// 根据滚动距离计算透明度（0-1）
const opacity = computed(() => {
  if (!props.scrollChange) return 1
  const maxScroll = 80 // 滚动80px后完全不透明
  return Math.min(scrollTop.value / maxScroll, 1)
})

// 导航栏背景色
const navBackground = computed(() => {
  if (props.navBgColor)
    return props.navBgColor

  if (!props.scrollChange) return 'transparent'
  return `rgba(255, 255, 255, ${opacity.value})`
})

// 标题颜色
const titleColor = computed(() => {
  if (props.navColor)
    return props.navColor

  if (!props.scrollChange) return '#ffffff'
  // 从白色渐变到黑色
  const r = Math.round(255 - opacity.value * (255 - 51))
  const g = Math.round(255 - opacity.value * (255 - 51))
  const b = Math.round(255 - opacity.value * (255 - 51))
  return `rgb(${r}, ${g}, ${b})`
})

// 是否显示底部边框
const showBorder = computed(() => {
  return props.scrollChange && opacity.value > 0.5
})

// 标题样式
const titleStyle = computed(() => {
  return {
    color: titleColor.value,
    lineHeight: `${navBarHeight.value}px`,
  }
})

// 返回按钮样式
const backStyle = computed(() => {
  return {
    height: `${navBarHeight.value}px`,
    lineHeight: `${navBarHeight.value}px`,
  }
})

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
  // 获取胶囊按钮信息
  const menuButton = uni.getMenuButtonBoundingClientRect()
  menuButtonInfo.value = {
    width: menuButton.width,
    height: menuButton.height,
    top: menuButton.top,
    right: systemInfo.windowWidth - menuButton.right,
  }

  // 计算导航栏高度：胶囊按钮高度 + (胶囊按钮top - 状态栏高度) * 2
  navBarHeight.value = menuButton.height + (menuButton.top - statusBarHeight.value) * 2
  // #endif

  // #ifndef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
  // 非小程序环境，使用默认高度
  navBarHeight.value = 44
  // #endif
})

// 返回上一页或返回首页
function handleBack() {
  // 获取当前页面栈
  const pages = getCurrentPages()

  // 如果页面栈长度大于1，说明有上级页面，可以返回
  if (pages.length > 1) {
    uni.navigateBack({
      delta: 1,
    })
  } else {
    // 如果页面栈长度为1，说明是直接进入的子页面，返回首页
    uni.reLaunch({
      url: '/pages/home/index'
    })
  }
}

// 暴露方法给父组件调用
defineExpose({
  setScrollTop: (top: number) => {
    scrollTop.value = top
  },
})
</script>

<template>
  <view
    class="custom-navbar"
    :class="{ 'has-border': showBorder }"
    :style="{ height: `${totalHeight}px`, background: navBackground }"
  >
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: `${statusBarHeight}px` }" />

    <!-- 导航栏内容 -->
    <view class="nav-content" :style="{ height: `${navBarHeight}px` }">
      <!-- 返回按钮 -->
      <view v-if="showBack" class="nav-back" :style="backStyle" @click="handleBack">
        <u-icon name="arrow-left" :size="32" color="black" />
      </view>

      <!-- 标题 -->
      <view class="nav-title" :style="titleStyle">
        {{ title }}
      </view>

      <!-- 右侧占位（与胶囊按钮等宽，保持标题居中） -->
      <view class="nav-right" :style="{ width: `${menuButtonInfo.width}px` }" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  transition: background 0.3s ease;

  &.has-border {
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  }
}

.status-bar {
  width: 100%;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
  position: relative;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  flex-shrink: 0;
}

.nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 30rpx;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
  transition: color 0.3s ease;
}

.nav-right {
  flex-shrink: 0;
}
</style>

