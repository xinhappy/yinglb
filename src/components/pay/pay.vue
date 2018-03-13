<template>
  <div>
    <x-header
              @on-click-back="back"
              :left-options="{backText: '',preventGoBack:true}">付款
    </x-header>
    <div class="content">
      <div class="companyInfo" v-if="mode == 0 && showApo">
        <popup-picker title="预约时间（可选）" v-bind:data="yuTime" v-model="yuId"
                      show-name></popup-picker>
      </div>
      <div class="companyInfo" v-if="mode == 1">
        <div style="padding: 2vw 0" @click="setAdd">
          <span v-if="!userAddress">选择配送地址</span>
          <span v-if="userAddress"
                style="display: inline-block;max-width: 75vw;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{userAddress.name}}{{userAddress.phone}} &nbsp;&nbsp;{{userAddress.orderFlowName}}{{userAddress.detailAddress}}</span>
          <span style="float: right;display: flex;align-content: center;">
            <img src="../../assets/i_row_right_gray.png" style="width: 5vw;height:5vw" alt="">
          </span>
        </div>
        <div style="padding: 2vw 0;border-top: 1px solid #ccc" @click="timeShow">
          尽快送到（可选时间）{{apoint}}
          <img src="../../assets/i_row_right_gray.png" style="float: right;width: 5vw" alt="">
        </div>
      </div>
      <div class="companyInfo">
        <p class="title">{{companyInfo.businessName}}</p>
        <div>
          <ul class="payList item">
            <li class="clearfix" v-for="i in goodsList" v-show="i.number>0">
              <span>{{i.goodsName}}</span>
              <div class="fr">
                <span style="margin-right: 3vw">*{{i.number}}</span>
                <span>{{i.ybPrice}}元</span>
              </div>
            </li>
          </ul>
          <div class="item clearfix" @click="getReg">店铺优惠 <span
            style="float: right;display: flex;align-content: center;">{{redName}}<img
            src="../../assets/i_row_right_gray.png"
            style="width: 5vw;height: 5vw"
            alt=""></span>
          </div>
          <div class="item clearfix">配送费用 <span class="fr">{{distributionFee}} 元</span></div>
          <div class="total">小计：<span>{{sum + distributionFee}}元</span></div>
        </div>
      </div>
      <div class="companyInfo">
        备注说明：<input type="text" v-model="remark" placeholder="请输入要求">
      </div>
      <div class="save">
        <button type="button" @click="pay">支付：{{sum + distributionFee - redAccount > 0 ? sum + distributionFee -
          redAccount : 0}}元
        </button>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show" position="bottom" height="55%">
        <div style="text-align: center;border-bottom: 1px solid #ccc;padding: 2vw 0">请输入支付密码</div>
        <input type="hidden" v-model="password"/>
        <div class="pay-pwd clearfix">
          <div class="fl"><input type="password" v-model="pw1"></div>
          <div class="fl"><input type="password" v-model="pw2"></div>
          <div class="fl"><input type="password" v-model="pw3"></div>
          <div class="fl"><input type="password" v-model="pw4"></div>
          <div class="fl"><input type="password" v-model="pw5"></div>
          <div class="fl" style="border-right: 1px solid #e5e5e5;"><input style="width: 98%" type="password" v-model="pw6"></div>
        </div>
        <div style="text-align: right"><a href="#/resetPwd">忘记密码？</a></div>
        <keyboard :keyboard="password" @on-result-change="onResultChange"></keyboard>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showTime" position="bottom" height="50%">
        <div style="text-align: center;background-color: #eee;padding: 2vw 0">选择消费时间</div>
        <div class="clearfix" style="height: 100%;background-color: #eee">
          <div class="fl" style="width: 35%">
            <div class="time-left" :class="{ 'active' : now }" @click=" now = true">{{checkTime[0]}}</div>
            <div class="time-left" :class="{ 'active' : !now }" @click=" now = false">{{checkTime[1]}}</div>
          </div>
          <div class="fl" style="width: 65%;height: 100%;overflow-y: auto;background-color: #fff">
            <checker default-item-class="demo-item" selected-item-class="demo-item-selected" v-model="apoint">
              <div class="time-item" v-for="item in nowTimes" v-if="now">
                {{item[0]}}
                <checker-item :value="item[0]" @on-item-click="onItemClick"></checker-item>
              </div>
              <div class="time-item" v-for="item in times" v-if="!now">
                {{item[0]}}
                <checker-item :value="item[0]" @on-item-click="onItemClick"></checker-item>
              </div>
            </checker>
          </div>
        </div>
      </popup>
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
      <popup v-model="showPay" position="bottom" height="20%">
        <div style="border-bottom: 1px solid #ccc;padding: 2vw 0;background-color: #fff;padding-left: 2vw">选择付款方式</div>
        <div @click="yingPay" class="item clearfix" style="margin: 2vw 0;padding-left: 2vw"><img
          style="width: 8vw;vertical-align: middle;margin-right: 2vw" src="../../assets/i_logo.png" alt="">元 <span
          style="float: right;display: flex;align-content: center;"><img
          src="../../assets/i_row_right_gray.png"
          style="width: 8vw;height: 8vw"
          alt=""></span>
        </div>
        <div class="item clearfix" @click="weiPay" style="margin: 2vw 0;padding-left: 2vw"><img
          style="width: 8vw;vertical-align: middle;margin-right: 2vw" src="../../assets/i_pay_wei.png" alt="">微信支付(实付{{rechargeNumber.realMoney}}元，优惠{{rechargeNumber.discountMoney}}元)
          <span
            style="float: right;display: flex;align-content: center;"><img
            src="../../assets/i_row_right_gray.png"
            style="width: 8vw;height: 8vw"
            alt=""></span>
        </div>
      </popup>
    </div>
    <toast v-model="showValue" type="text" width="20em" :time="800" is-show-mask :text="resultDesc" position="middle"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, PopupPicker, TransferDom, Popup, Toast, Checker, CheckerItem} from 'vux'
  import {mapGetters, mapMutations} from 'vuex'
  import * as ApiService from 'api/api'
  import Keyboard from 'components/keyboard/keyboard'
  import * as types from 'src/store/mutation-types'
  import * as config from 'common/config'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      PopupPicker,
      Keyboard,
      Popup,
      Toast,
      Checker,
      CheckerItem
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        companyInfo: JSON.parse(localStorage.getItem('companyInfo')),
        yuTime: [],
        yuId: [],
        remark: [],
        password: '',
        pw1: '',
        pw2: '',
        pw3: '',
        pw4: '',
        pw5: '',
        pw6: '',
        show: false,
        showValue: false,
        orderId: '',
        redId: '',
        red: [],
        redName: '选择优惠券',
        showRed: false,
        resultDesc: '',
        mode: this.$route.params.mode,
        showTime: false,
        checkTime: [],
        times: [],
        nowTimes: [],
        now: true,
        apoint: '',
        userAddress: {},
        distributionFee: 0,
        showPay: false,
        rechargeNumber: {},
        resultData: '',
        redAccount: ''
      }
    },
    created () {
      this.week()
      this.time()
      if (this.mode === '1') {
        this.getAddress()
      }
      let hour = new Date().getHours()
      let min = new Date().getMinutes()
      if (hour + min / 60 > 12.5) {
        this.yuTime = [[{name: '17:30~21:30', value: '17:30~21:30', id: '17:30~21:30', text: '17:30~21:30'}]]
      } else {
        this.yuTime = [[{name: '12:10~12:20', value: '12:10~12:20', id: '12:10~12:20', text: '12:10~12:20'}, {name: '12:20~12:30', value: '12:20~12:30', id: '12:20~12:30', text: '12:20~12:30'}]]
      }
    },
    computed: {
      ...mapGetters(
        ['sum', 'goodsNumber']
      ),
      goodsList() {
        return this.$store.state.goodsList
      },
      showApo () {
        let show = true
        for (let i = 0; i < this.$store.state.goodsList.length; i++) {
          if (this.$store.state.goodsList[i].appointmentFlag === 1 && this.$store.state.goodsList[i].number !== 0) {
            show = false
          }
        }
        return show
      }
    },
    methods: {
      ...mapMutations(
        ['addGoods']
      ),
      week () {
        let d = new Date()
        let weekday = new Array(7)
        weekday[0] = '星期天'
        weekday[1] = '星期一'
        weekday[2] = '星期二'
        weekday[3] = '星期三'
        weekday[4] = '星期四'
        weekday[5] = '星期五'
        weekday[6] = '星期六'
        this.checkTime = ['今天（' + weekday[d.getDay()] + '）', '明天（' + weekday[d.getDay() + 1] + '）']
      },
      time () {
        let hour = new Date().getHours()
        let min = new Date().getMinutes()
        for (let i = 0; i < 24; i++) {
          for (let j = 0; j < 60; j += 15) {
            let h = i < 10 ? '0' + i : i
            let m = j < 10 ? '0' + j : j
            if (i < hour) {
              this.times.push([h + ':' + m])
            } else if (i === hour) {
              if (j <= min) {
                this.times.push([h + ':' + m])
              } else {
                this.nowTimes.push([h + ':' + m])
              }
            } else {
              this.nowTimes.push([h + ':' + m])
            }
          }
        }
      },
      timeShow () {
        this.showTime = true
      },
      onResultChange (val) {
        this.password = val
      },
      pay () {
        let goodsList = ''
        for (let i = 0; i < this.goodsList.length; i++) {
          if (this.goodsList[i].number > 0) {
            goodsList = goodsList + this.goodsList[i].id + ',' + this.goodsList[i].number + ';'
          }
        }
        /*
        if (this.userInfo.transactionPwdStatus === 0) {
          this.$router.push('/setPwd')
          return
        }
        let arr = this.redId.split(',')
        let redId = arr[0]
        ApiService.post('/api/h5SystemRechargeRules/getRealMoney.htm', {
          terminalType: 3,
          totalMoney: this.sum + this.distributionFee,
          redId: redId,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.rechargeNumber = res.data.object
          }
        })
        */
        if (this.mode === '0') {
          ApiService.post('/api/h5MemberExchange/produceOrderH5.htm', {
            businessId: this.companyInfo.id,
            goodsList: goodsList,
            appointmentTime: this.yuId[0],
            userId: this.userInfo.id,
            remark: this.remark[0],
            checkFlag: '',
            deviceInfo: this.userInfo.deviceInfo,
            peopleId: this.userInfo.id
          }).then(res => {
            if (res.data.resultCode === '1') {
              // this.showPay = true
              this.orderId = res.data.object.id
              this.weiPay()
            } else {
              this.showValue = true
              this.resultDesc = res.data.resultDesc
            }
          })
        } else {
          if (!this.userAddress) {
            this.showValue = true
            this.resultDesc = '请选择配送地址'
            return
          }
          ApiService.post('/api/h5DistributorOrder/saveDistributionalOrderH5.htm', {
            businessId: this.companyInfo.id,
            goodsList: goodsList,
            appointmentTime: this.yuId[0],
            userId: this.userInfo.id,
            remark: this.remark[0],
            userAddress: this.userAddress.id,
            checkFlag: '',
            deviceInfo: this.userInfo.deviceInfo,
            peopleId: this.userInfo.id
          }).then(res => {
            if (res.data.resultCode === '1') {
              // this.showPay = true
              this.orderId = res.data.object.id
              this.weiPay()
            } else {
              this.showValue = true
              this.resultDesc = res.data.resultDesc
            }
          })
        }
      },
      onItemClick() {
        this.showTime = false
      },
      redClick (itemValue) {
        let arr = itemValue.split(',')
        this.redName = arr[1]
        this.showRed = false
        this.redAccount = arr[2]
        this.$store.commit(types.RED, this.redAccount)
      },
      getReg () {
        ApiService.post('/api/h5UserRed/getUserRedH5.htm', {
          userId: this.userInfo.id,
          businessId: this.companyInfo.id,
          exchangeNum: this.sum
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
      setAdd () {
        this.$router.push('/setAddress')
      },
      getAddress () {
        var vm = this
        if (vm.$store.state.userAddress.length > 0) {
          vm.userAddress = vm.$store.state.userAddress[vm.$store.state.userAddress.length - 1]
        } else {
          ApiService.post('/api/h5Member/queryMyAddressH5.htm', {
            userId: this.userInfo.id,
            checkFlag: '',
            deviceInfo: this.userInfo.deviceInfo,
            peopleId: this.userInfo.id,
            flag: '0'
          }).then(res => {
            if (res.data.resultCode === '1') {
              vm.userAddress = res.data.rows[0]
            }
          })
        }
      },
      back () {
        this.addGoods([])
        this.$router.push('/companyDetail')
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
        let openid = vm.userInfo.openid
        if (vm.userInfo.realNameStatus !== 2) {
          if (vm.mode === '0') {
            vm.$router.push('/realName/3')
            return
          } else {
            vm.$router.push('/realName/1')
            return
          }
        }
        if (!openid) {
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {  // eslint-disable-line
            // 跳转到微信授权页面
            let redirectUri = encodeURIComponent(config.retrunUrl + '/#/qqLoginBack')
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxae9cdc00bf788458&redirect_uri=' + redirectUri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            if (!this.$store.state.code) {
              this.$store.commit(types.SETCODE, this.getQueryString('code'))
            }
          }
        }
        let arr = this.redId.split(',')
        let redId = arr[0]
        if (vm.rechargeNumber.realMoney === 0) {
          this.showPay = false
          this.show = true
          return
        }
        ApiService.post('/api/h5wechatPay/toPayH5.htm', {
          // rechargeNumber: vm.rechargeNumber.realMoney,
          rechargeNumber: vm.sum + vm.distributionFee,
          returnNumber: vm.sum + vm.distributionFee,
          userId: vm.userInfo.id,
          userType: 1,
          userTelephone: vm.userInfo.userPhone,
          userName: vm.userInfo.realName,
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
          } else {
            vm.showFalse = true
            vm.resultDesc = res.data.resultDesc
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
              if (vm.mode === '0') {
                ApiService.post('/api/h5MemberExchange/payToGoodsH5.htm', {
                  userId: vm.userInfo.id,
                  redId: redId,
                  orderId: vm.orderId,
                  flag: '2',
                  checkFlag: '',
                  deviceInfo: vm.userInfo.deviceInfo,
                  peopleId: vm.userInfo.id,
                  transactionFlow: vm.resultData,
                  userPwd: ''
                }).then(resp => {
                  if (resp.data.resultCode === '0') {
                    vm.showValue = true
                    vm.resultDesc = resp.data.resultDesc
                    vm.show = false
                    vm.password = ''
                  } else {
                    vm.$router.push('/payResult')
                  }
                })
              } else {
                ApiService.post('/api/h5DistributorOrder/payDistributionalOrderH5.htm', {
                  userId: vm.userInfo.id,
                  userRedId: redId,
                  orderId: vm.orderId,
                  flag: 2,
                  checkFlag: '',
                  deviceInfo: vm.userInfo.deviceInfo,
                  peopleId: vm.userInfo.id,
                  transactionFlow: vm.resultData,
                  userPwd: ''
                }).then(resp => {
                  if (resp.data.resultCode === '0') {
                    vm.showValue = true
                    vm.resultDesc = resp.data.resultDesc
                    vm.show = false
                    vm.password = ''
                  } else {
                    vm.$router.push('/payResult')
                  }
                })
              }
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
    watch: {
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
          if (this.mode === '0') {
            ApiService.post('/api/h5MemberExchange/payToGoodsH5.htm', {
              userId: this.userInfo.id,
              redId: redId,
              orderId: this.orderId,
              userPwd: val,
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
                this.$router.push('/payResult')
              }
            })
          } else {
            ApiService.post('/api/h5DistributorOrder/payDistributionalOrderH5.htm', {
              userId: this.userInfo.id,
              userRedId: redId,
              orderId: this.orderId,
              userPwd: val,
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
                this.$router.push('/payResult')
              }
            })
          }
        }
      },
      userAddress (val) {
        if (val) {
          ApiService.get('/api/h5DistributorOrder/countDistributionFeeH5.htm?addressId=' + val.id + '&businessId=' + this.companyInfo.id + '&checkFlag&deviceInfo=' + this.userInfo.deviceInfo + '&peopleId=' + this.userInfo.id).then(res => {
            if (res.data.resultCode === '1') {
              this.distributionFee = parseFloat(res.data.object)
              this.$store.commit(types.PEISONG, this.distributionFee)
            }
          })
        }
      },
      userInfo (val) {
        this.userInfo = val
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .content {
    padding: 8vw 5vw;
    .companyInfo {
      background-color: #fff;
      padding: 2vw;
      margin-bottom: 2vw;
      .title {
        text-align: center;
      }
      .item {
        border-bottom: 1px solid #ccc;
        margin-bottom: 2vw;
        padding-bottom: 2vw;
        &.payList {
          padding: 2vw;
          li {
            margin: 2vw 0;
          }
        }
      }
      .total {
        text-align: right;
        span {
          color: #fa0000;
        }
      }
    }
  }

  .save {
    text-align: center;
    margin-top: 15vw;
    button {
      width: 65%;
      margin: 0 auto;
      border: none;
      background: url(../../assets/login/i_login_bt.png) no-repeat;
      background-size: cover;
      height: 13vw;
      color: #fff;
      font-size: 4vw;
      &:focus {
        outline: none;
      }
    }
  }

  .vux-cell-box:before {
    border-top: none !important;
  }

  .pay-pwd {
    width: 98vw;
    margin: 4vw auto;
    div {
      border: 1px solid #e5e5e5;
      border-right: none;
      width: 16%;
    }
    input {
      width: 100%;
      height: 10vw;
      border: none;
      text-align: center;
      font-size: 30px;
    }
  }

  .vux-popup-dialog {
    background-color: #fff !important;
  }

  .time-left {
    padding: 2vw 4vw;
    &.active {
      background-color: #fff;
    }
  }

  .time-item {
    padding: 3vw 4vw;
  }

  .demo-item {
    border: 1px solid #ececec;
    padding: 2vw;
    float: right;
  }

  .demo-item-selected {
    border: 1px solid #0000f6;
  }

  .demo1-item {
    width: 100%;
    padding: 2vw 4vw;
    border-bottom: 1px solid #ccc;
  }

  .demo1-item-selected {
    background-color: #eee;
  }
</style>
