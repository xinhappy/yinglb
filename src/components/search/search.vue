<template>
  <div>
    <div class="blue_bg">
      <span class="glass"></span>
      <input class="searc" type="text" v-model="businessName" placeholder="请输入搜索内容">
      <span><a @click="result(businessName)" style="color: #fff;font-size: 3.8vw">搜索</a></span>
    </div>
    <div>
      <p class="title">搜索历史</p>
      <div v-if="history.length>0" class="history">
        <div class="item" v-for="(item,index) in history">
          <span class="icon" @click="result(item.name)"></span>
          <span class="inner"
                @click="result(item.name)">{{item.name}}</span>
          <span class="dete" @click="clear(index)"></span>
        </div>
        <p class="clear_his" @click="clearAll">清除历史记录</p>
      </div>
      <div style="text-align: center" v-if="history.length==0">暂无数据</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as ApiService from 'api/api'
  export default {
    data () {
      return {
        businessName: '',
        history: JSON.parse(localStorage.getItem('history')) ? JSON.parse(localStorage.getItem('history')) : []
      }
    },
    created () {

    },
    methods: {
      clearAll: function () {
        localStorage.setItem('history', [])
      },
      clear: function (index) {
        this.history.splice(index, 1)
        localStorage.setItem('history', JSON.stringify(this.history))
      },
      result: function (name) {
        this.history.push({name: name})
        localStorage.setItem('history', JSON.stringify(this.history))
        this.$router.push({path: '/searchResult/' + name})
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .blue_bg {
    background: url('../../assets/i_bg_normal.png') no-repeat;
    background-size: cover;
    padding: 2vw 0;
    top: 0;
  }

  .searc {
    width: 78vw;
    height: 7vw;
    padding-left: 9vw;
    margin-left: 2vw;
    border-radius: 3px;
  }

  .glass {
    background: url('../../assets/search.png') no-repeat;
    background-size: contain;
    width: 5vw;
    height: 5vw;
    position: absolute;
    top: 3.3vw;
    left: 3vw;
    padding-right: 1vw;
    border-right: 1px solid #ddd;
  }

  .title {
    margin: 5vw 2vw;
  }

  .clear_his {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 5vw 0;
  }

  .history {
    padding: 2vw;
    height: 145vw;
    overflow: hidden;
    position: relative;
    .item {
      margin-bottom: 2vw;
      padding-bottom: 2vw;
      border-bottom: 1px solid #ddd;
      &:last-child {
        margin-bottom: 15vw;
      }
      span {
        display: inline-block;
        &.icon {
          width: 3vw;
          height: 3vw;
          background: url(../../assets/i_time.png) no-repeat;
          background-size: contain;
        }
        &.inner {
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 3vw;
        }
        &.dete {
          width: 3vw;
          height: 3vw;
          background: url(../../assets/i_delete.png) no-repeat;
          background-size: contain;
        }
      }
    }
  }
</style>
