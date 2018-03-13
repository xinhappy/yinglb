<template>
  <div>
    <header
      class="m-header fixed-top">
      待抢单
    </header>
    <scroller lock-x height="-46px" :bounce=true @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
              :scroll-bottom-offst="50" :use-pullup="false">
      <div class="griblist" style="padding:40px 15px 50px 15px;">
        <grib-list v-bind:items="grib" v-on:showErod="showErod"></grib-list>
        <load-more v-if="show" tip="努力加载中..."></load-more>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="seen" class="dialog">
          <div class="img-box">
            <divider style="font-size:20px;font-weight:bold;">{{title}}</divider>
            <img src="../../assets/ewcode.png" width="200px" height="200px" alt="盈联邦二维码">
            <p style="margin-top: 30px;font-size:15px">扫码下载盈联帮APP</p>
          </div>
          <div @click="seen=false">
            <span class="vux-close"></span>
          </div>
        </x-dialog>
      </div>
    </scroller>
    <v-footer></v-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    Scroller,
    XHeader,
    LoadMore,
    Toast,
    XDialog,
    TransferDomDirective as TransferDom,
    Divider,
    ToastPlugin
  } from 'vux'
  import * as ApiService from 'api/api'
  import Footer from 'components/footer/footer'
  import GribList from 'components/grib-list/grib-list'
  import Vue from 'vue'

  Vue.use(ToastPlugin)

  export default {
    directives: {
      TransferDom
    },
    components: {
      'v-footer': Footer,
      XHeader,
      GribList,
      Scroller,
      LoadMore,
      Toast,
      Divider,
      XDialog
    },
    data() {
      return {
        grib: [],
        page: 1,
        onFetching: false,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        local: JSON.parse(localStorage.getItem('local')),
        distributorId: JSON.parse(localStorage.getItem('userInfo')).distributorId ? JSON.parse(localStorage.getItem('userInfo')).distributorId : '',
        show: true,
        seen: false,
        title: '盈联帮'
      }
    },
    created() {
      this.getGribList()
    },
    methods: {
      getGribList() {
        let latitude = this.local ? this.local.latitude : '0.0'
        let longitude = this.local ? this.local.longitude : '0.0'
        ApiService.get('/api/h5DistributorOrder/queryDistributorOrderH5.htm?distributorId=' + this.distributorId + '&checkFlag=&deviceInfo=' + this.userInfo.deviceInfo + '&peopleId=' + this.userInfo.id + '&status=0' + '&latitude=' + latitude + '&longitude=' + longitude + '&page=' + this.page + '&limit=3').then(res => {
          if (res.data.rows.length > 1) {
            this.grib.push.apply(this.grib, res.data.rows)
          } else {
            this.$vux.toast.text('无更多数据加载！', 'bottom')
            this.show = false
          }
        })
      },
      onScrollBottom() {
        if (this.onFetching) {
        } else {
          this.onFetching = true
          setTimeout(() => {
            this.page++
            this.getGribList()
            this.onFetching = false
          }, 1000)
        }
      },
      showErod(data) {
        this.seen = data
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '~vux/src/styles/close';

  .griblist {
    box-sizing: border-box;
  }

  .dialog {
    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 8px;
    }
    .dialog-title {
      line-height: 30px;
      color: #666;
    }
    .img-box {
      height: 350px;
      overflow: hidden;
    }
    .vux-close {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
</style>
