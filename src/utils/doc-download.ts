import { fetchGetDownloadSignate, fetchSendDocFileToEmail } from '@/api/download'
import { downloadDocFileForPreview, previewDocument } from '@/utils/download'
import { useUserStore } from '@/stores'

export interface DocDownloadFlowParams {
  docId: number
  title?: string
  fileType?: string
  fileSize?: number
}

/**
 * 通用文档下载流程：
 * 1. 弹窗选择「立即预览」或「发送邮箱」
 * 2. 预览时下载临时文件并禁止分享
 * 3. 发邮箱时检查用户邮箱是否已设置
 */
export async function startDocDownloadFlow(params: DocDownloadFlowParams) {
  const userStore = useUserStore()
  const fileName = params.title || '文档'
  const fileType = params.fileType || 'pdf'

  uni.showModal({
    title: '请选择操作',
    content: '您想要立即预览还是发送到邮箱？',
    confirmText: '立即预览',
    cancelText: '发送邮箱',
    success: async (modalRes) => {
      if (modalRes.confirm) {
        await previewDoc(params.docId, fileName, fileType, params.fileSize)
      } else {
        await sendDocToEmail(params.docId, userStore.email)
      }
    }
  })
}

async function previewDoc(docId: number, fileName: string, fileType: string, fileSize?: number) {
  try {
    if (fileSize && fileSize > 10 * 1024 * 1024) {
      uni.showModal({
        title: '文件过大',
        content: '文件超过10MB，无法预览。建议发送到邮箱查看。',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    uni.showLoading({ title: '准备中...' })
    const sign = await fetchGetDownloadSignate(docId)

    uni.showLoading({ title: '加载中...' })
    const fileInfo = await downloadDocFileForPreview({
      docId,
      timestamp: sign.timestamp,
      nonce: sign.nonce,
      sign: sign.sign,
      fileName,
      fileType
    })

    uni.hideLoading()
    await previewDocument(fileInfo.filePath, fileInfo.fileType)
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error?.message || '预览失败',
      icon: 'none'
    })
  }
}

async function sendDocToEmail(docId: number, email?: string) {
  if (!email || !email.trim()) {
    uni.showModal({
      title: '未设置邮箱',
      content: '您还未设置邮箱，是否前往设置？',
      confirmText: '去设置',
      cancelText: '取消',
      success: (modalRes) => {
        if (modalRes.confirm) {
          uni.navigateTo({ url: '/pages/user/user-profile/index' })
        }
      }
    })
    return
  }

  try {
    uni.showLoading({ title: '准备中...' })
    const sign = await fetchGetDownloadSignate(docId)

    uni.showLoading({ title: '发送中...' })
    await fetchSendDocFileToEmail({
      docId,
      timestamp: sign.timestamp,
      nonce: sign.nonce,
      sign: sign.sign
    })

    uni.hideLoading()
    uni.showModal({
      title: '发送成功',
      content: `文件将发送到 ${email}，请注意查收`,
      showCancel: false,
      confirmText: '知道了'
    })
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error?.message || '发送失败',
      icon: 'none'
    })
  }
}

