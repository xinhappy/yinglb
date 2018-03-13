<template>
  <div>
    <x-header
              :left-options="{showBack: false}">
      <a href="#/message" slot="left" style="color: #fff">取消</a>
      用户消息
      <a slot="right" @click="all" style="color: #fff">全选</a>
    </x-header>
    <scroller lock-x height="-46px" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
              :scroll-bottom-offst="10">
      <div style="text-align: center" v-if="list.length === 0">暂无数据</div>
      <div class="content">
        <checker type="checkbox" v-model="ids" default-item-class="demo-item"
                 selected-item-class="demo-item-selected">
          <div v-for="item in list" class="item clearfix">
            <div class="fl" style="padding-top:2vw;margin-right: 2vw">
              <checker-item :value="item.id" @on-item-click="onItemClick"></checker-item>
            </div>
            <div class="fl" style="width: 85%">
              <div><span>用户消息</span><span class="fr">{{item.sendTime}}</span></div>
              <div>{{item.sendContent}}</div>
            </div>
            <div class="fr" style="padding-top: 2vw">
              <img style="width: 5vw;height: 5vw" src="../../../assets/i_row_right_gray.png" alt="">
            </div>
          </div>
        </checker>
      </div>
    </scroller>
    <v-footer :ids="ids"></v-footer>
    <toast v-model="showValue" type="text" :time="800" is-show-mask text="没有更多数据" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Scroller, Toast, Checker, CheckerItem} from 'vux'
  import * as ApiService from 'api/api'
  import Footer from './footer.vue'
  export default {
    components: {
      XHeader,
      Scroller,
      Toast,
      Checker,
      CheckerItem,
      'v-footer': Footer
    },
    data () {
      return {
        page: 1,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        list: [],
        showValue: false,
        onFetching: false,
        ids: [],
        checkedAll: false
      }
    },
    created () {
      this.getMessage()
    },
    methods: {
      getMessage () {
        ApiService.post('/api/h5MessageRecordHistory/queryMessageHistoryH5.htm', {
          telephone: this.userInfo.userPhone,
          page: this.page,
          limit: 8
        }).then(res => {
          if (res.data.resultCode === '1') {
            if (!res.data.rows && this.page > 1) {
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
            this.getMessage()
            this.onFetching = false
          }, 2000)
        }
      },
      all () {
        if (!this.checkedAll) {
          for (let i = 0; i < this.list.length; i++) {
            this.ids.push(this.list[i].id)
          }
          this.checkedAll = true
        }
      },
      onItemClick () {
        if (this.checkedAll) {
          this.checkedAll = false
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .content {
    background-color: #fff;
    .item {
      padding: 4vw;
      border-bottom: 1px solid #eee;
    }
  }

  .demo-item {
    border: 1px solid #ccc;
    width: 4vw;
    height: 4vw;
    border-radius: 50% 50%;
  }

  .demo-item-selected {
    background: url(../../../assets/i_msg_select.png) no-repeat;
    background-size: cover;
  }

  .vux-badge {
    background-color: #0582ff;
  }
</style>
