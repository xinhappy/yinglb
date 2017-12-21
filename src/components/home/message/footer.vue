<template>
  <div class="select clearfix">
    <div class="fl read" @click="read">标记为已读</div>
    <div class="fl dele" @click="detele">删除</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as ApiService from 'api/api'
  export default {
    props: ['ids'],
    methods: {
      read () {
        ApiService.post('/api/h5MessageRecordHistory/changeReaderStateH5.htm', {ids: this.ids.toString()}).then(res => {
          if (res.data.resultCode === '1') {
            this.$router.push('/message')
          }
        })
      },
      detele () {
        ApiService.post('/api/h5MessageRecordHistory/appDelMessageH5.htm', {ids: this.ids.toString()}).then(res => {
          if (res.data.resultCode === '1') {
            this.$router.push('/message')
          }
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .select {
    text-align: center;
    background-color: #ffffff;
    width: 100%;
    position: fixed;
    bottom: -1px;
    z-index: 100;
    border-top: 1px solid #eee;
    .read {
      width: 50%;
      padding: 2vw 0;
    }
    .dele {
      width: 50%;
      background-color: #0579ff;
      color: #fff;
      padding: 2vw 0;
    }
  }
</style>
