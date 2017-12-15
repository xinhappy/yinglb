import Vue from 'vue'
import Router from 'vue-router'
import store from 'src/store'
import * as types from 'src/store/mutation-types'
import Community from 'components/community/community'
import Login from 'components/login/login'
import CompanyList from 'components/company/company-list/company-list'
import CompanyDetail from 'components/company/company-detail/company-detail'
import CompanyAppraise from 'components/company/company-appraise/company-appraise'
import Runner from 'components/runner/runner'
import Home from 'components/home/home'
import UserInfo from 'components/home/userInfo'
import Search from 'components/search/search'
import SearchResult from 'components/search/search-result'
import Circle from 'components/circle/circle'
import Pay from 'components/pay/pay'
import PayResult from 'components/pay/pay-result'
import Zhuan from 'components/pay/zhuan'
import PayCompany from 'components/pay/pay-company'
import SetAddress from 'components/address/select-address'
import AddAddress from 'components/address/add-address'
import SetPwd from 'components/pwd/set-pwd'
import ItemList from 'components/company/company-item/item-list/item-list'
import ItemDetail from 'components/company/company-item/item-detail/item-detail'

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
      path: '/companyDetail',
      name: 'companyDetail',
      component: CompanyDetail
    },
    {
      path: '/companyAppraise/:id',
      name: 'companyAppraise',
      component: CompanyAppraise
    },
    {
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
      path: '/itemDetail',
      name: 'itemDetail',
      component: ItemDetail
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
    {
      path: '/payResult',
      name: 'payResult',
      component: PayResult
    },
    {
      path: '/zhuan/:sum',
      name: 'zhuan',
      component: Zhuan
    },
    {
      path: '/payCompany',
      name: 'payCompany',
      component: PayCompany
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
      path: '/userInfo',
      name: 'userInfo',
      component: UserInfo
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
