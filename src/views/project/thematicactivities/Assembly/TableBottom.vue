<template>
  <div>
    <div class="table_bottom">
      <div class="bottom_left">
        <h3>{{dataSource.name}}</h3>
      </div>
      <div class="bottom_right">
        <ul class="list_box">
          <li class="item_box" :class="{active:item.isselected}" v-for="(item, index) in dataSource.list" @click.stop="checkitem(item)">{{item.mc}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        
      }
    },
    methods: {
      checkitem(datas){
        this.$emit('checkitem', datas)
      }
    }
  }
</script>
<style lang="scss" scoped>
.table_bottom{
  width: 100%;
  height: 100%;
  .bottom_left{
    width: 220px;
    min-height: 300px;
    float: left;
  }
  .bottom_right{
    width: 76%;
    min-height: 300px;
    border-left: 1px solid #eee;
    float: left;
    .list_box{
      width: 100%;
      height: 100%;
      float: left;
      .item_box{
        border: 1px solid #eee;
        width: 100px;
        height: 30px;
        border-radius: 8px;
        background: #fff;
        color: #333;
        margin: 10px;
      }
      .active{
        background: #409eff;
        color: #fff;
        border: 1px solid #409eff;
      }
    }
  }
}

</style>