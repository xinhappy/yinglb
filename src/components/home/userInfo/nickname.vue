<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">修改昵称
      <a slot="right" style="color: #fff" @click="changeName">确定</a>
    </x-header>
    <div class="room">
      <div class="input"><input type="text" v-model="nickname" placeholder="请输入内容"></div>
      <div class="length"><span v-model="length"></span>{{length}}/11</div>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="resultDesc" position="bottom"></toast>
  </div>
</template>

<script scoped type="text/ecmascript-6">
  import {XHeader, Toast} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      XHeader,
      Toast
    },
    data() {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        nickname: '',
        length: 0,
        showValue: false,
        resultDesc: ''
      }
    },
    methods: {
      changeName () {
        if (this.nickname.length === 0) {
          this.showValue = true
          this.resultDesc = '输入内容不能为空'
        } else {
          ApiService.post('/api/h5Member/modifyNickNameH5.htm', {
            userId: this.userInfo.id,
            nickname: this.nickname,
            deviceInfo: this.userInfo.deviceInfo,
            checkFlag: '',
            peopleId: this.userInfo.id
          }).then(res => {
            if (res.data.resultCode === '1') {
              this.$router.push('/userInfo')
            }
          })
        }
      }
    },
    watch: {
      nickname (val) {
        let i = val.length
        this.length = i
        if (i > 11) {
          this.nickname = val.substring(0, 11)
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  body {
    background-color: #fff !important;
    .room {
      padding: 4vw 2vw;
      .input {
        border-bottom: 1px solid #0000f6;
        input {
          width: 100%;
          font-size: 3.6vw;
        }
      }
      .length {
        text-align: right;
      }
    }
  }
</style>
