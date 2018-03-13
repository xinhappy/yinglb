<template>
  <div class="registerWrap">
    <div class="registerForm">
      <img style="display: block;margin: 0 auto" src="../../assets/register/i_enroll_bg2.png" width="50%" height="30%"
           alt="">
      <form @submit.prevent="submit">
        <div class="input">
          <img src="../../assets/login/icon_login_name.png" alt="">
          <input v-model="formData.telephone" type="text" placeholder="请输入手机号" maxlength="13">
        </div>
        <div class="input" style="position:relative">
          <img src="../../assets/register/i_enroll_msg.png" alt="">
          <input v-model="formData.vercode" type="text" placeholder="请输入验证码" maxlength="6">
          <button class="vercode" @click="sendCode">
            <span v-if="sendMsgDisabled">{{time + '秒后获取'}}</span>
            <span v-if="!sendMsgDisabled">获取验证码</span> 
          </button>
        </div>
        <div class="input">
          <img src="../../assets/register/i_enroll_pwd.png" alt="">
          <input v-model="formData.password" type="password" placeholder="请输入密码">
        </div>
        <div class="input">
          <img src="../../assets/login/icon_login_pwd.png" alt="">
          <input v-model="formData.makepassword" type="password" placeholder="请确认密码">
        </div>
        <div class="input">
          <img src="../../assets/login/icon_login_name.png" alt="">
          <input v-model="recotelephone" type="text" placeholder="推荐人手机号(选填)" maxlength="13">
        </div>
        <div class="input">
          <check-icon :value.sync="chose">
            已同意
          </check-icon>
          <span @click="$router.push('/protocol')">《盈联帮注册协议》</span>
        </div>
        <div class="save-back">
          <button class="regbtn" type="submit">注册</button>
          <button class="bacbtn" @click="$router.push('/')" type="button">返回</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as ApiService from 'api/api'
  import * as Reg from 'common/regexp'
  import {CheckIcon, ToastPlugin} from 'vux'
  import Vue from 'vue'

  Vue.use(ToastPlugin)

  export default {
    components: {
      CheckIcon,
      ToastPlugin
    },

    data() {
      return {
        chose: false,
        time: 60,
        sendMsgDisabled: false,
        recotelephone: '',
        formData: {
          telephone: '',
          vercode: '',
          password: '',
          makepassword: ''
        }
      }
    },
    methods: {
      sendCode() {
        let tel = this.formData.telephone
        if (tel === '' || tel === null) {
          // do nothing
        } else {
          ApiService.post('/api/h5Member/smsValidationH5.htm?' + '&flag=0' + '&telephone=' + this.formData.telephone).then((res) => {
            let me = this
            this.sendMsgDisabled = true
            let interval = window.setInterval(function () {
              if ((me.time--) <= 0) {
                me.time = 60
                me.sendMsgDisabled = false
                window.clearInterval(interval)
              }
            }, 1000)
          })
        }
      },
      submit() {
        if (this.formData.telephone.match(Reg.telephone) === null) {
          this.$vux.toast.text('手机号未输入或格式不正确！', 'bottom')
          return
        }
        if (!this.formData.vercode) {
          this.$vux.toast.text('请输入验证码！', 'bottom')
          return
        }
        if (!this.formData.password) {
          this.$vux.toast.text('请输入密码', 'bottom')
          return
        }
        if (this.formData.password.match(Reg.password) === null) {
          this.$vux.toast.text('密码要求6到12位数字、字母、下划线！', 'bottom')
          return
        }
        if (!this.formData.makepassword) {
          this.$vux.toast.text('请输入确认密码！', 'bottom')
          return
        }
        if (this.formData.makepassword !== this.formData.password) {
          this.$vux.toast.text('两次输入的密码不一致！', 'bottom')
          return
        }
        if (!this.chose) {
          this.$vux.toast.text('请同意协议！', 'bottom')
          return
        }
        ApiService.post('/api/h5Member/registeredH5.htm?telephone=' + this.formData.telephone + '&verifyCode=' + this.formData.vercode + '&password=' + this.formData.password + '&registerTerminal=3' + '&remark=H5注册' + '&referee=' + this.recotelephone + '&accountType=1', this.formData).then((res) => {
          if (res.data.resultCode === '0') {
            this.$vux.toast.text(res.data.resultDesc, 'bottom')
          } else {
            this.$router.push('/')
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .registerWrap {
    background: url(../../assets/register/i_enroll_bg1.png) no-repeat;
    background-size: cover;
    height: 400px;
    &:before {
      content: '';
      display: table;
    }
  }

  .registerForm {
    margin: 15vw auto 0;
    width: 78%;
    height: 66vw;
    text-align: center;
  }

  form {
    width: 80%;
    height: 26em;
    margin: 0 auto;
    padding-top: 20px;
    background-color: #ffffff;
    box-shadow: 1px 1px 1px #aaa;
    border-radius: 5px;
    .input {
      margin: 2px 15px;
      padding: 5px 0;
      font-size: 12px;
      border-bottom: 1px solid #EAE9E6;
      vertical-align: baseline;
      img {
        display: inline-block;
        width: 5vw;
        vertical-align: middle;
        margin: 0 2vw;
      }
      input {
        display: inline-block;
        height: 6vw;
        width: 75%;
      }
    }
    div:nth-child(6) {
      font-size: 12px;
      border: none;
      span {
        color: #0A78FE;
        padding: 0 8px
      }
    }
  }

  .vercode {
    height: 30px;
    color: #ffffff;
    background: #0A78FE;
    border: none;
    border-radius: 5px;
    position: absolute;
    top: 1px;
    right: 0;
    span {
      font-size: 10px;
    }
  }

  .save-back {
    text-align: center;
    button {
      width: 90%;
      margin: 2px auto;
      border: none;
      height: 9vw;
      font-size: 4vw;
      &:focus {
        outline: none;
      }
    }
    .regbtn {
      background: url(../../assets/register/i_enroll_bt.png) no-repeat;
      background-size: contain;
      color: #fff;
    }
    .bacbtn {
      background: url(../../assets/register/i_enroll_back.png) no-repeat;
      background-size: contain;
      color: #bfbfbf;
    }
  }
</style>
