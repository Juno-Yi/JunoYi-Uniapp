/**
 * 文件下载工具
 */

import { getApiUrl } from '@/config'
import { useUserStore } from '@/stores'

/**
 * 下载文档参数
 */
export interface DownloadDocFileParams {
    docId: number
    timestamp: number
    nonce: string
    sign: string
    fileName?: string
    fileType?: string  // 文件类型/扩展名，如 'pdf', 'docx', 'xlsx' 等
}

/**
 * 文件信息
 */
export interface FileInfo {
    filePath: string
    fileName: string
    fileType: string
}

/**
 * 下载文档文件（临时预览，不保存）
 */
export function downloadDocFileForPreview({ docId, timestamp, nonce, sign, fileName = '文档', fileType = 'pdf' }: DownloadDocFileParams): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
        // 构建下载URL
        const baseUrl = getApiUrl()
        const url = `${baseUrl}/mp/file/download?docId=${docId}&timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

        console.log('下载 URL:', url)
        console.log('文件名:', fileName, '文件类型:', fileType)

        // 获取用户 token
        const userStore = useUserStore()
        const token = userStore?.accessToken

        // 显示下载提示
        uni.showLoading({
            title: '加载中...',
            mask: true
        })

        // 使用 uni.downloadFile 下载文件到临时目录
        const downloadTask = uni.downloadFile({
            url: url,
            header: token ? {
                'Authorization': `Bearer ${token}`
            } : {},
            success: (res) => {
                uni.hideLoading()

                if (res.statusCode === 200) {
                    // 下载成功，返回临时文件路径
                    const tempFilePath = res.tempFilePath
                    console.log('临时文件路径:', tempFilePath)

                    // 直接返回临时文件信息，不保存到用户数据域
                    resolve({
                        filePath: tempFilePath,
                        fileName: fileName,
                        fileType: fileType
                    })
                } else {
                    uni.showToast({
                        title: '下载失败',
                        icon: 'none'
                    })
                    reject(new Error(`下载失败，状态码：${res.statusCode}`))
                }
            },
            fail: (err) => {
                uni.hideLoading()
                console.error('下载失败:', err)
                uni.showToast({
                    title: '下载失败',
                    icon: 'none'
                })
                reject(err)
            }
        })

        // 监听下载进度
        downloadTask.onProgressUpdate((res) => {
            console.log('下载进度', res.progress)
            uni.showLoading({
                title: `加载中 ${res.progress}%`,
                mask: true
            })
        })
    })
}

/**
 * 下载文档文件
 */
export function downloadDocFile({ docId, timestamp, nonce, sign, fileName = '文档', fileType = 'pdf' }: DownloadDocFileParams): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
        // 构建下载URL（修正为后端实际路径）
        const baseUrl = getApiUrl()
        const url = `${baseUrl}/mp/file/download?docId=${docId}&timestamp=${timestamp}&nonce=${nonce}&sign=${sign}`

        console.log('下载 URL:', url)
        console.log('文件名:', fileName, '文件类型:', fileType)

        // 获取用户 token
        const userStore = useUserStore()
        const token = userStore?.accessToken

        // 显示下载提示
        uni.showLoading({
            title: '加载中...',
            mask: true
        })

        // 使用 uni.downloadFile 下载文件（不指定 filePath，让系统自动生成临时文件）
        const downloadTask = uni.downloadFile({
            url: url,
            header: token ? {
                'Authorization': `Bearer ${token}`
            } : {},
            success: (res) => {
                uni.hideLoading()

                if (res.statusCode === 200) {
                    // 下载成功，保存文件
                    const tempFilePath = res.tempFilePath
                    console.log('临时文件路径:', tempFilePath)

                    // #ifdef MP-WEIXIN
                    // 微信小程序：保存到相册或打开文档
                    saveFileToLocal(tempFilePath, fileName, fileType, resolve, reject)
                    // #endif

                    // #ifdef H5
                    // H5环境：直接触发下载
                    window.open(url)
                    uni.showToast({
                        title: '下载成功',
                        icon: 'success'
                    })
                    resolve({
                        filePath: tempFilePath,
                        fileName: fileName,
                        fileType: fileType
                    })
                    // #endif

                    // #ifdef APP-PLUS
                    // APP环境：保存到本地
                    saveFileToLocal(tempFilePath, fileName, fileType, resolve, reject)
                    // #endif
                } else {
                    uni.showToast({
                        title: '下载失败',
                        icon: 'none'
                    })
                    reject(new Error(`下载失败，状态码：${res.statusCode}`))
                }
            },
            fail: (err) => {
                uni.hideLoading()
                console.error('下载失败:', err)
                uni.showToast({
                    title: '下载失败',
                    icon: 'none'
                })
                reject(err)
            }
        })

        // 监听下载进度
        downloadTask.onProgressUpdate((res) => {
            console.log('下载进度', res.progress)
            uni.showLoading({
                title: `加载中 ${res.progress}%`,
                mask: true
            })
        })
    })
}

/**
 * 保存文件到本地（微信小程序/APP）
 * 返回保存后的文件路径
 */
function saveFileToLocal(
    tempFilePath: string,
    fileName: string,
    fileType: string,
    resolve: (value?: any) => void,
    reject: (reason?: any) => void
) {
    const fileExtension = fileType.startsWith('.') ? fileType : `.${fileType}`
    const savedFileName = `${fileName}${fileExtension}`

    // #ifdef MP-WEIXIN
    // 微信小程序：保存到用户数据目录
    const fs = uni.getFileSystemManager()
    const savedFilePath = `${wx.env.USER_DATA_PATH}/${savedFileName}`

    console.log('保存文件:', savedFilePath)

    try {
        // 复制临时文件到用户数据目录
        fs.copyFileSync(tempFilePath, savedFilePath)
        console.log('文件已保存到:', savedFilePath)

        // 返回保存后的文件路径
        resolve({
            filePath: savedFilePath,
            fileName: savedFileName,
            fileType: fileType
        })
    } catch (err) {
        console.error('保存文件失败:', err)
        uni.showToast({
            title: '保存文件失败',
            icon: 'none'
        })
        reject(err)
    }
    // #endif

    // #ifdef APP-PLUS
    // APP环境：保存到文件系统
    plus.io.resolveLocalFileSystemURL('_downloads/', (entry) => {
        entry.getFile(savedFileName, { create: true }, (fileEntry) => {
            // 复制文件
            plus.io.resolveLocalFileSystemURL(tempFilePath, (tempEntry) => {
                tempEntry.copyTo(entry, savedFileName, () => {
                    resolve({
                        filePath: fileEntry.fullPath,
                        fileName: savedFileName,
                        fileType: fileType
                    })
                }, (err: any) => {
                    console.error('保存失败:', err)
                    uni.showToast({
                        title: '保存失败',
                        icon: 'none'
                    })
                    reject(err)
                })
            })
        })
    })
    // #endif
}

/**
 * 预览文档
 * @param filePath 文件路径
 * @param fileType 文件类型
 */
export function previewDocument(filePath: string, fileType: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.openDocument({
            filePath: filePath,
            fileType: fileType,
            showMenu: false,  // 禁止分享菜单
            success: () => {
                resolve()
            },
            fail: (err) => {
                console.error('打开文档失败:', err)
                uni.showToast({
                    title: '预览失败',
                    icon: 'none',
                    duration: 2000
                })
                reject(err)
            }
        })
        // #endif

        // #ifdef H5
        // H5 环境暂不支持预览
        uni.showToast({
            title: 'H5 暂不支持预览',
            icon: 'none'
        })
        reject(new Error('H5 暂不支持预览'))
        // #endif
    })
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(fileName: string): string {
    if (!fileName) return ''
    const lastDotIndex = fileName.lastIndexOf('.')
    return lastDotIndex > -1 ? fileName.substring(lastDotIndex + 1).toLowerCase() : ''
}

