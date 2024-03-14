// 定义user数据
// store/modules/user.ts
import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '星白凛',
    }
  },
  // other options...
})

export default useUserStore
