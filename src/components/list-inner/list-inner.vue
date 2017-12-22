<template>
  <div>
    <div class="list_inner clearfix" v-for="item in items" :key="item.id" @click="save(item)">
      <div class="fl">
        <img
          style="display: block;border-bottom-left-radius: 5px;border-top-left-radius: 5px;width: 150px;max-height: 90px"
          :src="item.businessPhoto" alt="">
      </div>
      <div class="fl inner_left">
        <p>{{item.businessName}}</p>
        <p class="qian">人均 <span>{{item.averageCost}}</span> 盈磅起</p>
        <p class="address"><span class="add_icon"></span>{{item.businessDetailAddress}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['items'],
    methods: {
      save: function (item) {
        localStorage.setItem('companyInfo', JSON.stringify(item))
        this.$router.push('/companyDetail')
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .list_inner {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 5px #aaa;
    margin: 2vw;
  }

  .inner_left {
    margin-left: 3vw;
    padding-top: 2vw;
  }

  .qian {
    margin: 1.6vw 0;
    font-size: 2vw;
    span {
      color: #e4393c;
      font-size: 3.2vw;
    }
  }

  .address {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 2vw;
    width: 50vw;
  }

  .add_icon {
    display: inline-block;
    width: 3vw;
    height: 2vw;
    background: url(../../assets/icon_commit_locate.png) no-repeat;
    background-size: contain;
  }

</style>
