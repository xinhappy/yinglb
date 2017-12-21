<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">个人认证
    </x-header>
    <div class="item">
      <div class="list clearfix" @click="to('/changePhone')">
        <div class="fl left">
          <img src="/src/assets/home/i_identify_phone.png" alt="">
          <span>手机号码</span>
        </div>
        <div class="fr right">
          <span>{{userInfo.userPhone}}</span>
          <img src="/src/assets/i_row_right_gray.png" alt="">
        </div>
      </div>
      <div class="list clearfix" @click="to('/realName')">
        <div class="fl left">
          <img src="/src/assets/home/i_center_ident.png" alt="">
          <span>实名认证</span>
        </div>
        <div class="fr right">
          <span>{{userInfo.realName ? userInfo.realName : '未实名'}}</span>
          <img src="/src/assets/i_row_right_gray.png" alt="">
        </div>
      </div>
    </div>
    <div class="item">
      <div class="list clearfix" @click="to('/changeLoginPwd')">
        <div class="fl left">
          <img src="/src/assets/home/i_center_ident.png" alt="">
          <span>更改登录密码</span>
        </div>
        <div class="fr right">
          <img src="/src/assets/i_row_right_gray.png" alt="">
        </div>
      </div>
      <div class="list clearfix" @click="to('/changePwd')">
        <div class="fl left">
          <img src="/src/assets/home/i_center_ident.png" alt="">
          <span>更改交易密码</span>
        </div>
        <div class="fr right">
          <img src="/src/assets/i_row_right_gray.png" alt="">
        </div>
      </div>
      <div class="list clearfix" @click="noChange">
        <div class="fl left">
          <img src="/src/assets/home/i_center_ident.png" alt="">
          <span>我的院校</span>
        </div>
        <div class="fr right">
          <span>{{school}}</span>
          <img src="/src/assets/i_row_right_gray.png" alt="">
        </div>
      </div>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask text="学校已绑定，暂时无法修改" position="bottom"></toast>
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
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        school: '',
        showValue: false
      }
    },
    created () {
      let arr = this.userInfo.orgName.split(',')
      this.school = arr[1]
    },
    methods: {
      to (path) {
        this.$router.push(path)
      },
      noChange () {
        if (this.userInfo.orgName) {
          this.showValue = true
        }
      }
    },
    watch: {
      userInfo (val) {
        this.userInfo = val
        localStorage.setItem('userInfo', JSON.stringify(val))
      }
    },
    mounted () {
      ApiService.post('/api/h5Member/refreshMemberInfoH5.htm', {
        userId: this.userInfo.id,
        deviceInfo: this.userInfo.deviceInfo,
        checkFlag: '',
        peopleId: this.userInfo.id
      }).then(res => {
        if (res.data.resultCode === '1') {
          this.userInfo = res.data.object
        }
      })
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .item {
    margin: 2vw;
    background-color: #fff;
    padding: 2vw;
    border: 1px solid #eee;
    border-radius: 3px;
    -webkit-box-shadow: 2px 2px 5px #ddd;
    box-shadow: 2px 2px 5px #ddd;
    .list {
      border-bottom: 1px solid #eee;
      margin-bottom: 2vw;
      padding-bottom: 2vw;
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .left {
        img {
          width: 5vw;
          height: 5vw;
          vertical-align: middle;
          margin-right: 1vw;
        }
        span {
          position: relative;
          top: 1vw;
        }
      }
      .right {
        img {
          width: 4vw;
          vertical-align: middle;
        }
      }
    }

  }
</style>
