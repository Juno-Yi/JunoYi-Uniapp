/**
 * 应用配置
 */

/** 环境类型 */
type EnvType = 'development' | 'production' | 'test'

/** 当前环境 */
const env: EnvType = 'development'

/** 配置项 */
interface AppConfig {
  /** API 基础地址 */
  apiBaseUrl: string
  /** API 前缀 */
  apiPrefix: string
  /** 请求超时时间（毫秒） */
  timeout: number
  /** 是否显示日志 */
  showLog: boolean
}

/** 不同环境的配置 */
const configs: Record<EnvType, AppConfig> = {
  // 开发环境
  development: {
    apiBaseUrl: 'http://localhost:7589',
    apiPrefix: '',
    timeout: 15000,
    showLog: true,
  },
  // 生产环境
  production: {
    apiBaseUrl: 'https://api.zhidai.junoyi.com',
    apiPrefix: '',
    timeout: 15000,
    showLog: false,
  },
  // 测试环境
  test: {
    apiBaseUrl: 'https://test-api.junoyi.com',
    apiPrefix: '/api',
    timeout: 15000,
    showLog: true,
  },
}

/** 当前配置 */
const config = configs[env]

/** 获取完整的 API 地址 */
export function getApiUrl(): string {
  const baseUrl = config.apiBaseUrl.endsWith('/')
    ? config.apiBaseUrl.slice(0, -1)
    : config.apiBaseUrl

  // 如果没有前缀，直接返回 baseUrl
  if (!config.apiPrefix || config.apiPrefix === '') {
    return baseUrl
  }

  const prefix = config.apiPrefix.startsWith('/')
    ? config.apiPrefix
    : `/${config.apiPrefix}`

  return `${baseUrl}${prefix}`
}

export default config

