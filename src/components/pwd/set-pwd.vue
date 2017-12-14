<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">设置交易密码
    </x-header>
    <div class="room">
      <div class="item"><img src="/src/assets/login/icon_login_pwd.png" style="width: 4vw;height: 4vw;margin-right: 2vw"
                             alt=""><input type="password" v-model="passWord" placeholder="请输入交易密码(6位数字)"></div>
      <div class="item"><img src="/src/assets/login/icon_login_pwd.png" style="width: 4vw;height: 4vw;margin-right: 2vw"
                             alt=""><input type="password" v-model="rePassWord" placeholder="请确认交易密码(6位数字)"></div>
    </div>
    <div class="save">
      <button @click="save">确定</button>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="resultDesc" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Toast} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      XHeader,
      Toast
    },
    data () {
      return {
        showValue: false,
        resultDesc: '',
        passWord: '',
        rePassWord: '',
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
      }
    },
    methods: {
      save () {
        if (this.passWord !== this.rePassWord) {
          this.showValue = true
          this.resultDesc = '两次输入的交易密码不一致'
          return
        }
        ApiService.post('/api/h5TransactionPwd/setPwdH5.htm', {
          userId: this.userInfo.id,
          passWord: this.passWord
        }).then(res => {
          if (res.data.resultCode === '1') {
            let userInfo = this.userInfo
            userInfo.transactionPwdStatus = 1
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            this.$router.back()
          }
        })
      }
    },
    watch: {
      passWord (val) {
        this.passWord = val.replace(/[^\d]/g, '')
        if (val.length > 6) {
          this.showValue = true
          this.resultDesc = '密码只能六位'
          this.passWord = val.substring(0, 6)
        }
      },
      rePassWord (val) {
        this.rePassWord = val.replace(/[^\d]/g, '')
        if (val.length > 6) {
          this.showValue = true
          this.resultDesc = '密码只能六位'
          this.rePassWord = val.substring(0, 6)
        }
      }
    }

  }
</script>

<style lang="less" rel="stylesheet/less">
  body {
    background-color: #fff;
    .room {
      padding: 2vw;
      .item {
        background-color: #fff;
        border-bottom: 1px solid #eee;
        padding: 2vw 0;
        display: flex;
        align-content: center;
        input {
          width: 60%;
        }
      }
    }
    .save {
      text-align: center;
      margin-top: 2vw;
      button {
        width: 85%;
        margin: 0 auto;
        border: none;
        background: url(../../assets/i_bg_normal.png) no-repeat;
        background-size: cover;
        height: 10vw;
        color: #fff;
        font-size: 4vw;
        &:focus {
          outline: none;
        }
      }
    }
  }

</style>
