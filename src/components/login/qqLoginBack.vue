<template>
  <div class="loginWrap">
    <div class="loginForm">
      <form @submit.prevent="submit">
        <div class="input"><img src="../../assets/login/icon_login_name.png" alt=""><input v-model="formData.telephone"
                                                                                           type="text" required
                                                                                           placeholder="手机号码"></div>
        <div class="input"><img src="../../assets/login/icon_login_pwd.png" alt=""><input v-model="formData.password"
                                                                                          type="password" required
                                                                                          placeholder="密码"></div>
        <div class="save">
          <button type="submit">登录</button>
        </div>
      </form>
      <div class="clearfix">
        <a class="fl" href="#/register" style="margin-left: 3vw;color: #aaa;font-size: 2vw">用户注册</a>
        <a class="fr" href="#/resetLoginPwd" style="margin-right: 3vw;color:#aaa;font-size: 2vw">忘记密码？</a>
      </div>
    </div>
    <div class="qita">
      <p>其他登录方式</p>
      <p><img src="../../assets/login/i_type_line.png" alt="" style="width: 50vw"></p>
      <p><img @click="wxLogin" src="../../assets/login/icon_login_wx.png" alt="">
        <!--<img id="qq" @click="qqLogin" src="../../assets/login/icon_login_qq.png" alt="">-->
      </p>
    </div>
    <toast v-model="show" type="text" :time="800" is-show-mask :text="text" position="bottom"></toast>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as ApiService from 'api/api'
  import {Toast} from 'vux'
  import * as types from 'src/store/mutation-types'
  export default {
    components: {
      Toast
    },
    data () {
      return {
        formData: [],
        text: '',
        show: false
      }
    },
    methods: {
      submit: function () {
        this.formData.type = 1
        this.formData.loginInfo = this.uuid()
        ApiService.login('/api/h5Member/loginH5.htm', this.formData).then((res) => {
          if (res.data.resultCode === '0') {
            this.show = true
            this.text = res.data.resultDesc
          } else {
            this.$store.commit(types.LOGIN, res.data.object)
            this.$router.push('/community')
          }
        })
      },
      wxLogin () {
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {  // eslint-disable-line
          // 跳转到微信授权页面
          let redirectUri = encodeURIComponent('http://p8ja6q.natappfree.cc/#/qqLoginBack')
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxae9cdc00bf788458&redirect_uri=' + redirectUri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        }
      },
      uuid: function () {
        const len = 32  // 32长度
        let radix = 16  // 16进制
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
        const uuid = []
        let i
        radix = radix || chars.length
        if (len) {
          for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]
        } else {
          var r
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
          uuid[14] = '4'
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16
              uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
          }
        }
        return uuid.join('')
      },
      getQueryString (name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        let r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
      }
    },
    mounted () {
      let vm = this
      let code = vm.getQueryString('code')
      if (code) {
        ApiService.post('/api/h5Member/getAccessToken.htm', {code: code}).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.object.userPhone) {
              this.$store.commit(types.LOGIN, res.data.object)
              this.$router.push('/community')
            } else {
              this.$store.commit(types.LOGIN, res.data.object)
              vm.$router.push('/bindPhone/1')
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .loginWrap {
    background: url(../../assets/login/i_login_bg1.png) no-repeat;
    background-size: contain;
    height: 100%;
    &:before {
      content: '';
      display: table;
    }
  }

  .loginForm {
    margin: 30vw auto 0;
    background: url(../../assets/login/i_login_bg2.png) no-repeat;
    background-size: contain;
    width: 60%;
    height: 66vw;
    padding-top: 25vw;
  }

  .input {
    border-bottom: 1px solid #eee;
    width: 90%;
    margin: 0 auto 2vw;
    img {
      display: inline-block;
      width: 5vw;
      vertical-align: middle;
      margin: 0 2vw;
    }
    input {
      display: inline-block;
      height: 6vw;
      width: 80%;
    }
  }

  .save {
    text-align: center;
    button {
      width: 90%;
      margin: 0 auto;
      border: none;
      background: url(../../assets/login/i_login_bt.png) no-repeat;
      background-size: contain;
      height: 12vw;
      color: #fff;
      font-size: 4vw;
      &:focus {
        outline: none;
      }
    }
  }

  .qita {
    text-align: center;
    img {
      width: 8vw;
      margin: 0 3vw;
    }
  }

</style>
