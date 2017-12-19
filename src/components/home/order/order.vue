<template>
  <div class="body">
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">我的订单
    </x-header>
    <tab :line-width=1 active-color='#04a9ff' v-model="index">
      <tab-item class="vux-center" :selected="current === item" v-for="(item, index) in list" @click="current = item"
                :key="index">{{item}}
      </tab-item>
    </tab>
    <swiper v-model="index" :aspect-ratio='num' :show-dots="false">
      <swiper-item v-for="(item, index) in list" :key="index">
        <div class="order">
          <scroller lock-x height="-14vw" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                    :scroll-bottom-offst="10">
            <div :class="{'toUse': item === '待使用','used': item ==='已使用', 'handling': item ==='处理中' }">
              <div class="item" v-if="item === '待使用' && i.orderType === 2" v-for="i in toUseList">
                <div class="top clearfix">
                  <div class="fl">
                    <img :src="i.distributorPhoto" alt="">
                  </div>
                  <div class="fl">
                    <p>{{i.businessName}}</p>
                    <p>下单时间：{{i.createTime}}</p>
                  </div>
                </div>
                <div class="look">
                  <span @click="toDetail(i)" class="detail">查看详情</span>
                </div>
              </div>
              <div class="item" v-if="item === '待使用' && i.orderType !== 2" v-for="i in toUseList">
                <div class="topInner clearfix">
                  <div class="fl left">{{i.businessName}}</div>
                  <div class="fr right">下单时间：{{i.createTime}}</div>
                </div>
                <div class="goodsList clearfix" v-for="k in i.orderGoodsList">
                  <div class="fl">{{k.goodsName}}</div>
                  <div class="fr"><span class="left">*{{k.goodsCount}}</span><span>{{k.goodsPrice}}</span></div>
                </div>
                <div class="total">实付<span>{{i.total}}</span>盈磅</div>
                <div class="status">
                  <span class="fl">单号：{{i.businessOrderNum}}</span>
                  <span class="cancel" @click="sure(i.businessId, i.randomNum)">确定收货</span>
                </div>
              </div>
              <div class="item" v-if="item === '已使用'" v-for="i in usedList">
                <div class="topInner clearfix">
                  <div class="fl left">{{i.businessName}}</div>
                  <div class="fr right">下单时间：{{i.createTime}}</div>
                </div>
                <div class="goodsList clearfix" v-for="k in i.orderGoodsList">
                  <div class="fl">{{k.goodsName}}</div>
                  <div class="fr"><span class="left">*{{k.goodsCount}}</span><span>{{k.goodsPrice}}</span></div>
                </div>
                <div class="total">实付<span>{{i.total}}</span>盈磅</div>
                <div class="status">
                  <span class="fl">单号：{{i.businessOrderNum}}</span>
                  <span class="used" v-if="i.orderType !==2">已使用</span>
                  <span class="comments" v-if="i.orderType ===2">去点评</span>
                </div>
              </div>
              <div class="item" v-if="item === '处理中'" v-for="i in handlingList">
                <div class="topInner clearfix">
                  <div class="fl left">{{i.businessName}}</div>
                  <div class="fr right">下单时间：{{i.createTime}}</div>
                </div>
                <div class="goodsList clearfix" v-for="k in i.orderGoodsList">
                  <div class="fl">{{k.goodsName}}</div>
                  <div class="fr"><span class="left">*{{k.goodsCount}}</span><span>{{k.goodsPrice}}</span></div>
                </div>
                <div class="total">实付<span>{{i.total}}</span>盈磅</div>
                <div class="status">
                  <span class="fl">单号：{{i.businessOrderNum}}</span>
                  <span class="cancel">取消中</span>
                </div>
              </div>
              <div style="text-align: center" v-if="toUseList.length === 0&& item === '待使用'">暂无数据</div>
              <div style="text-align: center" v-if="usedList.length === 0 && item === '已使用'">暂无数据</div>
              <div style="text-align: center" v-if="handlingList.length === 0 && item === '处理中'">暂无数据</div>
            </div>
          </scroller>
        </div>
      </swiper-item>
    </swiper>
    <div v-transfer-dom>
      <confirm v-model="show"
               title="确认收货?"
               theme="android"
               @on-cancel="onCancel"
               @on-confirm="onConfirm">
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Tab, TabItem, Swiper, SwiperItem, Scroller, Toast, Confirm, TransferDom} from 'vux'
  import * as ApiService from 'api/api'
  import * as types from 'src/store/mutation-types'
  const list = () => ['待使用', '已使用', '处理中']
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Scroller,
      Toast,
      Confirm
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        list: list(),
        current: '待使用',
        index: 0,
        page: 1,
        toUseList: [],
        usedList: [],
        handlingList: [],
        num: 1.5,
        show: false,
        title: '',
        businessId: '',
        randomNum: ''
      }
    },
    created () {
      this.toUse()
      this.used()
      this.handling()
    },
    methods: {
      toUse () {
        ApiService.post('/api/h5MemberExchange/queryOrderH5.htm', {
          userId: this.userInfo.id,
          orderStatus: '1',
          page: this.page,
          limit: '8'
        }).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.rows.length > 0) {
              this.toUseList.push.apply(this.toUseList, res.data.rows)
            }
          }
        })
      },
      used () {
        ApiService.post('/api/h5MemberExchange/queryOrderH5.htm', {
          userId: this.userInfo.id,
          orderStatus: '2',
          page: this.page,
          limit: '8'
        }).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.rows.length > 0) {
              this.usedList.push.apply(this.usedList, res.data.rows)
            }
          }
        })
      },
      handling () {
        ApiService.post('/api/h5MemberExchange/queryOrderH5.htm', {
          userId: this.userInfo.id,
          orderStatus: '3',
          page: this.page,
          limit: '8'
        }).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.rows.length > 0) {
              this.handlingList.push.apply(this.handlingList, res.data.rows)
            }
          }
        })
      },
      sure (businessId, randomNum) {
        this.businessId = businessId
        this.randomNum = randomNum
        this.show = true
      },
      onCancel () {
        this.show = false
      },
      onConfirm () {
        ApiService.post('/api/h5MemberExchange/businessCheckH5.htm', {
          businessId: this.businessId,
          randomNum: this.randomNum,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            window.location.reload()
          }
        })
      },
      onScrollBottom () {

      },
      toDetail (item) {
        this.$store.commit(types.ORDER, item)
        this.$router.push('/orderDetail')
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .body {
    height: 100%;
    background-color: #fff;
    .order {
      .toUse {
        padding: 2vw;
        .item {
          padding: 2vw;
          border: 1px solid #eee;
          border-radius: 3px;
          margin-bottom: 2vw;
          -webkit-box-shadow: 2px 2px 5px #ddd;
          box-shadow: 2px 2px 5px #ddd;
          .topInner {
            border-bottom: 1px solid #eee;
            padding-bottom: 1vw;
            .left {
              font-size: 3.6vw;
            }
            .right {
              color: #aaa;
            }
          }
          .goodsList {
            padding: 1vw 0;
            .left {
              margin-right: 8vw;
            }
          }
          .total {
            text-align: right;
            border-bottom: 1px solid #eee;
            padding-bottom: 1vw;
            span {
              color: #0577ff;
            }
          }
          .status {
            padding: 1vw 0;
            text-align: right;
            .cancel {
              color: #fff;
              background-color: orange;
              padding: 0.5vw 2vw;
            }
          }
          .top {
            img {
              width: 8vw;
              height: 8vw;
              border-radius: 50% 50%;
              margin-right: 3vw;
            }
          }
          .look {
            text-align: right;
            .detail {
              color: #0577ff;
              padding: 0.5vw 2vw;
              border: 1px solid #0577ff;
              border-radius: 3px;
            }
          }
        }
      }
      .used {
        padding: 2vw;
        .item {
          padding: 2vw;
          border: 1px solid #eee;
          border-radius: 3px;
          margin-bottom: 2vw;
          -webkit-box-shadow: 2px 2px 5px #ddd;
          box-shadow: 2px 2px 5px #ddd;
          .topInner {
            border-bottom: 1px solid #eee;
            padding-bottom: 1vw;
            .left {
              font-size: 3.6vw;
            }
            .right {
              color: #aaa;
            }
          }
          .goodsList {
            padding: 1vw 0;
            .left {
              margin-right: 8vw;
            }
          }
          .total {
            text-align: right;
            border-bottom: 1px solid #eee;
            padding-bottom: 1vw;
            span {
              color: #0577ff;
            }
          }
          .status {
            padding: 1vw 0;
            text-align: right;
            .used {
              color: #aaa;
              padding: 0.5vw 2vw;
              border: 1px solid #ddd;
              border-radius: 3px;
            }
            .comments {
              color: #0577ff;
              padding: 0.5vw 2vw;
              border: 1px solid #0577ff;
              border-radius: 3px;
            }
          }
        }
      }
      .handling {
        padding: 2vw;
        .item {
          padding: 2vw;
          border: 1px solid #eee;
          border-radius: 3px;
          margin-bottom: 2vw;
          -webkit-box-shadow: 2px 2px 5px #ddd;
          box-shadow: 2px 2px 5px #ddd;
          .topInner {
            border-bottom: 1px solid #eee;
            padding-bottom: 1vw;
            .left {
              font-size: 3.6vw;
            }
            .right {
              color: #aaa;
            }
          }
          .goodsList {
            padding: 1vw 0;
            .left {
              margin-right: 8vw;
            }
          }
          .total {
            text-align: right;
            border-bottom: 1px solid #eee;
            padding-bottom: 1vw;
            span {
              color: #0577ff;
            }
          }
          .status {
            padding: 1vw 0;
            text-align: right;
            .cancel {
              color: #fff;
              background-color: orange;
              padding: 0.5vw 2vw;
            }
          }
        }
      }
    }
  }
</style>
