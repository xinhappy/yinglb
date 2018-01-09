/**
 * Created by xzz on 2017/12/6.
 */
import axios from './request'

// 首页获取轮播图
export function getImgs() {
  return axios.get('/api/h5AdvertisementBusiness/queryAdsH5.htm')
}

// 首页轮播咨询
export function getInfos() {
  return axios.get('/api/h5Cms/queryCmsH5.htm?programCode=information&terminalType=3')
}

// 登录
export function login(url, data) {
  return axios.post(url, data)
}

// 获取商家列表
export function getCompanyList(url) {
  return axios.get(url)
}

// 获取分类下商品列表
export function getClassCompanyList(url) {
  return axios.get(url)
}

// post
export function post(url, data) {
  return axios.post(url, data)
}

// get
export function get(url) {
  return axios.get(url)
}
