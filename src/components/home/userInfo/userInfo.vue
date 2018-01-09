<template>
  <div class="cont">
    <x-header
              :left-options="{backText: ''}">个人信息
    </x-header>
    <div style="position: relative">
      <div class="topOne"></div>
      <div class="inner">
        <img :src="userInfo.photoUrl ? userInfo.photoUrl : defaultUrl" @click="show = true">
        <p>
          <router-link to="/nickname" style="color: #333">{{userInfo.nickname}}</router-link>
        </p>
      </div>
      <div class="room">
        <div class="item clearfix">
          <img src="../../../assets/home/i_xm.png" alt="">
          <span>姓名</span>
          <span class="fr">{{userInfo.realName}}<img style="width: 12vw;height: auto"
                                                     :src="userInfo.realNameStatus === 0 ? no : yes" alt=""></span>
        </div>
        <div class="item clearfix">
          <img src="../../../assets/home/i_identify_phone.png" alt="">
          <span>电话</span>
          <span class="fr">{{userInfo.userPhone}}</span>
        </div>
        <div class="item clearfix">
          <img src="../../../assets/home/i_dq.png" alt="">
          <span>地区</span>
          <span class="fr">{{area}}</span>
        </div>
        <div class="item clearfix">
          <img src="../../../assets/home/i_identify_school.png" alt="">
          <span>学校</span>
          <span class="fr">{{school}}</span>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <popup position="bottom" height="20%" v-model="show" :is-transparent="true">
        <div class="box" style="border-bottom: 1px solid #eee">
          <input type="file" id="camera" class="file" @change="fileChange" capture="camera" accept="image/*">
          <label for="camera" class="select">拍照</label>
        </div>
        <div class="box">
          <input type="file" id="album" class="file" @change="fileChange">
          <label for="album" class="select">从相册选择</label>
        </div>
        <div class="box" style="top:3vw">
          <div class="select" @click="show = false">取消</div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {XHeader, TransferDom, Popup} from 'vux'
  import * as ApiService from 'api/api'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup
    },
    data () {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        defaultUrl: '../../../assets/icon_cell.png',
        school: '',
        area: '',
        no: '../../../assets/home/i_wshiming.png',
        yes: '/../../../assets/home/i_yshiming.png',
        show: false,
        dataUrl: ''
      }
    },
    created () {
      let arr = this.userInfo.orgName.split(',')
      this.area = arr[0]
      this.school = arr[1]
    },
    methods: {
      fileChange (e) {
        let vm = this
        let deviceFile = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(deviceFile)
        reader.onload = function () {
          let imgBase64Data = this.result
          let pos = imgBase64Data.indexOf('4') + 2
          vm.dataUrl = imgBase64Data.substring(pos, imgBase64Data.length - pos)
          ApiService.post('/api/h5Member/modifyPhotoStringH5.htm', {
            userId: vm.userInfo.id,
            photoStr: vm.dataUrl,
            loginInfo: vm.userInfo.deviceInfo,
            photoType: deviceFile.type
          }).then(res => {
            if (res.data.resultCode === '1') {
              vm.show = false
            }
          })
        }
      }
    },
    watch: {
      userInfo (val) {
        this.userInfo = val
        localStorage.setItem('userInfo', JSON.stringify(val))
      }
    },
    mounted () {
      ApiService.post('/api/h5Member/refreshMemberInfoH5.htm', {
        userId: this.userInfo.id,
        deviceInfo: this.userInfo.deviceInfo,
        checkFlag: '',
        peopleId: this.userInfo.id
      }).then(res => {
        if (res.data.resultCode === '1') {
          this.userInfo = res.data.object
        }
      })
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .cont{
    background-color: #fff;
    height: 100%;
    .topOne {
      background: url(../../../assets/home/i_person_blue_bg.png) no-repeat center bottom;
      background-size: cover;
      height: 20vw;
      margin-bottom: 25vw;
    }
    .inner {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -50%;
      width: 100%;
      background: url(../../../assets/home/i_person_data_bg.png) no-repeat center bottom;
      background-size: contain;
      text-align: center;
      border-radius: 3px;
      height: 45vw;
      img {
        width: 10vw;
        height: 10vw;
        border-radius: 50% 50%;
        margin-top: 16vw;
        margin-bottom: 2vw;
      }
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
  .box {
    position: relative;
    height: 8vw;
    margin: 0 2vw;
    .file {
      position: absolute;
      left: -9999px;
    }
    .select {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background-color: #fff;
      text-align: center;
      height: 8vw;
      line-height: 8vw;
    }
  }
</style>
