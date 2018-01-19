import Vue from 'vue'
import Router from 'vue-router'
import store from 'src/store'
import * as types from 'src/store/mutation-types'
import Community from 'components/community/community'
import Login from 'components/login/login'
import Protocol from 'components/protocol/protocol'
import Register from 'components/register/register'
import QqLoginBack from 'components/login/qqLoginBack'
import CompanyList from 'components/company/company-list/company-list'
import CompanyDetail from 'components/company/company-detail/company-detail'
import CompanyAppraise from 'components/company/company-appraise/company-appraise'
import Runner from 'components/runner/runner'
import Home from 'components/home/home'
import UserInfo from 'components/home/userInfo/userInfo'
import NickName from 'components/home/userInfo/nickname'
import Records from 'components/home/records/records'
import Order from 'components/home/order/order'
import OrderDetail from 'components/home/order/orderDetail'
import Certification from 'components/home/certification/certification'
import Recharge from 'components/home/recharge/recharge'
import RechargeRecords from 'components/home/recharge/recharge-records'
import Message from 'components/home/message/message'
import MessageDetail from 'components/home/message/message-detail'
import MessageEdit from 'components/home/message/message-edit'
import ChangePhone from 'components/home/certification/change-phone'
import ChangeOne from 'components/home/certification/change-one'
import ChangeNext from 'components/home/certification/change-next'
import BindPhone from 'components/home/certification/bind-phone'
import RealName from 'components/home/certification/real-name'
import ChangeLoginPwd from 'components/home/certification/change-loginPwd'
import ResetLoginPwd from 'components/home/certification/resetting-loginPwd'
import ResetPwd from 'components/home/certification/resetting-pwd'
import ChangePwd from 'components/home/certification/change-pwd'
import Search from 'components/search/search'
import SearchResult from 'components/search/search-result'
import Circle from 'components/circle/circle'
import Pay from 'components/pay/pay'
import PayResult from 'components/pay/pay-result'
import Zhuan from 'components/pay/zhuan'
import PayCompany from 'components/pay/pay-company'
import SetAddress from 'components/address/select-address'
import AddAddress from 'components/address/add-address'
import Address from 'components/address/address'
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
      path: '/qqLoginBack',
      name: 'qqLoginBack',
      component: QqLoginBack
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
      path: '/address',
      name: 'address',
      component: Address
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
    {
      path: '/nickname',
      name: 'nickname',
      component: NickName
    },
    {
      path: '/records',
      name: 'records',
      component: Records
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: OrderDetail
    },
    {
      path: '/certification',
      name: 'certification',
      component: Certification
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: Recharge
    },
    {
      path: '/rechargeRecords',
      name: 'rechargeRecords',
      component: RechargeRecords
    },
    {
      path: '/message',
      name: 'message',
      component: Message
    },
    {
      path: '/messageDetail',
      name: 'messageDetail',
      component: MessageDetail
    },
    {
      path: '/messageEdit',
      name: 'messageEdit',
      component: MessageEdit
    },
    {
      path: '/changePhone',
      name: 'changePhone',
      component: ChangePhone
    },
    {
      path: '/changeOne',
      name: 'changeOne',
      component: ChangeOne
    },
    {
      path: '/changeNext',
      name: 'changeNext',
      component: ChangeNext
    },
    {
      path: '/realName',
      name: 'realName',
      component: RealName
    },
    {
      path: '/changeLoginPwd',
      name: 'changeLoginPwd',
      component: ChangeLoginPwd
    },
    {
      path: '/resetLoginPwd',
      name: 'resetLoginPwd',
      component: ResetLoginPwd
    },
    {
      path: '/changePwd',
      name: 'changePwd',
      component: ChangePwd
    },
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: ResetPwd
    },
    {
      path: '/bindPhone/:id',
      name: 'bindPhone',
      component: BindPhone
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/protocol',
      name: 'protocol',
      component: Protocol
    },
    // 重定向
    {path: '*', redirect: '/community'}
  ]
})
router.beforeEach((to, from, next) => {
  if (localStorage.getItem('userInfo')) {
    // 已登录 重定向到社区
    if (to.name === 'login') {
      router.replace('/community')
    }
    next()
  } else {
    next()
  }
})
export default router
