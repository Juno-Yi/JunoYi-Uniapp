<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { fetchRecordMpAccess } from '@/api/access'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

function getCurrentUserId() {
  console.log('启动时 store.userId =', userStore.userId)

  if (userStore.userId) {
    return userStore.userId
  }

  try {
    const localUser = uni.getStorageSync('user')
    console.log('启动时本地 user 缓存 =', localUser)

    if (localUser?.userId) {
      return localUser.userId
    }
  } catch (error) {
    console.error('读取本地 userId 失败：', error)
  }

  return undefined
}

onLaunch((options) => {
  // fetchRecordMpAccess({
  //   userId: getCurrentUserId(),
  //   scene: options?.scene != null ? String(options.scene) : undefined,
  //   pagePath: options?.path || undefined,
  // }).catch((error) => {
  //   console.error('记录小程序访问失败：', error)
  // })
})
</script>

<style lang="scss">
@import "uview-pro/index.scss";
@import "common/style.scss";

/* 全局背景颜色 */
page {
  background-color: #ffffff;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: hidden;
}

page::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* 隐藏所有滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
}


/* 针对 scroll-view 组件 */
scroll-view::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
}
</style>
