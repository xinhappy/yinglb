<template>
  <div>
    <div>
      <x-header
                :left-options="{showBack: false}">我的
        <a href="#/message" slot="right" style="color: #fff">消息</a>
      </x-header>
      <div class="top clearfix">
        <div class="fl top_left">
          <img :src="userInfo.photoUrl ? userInfo.photoUrl : defaultUrl" alt="">
          {{userInfo.userPhone}}
        </div>
        <router-link to="/userInfo">
          <img src="../../assets/i_row_white_right.png" style="width: 2vw;float: right;margin-top: 2vw;" alt="">
        </router-link>
      </div>
      <div class="account">
        <p><img src="../../assets/home/i_center_income.png" alt="">我的盈磅</p>
        <div class="clearfix bottom">
          <span style="margin-left: 7vw;color: #777">账户余额</span>
          <p class="fr right">
            {{account.rebateBalance}}
            <a style="margin-left: 1vw" @click="recharge">充值</a>
          </p>
        </div>
      </div>
      <div class="room">
        <div class="item clearfix" @click="to('/records')">
          <img src="../../assets/home/i_center_consume.png" alt="">
          <span>消费记录</span>
          <a class="fr"><img src="../../assets/i_row_right_gray.png" alt=""></a>
        </div>
        <div class="item clearfix" @click="to('/order')">
          <img src="../../assets/home/i_center_consume.png" alt="">
          <span>我的订单</span>
          <a class="fr"><img src="../../assets/i_row_right_gray.png" alt=""></a>
        </div>
        <div class="item clearfix" @click="to('/certification')">
          <img src="../../assets/home/i_center_ident.png" alt="">
          <span>个人认证</span>
          <a class="fr"><img src="../../assets/i_row_right_gray.png" alt=""></a>
        </div>
        <div class="item clearfix" @click="to('/companyList/00/我的收藏')">
          <img src="../../assets/home/i_center_collect.png" alt="">
          <span>我的收藏</span>
          <a class="fr"><img src="../../assets/i_row_right_gray.png" alt=""></a>
        </div>
        <div class="item clearfix" @click="to('/address')">
          <img src="../../assets/home/i_dq.png" alt="">
          <span>地址管理</span>
          <a class="fr"><img src="../../assets/i_row_right_gray.png" alt=""></a>
        </div>
      </div>
      <div style="text-align: center;margin-top: 10vw">
        <button class="btn" @click="logout">退 出</button>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader} from 'vux'
  import Footer from 'components/footer/footer'
  import * as ApiService from 'api/api'
  import * as types from 'src/store/mutation-types'
  export default {
    components: {
      'v-footer': Footer,
      XHeader
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        defaultUrl: '../../assets/icon_cell.png',
        account: ''
      }
    },
    created () {
      this.getAccount()
    },
    methods: {
      getAccount () {
        ApiService.get('/api/h5StagingRule/getMemberDataH5.htm?userId=' + this.userInfo.id + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag').then(res => {
          if (res.data.resultCode === '1') {
            this.account = res.data.object
          }
        })
      },
      to (path) {
        this.$router.push(path)
      },
      recharge () {
        if (this.userInfo.realNameStatus !== 2) {
          this.$router.push('/realName')
        } else {
          this.$router.push('/recharge')
        }
      },
      logout () {
        ApiService.post('/api/h5Member/logoutH5.htm', {
          userId: this.userInfo.id,
          loginInfo: this.userInfo.deviceInfo
        }).then(res => {
          this.$store.commit(types.LOGOUT, [])
          this.$router.push('/')
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .top {
    background: url(../../assets/i_bg_normal.png) no-repeat;
    background-size: cover;
    padding: 2vw;
    .top_left {
      color: #fff;
      img {
        width: 8vw;
        height: 8vw;
        border-radius: 50% 50%;
        vertical-align: middle;
      }
    }
  }

  .account {
    background-color: #fff;
    margin: 2vw;
    padding: 2vw;
    border-radius: 3px;
    img {
      width: 4vw;
      height: 4vw;
      margin-right: 2vw;
    }
    .bottom {
      padding-top: 2vw;
      margin-top: 1vw;
      border-top: 1px solid #eee;
      font-size: 3vw;
      .right {
        color: #0000f6;
        a {
          border: 1px solid #0000f6;
          border-radius: 3px;
          padding: 0.3vw 2vw;
          color: #0000f6;
        }
      }
    }
  }

  .room {
    background-color: #fff;
    margin: 2vw;
    padding: 2vw;
    border-radius: 3px;
    .item {
      border-bottom: 1px solid #eee;
      padding: 2vw 0;
      img {
        width: 4vw;
        height: 4vw;
        margin-right: 2vw;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .btn {
    background-color: #04a3ff;
    color: #fff;
    border: none;
    padding: 2vw 20vw;
    border-radius: 50px 50px 50px 50px;
    &:focus {
      outline: none;
    }
  }
</style>
