<template>
    <div class="app-container calendar-list-container">

        <div class="u_TableMain">
            <div class="filter-container">

                <span><b>维度：</b></span>
                <el-cascader class="selMargin" v-model="dimensionId" placeholder="请选择维度" style="width:150px;" :options="dimensionOptions" filterable :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList',disabled:''  }" clearable></el-cascader>

                <el-input placeholder="请输入内容" v-model="keyWords" clearable class="input-with-select" style="width: 200px;"> 
                </el-input>
                <!-- <el-button class="filter-item" type="primary" style="margin-left: 5px;" v-waves icon="search" @click="handleFilter">搜索</el-button> -->

                <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="primary" icon="edit">新增卡片</el-button>
                <!-- <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="warning" icon="edit">批量导入</el-button> -->
            </div>

            <div class="m_GenTableBox">
                <el-table :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" prop="name" label="名称">
                    </el-table-column>
                    <el-table-column align="center" prop="dimensionName" label="关联维度">
                    </el-table-column>
                    <el-table-column align="center" prop="rewardType" label="奖励类型">
                        <template  slot-scope="scope">
                        {{scope.row.rewardType==1?'分数':'勋章'}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="rewardNum" label="奖励数量">
                    </el-table-column>
                    <el-table-column align="center" prop="limitVoList" label="兑换限制">
                        <template slot-scope="scope">
                        <span v-html="showLimitContent(scope.row.limitVoList)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="cardCount" label="已录卡号">
                       
                    </el-table-column>
                    <el-table-column align="center" prop="usedTimes" label="兑换次数">
                    </el-table-column>
                    <el-table-column align="center" prop="status" label="状态">
                        <template slot-scope="scope">
                        <el-link :type="scope.row.status==1?'success':'warning'">{{scope.row.status==1?'正常':'锁定'}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="240">
                        <template slot-scope="scope">
                            <div style="padding-bottom:8px;">
                            <el-button type="primary" @click="editCard(scope.row)" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button type="primary" @click="cardNumManage(scope.row)" icon="el-icon-edit" size="mini">卡号管理</el-button>
                            </div>
                            <div>
                            <el-button :type="scope.row.status==1?'warning':'success'" @click="lockCard(scope.row)" icon="el-icon-edit" size="mini">{{scope.row.status==1?'锁定':'解锁'}}</el-button>

                            <el-popover placement="top" width="160" v-model="scope.row.deltips">
                                <p>是否删除此卡片</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="scope.row.deltips = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="cardDel(scope.row)">确定</el-button>
                                </div>
                                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </el-popover>


                            <!-- <el-button type="danger" @click="cardDel(scope.row)" icon="el-icon-edit" size="mini">删除</el-button> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="pagination"
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="listQuery.limit"
                    :current-page="listQuery.page"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>


        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal='false' :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="form" ref="form" label-width="90px" style="padding-right:10px;">
                <el-row :gutter="16">
                
                    <el-form-item label="名称">
                        <el-input :maxlength="20" style="width:300px;" v-model="form.name" placeholder="请输入卡片名称"></el-input>
                    </el-form-item>
                    <el-form-item label="关联维度">
                        
                        <el-cascader class="selMargin" ref="dimension" v-model="form.dimensionId" placeholder="请选择维度" style="width:150px;" :options="dimensionOptions" filterable :props="{ emitPath:false,expandTrigger: 'hover',checkStrictly: true,value: 'id',label: 'name',children:'dimensionItemVOList',disabled:''  }" clearable></el-cascader>
                    </el-form-item>
                    <el-form-item label="奖励类型">
                        <el-radio v-model="form.rewardType" label="1">分数</el-radio>
                        <el-radio v-model="form.rewardType" label="2">勋章</el-radio>
                    </el-form-item>
                    <el-form-item label="奖励数量">
                        <el-input-number style="width:150px;" v-model="form.rewardNum" placeholder="请输入奖励数量"></el-input-number>
                        <!-- <el-input :maxlength="20" style="width:150px;" v-model="form.rewardNum" placeholder="请输入奖励数量"></el-input> -->
                    </el-form-item>
                    <el-form-item label="兑换限制">
                        <el-radio v-model="form.cardLimit" @click="abc()" label="1">不限</el-radio>
                        <el-radio v-model="form.cardLimit" @click="abc()" label="2">兑换次数</el-radio>
                    </el-form-item>
                    <el-form-item label="" style="margin-top:-10px;" v-show="form.cardLimit=='2'">

                        <div class="">
                            <el-checkbox v-model="limitPerCard">每张卡&nbsp;&nbsp;&nbsp;&nbsp;</el-checkbox> 
                            <el-select v-model="perCardTerm" size="mini" style="width:100px;">
                                <el-option value="3" label="每周">每周</el-option>
                                <el-option value="4" label="每月">每月</el-option>
                                <el-option value="5" label="每学期">每学期</el-option>
                            </el-select> 
                            只能兑换 <el-input v-model="perCardNum" size="mini" style="width:50px;"></el-input>次
                        </div>
                        <div class="">
                            <el-checkbox v-model="limitPerStu">每个学生</el-checkbox> 
                            <el-select v-model="perStuTerm" size="mini" style="width:100px;">
                                <el-option value="3" label="每周">每周</el-option>
                                <el-option value="4" label="每月">每月</el-option>
                                <el-option value="5" label="每学期">每学期</el-option>
                            </el-select> 
                            只能兑换 <el-input v-model="perStuNum"  size="mini" style="width:50px;"></el-input>次
                        </div>
                    </el-form-item>
                    
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create()" :disabled="changeSure">确 定</el-button>
                <el-button v-else type="primary" @click="create()" :disabled="changeSure">更 新</el-button>
            </div>
        </el-dialog>







    </div>

</template>

<script>
import _ from 'lodash';
import * as cardApi from '@/api/projectapp/cardManage'
import * as api from '@/api/projectapp/evaluationSetting'
import { trim } from 'utils';
export default {
    name:'cardManage',
    data(){
        return{
            listQuery:{
                page: 1,
                limit: 4,
            },
            searchsel: 'name', // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）
            listLoading:false,
            list:[],
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                // 判断弹层是添加还是编辑
                update: '编辑',
                create: '创建'
            },
            form: {
                cardLimit:'1',
                rewardType:'1',
                rewardNum:1,
            }, 
            changeSure: false, // 防止重复提交
            rules: {},
            dimensionId:'',
            keyWords:'',
            dimensionOptions: [],//维度选项
            cardType:1,
            
            limitPerCard:false,
            limitPerStu:false,
            perCardTerm:'3',
            perStuTerm:'3',
            perCardNum:'1',
            perStuNum:'1',
            total:0,
            // pagenum:1,
            // pagelimit:4,
        }
    },
    watch:{
        dimensionId(val){
            this.listQuery.page = 1;
            this.handleFilter();
        },
        keyWords(val){
            this.listQuery.page = 1;
            this.handleFilter();
        }
    },
    mounted(){
        this.getDimension()
        this.getCategoryList()
    },
    methods:{
        async getCategoryList(){
            // let param = {};
            // param.limit = this.pagelimit;
            // param.page = this.pagenum;
            
            var res = await cardApi.atmCategory(this.listQuery);
            this.list = res.value.dataList;
            if(this.list.length==0&&this.listQuery.page!=1){
                this.listQuery.page--;
                this.getCategoryList();
            }
            // console.log(res,"res");
            this.total = res.value.totalCount;
        },
        handleCurrentChange(val){
            // console.log(`当前页: ${val}`);
            this.listQuery.page = val;
            this.getCategoryList();
        },
        handleFilter(){
            this.listQuery.dimensionId = this.dimensionId;
            this.listQuery.keyWords = this.keyWords;
            this.getCategoryList();
        },
        handleCreate(){
            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
            this.initForm();
        },
        initForm(){
            this.form = {};
            this.form = {
                cardLimit:'1',
                rewardType:'1',
                rewardNum:1,
            }
            this.limitPerCard = false;
            this.limitPerStu = false;
            this.perCardTerm = '3';
            this.perStuTerm = '3';
            this.perCardNum = '1';
            this.perStuNum = '1';
        },
        cancel(){
            this.initForm();
            this.dialogFormVisible = false;
        },
        checkForm(){
            if(!this.form.name){
                 this.$notify({title:'提示',message:"请输入卡片名称!",type:'warning'});
                 return false;
            }
            if(!this.form.dimensionId){
                 this.$notify({title:'提示',message:"请选择维度!",type:'warning'});
                 return false;
            }
            if(!this.form.rewardNum){
                 this.$notify({title:'提示',message:"请输入奖励数量!",type:'warning'});
                 return false;
            }
            if(this.form.cardLimit=='2'){
                if(!this.limitPerCard && !this.limitPerStu){
                    this.$notify({title:'提示',message:"请选择限制条件!",type:'warning'});
                    return false;
                }
                if(this.limitPerCard){
                    if(!this.perCardNum){
                        this.$notify({title:'提示',message:"请输入兑换数量!",type:'warning'});
                        return false;
                    }
                }
                if(this.limitPerStu){
                    if(!this.perStuNum){
                        this.$notify({title:'提示',message:"请输入兑换数量!",type:'warning'});
                        return false;
                    }
                }
            }
            return true
        },
        async create(){
            if(!this.checkForm()){
                return false;
            }
            // {
            // "dimensionId": 0,
            // "dimensionName": "string",
            // "id": 0,
            // "limitParams": [
            //     {
            //     "categoryId": 0,
            //     "cycle": 0,
            //     "id": 0,
            //     "times": 0,
            //     "type": 0
            //     }
            // ],
            // "name": "string",
            // "rewardNum": 0,
            // "rewardType": 0,
            // "schoolCode": "string",
            // "status": 0
            // }
            let param = {};
            param = this.form;
            // let dimensionArr = this.$refs['dimension'].inputValue.split("/");
            if(this.form.cardLimit == '2'){       
                param.limitVoList = [];
                if(this.limitPerCard){
                    let limitUnit = {};
                    limitUnit.cycle = this.perCardTerm;
                    limitUnit.times = this.perCardNum;
                    limitUnit.type = 1;
                    param.limitVoList.push(limitUnit);
                }
                if(this.limitPerStu){
                    let limitUnit = {};
                    limitUnit.cycle = this.perStuTerm;
                    limitUnit.times = this.perStuNum;
                    limitUnit.type = 2;
                    param.limitVoList.push(limitUnit);
                }
            }else{
                param.limitVoList = [];
            }
            // param.dimensionName = trim(dimensionArr[dimensionArr.length-1])
            param.dimensionName = this.$refs['dimension'].inputValue
            // console.log(param,"param")
            var res = await cardApi.addOrUpdateInfo(param);
            if(res.resultCode==1){
                this.$notify({title:'提示',message:res.resultMessage,type:'success'});
                this.dialogFormVisible = false;
                this.getCategoryList();
            }else{
                this.$notify({title:'提示',message:res.resultMessage,type:'error'});
            }
            // console.log(res,'resres')
        },
        async update(){
           
        },
        editCard(item){
            this.initForm();
            this.dialogStatus = 'update';
            // console.log(item,"item")
            this.form = _.cloneDeep(item);
            // this.form = item;
            this.dialogFormVisible = true;
            this.form.rewardType = item.rewardType.toString();

            this.$set(this.form,'cardLimit',item.limitVoList.length>0?'2':'1'); 
            
            if(item.limitVoList.length>0){
                for(let i=0;i<item.limitVoList.length;i++){
                    if(item.limitVoList[i].type==1){
                        this.limitPerCard = true;
                        this.perCardTerm = item.limitVoList[i].cycle.toString();;
                        this.perCardNum = item.limitVoList[i].times;
                    }
                    if(item.limitVoList[i].type==2){
                        this.limitPerStu = true;
                        this.perStuTerm = item.limitVoList[i].cycle.toString();;
                        this.perStuNum = item.limitVoList[i].times;
                    }
                }
            }
        },
        abc(){
            console.log("val")
        },
        async cardDel(item){
            console.log(item,"item")
            var idsArr = [];
            idsArr.push(item.id)
            let res = await cardApi.cardDelete(idsArr);
            if(res.resultCode==1){
                this.$notify({title:'提示',message:res.resultMessage,type:'success'});
                this.getCategoryList();
            }else{
                this.$notify({title:'提示',message:res.resultMessage,type:'error'});
            }
        },
        async lockCard(item){
            item.status = item.status==1?2:1;
            let res = await cardApi.addOrUpdateInfo(item);
            this.getCategoryList();
        },
        //获取所有维度供选择
        getDimension(){
            api.getAllDimension().then(res=>{
                var arr = res.value
                this.checkDisable(arr);
                // console.log(arr);
                this.dimensionOptions = arr
                // this.dimensionOptions = res.value;
            })
        },
        //根据hasMedal来检查是否可选
        checkDisable(arr){
            for(var i of arr){
                i.disabled = !i.hasMedal;
                if(i.dimensionItemVOList&&i.dimensionItemVOList.length>0){
                    this.checkDisable(i.dimensionItemVOList);
                }
            }
        },
        cardNumManage(item){
            console.log(item,"item,item");
            this.$router.push({path: '/qualityAppraisal/cardManage/cardnum', query:{id:item.id}})
            // this.$router.push('')
        },
        showLimitContent(item){
            if(item.length==0){
                return '无限制'
            }else{
                var restr = "";
                for(let i=0;i<item.length;i++){
                    if(item[i].type=='1'){
                        restr += '本卡'
                    }else{
                        restr += '每个学生'
                    }
                    if(item[i].cycle=='3'){
                        restr += '每周'
                    }else if(item[i].cycle=='4'){
                        restr += '每月'
                    }else if(item[i].cycle=='5'){
                        restr += '每学期'
                    }
                    restr += '只能兑换'+item[i].times + '次<br>'
                }
                return restr
            }
        },
    }
}
</script>

<style>

</style>