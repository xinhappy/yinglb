<template>
  <div>
    <x-header
              :left-options="{backText: ''}">实名认证
    </x-header>
    <div class="room">
      <div style="padding-bottom: 2vw;margin-bottom: 2vw;border-bottom: 1px solid #eee">
        <span>你的姓名</span><input v-model="userName" placeholder="请输入姓名" type="text"></div>
      <div>
        <span>身份证号</span><input v-model="userCard" placeholder="请输入身份证号" type="text" maxlength="20">
      </div>
    </div>
    <div v-show="showBtn" style="text-align: center;margin-top: 10vw">
      <button class="btn" @click="save">确定</button>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="text" width="15em" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Countdown, Toast} from 'vux'
  import * as ApiService from 'api/api'
  import * as Reg from 'common/regexp'
  export default {
    components: {
      XHeader,
      Countdown,
      Toast
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        userName: '',
        userCard: '',
        showValue: false,
        text: '',
        showBtn: true
      }
    },
    created () {
      this.userName = this.userInfo.realName
      this.userCard = this.userInfo.identityCard
      if (this.userInfo.realNameStatus === 2) {
        this.showBtn = false
      }
    },
    methods: {
      save () {
        if (!this.userName) {
          this.showValue = true
          this.text = '姓名不能为空'
          return
        }
        if (!this.userCard) {
          this.showValue = true
          this.text = '身份证号不能为空'
          return
        }
        if (this.userCard.match(Reg.ID18) || this.userCard.match(Reg.ID15)) {
          ApiService.post('/api/h5Member/perfectInfoH5.htm', {
            identityCard: this.userCard,
            name: this.userName,
            id: this.userInfo.id,
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
        } else {
          this.showValue = true
          this.text = '身份证号格式错误！'
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
