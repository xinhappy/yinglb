<template>
  <div v-html="protocol.contentStyle"></div>
</template>

<script type="text/ecmascript-6">
  import * as ApiService from 'api/api'

  export default {
    data() {
      return {
        protocol: ''
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        ApiService.get('/api/h5StagingRule/getDealH5.htm?type=1').then((res) => {
          this.protocol = res.data.object
        })
      }
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">

</style>
