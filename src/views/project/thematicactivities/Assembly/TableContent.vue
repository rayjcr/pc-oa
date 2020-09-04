<template>
  <div style="width: 1000px;margin:auto;">
    <!-- 附言寄语beg -->
    <div v-if="dataSource.lx === 12">
        <!-- <el-input style="width: 1000px;" v-model="dataSource.info.bm" placeholder="请输入内容"></el-input> -->
        <h3 style="width:1000px;font-size: 18px;margin: 10px 0;margin-top: 30px;">{{dataSource.info.bm}}</h3>
        <rich-text :isedit="isedit" class="rich_com" @onEditorChange="onEditorChange" @onEditorReady="onEditorReady"
        @onEditorFocus="onEditorFocus" @onEditorBlur="onEditorBlur" :dataSource="dataSource.info.fy" :mainwidth="1000 + 'px'"></rich-text>
    </div>
    <div style="width:1000px;" v-if="dataSource.lx === 12 && dataSource.info.wjList.length">
      <div style="width: 100%;" v-for="(item, indd) in dataSource.info.wjList">
        <!-- height: 665px; -->
        <img :style="{margin: 'auto',display: 'block'}" style="max-width:100%;" :src="item.dz" alt="">
        <!-- width:isedit?950+'px':1095+'px', height: 100+'%', maxWidth: 100+'%', -->
      </div>
    </div>
    <!-- 附言寄语end -->

    <!-- 活动分析表beg -->
    <div v-if="dataSource.lx === 13">
        <div style="margin-bottom: 20px;">
          <!-- <el-input v-model="dataSource.info.bm" style="width: 1000px;" @blur="changebm" placeholder="请输入内容"></el-input> -->
          <h3 style="width:1000px;font-size: 18px;margin: 10px 0;margin-top: 30px;">{{dataSource.info.bm}}</h3>
          <div style="float:right;margin-top: -50px;" v-if="dataSource.info.pfbzewm"><img :src="dataSource.info.ewmUrl" alt=""></div>
        </div>
        <table-com :isyl="isyl" :starable="starable" :isdisabled="isdisabled" :tableData="dataSource.info" :num="num" @delect="delect" @blur="blur"></table-com>
        
        <!-- 活动分析个性评价未勾选班级整体模块beg -->
        <div v-if="!dataSource.info.bjzt"  style="border: 1px solid #eee;border-top:none;width: 1000px;padding: 0px 0px;min-height: 300px;float: left;">
            <div class="gxpj_box_left" style="padding:10px;">
                <h3 style="margin-top:60%;display:block;text-align: center;width: 100%;height: 100%;">个性评价</h3>
                <!-- <el-checkbox v-model="dataSource.info.bjzt" @change="selectbjzt">班级整体情况</el-checkbox> -->
            </div>
            <div class="gxpj_box_right" style="padding: 10px;">
                <ul class="pjz_box" v-if="dataSource.info.hdfxgxpjList.length">
                  <li class="gxpj_btn" v-for="(item, index) in dataSource.info.hdfxgxpjList" :class="{avtive:item.isselected?item.isselected:false}" @click.stop="select(item)" :key="index">{{item.mc}}</li>
                    <!-- <el-input @blur="pjxblur" style="width: 100px;margin: 10px" v-for="(pjx, pjxindex) in dataSource.info.hdfxgxpjList" size="small" clearable :key="pjxindex" @clear="clearpjx(pjx,pjxindex)" v-model="pjx.mc" placeholder="请输入内容"></el-input> -->
                </ul>
            </div>
        </div>
        <!-- 活动分析个性评价未勾选班级整体模块end -->

        <!-- 活动分析个性评价勾选班级整体模块beg -->
        <div v-else style="border: 1px solid #eee;border-top:none;width: 1000px;padding: 0px 0px;min-height: 300px;float: left;">
          <!-- <div class="gxpj_box_left">
            <div class="gxpj_box_left_top">
              <div>个性评价</div>
            </div>
            <div style="padding: 10px;">
              <el-checkbox-group v-model="checkboxGroup1">
                <el-checkbox v-for="city in cities" :label="city" :key="city" border></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="gxpj_box_right">
            <div class="gxpj_box_right_top">
              <div>班级整体情况</div>
            </div>
            <div style="width:100%;min-height:200px;">
              <my-charts></my-charts>
            </div>
          </div> -->
          <div class="gxpj_box_left">
            <div class="gxpj_box_left_top">
              <div>个性评价</div>
            </div>
            <div style="padding: 10px;">
              <ul class="pjz_box gxpjbox" v-if="dataSource.info.hdfxgxpjList.length">
                <li style="line-height: 40px;width: 100px;height: 40px;border: 1px solid rgb(238, 238, 238);border-radius: 8px;text-align: center;" class="gxpj_btn" v-for="(item, index) in dataSource.info.hdfxgxpjList" :class="{avtive:item.wdbq?item.wdbq:false}" :key="index">{{item.mc}}</li>
              </ul>
            </div>
          </div>
          <div class="gxpj_box_right">
            <div class="gxpj_box_right_top">
              <div>班级整体情况</div>
            </div>
            <div style="width:100%;min-height:200px;">
              <my-charts :datas="dataSource.info.hdfxgxpjList1"></my-charts>
            </div>
          </div>
        </div>
        <!-- 活动分析个性评价勾选班级整体模块end -->
        
    </div>
    <!-- 活动分析表end -->
  </div>
