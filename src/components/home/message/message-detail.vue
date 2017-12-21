<template>
  <div class="room">
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">消息详情
    </x-header>
    <div class="info">
      <div style="color: orange;margin-bottom: 2vw">{{messageInfo.sendTime}}</div>
      <div>{{messageInfo.sendContent}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader} from 'vux'
  export default {
    components: {
      XHeader
    },
    data () {
      return {
        messageInfo: JSON.parse(localStorage.getItem('messageInfo'))
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .room{
    height: 100%;
    background-color: #fff;
    .info{
      padding: 2vw;
    }
  }
</style>
