<template>
  <div class="orderRoom">
    <x-header
              :left-options="{backText: ''}">订单详情
    </x-header>
    <div class="topWrap">
      <div class="first">
        <img :src="orderInfo.distributorPhoto" alt="">
        <span>{{orderInfo.businessName}}</span>
      </div>
      <div class="clearfix two">
        <div class="fl">具体商品：</div>
        <div class="fl right">
          <div v-for="item in orderInfo.orderGoodsList">
            <span>{{item.goodsName}}</span>
            <span class="center">*{{item.goodsCount}}</span>
            <span>{{item.goodsPrice}}</span>
          </div>
        </div>
      </div>
      <div class="three">订单备注：{{orderInfo.remark}}</div>
      <div class="four">
        配送费用：
        <span class="fr">{{orderInfo.distributionFee?orderInfo.distributionFee:'0.00'}}盈磅</span>
      </div>
      <div>
        订单优惠：
        <span class="fr">{{orderInfo.discountFee}}盈磅</span>
      </div>
      <div class="last">实付{{orderInfo.total}}盈磅</div>
    </div>
    <div class="bottomWrap">
      <div>取货地址：{{orderInfo.businessAddress}}</div>
      <div>送餐地址：{{orderInfo.userAddress}}</div>
      <div>收货时间：{{orderInfo.appointmentTime ? appointmentTime : '等待骑手接单'}}</div>
      <div>订单编号：{{orderInfo.orderNum}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader} from 'vux'
  export default {
    components: {
      XHeader
    },
    data () {
      return {
        orderInfo: this.$store.state.orderDetail[0]
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .orderRoom{
    background-color: #eee ;
    height: 100%;
    .topWrap{
      background-color: #fff;
      padding: 2vw;
      .first{
        padding: 2vw 0;
        img{
          width: 10vw;
          height: 10vw;
          border-radius: 50% 50%;
          margin-right: 4vw;
          vertical-align: middle;
        }
      }
      .two{
        margin: 3vw 0;
        .right{
          .center{
            margin: 0 8vw 0 25vw;
          }
        }
      }
      .four{
        margin: 3vw 0;
      }
      .last{
        margin-top: 3vw;
        text-align: right;
        color: #fa0000;
      }
    }
    .bottomWrap{
      margin-top: 4vw;
      background-color: #fff;
      padding: 2vw;
      line-height: 8vw;
    }
  }
</style>
