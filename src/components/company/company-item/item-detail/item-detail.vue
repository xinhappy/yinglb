<template>
  <div>
    <div>
      <div class="blue_bg">
        <a @click="go" style="float: left;margin-left: 3vw"><img style="width: 2vw"
                                                                 src="/src/assets/i_back_white.png"
                                                                 alt=""></a>
        {{itemDetail.goodsName}}
        <a class="collect"></a>
      </div>
      <swiper auto height="60vw">
        <swiper-item v-for="item in imgs" :key="item.id"><img class="img-responsive" :src="item.photoUrl"
                                                              alt=""></swiper-item>
      </swiper>
      <div class="item" style="margin: 3vw 0 2vw">
        <span style="color: #1AAD19;margin-right: 2vw">{{itemDetail.ybPrice}}</span>
        <span style="font-size: 2vw;color: #aaa">最高门市价：¥{{itemDetail.marketPrice}}</span>
      </div>
      <div class="item" style="border-bottom: 1px solid #ccc">
        商品介绍
      </div>
      <div class="item" style="margin-bottom: 2vw">
        {{itemDetail.introduce}}
      </div>
      <div class="item" style="border-bottom: 1px solid #ccc">
        使用须知
      </div>
      <div class="item">
        {{itemDetail.ruleName}}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Swiper, SwiperItem} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      Swiper,
      SwiperItem
    },
    data () {
      return {
        imgs: [],
        itemDetail: JSON.parse(localStorage.getItem('itemDetail'))
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      go () {
        this.$router.back()
      },
      getInfo () {
        ApiService.get('/api/h5BusinessGoods/queryGoodInfoImgH5.htm?goodsId=' + this.itemDetail.id).then(res => {
          if (res.data.resultCode === '1') {
            this.imgs = res.data.rows
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .blue_bg {
    padding: 2vw 0;
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 10;
  }

  .item {
    padding: 2vw;
    background-color: #fff;
  }
</style>
