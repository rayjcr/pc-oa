<template>
  <div class="last_tableCom">
      <el-table
      :header-cell-style="top"
      :data="tableData.tablestatues"
      border
      :style="{width: conwidth?100+'%':100+'%'}">
          <el-table-column :label="'活动分析'">
            <el-table-column fixed width="140" align="right" v-for="(el, indexs) in tableData.tablehead" :key="indexs" v-if="el.id==='mc'" :render-header="renderHeader">
              <template slot-scope="scope">
                  <el-input maxlength="4" v-if="!isdisabled" v-model="scope.row.mc" placeholder="请输入内容" @blur="blur(scope.row)" :disabled="isdisabled"></el-input>
                  <div v-else style="width:100%;text-align: center;">{{scope.row.mc}}</div>
                </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in tableData.tablehead"
              v-if="item.id === 'zgdf'"
              :key="index"
              :prop="item.id"
              :label="item.label"
              width="100"
              >
              <template slot-scope="scope">
                <el-rate v-model="isyl?scope.row.zgdf:scope.row.xsdf" :max="3" :disabled="starable" @change="addrate(scope.row)"></el-rate>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in tableData.tablehead"
              v-if="item.id === 'xzqk'"
              :key="index"
              :label="item.label"
              :render-header="renderHeader"
              min-width="250"
              :prop="item.xzqk"
              >
              <template slot-scope="scope">
                <div class='blockcol'>
                  <span :class="'col'+ dj.pjz" v-for="(dj,djind) in scope.row.xzqk" :key="djind" :style="{width:dj.djW}">{{dj.num}}{{dj.star}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in tableData.tablehead"
              v-if="item.id === 'qbqk'"
              :key="index"
              :label="item.label"
              :render-header="renderHeader"
              min-width="250"
              :prop="item.qbqk"
              >
              <template slot-scope="scope">
                <div class='blockcol last_blockcol'>
                  <span :class="'col'+dj.pjz" v-for="(dj,djind) in scope.row.qbqk" :key="djind" :style="{width:dj.djW}">{{dj.num}}</span>
                </div>
                <!-- <el-button v-if="!isdisabled" style="margin-left: 20px;width: 30px;height: 20px;line-height: 20px;margin-top: 6px;" class="delect_btn" type="danger" icon="el-icon-delete" @click.stop="delect(scope.row, index)"></el-button> -->
                <el-button v-if="!isdisabled" style="margin-left: 10px;" class="delect_btn" @click.stop="delect(scope.row, index)" type="danger" icon="el-icon-delete" circle></el-button>
              </template>
            </el-table-column>
          </el-table-column>
      </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        top:{
          textAlign: 'center',
          padding: 0,
          paddingTop: 10+'px',
          paddingBottom: 10 + 'px',
        },
      }
    },
    props: {
      isdisabled:Boolean, // 输入框是否可以点击输入控制
      tableData:Object, // 表格数据
      starable:Boolean, // 表格内星星是否可点击控制
      conwidth:Boolean,
      isyl:Boolean,  // 是否为预览页面
    },
    mounted () {
      // console.log(this.tableData)
    },
    methods: {
      // 星星点击评分
      addrate(newval){
        // console.log(newval)
        this.$emit('addrate', newval)
      },
      // 删除活动表格数据
      delect(datas, index){
        this.$emit('delect', datas, index)
      },
      blur(datas){
        this.$emit('blur', datas)
      },
      // 自定义表头
      renderHeader(h, { column, $index }){
        // console.log(h)
        // console.log(column)
        // console.log($index)
        if ($index === 0) {
          return [
            h('div', { class: 'out', style:'width: 80px;height: 80px;position: relative;' },[
              h('span',{class: 'b_box', style:'font-style:normal;display:block;position:absolute;top:5px;left:40px;width:35px;'}, '维度'),
              h('span',{class: 'em_box', style:'font-style: normal;display: block;position: absolute;top: 41px;left: 45px;'}, '分析'),
              h('span',{class: 'i_box', style:'font-style:normal;display:block;position:absolute;top:50px;left:5px;width:55x;'}, '项目')
            ])
          ]
        } else {
          return [
          h('div',{ class: '', style:'width:100%;text-align: center;' }, column.label),
            h('div', { class: '',style:'width:100%;text-align: center;padding:0;' },[
              h('div',{class: 'Box_start', style:'width:50px;padding:0;'}, [
                h('span',{ class: '', style:'width:15px;height:15px;background:#ff6633;display: inline-block;' }, ''),
                h('el-rate',{ class: '', style:'line-height:33px;text-align: center;', attrs:{"disabled":"disabled",max:1}},),
              ]),
              h('div',{class: 'Box_start',style:'width:70px;padding:0;'}, [
                h('span',{ class: '', style:'width:15px;height:15px;background:#ffcc00;display: inline-block;' }, ''),
                h('el-rate',{ class: '', style:'line-height:33px;text-align: center;', attrs:{"disabled":"disabled",max:2}},),
              ]),
              h('div',{class: 'Box_start', style:'width:100px;padding:0;'}, [
                h('span',{ class: '', style:'width:15px;height:15px;background:#669933;display: inline-block;' }, ''),
                h('el-rate',{ class: '', style:'line-height:33px;text-align: center;', attrs:{"disabled":"disabled",max:3}},),
              ])
            ])
          ]
        } 
      },
    }
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  .Box_start{
    display: inline-block;
    .el-rate{
      display: inline-block;    
      margin-left: 5px;
    }
    .el-rate__item i{
      color: #c0c4cc !important;
    }
  }
  .blockcol{
    width: 100%; height: 24px; 
    span{ 
        float: left; 
        height: 24px; 
        color: #fff; 
        font-size: 12px;
        text-align: center;
    }
    .col0{ background:#fff; }
    .col1{ background:#FF6633; }
    .col2{ background:#FFCC00; }
    .col3{ background:#669915; }
  }
  .last_blockcol{
    width: 70%; height: 24px;
    float: left;
    margin-top: 4px;  
  } 
  .last_tableCom{
    /deep/ .delect_btn{
      padding: 8px;
    }
  }
</style>
<style lang="scss">
/* .delect_btn .el-icon-delete{

}
.delect_btn .el-icon-delete::before{
  line-height: 0;
} */
</style>