// 访问记录接口封装
// @author: Fan
import request from '@/utils/request'

/**
 * 记录小程序访问
 */
export function fetchRecordMpAccess(params?: {
  userId?: string | number
  scene?: string
  pagePath?: string
}) {
  return request.get<void>({
    url: '/mp/access/record',
    params,
  })
}

