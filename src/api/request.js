import qs from 'qs'
import axios from 'axios'
import store from 'src/store'
import * as types from 'src/store/mutation-types'
import router from 'src/router'

axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.resultCode === '-2') {
      store.commit(types.LOGOUT)
      router.replace({
        path: '/',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  }
)

export default axios
