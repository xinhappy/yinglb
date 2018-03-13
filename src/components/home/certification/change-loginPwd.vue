<template>
  <div class="wrap">
    <x-header
              :left-options="{backText: ''}">修改登录密码
    </x-header>
    <div class="room">
      <div class="item">
        <span><img src="../../../assets/login/icon_login_pwd.png" alt=""></span><input v-model="oldPwd" placeholder="请输入旧密码" type="password"></div>
      <div class="item">
        <span><img src="../../../assets/login/icon_login_pwd.png" alt=""></span><input v-model="pwd" placeholder="请输入密码" type="password">
      </div>
      <div class="item">
        <span><img src="../../../assets/login/icon_login_pwd.png" alt=""></span><input v-model="rePwd" placeholder="请确认密码" type="password">
      </div>
    </div>
    <div style="text-align: center;margin-top: 2vw;padding: 0 2vw">
      <button class="btn" @click="save">确定</button>
      <p style="text-align: right">
        <router-link style="color: #04a3ff" to="/resetLoginPwd">重置登录密码</router-link>
      </p>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="text" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Countdown, Toast} from 'vux'
  import * as types from 'src/store/mutation-types'
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
        ApiService.post('/api/h5Member/updatePwdH5.htm', {
          oldPwd: this.oldPwd,
          newPwd: this.pwd,
          id: this.userInfo.id,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.$store.commit(types.LOGOUT, [])
            this.$router.push('/')
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
      .item{
        padding-bottom: 2vw;
        margin-bottom: 2vw;
        border-bottom: 1px solid #eee;
        img{
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
