import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  // data
  state: () => ({
    token: null,
    isLogin: false,
    user_id: '',
    name: '',
    avatar: {
      link: '',
      hash: ''
    }
  }),
  // methods
  actions: {
    // 登入測試
    tryLogin () {
      const token = localStorage.getItem('token')
      const tokenExpiration = localStorage.getItem('tokenExpiration')
      const expiresIn = +tokenExpiration - new Date().getTime()

      if (!token || expiresIn < 0) {
        this.logoutAuth()
        return false
      } else {
        this.token = token
        this.isLogin = true
        return true
      }
    },
    // 設定登入訊息
    setAuth (payload) {
      const expiresIn = 1000 * 3600 * 24
      const expirationDate = new Date().getTime() + expiresIn
      const { token } = payload

      localStorage.setItem('token', token)
      localStorage.setItem('tokenExpiration', expirationDate)

      this.token = token
      this.isLogin = true
    },
    // 登出會員
    logoutAuth () {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
      this.token = null
      this.isLogin = false
    },
    // 更新會員資料
    patchUser (payload) {
      this.$patch({
        ...payload
      })
    }
  }
})
