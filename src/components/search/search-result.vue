<template>
  <div>
    <x-header
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
        circle: this.$store.state.circle,
        inners: []
      }
    },
    created () {
      this.result()
    },
    methods: {
      result: function () {
        let latitude = this.local ? this.local.latitude : '0.0'
        let longitude = this.local ? this.local.longitude : '0.0'
        ApiService.getCompanyList('/api/h5BusinessManage/queryBusinessInfoH5.htm?businessName=' + this.businessName + '&terminalType=3&latitude=' + latitude + '&longitude=' + longitude + '&businessRegion=' + this.circle.orgId + '&peopleId=' + this.userInfo.id + '&deviceInfo=' + this.userInfo.deviceInfo + '&checkFlag&page=1&limit=100').then(res => {
          this.inners.push.apply(this.inners, res.data.rows)
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
