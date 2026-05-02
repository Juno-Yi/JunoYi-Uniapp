import type { TabbarItem } from 'uview-pro/types/global'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabbarStore = defineStore('tabbar', () => {
  const activeIndex = ref(0)
  const tabbarList = ref<TabbarItem[]>([
    {
      text: '首页',
      iconPath: '/static/tabbar/home.png',
      selectedIconPath: '/static/tabbar/home_selected.png',
      pagePath: '/pages/home/index',
    },
    {
      text: '我的',
      iconPath: '/static/tabbar/me.png',
      selectedIconPath: '/static/tabbar/me_selected.png',
      pagePath: '/pages/mine/index',
    },
  ])

  const setActiveIndex = (index: number) => {
    activeIndex.value = index
  }

  const updateBadge = (index: number, count: number) => {
    tabbarList.value[index].count = count
  }

  const updateIsDot = (index: number, isDot: boolean) => {
    tabbarList.value[index].isDot = isDot
  }

  return {
    activeIndex,
    tabbarList,
    setActiveIndex,
    updateBadge,
    updateIsDot,
  }
}, {
  persist: true,
})
