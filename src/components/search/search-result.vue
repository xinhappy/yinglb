<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">搜索结果
    </x-header>
    <div v-if="inners.length>0">
      <listInner v-bind:items="inners"></listInner>
    </div>
    <div v-if="inners.length==0" style="text-align: center">暂无数据</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader} from 'vux'
  import * as ApiService from 'api/api'
  import ListInner from 'components/list-inner/list-inner'
  export default {
    components: {
      XHeader,
      ListInner
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        local: JSON.parse(localStorage.getItem('local')),
        businessName: this.$route.params.name,
        inners: []
      }
    },
    created () {
      this.result()
    },
    methods: {
      result: function () {
        ApiService.getCompanyList('/api/h5BusinessManage/queryBusinessInfoH5.htm?businessName=' + this.businessName + '&terminalType=1&latitude=' + this.local.latitude + '&longitude=' + this.local.longitude + '&businessRegion=' + this.userInfo.orgId + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=1&limit=100').then(res => {
          this.inners.push.apply(this.inners, res.data.rows)
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
