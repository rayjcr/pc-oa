<!--
 * @Description: 表格组件
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-19 10:08:33
 * @LastEditTime: 2019-04-28 16:24:11
 -->
<template>
  <div class="main_box">
    <thead>
      活动分析
    </thead>
    <tbody>
    <table class="table">
      <tr>
        <th style="width:80px;">
          <div class="out">
            <b>维度</b>
            <em>分析</em>
            <i>项目</i>
          </div>
        </th>
        <th style="background-color: #fff; padding: 0 10px;" v-for="(item, index) in ranklist" :key="index">
          <!-- {{item.label}} -->
          <div>{{item.label}}</div>
          <div v-if="index !==0" style="float: left;width: 100%;    display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;">
            <div class="star_box">
              <span class="first_block"></span>
              <el-rate class="star" disabled v-model="value1" :max='num-2'></el-rate>
            </div>
            <div class="star_box">
              <span class="sec_block"></span>
              <el-rate class="star" disabled v-model="value2" :max='num-1'></el-rate>
            </div>
            <div class="star_box">
              <span class="thir_block"></span>
              <el-rate class="star" disabled v-model="value3" :max='num'></el-rate>
            </div>
          </div>
        </th>
      </tr>
      <tr v-for="(items, index) in tablelist" :key="index">
        <td class="t1">{{items.name}}</td>
        <td v-for="(item, itemindex) in items.rankingCounts" :key="itemindex">{{item.count}}</td>
      </tr>
    </table>
  </tbody>
  <tfoot>
    <tr>
      <th class="foot_left">
        <span>个性评价</span>
        <el-checkbox v-model="checked">班级整体情况</el-checkbox>
      </tj>
      <th class="foot_right">
        33333333355555555555555555555555555555555555555555555555555555555555555555555
      </th>
    </tr>
  </tfoot>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        checked: false,
        value3: 3,
        value2: 2,
        value1: 1,
        tablelist: [],
        ranklist: []
      }
    },
    mounted () {
      // this.tablelist = this.dataSource
      this.ranklist = this.dataSource.tableheader
      // this.getTable()
      this.init(4)
    },
    props: {
      num: Number,
      dataSource: Object,
    },
    methods: {
      /**
       * @description:  根据类名获取表格
       * @param {type} 
       * @return: 
       */
      getTable() {
        var table = document.getElementsByClassName('table')
        var arr = new Array()
        for(var i=0;i<table.length;i++){
          arr[i] = table[i]
        }
        console.log(arr)
        return arr
      },
      /**
       * @description: 合并表格数据处理
       * @param {num} 表格列数
       * table：表格或者表格ID（最好是tbody，避免把表尾给合并了)
       * startRow：起始行，没有标题就从0开始
       * endRow：终止行，此参数是递归时检查的范围，一开始时会自动赋值为最后一行
       * col：当前处理的列
       * endCol:终止列
       * isInit:是否初始调用，如果是则在终止行为0时自动取最后一行
       * @return: 
       */
      init(num) {
        var table = this.getTable()
        if (table.length) {
          for(var t=0; t<table.length; t++){
            var el=table[t]
            var maxCol = num, val, count, start;
            for(var col = maxCol-1; col >= 0 ; col--){
                count = 1;
                val = "";
              for(var i=0; i<el.rows.length; i++){
                // console.log(el.rows[i].cells[col])
                if (el.rows[i].cells[col]) {
                  if(val == el.rows[i].cells[col].innerHTML && col === 0){
                    count++;
                  }else{
                    if(count > 1){ //合并
                      start = i - count;
                      el.rows[start].cells[col].rowSpan = count;
                      for(var j=start+1; j<i; j++){
                        el.rows[j].cells[col].style.display = "none";
                      }
                      count = 1;
                    }
                    val = el.rows[i].cells[col].innerHTML;
                  }
                }
              }
              if(count > 1 ){ //合并，最后几行相同的情况下
                start = i - count;
                el.rows[start].cells[col].rowSpan = count;
                for(var j=start+1; j<i; j++){
                  el.rows[j].cells[col].style.display = "none";
                }
              }
            }
          }

          //     ///合并表格相同行的内容
          //     ///table：表格或者表格ID（最好是tbody，避免把表尾给合并了)
          //     ///startRow：起始行，没有标题就从0开始
          //     ///endRow：终止行，此参数是递归时检查的范围，一开始时会自动赋值为最后一行
          //     ///col：当前处理的列
          //     ///endCol:终止列
          //     ///isInit:是否初始调用，如果是则在终止行为0时自动取最后一行
        }

      }
    }
  }
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
  *{padding:0;margin:0;}
    .main_box{width: 100%;}
    caption{font-size:14px;font-weight:bold;}
    thead{width: 100%;text-align: center;font-size: 20px;padding: 5px 10px;}
    tbody{width: 100%;}
    table{ border-collapse:collapse;border:1px #525152 solid;width:100%;margin:0 auto;}
    /* margin-top:100px; */
    th,td{border:1px #525152 solid;text-align:center;font-size:12px;line-height:30px;}

    /*模拟对角线*/
    .out{
      width: 80px;
      height: 80px;
      position: relative;
      /* border-right: 1px solid #333; */
      /* border-top:40px #D6D3D6 solid;上边框宽度等于表格第一行行高 */
      /* width:0px; */
      /*让容器宽度为0*/
      /* height:0px; */
      /*让容器高度为0*/
      /* border-bottom:40px #eee solid; */
      /* border-right:80px #BDBABD solid;左边框宽度等于表格第一行第一格宽度 */
      /* position:relative;让里面的两个子容器绝对定位 */
    }
    b{
      font-style:normal;
      display:block;
      position:absolute;
      top:5px;
      left:40px;
      width:35px;
    }
    b::before{
      content: '';
      width: 99px;
      height: 1px;
      background-color: #333;
      position: absolute;
      transform: rotate(33deg);
      top: 20px;
      left: -51px;
    }
    em{
      /* font-style:normal;
      display:block;
      position:absolute;
      top:25px;
      left:75px; */
      /* width:55x; */
      font-style: normal;
      display: block;
      position: absolute;
      top: 41px;
      left: 45px;
    }
    i{
      font-style:normal;
      display:block;
      position:absolute;
      top:50px;
      left:5px;
      width:55x;
    }
    i::after{
      content: '';
      width: 100px;
      height: 1px;
      background-color: #333;
      position: absolute;
      transform: rotate(54deg);
      top: -11px;
      left: -28px;
    }
    .star_box{float: left;}
    .first_block{float: left;width: 20px;height: 20px;background-color: orange;}
    .sec_block{float: left;width: 20px;height: 20px;background-color: yellow;}
    .thir_block{float: left;width: 20px;height: 20px;background-color: green;}
    .star{float: left;}
    .foot_left{width: 23.6%;float: left;border: solid 1px #333;border-top:none; height: 100%;min-height: 100px;}
    .foot_right{width: 76.4%;float: left;border: 1px solid #333;border-top: none;border-left: none;height: 100%;min-height: 100px;}
</style>