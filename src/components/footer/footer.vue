<template>
  <div class="footerNav">
    <router-link to="/community" class="item">
      <span class="icon community"></span>
      <p>社区</p>
    </router-link>
    <router-link to="/runner" class="item">
      <span class="icon runner"></span>
      <p>奔跑者</p>
    </router-link>
    <router-link to="/home" class="item">
      <span class="icon home"></span>
      <p>我的</p>
    </router-link>
    <div class="clearBoth"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="less" rel="stylesheet/less">
  .footerNav {
    background-color: #ffffff;
    width: 100%;
    padding: 0.7vw 0;
    position: fixed;
    bottom: -1px;
    z-index: 100;
    border-top: 1px solid #eee;
    .item {
      font-size: 2vw;
      text-align: center;
      width: 32%;
      height: 100%;
      float: left;
      color: #626262;
      .icon {
        height: 20px;
        width: 20px;
        display: inline-block;
        text-align: center;
        margin-bottom: 2px;
        &.community{
          background: url(../../assets/icon_commit_normal.png) no-repeat;
          background-size: cover;
        }
        &.runner{
          background: url(../../assets/tab_rider_default.png) no-repeat;
          background-size: cover;
        }
        &.home{
          background: url(../../assets/icon_my_normal.png) no-repeat;
          background-size: cover;
        }
      }
      &.router-link-active{
        color: #177aff;
        .community{
          background: url(../../assets/icon_commit_select.png) no-repeat;
          background-size: cover;
        }
        .runner{
          background: url(../../assets/tab_rider.png) no-repeat;
          background-size: cover;
        }
        .home{
          background: url(../../assets/icon_my_select.png) no-repeat;
          background-size: cover;
        }
      }
    }
  }
</style>
