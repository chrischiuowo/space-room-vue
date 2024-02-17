import axios from 'axios'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const { openAlert, closeLoading } = modalStore

// 判斷環境
const isDev = import.meta.env.VITE_ENV === 'dev'

const useReq = axios.create()

// timeout 請求時限
axios.defaults.timeout = 1000
// retry 請求次數
axios.defaults.retry = 4
// retryDelay 請求間隙
axios.defaults.retryDelay = 1000

useReq.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    }
    return config
  },
  (request) => {
    request.method.toUpperCase()
    return request
  },
  (config) => {
    return config
  },
  (error) => {
    closeLoading()
    if (isDev) console.error(`❌ 發生錯誤：${error}`)
    return Promise.reject(error)
  }
)

useReq.interceptors.response.use(
  (response) => {
    const result = {
      ...response,
      target: response?.data?.data || {}
    }
    return result
  },
  (error) => {
    closeLoading()

    if (isDev) {
      console.log(
        `❌ ${error.response.status}: ${error.response.data.message}`,
        `API: ${error.response.config.url}，`,
        error.response
      )
    }

    if (error.response) {
      // const { status } = error.response
      // const { name } = error.response.data.error
      const { message } = error.response.data
      openAlert('error', message)
    }

    //  若 timeout 伺服器無回應，則重新打 API
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      const { config } = error
      config.__retryCount = config.__retryCount || 0

      if (config.__retryCount >= config.retry) {
        // Reject with the error
        // window.location.reload()
        return Promise.reject(error)
      }

      // Increase the retry count
      config.__retryCount += 1

      // Create new promise to handle
      const backOff = new Promise(function (resolve) {
        setTimeout(function () {
          openAlert('error', '伺服器沒有即時回應，正在嘗試重新請求服務...')
          resolve()
        }, config.retryDelay || 1)
      })

      return backOff
        .then(() => {
          return axios(config)
        })
        .catch((error) => {
          openAlert('error', '系統錯誤，請洽系統管理員')
          console.error(error)
        })
    }

    return error.response
  }
)

export default useReq
