<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;" @on-click-back="back"
              :left-options="{backText: '',preventGoBack:true}">商品列表
    </x-header>
    <div class="item-container">
      <ul>
        <li class="clearfix item-list" v-for="(v,i) in goodsList">
          <div class="fl" @click="detail(v)">
            <img :src="v.thumbnail"
                 style="width: 22vw;height: 22vw;display: block;border-bottom-left-radius: 5px;border-top-left-radius: 5px;">
          </div>
          <div class="fl innerRight">
            <p>{{v.goodsName}} <span class="fr">已售{{v.saleCount}}</span></p>
            <p style="margin: 2vw 0"><span style="color: #f78686;font-size: 3.6vw">{{v.ybPrice}}盈磅 </span>
              剩余数量{{v.count}}</p>
            <p style="display: flex;align-content: center;float: right">
              <button class="number reduce" @click="changeNumber(v.id,-1)"></button>
              <input style="width: 4vw;margin: 0 1vw;text-align: center" type="text" v-model="v.number">
              <button class="number add" @click="changeNumber(v.id,1)"></button>
            </p>
          </div>
        </li>
      </ul>
      <div style="text-align: center" v-if="goodsList.length === 0">暂无数据</div>
    </div>
    <div class="car-foot-nav clearfix">
      <div class="fl" style="position: relative" @click="showCar">
        <div class="car">
          <span class="icon" v-show="goodsNumber&&goodsNumber>0">{{goodsNumber}}</span>
        </div>
      </div>
      <div class="fr">
        <a class="sum-price">{{sum}}</a>
        <a class="to-pay" @click="buy">去结算</a>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show" position="bottom" height="50%">
        <div style="padding: 2vw">购物车 <span class="fr" @click="clear">清空</span></div>
        <group>
          <ul class="carWrap">
            <li class="clearfix" v-for="i in goodsList" v-show="i.number>0">
              <span>{{i.goodsName}}</span>
              <div class="fr">
                <span style="margin-right: 3vw">*{{i.number}}</span>
                <span>{{i.ybPrice}}盈磅</span>
              </div>
            </li>
          </ul>
        </group>
      </popup>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" is-show-mask text="请先选择商品" position="bottom"></toast>
    <div v-transfer-dom>
      <confirm v-model="show1"
               title="请选择你的消费类型"
               @on-cancel="onCancel"
               @on-confirm="onConfirm" confirm-text="配送" cancel-text="自取">
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations, mapGetters} from 'vuex'
  import {XHeader, TransferDom, Popup, Group, Toast, Confirm} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup,
      Group,
      Toast,
      Confirm
    },
    name: 'car',
    data () {
      return {
        businessId: this.$route.params.id,
        show: false,
        showPositionValue: false,
        show1: false
      }
    },

    methods: {
      ...mapMutations(
        ['deleteGoods', 'updateGoods', 'clearGoods', 'addGoods']
      ),
      findPosition(id) {
        return this.goodsList.findIndex(item => {
          return item.id === id
        })
      },

      changeNumber(id, val) {
        var i = this.findPosition(id)
        var number = this.goodsList[i].number
        this.updateGoods({
          index: i,
          key: 'number',
          value: number + val <= 0 ? 0 : number + val
        })
      },

      del(id) {
        var i = this.findPosition(id)
        this.deleteGoods(i)
      },
      fifter (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].number = 0
        }
        return data
      },
      showCar () {
        if (this.goodsNumber === 0) {
          this.showPositionValue = true
        } else {
          this.show = true
        }
      },
      clear () {
        this.clearGoods()
        this.show = false
      },
      onCancel () {
        this.$router.push('/pay/0')
      },
      onConfirm () {
        this.$router.push('/pay/1')
      },
      buy () {
        if (this.goodsNumber === 0) {
          this.showPositionValue = true
        } else {
          this.show1 = true
        }
      },
      detail (v) {
        localStorage.setItem('itemDetail', JSON.stringify(v))
        this.$router.push('/itemDetail')
      },
      back () {
        this.addGoods([])
        this.$router.back()
      }
    },
    computed: {
      ...mapGetters(
        ['sum', 'goodsNumber']
      ),
      goodsList() {
        return this.$store.state.goodsList
      }
    },
    mounted() {
      ApiService.getCompanyList('/api/h5BusinessGoods/queryGoodInfoH5.htm?businessId=' + this.businessId + '&page=1&limit=100').then(res => {
        this.goodsList.push.apply(this.goodsList, this.fifter(res.data.rows))
      })
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .item-container {
    padding: 0 2vw;
    .item-list {
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 2px 2px 5px #aaa;
      margin: 2vw;
      .innerRight {
        margin-left: 3vw;
        padding-top: 2vw;
        width: 65%;
        .number {
          width: 4vw;
          height: 4vw;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: transparent;
          border: none;
          &.add {
            background-image: url(/src/assets/i_good_order_add.png);
          }
          &.reduce {
            background-image: url(/src/assets/i_good_order_reduce.png);
          }
          &:focus {
            outline: none
          }
        }
      }
    }
  }

  .car-foot-nav {
    position: fixed;
    bottom: -1px;
    background-color: #2e2f42;
    width: 100%;
    font-size: 3.8vw;
    .sum-price {
      color: #fff;
      display: inline-block;
    }
    .to-pay {
      color: #fff;
      background-color: #0071ff;
      padding: 2vw 4vw;
      display: inline-block;
    }
    .car {
      background: url(/src/assets/i_shopping.png) no-repeat;
      width: 10vw;
      height: 10vw;
      background-size: cover;
      position: absolute;
      top: -5vw;
      left: 2vw;
      text-align: right;
      .icon {
        background-color: #fa0000;
        color: #fff;
        border-radius: 50% 50%;
        display: inline-block;
        width: 4vw;
        height: 4vw;
        line-height: 4vw;
        text-align: center;
        font-size: 3.2vw;
      }
    }
  }

  .carWrap {
    padding: 0 2vw;
    font-size: 3.2vw;
    li {
      padding: 2vw 0;
      border-bottom: 1px solid #ccc;
    }
  }

  .vux-popup-dialog {
    background-color: #fff !important;
  }
  .vux-no-group-title {
    margin-top: 0 !important;
  }
  .weui-toast{
    &.vux-toast-bottom{
      bottom:10vw !important;
    }
  }
</style>
