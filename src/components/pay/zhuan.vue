<template>
  <div>
    <x-header @on-click-back="back"
              :left-options="{backText: '',preventGoBack:true}">转账结果
    </x-header>
    <div class="item" style="text-align: center">
      <img src="../../assets/i_success.png" alt="">
      <p>转账成功</p>
    </div>
    <div class="item clearfix">
      <div>支付金额 <span class="fr red">{{sum - redAccount > 0 ? sum - redAccount : 0}}元</span></div>
      <div style="margin: 2vw 0">支付对象 <span class="fr">{{companyInfo.businessName}}</span></div>
      <div>交易时间 <span class="fr">{{time}}</span></div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import {XHeader} from 'vux'
  import {formatDate} from 'common/formDate.js'
  export default {
    components: {
      XHeader
    },
    data () {
      return {
        companyInfo: JSON.parse(localStorage.getItem('companyInfo')),
        time: '',
        sum: this.$route.params.sum,
        redAccount: this.$store.state.redAccount
      }
    },
    created () {
      this.time = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
    },
    methods: {
      back () {
        this.$router.push('/companyDetail')
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .item {
    margin: 3vw 2vw;
    background-color: #fff;
    padding: 2vw;
    border: 1px solid #ccc;
    border-radius: 3px;
    .red {
      color: red;
    }
    img {
      width: 8vw;
      height: 8vw;
    }
    div {
      color: #aaa;
    }
  }
</style>
