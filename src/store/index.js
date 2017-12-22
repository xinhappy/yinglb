/**
 * Created by xzz on 2017/12/6.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: null,
    circle: {orgId: 'ff8080815d300215015d40066a300070', text: '河南城建学院商圈'},
    goodsList: localStorage['goodsList'] ? JSON.parse(localStorage['goodsList']) : [],
    userAddress: [],
    orderDetail: []
  },
  getters: {
    sum: state => {
      var total = 0
      state.goodsList.forEach((item) => {
        total += parseFloat(item.ybPrice) * item.number
      })
      return total
    },
    goodsNumber: state => {
      var total = 0
      state.goodsList.forEach((item) => {
        total += item.number
      })
      return total
    }
  },
  mutations: {
    [types.LOGIN] (state, data) {
      // localStorage.token = data
      // state.token = data
      localStorage.setItem('userInfo', JSON.stringify(data))
      state.user = data
    },
    [types.LOGOUT] (state, data) {
      // localStorage.token = data
      // state.token = data
      localStorage.removeItem('userInfo')
      state.user = null
    },
    [types.SELECTED] (state, data) {
      state.circle = data
    },
    [types.SETADS] (state, data) {
      state.userAddress.push(data)
    },
    [types.ORDER] (state, data) {
      state.orderDetail.push(data)
    },
    addGoods: (state, data) => {
      state.goodsList = data
      // localStorage.setItem('goodsList', JSON.stringify(state.goodsList))
    },
    deleteGoods(state, index) {
      state.goodsList.splice(index, 1)
      // localStorage.setItem('goodsList', JSON.stringify(state.goodsList))
    },
    updateGoods(state, data) {
      const {index, key, value} = data
      state.goodsList[index][key] = value
      // localStorage.setItem('goodsList', JSON.stringify(state.goodsList))
    },
    clearGoods(state) {
      state.goodsList.forEach((item) => {
        item.number = 0
      })
    }
  }
})
