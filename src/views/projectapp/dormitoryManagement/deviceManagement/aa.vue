<template>
  <div class="deviceMain">
    
    <div class="deviceSelect">
      <el-select  v-model="roomId" class="roomSel" placeholder="请选择寝楼">
        <el-option
          v-for="item in roomList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      
      <el-select  v-model="roomStatus" class="statusSel" placeholder="请选择状态">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input class="searchInput" v-model="searchVal" placeholder="请输入网关名称"></el-input>
      <el-button type="primary">查询</el-button>
      <el-button class="allUnlock" type="primary">添加网关</el-button>
    </div>

    <div class="lockList">
      <div class="lockWarp">
        <p class="lockName">寝室第一网管</p>
      </div>
      <p class="infoDetail"><span class="detail">供应商：周杰伦</span></p>
      <p class="infoDetail"><span class="detail">网关状态：在线(更新时间2019-0.-02 13:00)</span><span>固件版本：2222</span></p>
      <p class="infoDetail"><span class="detail">绑定时间：2019-0.-02 13:00)</span></p>
      <p class="infoDetail"><span class="detail">网关类型：周杰伦</span><span>ZigBee：2222</span></p>
      <p class="infoDetail"><span class="detail">网关序列号：2019-0.-02 13:00</span></p>
      <el-button class="handel handleButton" type="primary">远程解码</el-button>
    </div>
     <div class="pageWarp">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
  export default{
    name:'smartLock',
    data(){
      return{
        roomId:'',                //所选寝楼的值
       
        roomStatus:'',            //所在楼层的状态值
        searchVal:'',             //搜索值
        roomList: [{              //寝楼数组
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
       
        statusList: [{              //楼层状态数组
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
        page: 1,                   // 页数
        limit: 10,                 // 条数
        total: 0,                  // 总条
      }
    },
    mounted() {
      
    },
    methods: {
      /**
       * @description: 页数改变
       * @param {type} 
       * @return: 
       */
      handleSizeChange(){

      },
      handleCurrentChange(){

      }
    },
  }
</script>
<style scoped >
  .deviceMain{
    width:100%;
    height:100%;
  }
  .deviceSelect{
    width:80%;
    margin:30px;
    height:50px;
  }
  .roomSel,.floorSel,.statusSel,.searchInput{
    width:150px;
    margin-right:10px;
  }
  .allUnlock{
    float:right;
  }
  .lockList{
    width:80%;
    margin-top:30px;
    margin-left:30px;
    height:330px;
    box-shadow:5px 5px 5px #ccc;
    border:1px solid #ccc;
  }
  .lockName{
    font-size:0.4rem;
    font-weight:500;
  }
  .lockWarp{
    margin-top:30px;
  }
  .lockName{
    font-size: 20px;
    font-weight: 600;
  }
  .infoDetail,.lockWarp{
    margin-left:30px;
    margin-bottom:10px;
  }
  
  .detail{
    width:480px;
    display: inline-block;
    font-size: 17px;
  }
  .detailLang{
    width: 250px;
    display: inline-block;
  }
  .green{
    width: 20px;
    display: inline-block;
    height: 12px;
    background-color: #2fc25b;
    margin-right:5px;
  }
  .handel{
    margin-left: 30px;
  }
  .handleButton{
    margin-right:10px;
    margin-top:20px;
  }
  .pageWarp{
    margin-left: 30px;
    margin-top:30px;
  }
</style>