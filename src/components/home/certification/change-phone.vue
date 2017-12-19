<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">更改手机号
    </x-header>
    <div class="room">
      <div style="padding-bottom: 2vw;margin-bottom: 2vw;border-bottom: 1px solid #eee"><span>手机号</span><input
        v-model="telephone" type="text"></div>
      <div><span>验证码</span><input v-model="verifyCode" type="text" placeholder="请输入验证码">
        <button :disabled="disable" type="button" @click="getY">
          {{title}}
          <countdown v-model="time" v-show="time > 0" :start="start"></countdown>
        </button>
      </div>
    </div>
    <div style="padding: 2vw">
      <router-link to="/changeOne" style="color: #4b8bf4">手机丢失或已不用</router-link>
    </div>
    <div style="text-align: center;margin-top: 10vw">
      <button class="btn" @click="next">下一步</button>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="text" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Countdown, Toast} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      XHeader,
      Countdown,
      Toast
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        title: '获取验证码',
        time: 0,
        start: false,
        telephone: '',
        disable: false,
        showValue: false,
        text: '',
        verifyCode: ''
      }
    },
    created () {
      this.telephone = this.userInfo.userPhone
    },
    methods: {
      getY () {
        ApiService.post('/api/h5Member/smsValidationH5.htm', {telephone: this.telephone, flag: 8}).then(res => {
          if (res.data.resultCode === '1') {
            this.title = ''
            this.time = 60
            this.start = true
          } else {
            this.showValue = true
            this.text = '网络繁忙，请稍后重试'
          }
        })
      },
      next () {
        if (this.verifyCode) {
          ApiService.post('/api/h5CheckPhoneRecord/checkVerifyCodeH5.htm', {
            phone: this.telephone,
            verifyCode: this.verifyCode,
            messageType: 8
          }).then(res => {
            if (res.data.resultCode === '0') {
              this.showValue = true
              this.text = res.data.resultDesc
            } else {
              this.$router.push('/changeNext')
            }
          })
        } else {
          this.showValue = true
          this.text = '验证码不能为空'
        }
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
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .room {
    background-color: #fff;
    margin: 4vw 0;
    padding: 2vw;
    input {
      width: 57%;
      padding-left: 3vw;
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
