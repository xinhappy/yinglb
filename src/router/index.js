import Vue from 'vue'
import Router from 'vue-router'
import store from 'src/store'
import * as types from 'src/store/mutation-types'
import Community from 'components/community/community'
import Login from 'components/login/login'
import CompanyList from 'components/company/company-list/company-list'
import CompanyDetail from 'components/company/company-detail/company-detail'
import Runner from 'components/runner/runner'
import Home from 'components/home/home'
import Search from 'components/search/search'
import SearchResult from 'components/search/search-result'
import Circle from 'components/circle/circle'
import Pay from 'components/pay/pay'
import SetAddress from 'components/address/select-address'
import AddAddress from 'components/address/add-address'
import SetPwd from 'components/pwd/set-pwd'
import ItemList from 'components/company/company-item/item-list/item-list'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/community',
      name: 'community',
      component: Community
    },
    {
      path: '/companyList/:id/:title',
      name: 'companyList',
      component: CompanyList
    },
    {
      path: '/runner',
      name: 'runner',
      component: Runner
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/companyDetail',
      name: 'companyDetail',
      component: CompanyDetail
    }, {
      path: '/search',
      name: 'search',
      component: Search
    }, {
      path: '/searchResult/:name',
      name: 'searchResult',
      component: SearchResult
    }, {
      path: '/circle',
      name: 'circle',
      component: Circle
    },
    {
      path: '/itemList/:id',
      name: 'itemList',
      component: ItemList
    },
    {
      path: '/pay/:mode',
      name: 'pay',
      component: Pay
    },
    {
      path: '/setAddress',
      name: 'setAddress',
      component: SetAddress
    },
    {
      path: '/addAddress/:id',
      name: 'addAddress',
      component: AddAddress
    },
    {
      path: '/setPwd',
      name: 'setPwd',
      component: SetPwd
    },
    // 重定向
    {path: '*', redirect: '/community'}
  ]
})
router.beforeEach((to, from, next) => {
  if (!store.state.user.userInfo) {
    // 获取用户信息
    next()
  } else {
    // 已经登录
    console.log('已授权')
    next()
  }
})
export default router
