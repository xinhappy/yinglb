<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}" :title="title">
    </x-header>
    <scroller lock-x height="-7vw" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
              :scroll-bottom-offst="10">
      <div>
        <div class="search-results" v-if="inners.length > 0">
          <listInner v-bind:items="inners"></listInner>
          <load-more tip="loading" v-if="onFetching"></load-more>
        </div>
        <div style="text-align: center" v-if="inners.length === 0">
          暂无数据
        </div>
      </div>
    </scroller>
    <toast v-model="showValue" type="text" :time="800" is-show-mask text="暂无更多数据" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListInner from 'components/list-inner/list-inner'
  import {LoadMore, Scroller, XHeader, Toast} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      ListInner,
      LoadMore,
      Scroller,
      XHeader,
      Toast
    },
    data () {
      return {
        inners: [],
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        local: JSON.parse(localStorage.getItem('local')),
        title: this.$route.params.title,
        page: 1,
        goodsType: this.$route.params.id,
        onFetching: false,
        showValue: false
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList: function () {
        if (this.title === '商家活动') {
          ApiService.getClassCompanyList('/api/h5AdvertisementBusiness/queryBusinessH5.htm?adId=' + this.goodsType + '&latitude=' + this.local.latitude + '&longitude=' + this.local.longitude + '&businessRegion&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=' + this.page + '&limit=8').then(res => {
            if (res.data.resultCode === '1') {
              if (res.data.rows.length > 0) {
                this.inners.push.apply(this.inners, res.data.rows)
              } else if (this.page > 1) {
                this.showValue = true
              }
            }
          })
        } else if (this.title === '我的收藏') {
          ApiService.get('/api/h5BusinessManage/queryCollectionH5.htm?userId=' + this.userInfo.id + '&latitude=' + this.local.latitude + '&longitude=' + this.local.longitude + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=' + this.page + '&limit=8').then(res => {
            if (res.data.resultCode === '1') {
              if (res.data.rows.length > 0) {
                this.inners.push.apply(this.inners, res.data.rows)
              } else if (this.page > 1) {
                this.showValue = true
              }
            }
          })
        } else {
          ApiService.getClassCompanyList('/api/h5BusinessManage/queryBusinessInfoH5.htm?goodsType=' + this.goodsType + '&memberId=' + this.userInfo.id + '&terminalType=1&latitude=' + this.local.latitude + '&longitude=' + this.local.longitude + '&businessRegion&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=' + this.page + '&limit=8').then(res => {
            if (res.data.resultCode === '1') {
              if (res.data.rows.length > 0) {
                this.inners.push.apply(this.inners, res.data.rows)
              } else if (this.page > 1) {
                this.showValue = true
              }
            }
          })
        }
      },
      onScrollBottom: function () {
        if (this.onFetching) {
          // do nothing
        } else {
          this.onFetching = true
          setTimeout(() => {
            this.page++
            this.getList()
            this.onFetching = false
          }, 2000)
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .blue_bg {
    background: url('../../../assets/i_bg_normal.png') no-repeat;
    background-size: cover;
    padding: 2vw 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    color: #fff;
    text-align: center;
  }
</style>
