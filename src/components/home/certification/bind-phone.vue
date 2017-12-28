<template>
  <div class="wrap">
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">绑定手机号
    </x-header>
    <div class="room">
      <div class="item">
        <span><img src="/src/assets/login/icon_login_pwd.png" alt=""></span><input v-model="phone" placeholder="请输入手机号"
                                                                                   type="text">
      </div>
      <div class="item">
        <span><img src="/src/assets/login/icon_login_pwd.png" alt=""></span>
        <input v-model="verifyCode" type="text" placeholder="请输入验证码">
        <button :disabled="disable" type="button" @click="getY">
          {{title}}
          <countdown v-model="time" v-show="time > 0" :start="start"></countdown>
        </button>
      </div>
      <div class="item" v-show="showPwd">
        <span><img src="/src/assets/login/icon_login_pwd.png" alt=""></span><input v-model="pwd" placeholder="请输入密码"
                                                                                   type="password">
      </div>
      <div class="item" v-show="showPwd">
        <span><img src="/src/assets/login/icon_login_pwd.png" alt=""></span><input v-model="rePwd" placeholder="请确认密码"
                                                                                   type="password">
      </div>
    </div>
    <div style="text-align: center;margin-top: 2vw;padding: 0 2vw">
      <button class="btn" @click="save">绑定</button>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="text" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Countdown, Toast} from 'vux'
  import * as ApiService from 'api/api'
  import * as types from 'src/store/mutation-types'
  export default {
    components: {
      XHeader,
      Countdown,
      Toast
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        oldPwd: '',
        pwd: '',
        rePwd: '',
        showValue: false,
        text: '',
        title: '获取验证码',
        time: 0,
        start: false,
        verifyCode: '',
        disable: false,
        phone: '',
        showPwd: false,
        registerType: this.$route.params.id
      }
    },
    watch: {
      time (val) {
        if (val === 0) {
          this.start = false
          this.title = '重新获取验证码'
          this.disable = false
        } else if (val > 0) {
          this.disable = true
        }
      }
    },
    methods: {
      getY () {
        ApiService.post('/api/h5Member/smsValidationH5.htm', {telephone: this.phone, flag: 4}).then(res => {
          if (res.data.resultCode === '1') {
            this.title = ''
            this.time = 60
            this.start = true
          } else {
            this.showValue = true
            this.text = '网络繁忙，请稍后重试'
          }
        })
        ApiService.post('/api/h5Member/isExistPhoneH5.htm', {userPhone: this.phone}).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.object === 0) {
              this.showPwd = true
            }
          } else {
            this.showValue = true
            this.text = '网络繁忙，请稍后重试'
          }
        })
      },
      save () {
        if (!this.phone) {
          this.showValue = true
          this.text = '手机号不能为空'
          return
        }
        if (!this.verifyCode) {
          this.showValue = true
          this.text = '验证码不能为空'
          return
        }
        if (this.showPwd) {
          if (!this.pwd) {
            this.showValue = true
            this.text = '密码不能为空'
            return
          }
          if (!this.rePwd) {
            this.showValue = true
            this.text = '确认密码不能为空'
            return
          }
        }
        ApiService.post('/api/h5Member/registerPhoneH5.htm', {
          telephone: this.phone,
          verifyCode: this.verifyCode,
          pwd: this.pwd,
          deviceInfo: this.userInfo.deviceInfo,
          loginInfo: this.userInfo.deviceInfo,
          peopleId: this.userInfo.id,
          userId: this.userInfo.id,
          registerType: this.registerType,
          accountId: localStorage.getItem('openid'),
          accountType: '1',
          registerTerminal: '1',
          remark: '当前为H5三方登录',
          checkFlag: ''
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.$router.push('/community')
            this.$store.commit(types.LOGIN, res.data.object)
          } else {
            this.showValue = true
            this.text = res.data.resultDesc
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .wrap {
    height: 100%;
    background-color: #fff;
    .room {
      background-color: #fff;
      margin: 4vw 0;
      padding: 2vw;
      .item {
        padding-bottom: 2vw;
        margin-bottom: 2vw;
        border-bottom: 1px solid #eee;
        img {
          width: 5vw;
          height: 5vw;
          vertical-align: middle;
        }
        button {
          float: right;
          background-color: #04a3ff;
          color: #fff;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
      input {
        width: 57%;
        padding-left: 3vw;
      }
    }

    .btn {
      background-color: #04a3ff;
      color: #fff;
      border: none;
      width: 100%;
      padding: 2vw;
      border-radius: 3px;
      &:focus {
        outline: none;
      }
    }
  }
</style>
