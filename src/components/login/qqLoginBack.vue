<template>

</template>

<script type="text/ecmascript-6">
  export default {
    created() {
      let url = window.location.search
      alert(url.indexOf('?'))
      if (url.indexOf('?') !== -1) {
        let str = url.substr(1)
        let strs = str.split('&')
        alert(strs)
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
</style>
