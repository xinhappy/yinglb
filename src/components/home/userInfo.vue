<template>
  <div>
    <x-header style="background: url('/src/assets/i_bg_normal.png') no-repeat;background-size: cover;"
              :left-options="{backText: ''}">个人信息
    </x-header>
    <div>
      <div class="top">

      </div>
      <div class="room">
        <div class="item clearfix">
          <img src="/src/assets/home/i_xm.png" alt="">
          <span>姓名</span>
          <span class="fr">{{userInfo.realName}}<img style="width: 12vw;height: auto" :src="userInfo.realNameStatus === 0 ? no : yes" alt=""></span>
        </div>
        <div class="item clearfix">
          <img src="/src/assets/home/i_identify_phone.png" alt="">
          <span>电话</span>
          <span class="fr">{{userInfo.userPhone}}</span>
        </div>
        <div class="item clearfix">
          <img src="/src/assets/home/i_dq.png" alt="">
          <span>地区</span>
          <span class="fr">{{area}}</span>
        </div>
        <div class="item clearfix">
          <img src="/src/assets/home/i_identify_school.png" alt="">
          <span>学校</span>
          <span class="fr">{{school}}</span>
        </div>
      </div>
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
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        defaultUrl: '/src/assets/icon_cell.png',
        school: '',
        area: '',
        no: '/src/assets/home/i_wshiming.png',
        yes: '//src/assets/home/i_yshiming.png'
      }
    },
    created () {
      let arr = this.userInfo.orgName.split(',')
      this.area = arr[0]
      this.school = arr[1]
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  body{
    background-color: #fff;
    .top{
      background: url(/src/assets/home/i_person_blue_bg.png) no-repeat center bottom;
      background-size: cover;
      height: 16vw;
    }
    .room {
      margin: 2vw;
      padding: 2vw;
      border-radius: 3px;
      .item {
        border-bottom: 1px solid #eee;
        padding: 2vw 0;
        img {
          width: 4vw;
          height: 4vw;
          margin-right: 2vw;
        }
      }
    }
  }
</style>
