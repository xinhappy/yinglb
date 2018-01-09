<template>
  <div>
    <x-header
              :left-options="{backText: ''}">选择商圈
    </x-header>
    <div>
      <p style="text-align: center;color:#fa0000;background-color: #e6e61f">*请选择消费区域*</p>
      <group>
        <popup-picker title="省份：请输入省份" v-bind:data="province" v-model="provinceId" @on-change="change"
                      show-name></popup-picker>
      </group>
      <group>
        <popup-picker title="城市：请输入城市" v-bind:data="city" v-model="cityId" @on-change="changeCity"
                      show-name></popup-picker>
      </group>
      <group>
        <popup-picker title="区：请输入区" v-bind:data="area" v-model="areaId" @on-change="changeArea"
                      show-name></popup-picker>
      </group>
      <group>
        <popup-picker title="商圈：请输入商圈" v-bind:data="circle" v-model="orgId"
                      show-name></popup-picker>
      </group>
      <div class="save">
        <button type="button" @click="selected">确认选择</button>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import {XHeader, Group, TransferDom, PopupPicker} from 'vux'
  import * as ApiService from 'api/api'
  import * as types from 'src/store/mutation-types'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      PopupPicker
    },
    data () {
      return {
        province: [],
        value: [],
        show: false,
        provinceId: [],
        city: [],
        cityId: [],
        area: [],
        areaId: [],
        circle: [],
        circleId: [],
        orgId: [],
        circleText: ''
      }
    },
    created() {
      this.getProvince()
    },
    methods: {
      getProvince: function () {
        ApiService.getCompanyList('/api/h5Organization/queryAreaComboH5.htm?type=1').then(res => {
          this.province.push(res.data.rows)
          this.cityId = []
          this.areaId = []
          this.circleId = []
        })
      },
      change: function () {
        ApiService.getCompanyList('/api/h5Organization/queryAreaComboH5.htm?type=1&id=' + this.provinceId[0]).then(res => {
          this.city.push(res.data.rows)
          this.areaId = []
          this.circleId = []
        })
      },
      changeCity: function () {
        ApiService.getCompanyList('/api/h5Organization/queryAreaComboH5.htm?type=1&id=' + this.cityId[0]).then(res => {
          this.area.push(res.data.rows)
          this.circleId = []
        })
      },
      changeArea: function () {
        ApiService.getCompanyList('/api/h5Organization/queryAreaComboH5.htm?type=0&id=' + this.areaId[0]).then(res => {
          this.circle.push(res.data.rows)
          this.circleText = res.data.rows[0].text
        })
      },
      selected: function () {
        this.$store.commit(types.SELECTED, {orgId: this.orgId[0], text: this.circleText})
        this.$router.push('/community')
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .save {
    text-align: center;
    margin-top: 15vw;
    button {
      width: 60%;
      margin: 0 auto;
      border: none;
      background: url(../../assets/login/i_login_bt.png) no-repeat;
      background-size: cover;
      height: 13vw;
      color: #fff;
      font-size: 4vw;
      &:focus {
        outline: none;
      }
    }
  }
  .vux-no-group-title{
    margin-top: 0 !important;
  }
</style>
