<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">商品评价
    </x-header>
    <scroller lock-x height="-7vw" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
              :scroll-bottom-offst="10">
      <div>
        <div style="text-align: center;padding-top: 10vw" v-if="list.length === 0">暂无数据</div>
        <div v-for="item in list" class="clearfix item">
          <div class="fl item_left">
            <img :src="item.userUrl ? item.userUrl : defaultUrl" alt="">
          </div>
          <div class="fl item_right">
            <p class="clearfix">{{item.userName}} <span class="fr">{{item.evaluationTime}}</span></p>
            <p>打分 <rater v-model="item.evaluationRemark" :font-size="15"></rater></p>
            <div>
              <p>{{item.goodsEvaluation}}</p>
              <span v-for="i in item.imgUrls">
                <img :src="i" alt="" style="max-width: 15vw;margin-right: 2vw">
              </span>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <toast v-model="showValue" type="text" :time="800" is-show-mask :text="resultDesc" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Scroller, Toast, Rater} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      XHeader,
      Scroller,
      Toast,
      Rater
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        list: [],
        businessId: this.$route.params.id,
        page: 1,
        showValue: false,
        resultDesc: '',
        defaultUrl: '/src/assets/icon_cell.png'
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList: function () {
        ApiService.get('/api/h5DistributorOrder/queryOrderEvaluationH5.htm?businessId=' + this.businessId + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=' + this.page + '&limit=8').then(res => {
          if (res.data.rows.length === 0 && this.page > 1) {
            this.showValue = true
            this.resultDesc = '没有更多数据'
          } else {
            this.list.push.apply(this.list, res.data.rows)
          }
        })
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
  .item {
    padding: 2vw;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    .item_left {
      width: 15%;
      img {
        width: 8vw;
        height: 8vw;
        border-radius: 50% 50%;
      }
    }
    .item_right{
      width: 85%;
    }
  }
</style>
