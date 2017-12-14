<template>
  <ul class="keyboard clearfix">
    <li v-for="(key,index) in keyList" :key="index" v-text="key" @click="clickKey(key)"></li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['keyboard'],
    data() {
      return {
        keyList: [],
        myKeyList: this.keyboard
      }
    },
    watch: {
      keyboard (val) {
        this.myKeyList = val
      },
      myKeyList (val) {
        this.$emit('on-result-change', val)
      }
    },
    methods: {
      clickKey(key) {
        switch (key) {
          case 'Del':
            let kbt = this.myKeyList
            this.myKeyList = kbt.length ? kbt.substring(0, kbt.length - 1) : kbt
            break

          default:
            this.myKeyList += key.toString()
            break
        }
      }
    },
    mounted() {
      this.keyList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '0', 'Del']
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .keyboard {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 0;
    list-style: none;
    user-select: none;
    &.clearfix {
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
    li {
      float: left;
      width: 33%;
      height: 12vw;
      line-height: 12vw;
      text-align: center;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-left: none;
      border-bottom: none;
      font-size: 6vw;
      &:nth-child(3),&:nth-child(6),&:nth-child(9),&:nth-child(12){
        border-right: none;
      }
    }
  }
</style>
