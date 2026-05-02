import type { DarkMode } from 'uview-pro/types/global'
import { defineStore } from 'pinia'
import { useLocale, useTheme } from 'uview-pro'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userId = ref('')
  const userName = ref('')
  const nickName = ref('')
  const avatar = ref('')
  const phoneNumber = ref('')
  const email = ref('')
  const isLogin = ref(false)

  // Token 管理
  const accessToken = ref('')
  const refreshToken = ref('')

  // 用户偏好设置
  const preferences = ref({
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
  })

  const { setDarkMode } = useTheme()
  const { setLocale } = useLocale()

  /**
   * 登录
   * @param name 用户名
   */
  function login(name: string) {
    if (!name || !name.trim()) {
      throw new Error('用户名不能为空')
    }
    userName.value = name
    isLogin.value = true
  }

  /**
   * 设置 Token
   * @param access 访问令牌
   * @param refresh 刷新令牌
   */
  function setToken(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    isLogin.value = true
  }

  /**
   * 设置用户信息
   * @param userInfo 用户信息
   */
  function setUserInfo(userInfo: {
    userId?: string
    userName?: string
    nickName?: string
    avatar?: string
    phoneNumber?: string
    email?: string
  }) {
    // 注意：这里要用 undefined 判断，不能用 truthy 判断
    // 否则 ''（清空邮箱/手机号）这类合法值不会写入，导致缓存还是旧值
    if (userInfo.userId !== undefined) userId.value = userInfo.userId
    if (userInfo.userName !== undefined) userName.value = userInfo.userName
    if (userInfo.nickName !== undefined) nickName.value = userInfo.nickName
    if (userInfo.avatar !== undefined) avatar.value = userInfo.avatar
    if (userInfo.phoneNumber !== undefined) phoneNumber.value = userInfo.phoneNumber
    if (userInfo.email !== undefined) email.value = userInfo.email
  }

  /**
   * 退出登录
   */
  function logout() {
    isLogin.value = false
    userId.value = ''
    userName.value = ''
    nickName.value = ''
    avatar.value = ''
    phoneNumber.value = ''
    email.value = ''
    accessToken.value = ''
    refreshToken.value = ''
  }

  /**
   * 更新主题
   * @param theme 主题模式
   */
  function updateTheme(theme: DarkMode) {
    preferences.value.theme = theme
    try {
      setDarkMode(theme)
    }
    catch {
      // ignore if hook not available in runtime
    }
  }

  /**
   * 设置语言
   * @param locale 语言代码
   */
  function setLanguage(locale: string) {
    preferences.value.language = locale
    try {
      setLocale(locale)
    }
    catch {
      // ignore
    }
  }

  /**
   * 切换通知开关
   */
  function toggleNotifications() {
    preferences.value.notifications = !preferences.value.notifications
  }

  /**
   * 清空所有数据
   */
  function clearData() {
    uni.clearStorage()
    userId.value = ''
    userName.value = ''
    nickName.value = ''
    avatar.value = ''
    phoneNumber.value = ''
    email.value = ''
    isLogin.value = false
    accessToken.value = ''
    refreshToken.value = ''
    preferences.value = {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
    }
  }

  return {
    // 状态
    userId,
    userName,
    nickName,
    avatar,
    phoneNumber,
    email,
    isLogin,
    accessToken,
    refreshToken,
    preferences,
    // 方法
    login,
    logout,
    setToken,
    setUserInfo,
    updateTheme,
    setLanguage,
    toggleNotifications,
    clearData,
  }
}, { persist: true })
