<template>
  <div class="cont">
    <div>
      <scroller lock-x height="-46px" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                :scroll-bottom-offst="10">
        <x-header
          :left-options="{backText: ''}">充值记录
        </x-header>
        <div class="records">
          <div style="text-align: center" v-if="list.length === 0">暂无数据</div>
          <div class="clearfix item" v-for="item in list">
            <div class="fl left">
              <p>{{item.transactionRemark}}</p>
              <p>{{item.transactionDate}}</p>
            </div>
            <div class="fl center">{{item.moneyYb}}</div>
            <div class="fr right">
              <p v-if="item.transactionStatus === 0">交易成功</p>
              <p v-if="item.transactionStatus === 1">交易失败</p>
              <p v-if="item.transactionStatus === 2">交易中</p>
              <p v-if="item.transactionStatus === 3">交易取消</p>
              <p>余额：{{item.userBalance}}</p>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask text="没有更多数据" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Scroller, Toast} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      XHeader,
      Scroller,
      Toast
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        page: 1,
        list: [],
        showValue: false,
        onFetching: false
      }
    },
    created () {
      this.getConsumption()
    },
    methods: {
      getConsumption () {
        ApiService.post('/api/h5CapitalRecord/queryCapitalRecordHistoryH5.htm', {
          userId: this.userInfo.id,
          userType: '1',
          typeFlag: '',
          page: this.page,
          limit: 8
        }).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.rows.length === 0 && this.page > 1) {
              this.showValue = true
            } else {
              this.list.push.apply(this.list, res.data.rows)
            }
          }
        })
      },
      onScrollBottom () {
        if (this.onFetching) {
          // do nothing
        } else {
          this.onFetching = true
          setTimeout(() => {
            this.page++
            this.getConsumption()
            this.onFetching = false
          }, 2000)
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .cont{
    background-color: #fff;
    height: 100%;
    .records {
      padding: 2vw;
      .item {
        border-bottom: 1px solid #aaa;
        display: flex;
        align-content: center;
        padding: 2vw 0;
        .left {
          width: 33vw;
        }
        .center {
          width: 33vw;
          text-align: center;
          color: #04acff;
          padding-top: 5vw;
        }
        .right {
          width: 33vw;
          text-align: center;
          padding-top: 3vw;
        }
      }
    }
  }
</style>
