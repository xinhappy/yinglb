<template>
  <div>
    <x-header
              :left-options="{backText: ''}">地址管理
    </x-header>
    <div style="max-height: 150vw;overflow-y: auto">
      <div v-for="item in address" class="item">
        <div class="clearfix">
          <span>{{item.name}}</span>
          <span class="fr">{{item.phone}}</span>
        </div>
        <div class="middle">
          {{item.orderFlowName}}{{item.detailAddress}}
        </div>
        <div class="clearfix">
          <span @click="setDefault(item.id)" class="default fl" :class="{ 'active' : item.defaultStaus === '1' }"><i
            class="icon"></i>默认选择地址</span>
          <p class="fr">
            <span class="change" @click="edit(item)"><img src="../../assets/icon_edit_gray.png"
                                                          style="width:4vw;height: 4vw;margin-right: 1vw"
                                                          alt="">编辑</span>
            <span class="change" @click="del(item.id)"><img src="../../assets/icon_delete_gray.png"
                                                            style="width:4vw;height: 4vw;margin-right: 1vw"
                                                            alt="">删除</span>
          </p>
        </div>
      </div>
    </div>
    <div class="save">
      <button @click="add">新增送餐地址</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader} from 'vux'
  import * as ApiService from 'api/api'
  import * as types from 'src/store/mutation-types'
  export default {
    components: {
      XHeader
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        address: []
      }
    },
    created () {
      this.getAddress()
    },
    methods: {
      add () {
        localStorage.setItem('addressInfo', JSON.stringify({
          name: '',
          phone: '',
          orderFlowName: '',
          detailAddress: '',
          id: null
        }))
        this.$router.push('/addAddress/0')
      },
      getAddress () {
        ApiService.post('/api/h5Member/queryMyAddressH5.htm', {
          userId: this.userInfo.id,
          checkFlag: '',
          deviceInfo: this.userInfo.deviceInfo,
          peopleId: this.userInfo.id,
          flag: ''
        }).then(res => {
          if (res.data.resultCode === '1') {
            this.address = res.data.rows
          }
        })
      },
      del (id) {
        ApiService.post('/api/h5Member/delMyAddressH5.htm', {
          id: id,
          checkFlag: '',
          deviceInfo: this.userInfo.deviceInfo,
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            window.location.reload()
          }
        })
      },
      edit (item) {
        localStorage.setItem('addressInfo', JSON.stringify(item))
        this.$router.push('/addAddress/1')
      },
      setDefault (id) {
        ApiService.post('/api/h5Member/updateMyAddressH5.htm', {
          id: id,
          checkFlag: '',
          deviceInfo: this.userInfo.deviceInfo,
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            window.location.reload()
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .save {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-bottom: 2vw;
    button {
      width: 65%;
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

  .item {
    padding: 2vw;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    .middle {
      margin: 2vw 0;
    }
    .default {
      color: #aaa;
      display: flex;
      align-content: center;
      .icon {
        display: inline-block;
        width: 4vw;
        height: 4vw;
        background: url(../../assets/icon_default_gray.png) no-repeat;
        background-size: cover;
        margin-right: 1vw;
      }
      &.active {
        color: #0000ff;
        .icon {
          background: url(../../assets/icon_default_blue.png) no-repeat;
          background-size: cover;
        }
      }
    }
    .change {
      margin-right: 2vw;
      float: left;
      display: flex;
      align-content: center;
    }
  }
</style>
