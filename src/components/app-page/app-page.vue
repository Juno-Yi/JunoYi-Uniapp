<script setup lang="ts">
import type { PropType } from 'vue'
import { $u } from 'uview-pro'
import { ref } from 'vue'

defineProps({
  navTitle: {
    type: String,
    default: '',
  },
  navColor: {
    type: String,
    default: '',
  },
  navBgColor: {
    type: String,
    default: '',
  },
  showNavBack: {
    type: Boolean,
    default: true,
  },
  hideNav: {
    type: Boolean,
    default: false,
  },
  showTabbar: {
    type: Boolean,
    default: false,
  },
  navScrollChange: {
    type: Boolean,
    default: false,
  },
  disableScroll: {
    type: Boolean,
    default: false,
  },
  customStyle: {
    type: [String, Object] as PropType<string | Record<string, any>>,
    default: '',
  },
  customClass: {
    type: [String, Object] as PropType<string | Record<string, any>>,
    default: '',
  },
})

// 定义事件
const emit = defineEmits(['scrolltolower'])

// 导航栏引用
const navbarRef = ref()

// 页面滚动事件
function handleScroll(e: any) {
  const scrollTop = e.detail.scrollTop
  if (navbarRef.value && navbarRef.value.setScrollTop) {
    navbarRef.value.setScrollTop(scrollTop)
  }
}

// 滚动到底部事件
function handleScrollToLower() {
  emit('scrolltolower')
}
</script>

<template>
  <view class="app-page" :class="{ 'has-tabbar': showTabbar }" :style="$u.toStyle(customStyle)">
    <!-- 自定义导航栏 -->
    <custom-navbar
      v-if="!hideNav"
      ref="navbarRef"
      :title="navTitle"
      :show-back="showNavBack && !showTabbar"
      :scroll-change="navScrollChange"
      :nav-color="navColor"
      :nav-bg-color="navBgColor"
    />

    <!-- 滚动容器 -->
    <scroll-view
      v-if="!disableScroll"
      class="page-scroll"
      scroll-y
      :scroll-with-animation="true"
      @scroll="handleScroll"
      @scrolltolower="handleScrollToLower"
    >
      <u-transition name="slide-left" :appear="true">
        <slot />
      </u-transition>
    </scroll-view>

    <!-- 非滚动容器 -->
    <view v-else class="page-content">
      <u-transition name="slide-left" :appear="true">
        <slot />
      </u-transition>
    </view>

    <app-tabbar v-if="showTabbar" />
  </view>
</template>

<style lang="scss" scoped>
.app-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $u-bg-white;
  -webkit-font-smoothing: antialiased;
  color: $u-main-color;
  transition: background 0.3s ease;

  &.has-tabbar {
    background-color: #ffffff;
  }
}

.page-scroll {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  /* 隐藏滚动条 - WebKit 内核 */
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

}

.page-content {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

/* 针对 scroll-view 内部元素 */
:deep(.uni-scroll-view) {
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
}

:deep(.uni-scroll-view-content) {
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
}
</style>
