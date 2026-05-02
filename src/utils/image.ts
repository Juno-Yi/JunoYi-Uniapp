/**
 * 图片工具类
 * 用于处理图片路径、加载、显示等相关功能
 */

import { getApiUrl } from '@/config'

/**
 * 处理图片路径，如果是相对路径则添加后端地址
 * @param path 图片路径（相对路径或完整URL）
 * @returns 完整的图片URL
 * @example
 * getImageUrl('/upload/image.jpg') // => 'http://localhost:7588/upload/image.jpg'
 * getImageUrl('https://example.com/image.jpg') // => 'https://example.com/image.jpg'
 */
export function getImageUrl(path: string): string {
  if (!path) return ''
  
  // 如果已经是完整的 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // 相对路径，添加后端地址
  const baseUrl = getApiUrl()
  const imagePath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${imagePath}`
}

/**
 * 批量处理图片路径
 * @param paths 图片路径数组
 * @returns 完整的图片URL数组
 */
export function getImageUrls(paths: string[]): string[] {
  return paths.map(path => getImageUrl(path))
}

/**
 * 处理对象中的图片字段
 * @param obj 包含图片字段的对象
 * @param imageFields 需要处理的图片字段名数组
 * @returns 处理后的对象
 * @example
 * const item = { id: 1, cover: '/upload/cover.jpg', avatar: '/upload/avatar.jpg' }
 * processImageFields(item, ['cover', 'avatar'])
 */
export function processImageFields<T extends Record<string, any>>(
  obj: T,
  imageFields: (keyof T)[]
): T {
  const result = { ...obj }
  imageFields.forEach(field => {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = getImageUrl(result[field] as string) as any
    }
  })
  return result
}

/**
 * 批量处理对象数组中的图片字段
 * @param list 对象数组
 * @param imageFields 需要处理的图片字段名数组
 * @returns 处理后的对象数组
 */
export function processImageFieldsList<T extends Record<string, any>>(
  list: T[],
  imageFields: (keyof T)[]
): T[] {
  return list.map(item => processImageFields(item, imageFields))
}

/**
 * 获取默认占位图
 * @param type 图片类型（avatar-头像, cover-封面, banner-横幅）
 * @returns 占位图URL
 */
export function getPlaceholderImage(type: 'avatar' | 'cover' | 'banner' = 'cover'): string {
  const placeholders = {
    avatar: '/static/placeholder-avatar.png',
    cover: '/static/placeholder-cover.png',
    banner: '/static/placeholder-banner.png',
  }
  return placeholders[type] || placeholders.cover
}

/**
 * 预加载图片
 * @param url 图片URL
 * @returns Promise，加载成功或失败
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: () => resolve(),
      fail: (err) => reject(err),
    })
  })
}

/**
 * 批量预加载图片
 * @param urls 图片URL数组
 * @returns Promise，所有图片加载完成
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(url => preloadImage(url)))
}

export default {
  getImageUrl,
  getImageUrls,
  processImageFields,
  processImageFieldsList,
  getPlaceholderImage,
  preloadImage,
  preloadImages,
}

