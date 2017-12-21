<template>
  <div class="room">
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">充值
      <a href="#/rechargeRecords" slot="right" style="color: #fff">充值记录</a>
    </x-header>
    <div>
      <img :src="src" class="img-responsive" alt="">
    </div>
    <div>
      <checker v-model="account" default-item-class="item" selected-item-class="item-selected">
        <checker-item radio-required v-for="item in list" :value="item.rechargeNumber" :key="item.imgSrc"
                      @on-item-click="select(item)">{{item.rechargeNumber}}
        </checker-item>
        <checker-item :value="inputting"><input type="text" v-model="inputting" placeholder="输入金额"></checker-item>
      </checker>
    </div>
    <div class="bottom">
      <div class="recharge">
        <button @click="save">充值</button>
      </div>
      <div>
        账户余额：<span style="color: orange">{{money.rebateBalance}}</span>盈磅
        <span class="fr" style="color: #0582ff;margin-right: 4vw" @click="show = true">活动规则</span>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="show">
        <div class="rule">
          <div class="title">活动规则</div>
          <div class="item" v-for="i in list">
            充{{i.rechargeNumber}}元，可得{{i.returnNumber}}盈磅
          </div>
          <div class="title" @click="show = false">关闭</div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Checker, CheckerItem, XDialog, TransferDom} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Checker,
      CheckerItem,
      XDialog
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        list: [],
        src: '/src/assets/i_default.png',
        account: [],
        inputting: '',
        money: '',
        show: false
      }
    },
    created () {
      this.getRule()
      this.getAccount()
    },
    methods: {
      getAccount () {
        ApiService.get('/api/h5StagingRule/getMemberDataH5.htm?userId=' + this.userInfo.id + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag').then(res => {
          if (res.data.resultCode === '1') {
            this.money = res.data.object
          }
        })
      },
      getRule () {
        ApiService.post('/api/h5SystemRechargeRules/systemRechargeRulesH5.htm', {
          areaId: this.userInfo.orgId,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.list.push.apply(this.list, res.data.rows)
          }
        })
      },
      select (item) {
        this.src = item.imgSrc
      },
      save () {
        window.open('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx25c0ddea9b3ab62d&redirect_uri=http%3A%2F%2192.168.1.111%3A8080&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect ')
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .room{
    height: 100%;
    background-color: #fff;
    .item {
      border: 1px solid #ccc;
      width: 28%;
      text-align: center;
      margin: 2vw;
      color: #aaa;
      input {
        background-color: transparent;
        text-align: center;
        width: 100%;
      }
    }

    .item-selected {
      border: 1px solid #0582ff;
      color: #0582ff;
    }

    .bottom {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 2vw;
      .recharge {
        text-align: center;
        margin-bottom: 1vw;
        button {
          background-color: #04a3ff;
          color: #fff;
          border: none;
          padding: 1vw 20vw;
          border-radius: 50px 50px 50px 50px;
          font-size: 4vw;
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
  .rule{
    padding: 4vw 0;
    background-color:#0572ff;
    color: #fff;
    text-align: center;
    .title{
      font-size: 4vw;
    }
    .item{
      margin: 2vw 0;
    }
  }
</style>
