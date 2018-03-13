<template>
  <div>
    <x-header
      :left-options="{backText: ''}">{{title}}
    </x-header>
    <div class="room">
      <div class="item">
        <span class="title">收货人：</span>
        <input type="text" v-model="addressInfo.name">
      </div>
      <div class="item">
        <span class="title">联系方式：</span>
        <input type="text" v-model="addressInfo.phone">
      </div>
      <div class="item" @click="set">
        <span class="title">所在楼号：</span>
        <input type="text" v-model="addressInfo.orderFlowName" readonly>
        <img src="../../assets/i_row_right_gray.png" style="float: right;width: 5vw" alt="">
      </div>
      <div class="item">
        <span class="title">详细地址：</span>
        <input type="text" v-model="addressInfo.detailAddress">
      </div>
    </div>
    <div v-transfer-dom>
      <popup position="bottom" v-model="show">
        <div style="padding: 2vw;background-color: #eee;text-align: center" class="clearfix">
          <span class="fl" @click="cancel">取消</span>
          <span>选择</span>
          <span class="fr" @click="sure">确定</span>
        </div>
        <picker :data="home" v-model="orderFlowId"></picker>
      </popup>
    </div>
    <div class="save">
      <button @click="save">{{btn}}</button>
    </div>
    <toast v-model="showValue" width="20em" type="text" :time="800" is-show-mask :text="resultDesc" position="middle"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Picker, TransferDom, Popup, Toast} from 'vux'
  import * as ApiService from 'api/api'
  import * as Reg from 'common/regexp'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Picker,
      Popup,
      Toast
    },
    data () {
      return {
        addressInfo: JSON.parse(localStorage.getItem('addressInfo')),
        title: '',
        btn: '',
        show: false,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        home: [],
        orderFlowId: [],
        showValue: false,
        resultDesc: ''
      }
    },
    created () {
      if (this.$route.params.id === '1') {
        this.title = '修改收货地址'
        this.btn = '修改'
      } else {
        this.title = '新增地址'
        this.btn = '保存'
      }
      ApiService.get('/api/h5DistributorOrder/queryDormitoryH5.htm?peopleId=' + this.userInfo.id + '&checkFlag&deviceInfo=' + this.userInfo.deviceInfo + '&schoolId=' + this.userInfo.orgId).then(res => {
        for (let i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].id = res.data.rows[i].id + ',' + res.data.rows[i].text
        }
        this.home.push(res.data.rows)
      })
    },
    methods: {
      save () {
        let addressInfo = {
          userId: this.userInfo.id,
          orderFlowId: this.addressInfo.orderFlowId,
          orderFlowName: this.addressInfo.orderFlowName,
          detailAddress: this.addressInfo.detailAddress,
          defaultStaus: this.addressInfo.defaultStaus,
          phone: this.addressInfo.phone,
          name: this.addressInfo.name,
          checkFlag: '',
          deviceInfo: this.userInfo.deviceInfo,
          peopleId: this.userInfo.id
        }
        if (this.addressInfo.id) {
          addressInfo.id = this.addressInfo.id
        }
        if (!addressInfo.name) {
          this.showValue = true
          this.resultDesc = '请输入收货人姓名'
          return
        }
        if (!addressInfo.phone) {
          this.showValue = true
          this.resultDesc = '请输入手机号'
          return
        }
        if (addressInfo.phone.match(Reg.telephone) === null) {
          this.showValue = true
          this.resultDesc = '手机号格式不正确'
          return
        }
        if (!addressInfo.orderFlowName) {
          this.showValue = true
          this.resultDesc = '请选择楼号'
          return
        }
        if (!addressInfo.detailAddress) {
          this.showValue = true
          this.resultDesc = '请输入详细地址'
          return
        }
        ApiService.post('/api/h5Member/saveMyAddressH5.htm', addressInfo).then(res => {
          if (res.data.resultCode === '1') {
            this.$router.push('/setAddress')
          }
        })
      },
      set () {
        this.show = true
      },
      sure () {
        this.show = false
        let arr = this.orderFlowId[0].split(',')
        this.addressInfo.orderFlowId = arr[0]
        this.addressInfo.orderFlowName = arr[1]
      },
      cancel () {
        this.show = false
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .room {
    background-color: #fff;
    margin-top: 2vw;
    .item {
      padding: 2vw;
      border-bottom: 1px solid #eee;
      .title {
        display: inline-block;
        width: 20vw;
        text-align: right;
      }
    }
  }

  .save {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-bottom: 2vw;
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
</style>