</template>
<script>
  import TableCom from './TableCom'
  import RichText from './RichText'
  import MyCharts from './MyCharts'
  export default {
    components: {
      TableCom, RichText,MyCharts
    },
    data () {
      return {
        starable: true,
        isdisabled: true,
        checkboxGroup1: [],
        pieChart: null,
        cities: ['上海', '北京', '广州', '深圳'],
      }
    },
    props: {
      isedit: Boolean, // 富文本框是否可编辑控制
      dataSource: Object,
      num: Number,
      conwidth: String,
      // starable:Boolean, // 星星可点击控制
      isyl:Boolean, // 是否为预览页
    },
    mounted () {
    },
    methods: {
      
       /**
     * @description: 富文本失去焦点触发事件
     * @param {type} 
     * @return: 
     */
     onEditorBlur(editor) {
        // console.log('hahgahahajhahajhd')
        this.$emit('onEditorBlur', editor)
        // console.log('editor blur!', editor)
      },
      /**
       * @description: 富文本获取焦点触发事件
       * @param {type} 
       * @return: 
       */  
      onEditorFocus(editor) {
        this.$emit('onEditorFocus', editor)
        // console.log('editor focus!', editor)
      },
      /**
       * @description: 编辑器准备完毕触发事件
       * @param {type} 
       * @return: 
       */ 
      onEditorReady(editor) {
        this.$emit('onEditorReady', editor)
        // console.log('editor ready!', editor)
      },
      /**
       * @description: 富文本编辑器内容数据发生改变触发事件
       * @param {type} 
       * @return: 
       */  
      onEditorChange({ editor, html, text }) {
        // console.log(this.$refs.myTextEditor._content)
        this.$emit('onEditorChange', { editor, html, text })
        // console.log('editor change!', editor, html, text)
        // this.content = html
      },
      // 更改别名失焦事件
      changebm(){

      },
      pjxblur(){},
      selectbjzt(){},
      blur(){},
      delect(){},
      // 个性评价项选择
      select(datas){
        if (datas.isselected) {
          this.$emit('select', datas)
        } 
        // else {
          
        // } 
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rich_com {
    /* margin-top: 10px; */
  }
  .gxpj_box_left{
    width: 240px;
    min-height: 300px;
    float: left;
    .gxpj_box_left_top{
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #eee;
      line-height: 50px;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
  }
  .gxpj_box_right{
    width: 75.95%;
    min-height: 300px;
    border-left: 1px solid #eee;
    float: left;
    position: relative;
    .pjz_btn{
      position: absolute;
      bottom: 10px;
      left: 45%;
    }
    .gxpj_box_right_top{
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #eee;
      line-height: 50px;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }
    .gxpj_btn{
      width: 100px;
      height: 40px;
      border: 1px solid #ccc;
      border-radius: 8px;
      line-height: 30px;
      padding: 5px;
      text-align: center;
      margin: 10px;
      cursor: pointer;
      float: left;
    }
  }
  .avtive{
    background: #409eff;
    color: #fff;
    border: 1px solid #409eff;
  }
  .gxpjbox{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      li{
        margin:5px;
        cursor: pointer;
      }
    }
</style>