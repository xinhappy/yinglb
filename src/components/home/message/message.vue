<template>
  <div class="room">
    <x-header @on-click-back="back" style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: '',preventGoBack: true}">用户消息
      <a href="#/messageEdit" slot="right" style="color: #fff">编辑</a>
    </x-header>
    <div>
      <scroller lock-x height="-7vw" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                :scroll-bottom-offst="10">
        <div style="text-align: center" v-if="list.length === 0">暂无数据</div>
        <div class="content">
          <div v-for="item in list" class="item clearfix" @click="read(item)">
            <div class="fl" style="padding-top:2vw;margin-right: 2vw">
              <badge :class="{'active':item.appReaderStatus === 0}"></badge>
            </div>
            <div class="fl" style="width: 85%">
              <div><span>用户消息</span><span class="fr">{{item.sendTime}}</span></div>
              <div>{{item.sendContent}}</div>
            </div>
            <div class="fr" style="padding-top: 2vw">
              <img style="width: 5vw;height: 5vw" src="/src/assets/i_row_right_gray.png" alt="">
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <toast v-model="showValue" type="text" :time="800" is-show-mask text="没有更多数据" position="bottom"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, Scroller, Toast, Badge} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    components: {
      XHeader,
      Scroller,
      Toast,
      Badge
    },
    data () {
      return {
        page: 1,
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        list: [],
        showValue: false,
        onFetching: false
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
      read (item) {
        localStorage.setItem('messageInfo', JSON.stringify(item))
        ApiService.post('/api/h5MessageRecordHistory/changeReaderStateH5.htm', {ids: item.id}).then(res => {
          if (res.data.resultCode === '1') {
            this.$router.push('/messageDetail')
          }
        })
      },
      back () {
        this.$router.push('/home')
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

  .vux-badge {
    background-color: transparent;
    &.active{
      background-color: #0582ff;
    }
  }
</style>
