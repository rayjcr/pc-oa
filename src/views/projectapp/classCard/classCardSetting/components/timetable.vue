<template>
    <div class="setTimeTable">
        <div class="addSpecial">
            <el-button class="addTime" @click="addSpecial" size="small" type="primary">
                添加特殊时间段
            </el-button>
        </div>

        <div class="setTime" v-for="(item,index) in tableList">
            <div class="setTimeTit">设置时间段</div>
            <div class="selweek">
                <div class="setsTimeSubTit">选择适用星期:</div>
                <el-checkbox-group size="small" v-model="checkWeek[index]">
                    <el-checkbox-button v-for="week in weekList" :label="week.value" :disabled="isCheckWeek(index,week.value)" :key="week.value">{{week.label}}</el-checkbox-button>
                </el-checkbox-group>
            </div>
            <div class="setTimeList">
                <div class="setsTimeSubTit">时段设置:</div>
                <el-table :data="timeList[index]" style="width: 400px;">
                    <el-table-column label="节次" width="150" type="index">
                        <!-- 第{{index}}节次 -->
                    </el-table-column>
                    <el-table-column prop="timeslot" label="时间段" width="250">
                        <template slot-scope="scope">
                            <el-time-picker size="small" class="timeslot" is-range v-model="scope.row.timeslot" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format="HH:MM:SS" value-format="HH:MM:SS">
                            </el-time-picker>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="addTime" @click="addTime(index)" size="small" type="primary">
                    添加时间段
                </el-button>
            </div>
        </div>


        <!-- <div class="KbShow">
            <div class="setTimeTit">设置课程</div>
            <el-table :data="timeList" border>
                <el-table-column  align="center" label="节次" width="50" type="index"></el-table-column>
                <el-table-column  align="center" prop="timeslot" label="时间段" min-width="150">
                    <template slot-scope="scope" v-if="scope.row.timeslot&&scope.row.timeslot.length>1">
                        {{scope.row.timeslot[0]}} ~ {{scope.row.timeslot[1]}}
                    </template>
                </el-table-column>
                
                <el-table-column  align="center" v-for="(item,index) in checkWeek" :label="'周'+item">

                </el-table-column>
                
            </el-table>
        </div> -->


    </div>
</template>

<script>
import _ from 'lodash';
export default {
    name: "setReport",
    components: {

    },
    computed:{
        isCheckWeek(){
            return function(index,val){
                var newCheck = [];
                for(var i=0;i<this.checkWeek.length;i++){
                    if(index!=i){
                        newCheck = newCheck.concat(this.checkWeek[i]);
                    }
                }
                if(newCheck.indexOf(val)>=0){
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    data() {
        return {
            tableList:[],
            timeList:[],
            checkWeek:[],
            weekList:[
                {label:'周一',
                value:1},
                {label:'周二',
                value:2},
                {label:'周三',
                value:3},
                {label:'周四',
                value:4},
                {label:'周五',
                value:5},
                {label:'周六',
                value:6},
                {label:'周日',
                value:7},
            ],
        }
    },
    mounted(){
       this.init()
    },
    methods: {
        init(){
            this.tableList = [{}];
            this.checkWeek = [[]];
            this.timeList = [[]];
        },
        addTime(index){
            this.timeList[index].push({});
        },
        addSpecial(){
            this.tableList.push({});
            this.checkWeek.push([]);
            this.timeList.push([]);
        },
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.addSpecial{
    width: 100%;
}
.setTime{
    width: 400px;
    float: left;
    position: relative;
    margin-right: 20px;
}
.KbShow{
    position: relative;
    padding-right: 20px;
    overflow: hidden;
}
.setTimeTit{
    font-size: 16px;
    color: #444;
    font-weight: bold;
    width: 400px;
    text-align: center;
    padding: 20px 10px;
}
.setsTimeSubTit{
    font-size: 14px;
    line-height: 30px;
    width: 100%;
    color: #666;
    font-weight: bold;
}
.addTime{
    margin-top: 10px;
}
.selweek{
    padding-bottom: 10px;
}
.timeslot{
    width: 220px;
}

</style>
