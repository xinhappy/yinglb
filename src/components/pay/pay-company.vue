<template>
  <div>
    <x-header
              :left-options="{backText: ''}">付款
    </x-header>
    <div class="title">
      <img :src="companyInfo.businessPhoto" alt="">
      <p>{{companyInfo.businessName}}</p>
      <p style="font-size: 2vw;color: #aaa">{{businessTelephone}}</p>
    </div>
    <div class="item">
      <span>消费金额(盈磅)</span>
      <input type="text" v-model="exchangeNum" placeholder="输入支付金额">
    </div>
    <div class="item clearfix" @click="getReg">店铺优惠 <span
      style="float: right;display: flex;align-content: center;">{{redName}}<img
      src="../../assets/i_row_right_gray.png"
      style="width: 5vw;height: 5vw"
      alt=""></span>
    </div>
    <div class="save">
      <button @click="save">确定付款</button>
    </div>
    <div v-transfer-dom>
      <popup v-model="showRed" position="bottom" height="50%">
        <div style="padding: 4vw;border-bottom: 1px solid #ccc">
          店铺优惠
          <img @click="showRed = false" src="../../assets/i_delete.png" style="float: right;width: 5vw" alt="">
        </div>
        <div style="position: relative;height: 100%">
          <checker v-model="redId" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <div style="height: 50vw;overflow-y: auto">
              <checker-item v-for="(item,index) in red" :key="index"
                            :value="item.id + ',' + item.redName + ',' + item.amount"
                            @on-item-click="redClick">
                <div class="clearfix">
                  <div class="fl">{{item.redName}}(优惠{{item.amount}})</div>
                  <div class="fr" style="margin-right: 6vw;color: #ccc">有效时间至{{item.endTime}}</div>
                </div>
              </checker-item>
            </div>
            <div
              style="position: fixed;bottom: -2px;width: 100%;text-align: center;border-top: 1px solid #ccc;color: orange">
              <checker-item :value="' ,选择优惠券'" @on-item-click="redClick">暂不使用卡券</checker-item>
            </div>
          </checker>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="show" position="bottom" height="50%">
        <div style="text-align: center;border-bottom: 1px solid #ccc;padding: 2vw 0">请输入支付密码</div>
        <input type="hidden" v-model="password"/>
        <div class="pay-pwd clearfix">
          <div class="fl"><input type="password" v-model="pw1"></div>
          <div class="fl"><input type="password" v-model="pw2"></div>
          <div class="fl"><input type="password" v-model="pw3"></div>
          <div class="fl"><input type="password" v-model="pw4"></div>
          <div class="fl"><input type="password" v-model="pw5"></div>
          <div class="fl"><input type="password" v-model="pw6"></div>
        </div>
        <div style="text-align: right"><a href="#/resetPwd">忘记密码？</a></div>
        <keyboard :keyboard="password" @on-result-change="onResultChange"></keyboard>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPay" position="bottom" height="20%">
        <div style="border-bottom: 1px solid #ccc;padding: 2vw 0;background-color: #fff;padding-left: 2vw">选择付款方式</div>
        <div @click="yingPay" class="item clearfix" style="background-color: #eee"><img
          style="width: 8vw;vertical-align: middle;margin-right: 2vw" src="../../assets/i_logo.png" alt="">盈磅<span
          style="float: right;display: flex;align-content: center;"><img
          src="../../assets/i_row_right_gray.png"
          style="width: 8vw;height: 8vw"
          alt=""></span>
        </div>
        <div class="item clearfix" @click="weiPay" style="background-color: #eee"><img
          style="width: 8vw;vertical-align: middle;margin-right: 2vw" src="../../assets/i_pay_wei.png" alt="">微信支付
          (实付{{rechargeNumber.realMoney}}元，优惠{{rechargeNumber.discountMoney}}元)<span
            style="float: right;display: flex;align-content: center;"><img
            src="../../assets/i_row_right_gray.png"
            style="width: 8vw;height: 8vw"
            alt=""></span>
        </div>
      </popup>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="resultDesc" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, TransferDom, Popup, Toast, Checker, CheckerItem} from 'vux'
  import * as ApiService from 'api/api'
  import Keyboard from 'components/keyboard/keyboard'
  import * as types from 'src/store/mutation-types'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup,
      Toast,
      Checker,
      CheckerItem,
      Keyboard
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        companyInfo: JSON.parse(localStorage.getItem('companyInfo')),
        businessTelephone: '',
        exchangeNum: '',
        redId: '',
        red: [],
        redName: '选择优惠券',
        showRed: false,
        resultDesc: '',
        showValue: false,
        password: '',
        pw1: '',
        pw2: '',
        pw3: '',
        pw4: '',
        pw5: '',
        pw6: '',
        show: false,
        showPay: false,
        rechargeNumber: {},
        resultData: '',
        redAccount: ''
      }
    },
    methods: {
      getReg () {
        if (!this.exchangeNum) {
          this.showValue = true
          this.resultDesc = '请输入金额'
          return
        }
        ApiService.post('/api/h5UserRed/getUserRedH5.htm', {
          userId: this.userInfo.id,
          businessId: this.companyInfo.id,
          exchangeNum: this.exchangeNum
        }).then(res => {
          if (res.data.resultCode === '1' && res.data.rows.length > 0) {
            this.showRed = true
            this.red = res.data.rows
          } else {
            this.showValue = true
            this.resultDesc = res.data.resultDesc
          }
        })
      },
      redClick (itemValue) {
        let arr = itemValue.split(',')
        this.redName = arr[1]
        this.showRed = false
        this.redAccount = arr[2]
        this.$store.commit(types.RED, this.redAccount)
      },
      onResultChange (val) {
        this.password = val
      },
      save () {
        if (!this.exchangeNum) {
          this.showValue = true
          this.resultDesc = '请输入金额'
          return
        }
        this.showPay = true
        let arr = this.redId.split(',')
        let redId = arr[0]
        ApiService.post('/api/h5SystemRechargeRules/getRealMoney.htm', {
          terminalType: 3,
          totalMoney: this.exchangeNum,
          redId: redId,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.rechargeNumber = res.data.object
          }
        })
      },
      yingPay () {
        this.showPay = false
        this.show = true
      },
      getQueryString (name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        let r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
      },
      weiPay () {
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
        let arr = this.redId.split(',')
        let redId = arr[0]
        ApiService.post('/api/h5wechatPay/toPayH5.htm', {
          rechargeNumber: this.rechargeNumber.realMoney,
          returnNumber: this.exchangeNum,
          userId: this.userInfo.id,
          userType: 1,
          userTelephone: this.userInfo.userPhone,
          userName: this.userInfo.realName,
          openId: openid,
          ruleId: '',
          rechargeFlag: 1,
          flag: 1,
          redId: redId
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
              let arr = vm.redId.split(',')
              let redId = arr[0]
              ApiService.post('/api/h5MemberExchange/exchangeH5.htm', {
                acceptUserId: vm.companyInfo.userId,
                outputUserId: vm.userInfo.id,
                userRedId: redId,
                exchangeNum: vm.exchangeNum,
                checkFlag: '',
                deviceInfo: vm.userInfo.deviceInfo,
                peopleId: vm.userInfo.id,
                flag: 2,
                transactionFlow: vm.resultData
              }).then(resp => {
                if (resp.data.resultCode === '0') {
                  vm.showValue = true
                  vm.resultDesc = resp.data.resultDesc
                  vm.show = false
                  vm.password = ''
                } else {
                  vm.$router.push('/zhuan/' + vm.exchangeNum)
                }
              })
            } else if (res.err_msg == 'get_brand_wcpay_request:cancel') { // eslint-disable-line
              ApiService.post('/api/h5Member/cancelCapitalRecordH5.htm', {
                checkFlag: 0,
                transactionFlow: vm.resultData
              }).then(data => {
                if (data.data.resultCode === '1') {
                  vm.showValue = true
                  vm.resultDesc = data.data.resultDesc
                  vm.showPay = false
                  vm.show = false
                }
              })
            } else {
//              alert(JSON.stringify(res))
              alert('支付失败,请跳转页面' + res.err_msg)
            }
          }
        )
      }
    },
    created () {
      let str = this.companyInfo.businessTelephone
      this.businessTelephone = str.substr(0, 3) + '****' + str.substr(7)
    },
    watch: {
      exchangeNum (val) {
        this.exchangeNum = val.replace(/[^\d+(/.\d+)?$]/g, '')
      },
      password (val) {
        this.pw1 = val[0]
        this.pw2 = val[1]
        this.pw3 = val[2]
        this.pw4 = val[3]
        this.pw5 = val[4]
        this.pw6 = val[5]
        if (val.length === 6) {
          let arr = this.redId.split(',')
          let redId = arr[0]
          ApiService.post('/api/h5MemberExchange/exchangeH5.htm', {
            acceptUserId: this.companyInfo.userId,
            outputUserId: this.userInfo.id,
            userRedId: redId,
            exchangeNum: this.exchangeNum,
            transactionPwd: val,
            checkFlag: '',
            deviceInfo: this.userInfo.deviceInfo,
            peopleId: this.userInfo.id
          }).then(res => {
            if (res.data.resultCode === '0') {
              this.showValue = true
              this.resultDesc = res.data.resultDesc
              this.show = false
              this.password = ''
            } else {
              this.$router.push('/zhuan/' + this.exchangeNum)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .title {
    text-align: center;
    padding: 5vw 0;
    img {
      width: 15vw;
      height: 15vw;
      border-radius: 50% 50%;
    }
  }

  .item {
    background-color: #fff;
    padding: 1vw 2vw;
    margin: 2vw 0;
    input {
      margin-left: 2vw;
      width: 50vw;
    }
  }

  .demo1-item {
    width: 100%;
    padding: 2vw 4vw;
    border-bottom: 1px solid #ccc;
  }

  .demo1-item-selected {
    background-color: #eee;
  }

  .save {
    text-align: center;
    margin-top: 8vw;
    button {
      width: 85%;
      margin: 0 auto;
      border: none;
      background: url(../../assets/i_bg_normal.png) no-repeat;
      background-size: cover;
      height: 8vw;
      color: #fff;
      font-size: 4vw;
      &:focus {
        outline: none;
      }
    }
  }

  .pay-pwd {
    width: 96vw;
    margin: 5vw auto;
    div {
      border: 1px solid #e5e5e5;
      border-right: none;
      &:last-child {
        border-right: 1px solid #e5e5e5;
      }
    }
    input {
      width: 15vw;
      height: 10vw;
      border: none;
      text-align: center;
      font-size: 30px;
    }
  }
</style>
