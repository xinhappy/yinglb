<template>
  <div class="wrap">
    <x-header
              :left-options="{backText: ''}">修改交易密码
    </x-header>
    <div class="room">
      <div class="item">
        <span><img src="../../../assets/login/icon_login_pwd.png" alt=""></span><input v-model="oldPwd"
                                                                                   placeholder="请输入旧密码(6位数字)"
                                                                                   type="password"></div>
      <div class="item">
        <span><img src="../../../assets/login/icon_login_pwd.png" alt=""></span><input v-model="pwd"
                                                                                   placeholder="请输入密码(6位数字)"
                                                                                   type="password">
      </div>
      <div class="item">
        <span><img src="../../../assets/login/icon_login_pwd.png" alt=""></span><input v-model="rePwd"
                                                                                   placeholder="请确认密码(6位数字)"
                                                                                   type="password">
      </div>
    </div>
    <div style="text-align: center;margin-top: 2vw;padding: 0 2vw">
      <button class="btn" @click="save">确定</button>
      <p style="text-align: right">
        <router-link style="color: #04a3ff" to="/resetPwd">重置交易密码</router-link>
      </p>
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
        oldPwd: '',
        pwd: '',
        rePwd: '',
        showValue: false,
        text: ''
      }
    },
    methods: {
      save () {
        if (!this.oldPwd) {
          this.showValue = true
          this.text = '旧密码不能为空'
          return
        }
        if (!this.pwd) {
          this.showValue = true
          this.text = '密码不能为空'
          return
        }
        if (this.pwd.length < 6) {
          this.showValue = true
          this.text = '密码不能小于6位'
          return
        }
        if (!this.rePwd) {
          this.showValue = true
          this.text = '确认密码不能为空'
          return
        }
        if (this.rePwd !== this.pwd) {
          this.showValue = true
          this.text = '确认密码跟密码不一致'
          return
        }
        ApiService.post('/api/h5TransactionPwd/editPwdH5.htm', {
          oldPassWord: this.oldPwd,
          newPassWord: this.pwd,
          userId: this.userInfo.id,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.$router.push('/certification')
          } else {
            this.showValue = true
            this.text = res.data.resultDesc
          }
        })
      }
    },
    watch: {
      oldPwd (val) {
        this.oldPwd = val.replace(/[^\d]/g, '')
        if (val.length > 6) {
          this.oldPwd = val.substring(0, 6)
        }
      },
      pwd (val) {
        this.pwd = val.replace(/[^\d]/g, '')
        if (val.length > 6) {
          this.pwd = val.substring(0, 6)
        }
      },
      rePwd (val) {
        this.rePwd = val.replace(/[^\d]/g, '')
        if (val.length > 6) {
          this.rePwd = val.substring(0, 6)
        }
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
