<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">付款
    </x-header>
    <div class="content">
      <div class="companyInfo" v-if="mode == 0">
        <popup-picker title="预约时间（可选）" v-bind:data="yuTime" v-model="yuId"
                      show-name></popup-picker>
      </div>
      <div class="companyInfo" v-if="mode == 1">
        <div style="padding: 2vw 0;border-bottom: 1px solid #ccc" @click="timeShow">
          尽快送到（可选时间）{{apoint}}
          <img src="/src/assets/i_row_right_gray.png" style="float: right;width: 5vw" alt="">
        </div>
        <div style="padding: 2vw 0" @click="setAdd">
          <span v-if="!userAddress">选择配送地址</span>
          <span v-if="userAddress"
                style="display: inline-block;max-width: 75vw;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{userAddress.name}}{{userAddress.phone}} &nbsp;&nbsp;{{userAddress.orderFlowName}}{{userAddress.detailAddress}}</span>
          <span style="float: right;display: flex;align-content: center;">
            <img src="/src/assets/i_row_right_gray.png" style="width: 5vw;height:5vw" alt="">
          </span>
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
                <span>{{i.ybPrice}}盈磅</span>
              </div>
            </li>
          </ul>
          <div class="item clearfix" @click="getReg">店铺优惠 <span
            style="float: right;display: flex;align-content: center;">{{redName}}<img
            src="/src/assets/i_row_right_gray.png"
            style="width: 5vw;height: 5vw"
            alt=""></span>
          </div>
          <div class="item clearfix">配送费用 <span class="fr">{{distributionFee}} 盈磅</span></div>
          <div class="total">小计：<span>{{sum}}盈磅</span></div>
        </div>
      </div>
      <div class="companyInfo">
        备注说明：<input type="text" v-model="remark" placeholder="请输入要求">
      </div>
      <div class="save">
        <button type="button" @click="pay">支付：{{sum}}盈磅</button>
      </div>
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
        <div style="text-align: right"><a href="">忘记密码？</a></div>
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
          <img @click="showRed = false" src="/src/assets/i_delete.png" style="float: right;width: 5vw" alt="">
        </div>
        <div style="position: relative;height: 100%">
          <checker v-model="redId" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
            <div style="height: 50vw;overflow-y: auto">
              <checker-item v-for="(item,index) in red" :key="index" :value="item.id + ',' + item.redName"
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
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="resultDesc" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, PopupPicker, TransferDom, Popup, Toast, Checker, CheckerItem} from 'vux'
  import {mapGetters} from 'vuex'
  import * as ApiService from 'api/api'
  import Keyboard from 'components/keyboard/keyboard'
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
        distributionFee: '0'
      }
    },
    created () {
      this.week()
      this.time()
      this.getAddress()
      let hour = new Date().getHours()
      let min = new Date().getMinutes()
      if (hour + min / 60 > 12.5) {
        this.yuTime = [[{id: '17:30~21:30', text: '17:30~21:30'}]]
      } else {
        this.yuTime = [[{id: '12:10~12:20', text: '12:10~12:20'}, {id: '12:20~12:30', text: '12:20~12:30'}]]
      }
    },
    computed: {
      ...mapGetters(
        ['sum', 'goodsNumber']
      ),
      goodsList() {
        return this.$store.state.goodsList
      }
    },
    methods: {
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
        if (this.userInfo.transactionPwdStatus === 0) {
          this.$router.push('/setPwd')
          return
        }
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
              this.show = true
              this.orderId = res.data.object.id
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
              this.show = true
              this.orderId = res.data.object.id
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
          vm.userAddress = vm.$store.state.userAddress[0]
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
        ApiService.get('/api/h5DistributorOrder/countDistributionFeeH5.htm?addressId=' + val.id + '&businessId=' + this.companyInfo.id + '&checkFlag&deviceInfo=' + this.userInfo.deviceInfo + '&peopleId=' + this.userInfo.id).then(res => {
          if (res.data.resultCode === '1') {
            this.distributionFee = res.data.object
          }
        })
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
