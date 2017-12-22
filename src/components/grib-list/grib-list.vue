<template>
  <div>
    <div class="grib-box" v-for="item in items" :key="item.id">
      <div class="grib-box-head flex border-style" style="justify-content: space-around">
        <img src="../../assets/icon_location_left.png" width="23" height="30" alt="">
        <span style="height:30px;line-height:30px">{{item.distanceBusiness}}</span>
        <img src="../../assets/icon_location_cen.png" width="23" height="30" alt="">
        <span style="height:30px;line-height:30px">{{item.distanceUser}}</span>
        <img src="../../assets/icon_location_right.png" width="23" height="30" alt="">
      </div>
      <div class="get-send-address border-style">
        <p><span style="color:#00f;padding:0;margin:0">取:</span><span>{{item.businessAddress}}</span></p>
        <p><span style="color:#0f0;padding:0;margin:0">送:</span><span>{{item.userAddress}}</span></p>
      </div>
      <div class="arrive-time border-style">
        <p>送到时间:<span>{{item.appointmentTime}}</span></p>
      </div>
      <div class="award">
        <p>预计收益:<span style="color:#f00">{{item.total}}</span></p>
      </div>
      <div class="btn" style="padding:10px 0;text-align: center">
        <x-button @click.native="toShow" :gradients="['#19D5FD','#1D62F0']"
                  style="width:80%;height:30px;line-height:30px;font-size:14px">抢单
        </x-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Flexbox, XButton} from 'vux'

  export default {
    components: {
      Flexbox,
      XButton
    },
    props: ['items'],
    created() {
    },
    methods: {
      toShow() {
        this.$emit('showErod', true)
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .grib-box {
    background-color: #fff;
    border-radius: 5px;
    border: #b9bfe8;
    box-shadow: 1px 1px 1px #aaa;
    margin: 2vw;
    align-items: center;
    div {
      margin: 2vw;
      padding: 2vw;
    }
    .border-style {
      border-bottom: 1px solid #b9bfe8;
    }
    span {
      padding: 0 5px;
    }
    p {
      padding: 3px 0;
    }
  }
</style>
