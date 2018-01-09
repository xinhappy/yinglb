<template>
  <div class="room">
    <x-header
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
        <checker-item :value="inputting" @on-item-click="selectIn()"><input type="text" v-model="inputting"
                                                                            placeholder="输入金额"></checker-item>
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
    <toast v-model="showFalse" type="text" :time="800" is-show-mask :text="text" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Checker, CheckerItem, XDialog, TransferDom, Toast} from 'vux'
  import * as ApiService from 'api/api'
  import * as types from 'src/store/mutation-types'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Checker,
      CheckerItem,
      XDialog,
      Toast
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        list: [],
        src: '../../../assets/i_default_n.png',
        account: [],
        inputting: '',
        money: '',
        show: false,
        returnNumber: '',
        ruleId: '',
        rechargeFlag: '',
        resultData: '',
        showFalse: false,
        showValue: false,
        text: '',
        hand: false
      }
    },
    created () {
      this.getRule()
      this.getAccount()
    },
    watch: {
      inputting (val) {
        this.inputting = val.replace(/[^\d+(/.\d+)?$]/g, '')
        let ArrMen = val.split('.')   // 截取字符串
        if (ArrMen.length === 2) {
          if (ArrMen[1].length > 1) {    // 判断小数点后面的字符串长度
            this.showFalse = true
            this.text = '小数点后最多一位'
            this.showValue = true
          } else {
            this.showValue = false
          }
        }
        this.rechargeNumber = val
      }
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
      selectIn () {
        this.ruleId = ''
        this.returnNumber = ''
        this.rechargeNumber = this.inputting
        this.rechargeFlag = 1
        this.hand = true
      },
      select (item) {
        this.src = item.imgSrc
        this.returnNumber = item.returnNumber
        this.ruleId = item.ruleId
        this.rechargeNumber = item.rechargeNumber
        this.hand = false
      },
      onBridgeReady: function (data) {
        var vm = this
        WeixinJSBridge.invoke( // eslint-disable-line
          'getBrandWCPayRequest', {
            'appId': data.appId,     // 公众号名称，由商户传入
            'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
            'nonceStr': data.nonceStr, // 随机串
            'package': data.package,
            'signType': 'MD5', // 微信签名方式：
            'paySign': data.paySign // 微信签名
          },
          function (res) {
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            if (res.err_msg == 'get_brand_wcpay_request:ok') { // eslint-disable-line
              vm.$router.push('/')
            } else if (res.err_msg == 'get_brand_wcpay_request:cancel') { // eslint-disable-line
              ApiService.post('/api/h5Member/cancelCapitalRecordH5.htm', {
                checkFlag: 0,
                transactionFlow: vm.resultData
              }).then(data => {
                if (data.data.resultCode === '1') {
                  vm.showValue = true
                  vm.resultDesc = data.data.resultDesc
                  vm.show = false
                }
              })
            } else {
//              alert(JSON.stringify(res))
              alert('支付失败,请跳转页面' + res.err_msg)
            }
          }
        )
      },
      getQueryString (name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        let r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
      },
      save () {
        var vm = this
        let openid = localStorage.getItem('openid')
        if (!openid) {
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {  // eslint-disable-line
            // 跳转到微信授权页面
            let redirectUri = encodeURIComponent('http://m.ylbzg.com/dist/#/qqLoginBack')
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxae9cdc00bf788458&redirect_uri=' + redirectUri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            if (!this.$store.state.code) {
              this.$store.commit(types.SETCODE, this.getQueryString('code'))
            }
          }
        }
        if (vm.rechargeNumber < 20 && this.hand) {
          vm.showFalse = true
          vm.text = '充值金额不能小于20'
          return
        }
        if (vm.showValue) {
          vm.showFalse = true
          vm.text = '小数点后最多一位'
          return
        }
        ApiService.post('/api/h5wechatPay/toPayH5.htm', {
          rechargeNumber: this.rechargeNumber,
          returnNumber: this.returnNumber,
          userId: this.userInfo.id,
          userType: 1,
          userTelephone: this.userInfo.userPhone,
          userName: this.userInfo.realName,
          openId: openid,
          ruleId: this.ruleId,
          rechargeFlag: this.rechargeFlag,
          flag: 0
        }).then(res => {
          if (res.data.resultCode === '1') {
            vm.resultData = res.data.resultData
            if (typeof WeixinJSBridge == 'undefined') { // eslint-disable-line
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(res.data.object), false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(res.data.object))
                document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(res.data.object))
              }
            } else {
              vm.onBridgeReady(res.data.object)
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .room {
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

  .rule {
    padding: 4vw 0;
    background-color: #0572ff;
    color: #fff;
    text-align: center;
    .title {
      font-size: 4vw;
    }
    .item {
      margin: 2vw 0;
    }
  }
</style>
