<template>
  <div>
    <div class="blue_bg clearfix">
      <div class="fl" @click="select">
        <input class="checkCir" v-model="circle.text">
        <i class="jiao"></i>
      </div>
      <div class="fl" @click="search" style="position: relative">
        <span class="glass"></span>
        <input class="searc" type="text" placeholder="请输入搜索内容">
        <span><a href="" style="color: #fff;font-size: 3.8vw;padding-left: 2vw">搜索</a></span>
      </div>
    </div>
    <scroller lock-x height="-7vw" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
              :scroll-bottom-offst="10">
      <div>
        <div class="clearfix"
             style="margin-top:13vw;background: #fff;margin-bottom: 8px;font-size: 3.2vw">
          <div class="fl">
          <span style="display: flex;align-items: center;padding: 4px;color: #177aff"><img
            src="../../assets/icon_commit_news.png" style="width: 6vw" alt=""> 资讯</span>
          </div>
          <div class="fl" style="width: 80vw">
            <swiper auto loop height="8vw" :interval=2000 class="text-scroll" :show-dots="false">
              <swiper-item v-for="item in infos" :key="item.id"><p
                style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.articleTittle}} </p>
              </swiper-item>
            </swiper>
          </div>
        </div>
        <swiper auto loop dots-position="center" height="40vw">
          <swiper-item v-for="item in lists" :key="item.id"><img @click="go(item.id)" class="img-responsive"
                                                                 :src="item.imgUrl"
                                                                 alt=""></swiper-item>
        </swiper>
        <div class="cumm_list clearfix">
          <div class="cumm_list_item">
            <router-link to="/companyList/40289b575c43a608015c43a926ae0001/天天特价">
              <img src="../../assets/icon_special.png" alt="">
              <p>天天特价</p>
            </router-link>
          </div>
          <div class="cumm_list_item">
            <router-link to="/companyList/40289b655c1f9ea0015c1fc6beed0002/餐饮美食">
              <img src="../../assets/food.png" alt="">
              <p>餐饮美食</p>
            </router-link>
          </div>
          <div class="cumm_list_item">
            <router-link to="/companyList/40289b655c2dc34d015c2dd16dba0000/酒店娱乐">
              <img src="../../assets/hotel.png" alt="">
              <p>酒店娱乐</p>
            </router-link>
          </div>
          <div class="cumm_list_item">
            <router-link to="/companyList/40289b575c43a608015c43aa5b400003/精品推荐">
              <img src="../../assets/icon_recommend.png" alt="">
              <p>精品推荐</p>
            </router-link>
          </div>
          <div class="cumm_list_item">
            <router-link to="/companyList/40289b655c2dc34d015c2e0266a70001/教育培训">
              <img src="../../assets/education.png" alt="">
              <p>教育培训</p>
            </router-link>
          </div>
          <div class="cumm_list_item">
            <router-link to="/companyList/40289b655c2dc34d015c2e03018f0002/商铺超市">
              <img src="../../assets/supermarket.png" alt="">
              <p>商铺超市</p>
            </router-link>
          </div>
        </div>
        <div class="company" style="margin-bottom: 14vw;">
          <div class="company_title">
            <p class="blue">商家列表</p>
            <img src="../../assets/line.png" alt="" style="width: 40vw">
            <p>Merchant list</p>
          </div>
          <div>
            <!--<app-company-list></app-company-list>-->
            <div>
              <listInner v-bind:items="inners"></listInner>
              <load-more tip="loading" v-show="onFetching"></load-more>
            </div>

          </div>
        </div>
      </div>

    </scroller>
    <local></local>
    <toast v-model="showValue" type="text" :time="800" is-show-mask text="暂无更多数据" position="bottom"></toast>
    <v-footer></v-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Swiper, SwiperItem, LoadMore, Scroller, Toast} from 'vux'
  import * as ApiService from 'api/api'
  import ListInner from 'components/list-inner/list-inner'
  import Footer from 'components/footer/footer'
  import Local from 'components/local/local'
  export default {
    components: {
      Swiper,
      SwiperItem,
      ListInner,
      LoadMore,
      'v-footer': Footer,
      Scroller,
      Local,
      Toast
    },
    data() {
      return {
        lists: [],
        infos: [],
        inners: [],
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        local: JSON.parse(localStorage.getItem('local')),
        page: 1,
        onFetching: false,
        circle: this.$store.state.circle,
        showValue: false
      }
    },
    created() {
      this.getImgs()
      this.getInfos()
      this.getCompanyList()
    },
    methods: {
      getImgs () {
        ApiService.getImgs().then(res => {
          this.lists = res.data.rows
        })
      },
      getInfos () {
        ApiService.getInfos().then(res => {
          this.infos = res.data.rows
        })
      },
      getCompanyList () {
        let latitude = this.local ? this.local.latitude : '0.0'
        let longitude = this.local ? this.local.longitude : '0.0'
        ApiService.getCompanyList('/api/h5BusinessManage/queryBusinessInfoH5.htm?memberId=' + this.userInfo.id + '&terminalType=3&latitude=' + latitude + '&longitude=' + longitude + '&businessRegion=' + this.circle.orgId + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=' + this.page + '&limit=5').then(res => {
          if (res.data.resultCode === '1') {
            if (res.data.rows.length > 0) {
              this.inners.push.apply(this.inners, res.data.rows)
              console.log(res.data.rows)
            } else if (this.page > 1) {
              this.showValue = true
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
            this.getCompanyList()
            this.onFetching = false
          }, 2000)
        }
      },
      search () {
        this.$router.push('/search')
      },
      select () {
        this.$router.push('/circle')
      },
      go (id) {
        this.$router.push('/companyList/' + id + '/商家活动')
      }
    },
    watch: {
      circle (val) {
        this.circle = val
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .blue_bg {
    background: url('../../assets/i_bg_normal.png') no-repeat;
    background-size: cover;
    padding: 2vw 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  .checkCir {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 2vw;
    margin-left: 2vw;
    color: #fff;
    width: 12vw;
    margin-top: 2vw;
    border: none;
    background: transparent;
  }

  .jiao {
    display: inline-block;
    width: 1vw;
    height: 1vw;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    margin-right: 3vw;
    margin-bottom: 1.5vw;
    transform: rotate(45deg);
  }

  .searc {
    width: 55vw;
    height: 7vw;
    padding-left: 10vw;
  }

  .glass {
    background: url('../../assets/search.png') no-repeat;
    background-size: contain;
    width: 5vw;
    height: 5vw;
    position: absolute;
    top: 5px;
    left: 5px;
    padding-right: 1vw;
    border-right: 1px solid #ddd;
  }

  .cumm_list {
    background-color: #fff;
    margin-top: 5px;
  }

  .cumm_list_item {
    float: left;
    width: 33%;
    text-align: center;
    margin: 3vw 0;
    a {
      color: #333;
      display: block;
      img {
        width: 6vw;
      }
    }
  }

  .company_title {
    text-align: center;
    .blue {
      position: relative;
      top: 2.5vw;
      color: #177aff;
    }
  }

  .text-scroll {
    border-left: none;
    border-right: none;
  }

  .text-scroll p {
    text-align: left;
    line-height: 8.5vw;
  }

  .title {
    line-height: 100px;
    text-align: center;
    color: #fff;
  }

  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  .vux-indicator.custom-bottom {
    bottom: 30px;
  }

  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }

  .fadeInUp {
    animation-name: fadeInUp;
  }
</style>
