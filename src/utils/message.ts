import { createDiscreteApi } from 'naive-ui'

type confirmType = {
  title: string
  content: string
  positiveText: string
  negativeText: string
}
const { message, dialog, notification, loadingBar } = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'])
const $confirm = (opt?: Partial<confirmType>) => {
  const options = {
    title: '提示',
    content: '确定要删除吗?',
    positiveText: '确定',
    negativeText: '取消',
    ...opt,
  }
  return new Promise((resolve) => {
    const d = dialog.info({
      title: options.title,
      content: options.content,
      positiveText: options.positiveText,
      negativeText: options.negativeText,
      maskClosable: false,
      onPositiveClick: async () => {
        d.loading = true
        setTimeout(() => {
          d.loading = false
          resolve('')
        }, 100)
      },
    })
  })
}
export { message, dialog, notification, loadingBar, $confirm }
