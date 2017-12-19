<template>
  <div>
    <div>
      <div class="blue_bg">
        <a @click="go" style="float: left;margin-left: 3vw"><img style="width: 2vw"
                                                                 src="../../../assets/i_back_white.png"
                                                                 alt=""></a>
        商品详情
        <a class="collect" :class=" {'active': collectionFlag === '1' }" @click="collect"></a>
      </div>
      <swiper auto height="70vw">
        <swiper-item v-for="item in imgs" :key="item.id"><img class="img-responsive" :src="item.photoUrl"
                                                              alt=""></swiper-item>
      </swiper>
    </div>
    <div class="clearfix">
      <div class="fl" style="padding-top: 2vw;padding-left: 2vw">
        <span style="padding: 1vw 2vw;background-color:rgb(239, 142, 142);color: #fff">
          优惠活动
        </span>
      </div>
      <div class="fl">
        <swiper auto loop height="8vw" :interval=2000 class="text-scroll" :show-dots="false">
          <swiper-item v-for="item in imgs" :key="item.id"><p
            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.activityContent}} </p>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="list_inner clearfix">
      <div class="title"><i></i>商家信息</div>
      <div class="inner_left">
        <p>{{companyInfo.businessName}}</p>
        <p class="qian">人均 <span>{{companyInfo.averageCost}}</span> 盈磅起</p>
        <p class="address"><span class="add_icon"></span>{{companyInfo.businessDetailAddress}}</p>
      </div>
    </div>
    <div @click="look" class="list_inner clearfix">
      <div class="fl">
        <div class="title"><i></i>商品列表</div>
        <div class="inner_left">
          <p>在售商品详情</p>
        </div>
      </div>
      <div class="fr see">
        <div>
          <img src="../../../assets/i_see.png" style="width: 5vw" alt="">
          <p>去查看</p>
        </div>
      </div>
    </div>
    <div @click="lookP" class="list_inner clearfix">
      <div class="fl">
        <div class="title"><i></i>商品评价</div>
        <div class="inner_left">
          <p>在售商品评价详情</p>
        </div>
      </div>
      <div class="fr see">
        <div>
          <img src="../../../assets/i_see.png" style="width: 5vw" alt="">
          <p>去查看</p>
        </div>
      </div>
    </div>
    <div class="save">
      <button @click="pay">去支付</button>
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
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        companyInfo: JSON.parse(localStorage.getItem('companyInfo')),
        collectionFlag: '0'
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      getInfo: function () {
        ApiService.getCompanyList('/api/h5BusinessManage/queryAdsH5.htm?peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&memberId=' + this.userInfo.id + '&businessAdId=' + this.companyInfo.id).then(res => {
          this.imgs = res.data.rows
          this.collectionFlag = res.data.rows[0].flag
        })
      },
      look: function () {
        this.$router.push('/itemList/' + this.companyInfo.id)
      },
      pay () {
        this.$router.push('/payCompany')
      },
      go () {
        this.$router.push('/community')
      },
      lookP () {
        this.$router.push('/companyAppraise/' + this.companyInfo.id)
      },
      collect () {
        let flag = this.collectionFlag ? this.collectionFlag : 0
        ApiService.post('/api/h5Member/businessCollectionH5.htm', {
          userId: this.userInfo.id,
          businessId: this.companyInfo.id,
          flag: flag,
          deviceInfo: this.userInfo.deviceInfo,
          checkFlag: '',
          peopleId: this.userInfo.id
        }).then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.resultDesc === '取消收藏成功') {
              this.collectionFlag = '0'
            } else {
              this.collectionFlag = '1'
            }
          }
        })
      }
    },
    watch: {
      collectionFlag (val) {
        this.collectionFlag = val
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .list_inner {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 5px #aaa;
    margin: 2vw;
  }

  .inner_left {
    margin-left: 3vw;
    padding-top: 2vw;
    padding-bottom: 2vw;
  }

  .qian {
    margin: 1.6vw 0;
    font-size: 2vw;
    span {
      color: #e4393c;
      font-size: 3.2vw;
    }
  }

  .address {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 2vw;
    width: 53vw;
  }

  .add_icon {
    display: inline-block;
    width: 3vw;
    height: 2vw;
    background: url(../../../assets/icon_commit_locate.png) no-repeat;
    background-size: contain;
  }

  .title {
    padding-top: 2vw;
    i {
      display: inline-block;
      height: 3vw;
      width: 2vw;
      background: url(../../../assets/icon_commit_shop_list.png) no-repeat;
      background-size: contain;
      margin-left: 2vw;
    }
  }

  .see {
    background: url(../../../assets/i_bg_normal.png) no-repeat right;
    background-size: cover;
    width: 15vw;
    height: 25vw;
    color: #fff;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }

  .blue_bg {
    padding: 2vw 0;
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 10;
  }

  .collect {
    float: right;
    margin-right: 5vw;
    width: 5vw;
    height: 5vw;
    background: url(../../../assets/collection.png) no-repeat;
    background-size: contain;
    &.active {
      background: url(../../../assets/stars.png) no-repeat;
      background-size: contain;
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
      background: url(../../../assets/i_bg_normal.png) no-repeat;
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
