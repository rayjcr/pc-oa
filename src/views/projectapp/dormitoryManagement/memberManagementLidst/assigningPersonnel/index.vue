<template>
  <div class="app-container houseMain">

        <div class="m_assigningBox">
                <div class="m_assigningTop">
                    <div class="f_assigningTit">调配人员</div>
                    <div class="f_assigningOpt">
                        <!-- <span class="f_record">记录</span> -->
                        <span class="f_help" v-on:mouseover="isHelpTips=true" v-on:mouseout="isHelpTips=false">帮助
                            <el-alert
                                v-show="isHelpTips"
                                class="helptips"
                                title="提示"
                                type="info"
                                description="将需要调配的人员或者整个寝室，拖动到目标房间，释放鼠标即可"
                                show-icon>
                            </el-alert>
                        </span>
                    </div>
                </div>

                <div class="m_assigningBody">

                    <!--左边-->
                    <div class="m_roomMain">

                        <!--房源列表-->
                        <div class="bulidTap">
                            <div class="bulidScroll">
                                <span :class="{'cur':curBuild_left.id==litem.id}" v-for="(litem,index) in leftBuildList"  v-on:click="getBuildInfo(litem,'left')">
                                    {{litem.name}}
                                </span>
                            </div>

                            <el-popover
                            class="morebulid"
                            placement="right"
                            width="260"
                            trigger="click">
                            <ul class="moreBuildList">
                                <li :class="{'cur':curBuild_left.id==litem.id}" v-for="(litem,index) in leftBuildList" v-on:click="getBuildInfo(litem,'left')" :title="litem.name">
                                    {{litem.name}}
                                </li>
                            </ul>
                            <el-button class="morebulid el-icon-more" slot="reference"></el-button>
                            </el-popover>
                        </div>

                        <!--楼层列表-->
                        <div class="floorTap">
                            <div v-if="leftFloorList&&leftFloorList.length>0">
                                <span :class="{'cur':curFloor_left.id==litem.id}" v-for="(litem,index) in leftFloorList" v-on:click="getRoomList(litem,'left')">
                                    {{litem.actualFloor}}层
                                </span>
                            </div>
                            <div v-else class="noneFloor">此房源暂无录入楼层信息</div>
                        </div>

                        <!--房间列表-->
                        <div ref="roomListLeft" class="roomList cusscroll">
                            <transition name="fade">
                                <div v-show="leftRoomList.length>0" ref="roomLeft">
                                    <div class="roomBox" @mousedown="roomMousedown($event,'left',roomitem)" v-for="(roomitem,index) in leftRoomList" :data-roomid='roomitem.id' :class="{'change':roomitem.isChange,'overNum':(roomitem.listAllotInfo.length>roomitem.maxNum)}">
                                        <div class="roomHead">
                                            <div class="roomName" :class="roomitem.attributes==0?'allpeople':roomitem.attributes==1?'':'female'">{{roomitem.name}}</div>
                                            <div class="roomInfo"><span>{{roomType.get(roomitem.type)}}</span>  <span>人数:{{roomitem.listAllotInfo.length?roomitem.listAllotInfo.length:0}}/{{roomitem.maxNum}}</span></div>
                                            <div class="addStu" @mousedown.stop="addPerson(roomitem,'left')"></div>
                                        </div>
                                        <div class="roomBody cusMiniScroll" v-show="roomitem.listAllotInfo">

                                            <div class="stuBox" :data-stuid='stuitem.id' @mousedown.stop="stuMousedown($event,'left',stuitem,roomitem.id,roomitem)" v-for="(stuitem,index) in roomitem.listAllotInfo" :class="{'stuchange':stuitem.ischange}">
                                                <div class="stuClass">{{stuitem.fromName}}</div>
                                                <div class="stuName">{{stuitem.name}}</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>




                    </div>
                    <div class="m_changeIcon"></div>


                    <!--右边-->
                    <div class="m_roomMain">

                        <!--房源列表-->
                        <div class="bulidTap">
                            <div class="bulidScroll">
                                <span :class="{'cur':curBuild_right.id==ritem.id}" v-for="(ritem,index) in rightBuildList" v-on:click="getBuildInfo(ritem,'right')">
                                    {{ritem.name}}
                                </span>
                            </div>

                            <el-popover
                            class="morebulid"
                            placement="right"
                            width="260"
                            trigger="click">
                            <ul class="moreBuildList">
                                <li :class="{'cur':curBuild_right.id==ritem.id}" v-for="(ritem,index) in rightBuildList" v-on:click="getBuildInfo(ritem,'right')">
                                    {{ritem.name}}
                                </li>
                            </ul>
                            <el-button class="morebulid el-icon-more" slot="reference"></el-button>
                            </el-popover>
                        </div>

                        <!--楼层列表-->
                        <div class="floorTap">
                            <span :class="{'cur':curFloor_right.id==ritem.id}" v-for="(ritem,index) in rightFloorList" v-on:click="getRoomList(ritem,'right')">
                                {{ritem.actualFloor}}层
                            </span>
                        </div>

                        <!--房间列表-->
                        <div ref="roomListRight" class="roomList cusscroll">
                            <transition name="fade">
                                <div v-show="rightRoomList.length>0" ref="roomRight">
                                    <div class="roomBox" @mousedown="roomMousedown($event,'right',roomitem)" v-for="(roomitem,index) in rightRoomList" :data-roomid='roomitem.id' :class="{'change':roomitem.isChange,'overNum':(roomitem.listAllotInfo.length>roomitem.maxNum)}">
                                        <div class="roomHead">
                                            <div class="roomName" :class="roomitem.attributes==0?'allpeople':roomitem.attributes==1?'':'female'">{{roomitem.name}}</div>
                                            <div class="roomInfo"><span>{{roomType.get(roomitem.type)}}</span>  <span>人数:{{roomitem.listAllotInfo.length?roomitem.listAllotInfo.length:0}}/{{roomitem.maxNum}}</span></div>
                                            <div class="addStu" @mousedown.stop="addPerson(roomitem,'left')"></div>
                                        </div>
                                        <div class="roomBody cusMiniScroll" v-show="roomitem.listAllotInfo">

                                            <div class="stuBox" :data-stuid='stuitem.id' @mousedown.stop="stuMousedown($event,'right',stuitem,roomitem.id,roomitem)" v-for="(stuitem,index) in roomitem.listAllotInfo" :class="{'stuchange':stuitem.ischange}">
                                                <div class="stuClass">{{stuitem.fromName}}</div>
                                                <div class="stuName">{{stuitem.name}}</div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </transition>

                        </div>

                    </div>

                </div>



        </div>
        <transition :name="transName">
            <div id="temproom" ref="temproom" class="temproom" :class="{'in':inRoom}" v-show="isCheckRoom||(inRoom&&checkType=='room')" v-html="moveElm"></div>
        </transition>

        <transition :name="transName">
            <div id="tempStu" ref="temproom" class="tempstu" :class="{'in':inRoom}" v-show="isCheckStu||(inRoom&&checkType=='stu')" v-html="moveElm"></div>
        </transition>

        

        <el-dialog
        class="addPersonnel"
        title="人员分配"
        :visible.sync="addPersonnelDialog"
        width="830px"
        :before-close="dialogClose">
        <div class="dig_roomInfo clear">
            <ul>
                <li>房源名称: {{curRoomObj.buildingName}}</li>
                <li>所属楼层: {{curRoomObj.floorName}}</li>
                <li>房间名称: {{curRoomObj.name}}</li>
                <li>人员数量: {{curRoomObj.maxNum}}</li>
                <li>房间类型: {{roomType.get(curRoomObj.type)}}</li>
                <li>房间属性: {{roomAttributes.get(curRoomObj.attributes)}}</li>
            </ul>
        </div>

        <div class="dig_addMain clear">
            <div class="groups">
                <div class="groupTit">选择分组</div>
                <div class="groupTab">
                    <el-radio-group v-model="groupCheckType" @change="changeGroup">
                        <el-radio-button :disabled="loadingData" label="student">学生</el-radio-button>
                        <el-radio-button :disabled="loadingData" label="teacher">教师</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="groupList cusscroll">
                    <el-tree 
                    v-if="addPersonnelDialog"              
                    :indent=8
                    :data="groupList"
                    :props="groupProps"
                    accordion
                    highlight-current
                    @node-click="getGroupInfoList">
                    </el-tree>
                </div>
            </div>

            <div class="groups ml50">
                <div class="groupTit">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll" @change="handleCheckAllChange"></el-checkbox>
                    人员列表<span v-show="personList.length>0">{{personCheckList.length}}/{{personList.length}}</span></div>
                <div class="groupSearch">
                    <el-input
                        class="searchIpt"
                        size="medium"
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="searchIpt">
                    </el-input>
                </div>
                <div class="groupList cusscroll" v-loading="loadingData">
                    <ul class="presonList">
                        <el-checkbox-group v-model="personCheckList" @change="changeCheckList">
                            <el-checkbox v-show="!personitem.ishide" v-for="(personitem,index) in personList" :disabled="personitem.disable" :label="personitem" :key="index"><span :class="personitem.xbm==1?'male':'female'">{{personitem.xm}}</span> {{personitem.bjmc?'-'+personitem.bjmc:''}}</el-checkbox>
                        </el-checkbox-group>

                    </ul>
                </div>
            </div>
            <div class="addRoomOpt">
                <div class="optAdd" @click="addPresonRoom"></div>
            </div>
            <div class="groups">
                <div class="groupTit">
                    {{curRoomObj.name}}人员列表<span v-show="curRoomObj.listAllotInfo">{{addRoomList?addRoomList.length:'NaN'}}/{{curRoomObj.maxNum}}</span>
                </div>
                <div class="groupList cusscroll">
                    <ul class="presonList">
                        <li v-for="(item,index) in addRoomList">
                            <span :class="item.gender==1?'male':item.gender==2?'female':'none'">{{item.name}}</span>
                            <em class="delPreson el-icon-delete" @click="removePresonRoom(item,index)"></em>
                        </li>
                    </ul>


                </div>
            </div>



        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addPersonnelDialog = false">取 消</el-button>
            <el-button type="primary" @click="addSaveAllotInfo">确 定</el-button>
        </span>
        </el-dialog>

  </div>
</template>
<script>

import * as api from '@/api/projectapp/dormitoryManagement/';
import {getBjTree} from '@/api/admin/student/';
import {getBMTree} from '@/api/admin/teach/index';
import {getCurrentXnxq} from '@/api/admin/acadyear/index';
import _ from 'lodash';
export default {
    name: '',
    data() {
        return {
            roomType:new Map([
                [0,"寝室"],
                [1,"办公室"],
                [2,"教室"],
                [3,"公共场所"]
            ]),
            roomAttributes:new Map([
                [0,"全部"],
                [1,"男生"],
                [2,"女生"]
            ]),
            addRoomList:[],                     //新增人员临时列表
            fxInfo:new Map([["left",{curfx: 'left',tarfx:'right'}],["right",{curfx: 'right',tarfx:'left'}]]),
            AllFloorList:[],                    //所有已获取的楼层数据(变更后的数据)
            changeRecord:{},                    //记录变更的人员的信息
            allotplanId:-1,                     //计划ID 从人员里获取
            addPersonnelDialog:false,           //添加人员的弹层
            curRoomObj:{},                      //临时存放,用户添加人员分配时展示
            groupCheckType:"student",           //新增人员里的分组类型(学生/教师)
            groupList:[],                       //分组选择tree(学生/老师)显示
            groupStudent:[],                    //学生分组
            groupTeacher:[],                    //教师分组
            groupProps:{                        //El-Tree的结构
                children: 'children',
                id: 'id',
                label: 'name'
            },
            isIndeterminate:false,              //全选的状态 1: isCheckAll=true&&isIndeterminate=false全选状态  2: isCheckAll=false&&isIndeterminate=false全不选状态  3: isCheckAll=false&&isIndeterminate=true部分选中状态
            isCheckAll:false,
            searchIpt:"",                       //查询内容
            dqxn:"",
            dqxq:"",
            personList_res:[],                  //最初的人员列表(查询用)
            personList:[],                      //最终显示的人员列表
            personCheckList:[],


            checkType:"",
            xxdm:localStorage.getItem("xxdm"),
            isHelpTips:false,                   //是否显示帮助提示


            curBuild_left:{},                    //左侧当前的楼宇Obj
            curBuild_right:{},                   //右侧当前的楼宇Obj
            curFloor_left:{},                    //左侧当前的楼宇当前楼层Obj
            curFloor_right:{},                   //右侧当前的楼宇当前楼层Obj
            tarRoom:{},                          //目标交换房间对象

            // curBuildId_left:0,                  //左侧当前的楼宇ID
            // curBuildId_right:0,                 //右侧当前的楼宇ID
            // curFloorId_left:0,                  //左侧当前的楼宇当前楼层ID
            // curFloorId_right:0,                 //右侧当前的楼宇当前楼层ID

            leftBuildList:[],                   //左侧楼宇列表
            rightBuildList:[],                  //右侧楼宇列表
            leftFloorList:[],                   //左侧楼层列表
            rightFloorList:[],                  //右侧楼层列表
            leftRoomList:[],                    //左侧房间列表
            rightRoomList:[],                   //右侧房间列表

            roomPos:"",                         //标明点击的是 左侧 还是 右侧 的房间列表
            curRoomID:-1,                       //点击拖动当前房间ID(用于交换)
            curStuID:-1,                        //点击拖动当前的学生(用于交换)
            targetRoomID:"",                    //目标的房间ID(用于交换)


            isCheckRoom:false,          //是否点中了房间
            isCheckStu:false,           //是否点中了学生
            inRoom:false,               //是否播放交换动画
            isAnimat:false,             //是否正在播放动画
            moveElm:"",                 //拖动对象的innerHtml
            transName:"",               //消失动画名称
            startPos:{                  //点击拖动对象后的起始坐标
                x:0,
                y:0
            },
            moveElStartPos:{            //移动的room对象的初始位置
                top:0,
                left:0
            },
            tempRoom:{},                //移动的对象
            tempStu:{},                 //移动的对象
            roomListLeftScrollTop:0,    // 滚动条偏移量
            roomListRightScrollTop:0,   // 滚动条偏移量
            tempRemoveObj:[],           //临时存放的被移除寝室的人员
            groupCurNodeTree:{},        //分组中 当前选中的类型,{年级：0,班级：1，id:bjdm,njdm}
            loadingData:false,          //数据加载中
        };
    },
    watch: {

    },
    mounted() {
        this.allotplanId = this.$route.query.planid
        // console.log('this.allotplanId='+this.allotplanId);
        //获取页面的body对象
        let bodyElm = document.getElementsByTagName("body")[0];
        //获取页面拖动框的对象
        this.tempRoom = document.getElementById("temproom");
        this.tempStu = document.getElementById("tempStu");

        let that = this;

        bodyElm.addEventListener("mouseup",async function(){

            if(!that.isCheckRoom && !that.isCheckStu){
                return;
            }

            //松开鼠标后先设置默认取消动画...
            that.transName = (that.roomPos == 'left')?"tempEl_L":'tempEl_R';

            // 如果碰撞就发生交换
            if(that.isChangeRoom){
                // console.log("that.curRoomID="+that.curRoomID);
                // console.log("that.targetRoomID="+that.targetRoomID);

                let isSameRoom = false;
                if(that.curRoomID.toString()==that.targetRoomID.toString()){
                    isSameRoom = true;
                }

                // console.log("我这里已经交换了,执行交换方法");
                // console.log("tempIndex="+that.curRoomID);
                // console.log("targetIndex="+that.targetRoomID);

                //记录当前房间在数组中的index 和 目标房间在数组中的index
                let curIndex;
                let tarIndex;

                let fxobj = that.fxInfo.get(that.roomPos);

                //当前选中的房间 和 目标房间 在左侧和右侧 所在的index
                curIndex = _.findIndex(that[fxobj.curfx+"RoomList"],{'id':parseInt(that.curRoomID)});
                tarIndex = _.findIndex(that[fxobj.tarfx+"RoomList"],{'id':parseInt(that.targetRoomID)});

                //赋值目标房间对象给tarRoom
                that.tarRoom = that[fxobj.tarfx+"RoomList"][tarIndex];

                // console.log(that.curRoomObj,12);
                // console.log(that.tarRoom,13);
                //交换前的房间列表人员列表保存起来用于接口错误以后的返回
                var curRoomList = $.extend(true,[],that.curRoomObj.listAllotInfo);
                var tarRoomList = $.extend(true,[],that.tarRoom.listAllotInfo);

                // console.log(curRoomList,394);
                // console.log(tarRoomList,395);
                //真正交换的方法 房间交换changeRoom 人员交换 changeStu
                if(that.checkType == 'room'){
                    if(!isSameRoom){
                        //调用交换房间的方法
                        var changeres = that.changeRoom(that.curRoomID,that.targetRoomID);
                        if(changeres){
                            that.saveChange(curRoomList,tarRoomList);
                        }
                    }
                }else{
                    if(!isSameRoom){
                        var changeres = that.changeStu(that.curRoomID,that.targetRoomID,that.curStuID);
                        if(changeres){
                            that.saveChange(curRoomList,tarRoomList);
                        }
                    }
                }

                //下面是播放交换的动画效果
                // 方向
                // console.log("987654321")
                let fx = (that.roomPos == 'left')?'Right':'Left'
                // 需要播放碰撞后的动画效果
                that.inRoom = true;
                // console.log(that,452);
                // console.log(that["roomList"+fx+"ScrollTop"],452);
                // 计算出拖动的对象需要到目标对象的 top 和 left
                if(that.checkType == 'room'){
                    that.tempRoom.style.cssText = "top:" + (that.$refs['room'+fx].children[tarIndex].offsetTop - that["roomList"+fx+"ScrollTop"]) + "px;left:" + that.$refs['room'+fx].children[tarIndex].offsetLeft + "px";
                }else{
                    that.tempStu.style.cssText = "top:" + ((that.$refs['room'+fx].children[tarIndex].offsetTop + that.$refs['room'+fx].children[tarIndex].offsetHeight/2 - 25) - that["roomList"+fx+"ScrollTop"]) + "px;left:" + (that.$refs['room'+fx].children[tarIndex].offsetLeft + that.$refs['room'+fx].children[tarIndex].offsetWidth/2 - 45) + "px";
                }
                that.transName = "";
                setTimeout(function(){
                    that.inRoom = false;
                },500)
                // console.log(that.changeRecord);
            }



            that.setAllNoChange();
            that.isChangeRoom = false;
            that.isCheckRoom = false;
            that.isCheckStu = false;
        });

        bodyElm.addEventListener("mousemove",function(event){
            // 判断是否选中了某个房间..如无直接return跳出方法
            if(!that.isCheckRoom && !that.isCheckStu){
                return;
            }
            let tempObj;
            // 计算拖动元素的top和left
            if(that.checkType == 'room'){
                tempObj = that.tempRoom
            }else{
                tempObj = that.tempStu
                // that.tempRoom.style.top = that.moveElStartPos.top - (that.startPos.y - event.y) + "px";
                // that.tempRoom.style.left = that.moveElStartPos.left - (that.startPos.x - event.x) + "px";
            }
            tempObj.style.top = that.moveElStartPos.top - (that.startPos.y - event.y) + "px";
            tempObj.style.left = that.moveElStartPos.left - (that.startPos.x - event.x) + "px";


            // 调用碰撞方法判断如果发生碰撞 返回目标房间号 否则 返回false
            let targetRoomId = that.roomCollision(event);
            // 调用setAllNoChange()取消所有发生碰撞后的样式
            that.setAllNoChange();
            // targetRoomId有值代表发生了碰撞
            if(targetRoomId){
                // isChangeRoom 碰撞的标识
                that.isChangeRoom = true;
                // 设置发生碰撞的目标房间ID
                that.targetRoomID = targetRoomId;
                // 设置碰撞后目标房间的样式,在相应的数组对象中加入isChange = true
                if(that.roomPos == 'left'){
                    that.$set(that.rightRoomList[_.findIndex(that.rightRoomList,{'id':parseInt(targetRoomId)})],"isChange",true)
                }else{
                    that.$set(that.leftRoomList[_.findIndex(that.leftRoomList,{'id':parseInt(targetRoomId)})],"isChange",true)
                }
            }else{
                //如果没有发生碰撞 标识设置为 false
                that.isChangeRoom = false;
            }

        })

        //初始化基础数据(楼宇列表,楼层列表等信息)
        this.init();
    },
    methods: {
        /**
         * 初始化基础数据
         * 作者:RayJ
         * 时间:2019-04-24
         */
        async init(){
            //获取全部楼宇列表
            let res = await api.buildingGetListAll({"schoolCode":this.xxdm});
            // console.log(res,526);
            this.leftBuildList = this.rightBuildList = res.value;
            // this.curBuildId_left = this.curBuildId_right = res.value[0].id
            this.curBuild_left = this.curBuild_right = res.value[0]
            //如果楼宇数大于0 获取楼宇详细信息取得楼层列表
            if(res.value.length > 0){
                this.getBuildInfo(this.curBuild_left);
            }
        },


        /**
         * 获取指定楼宇的楼层信息
         * 作者:RayJ
         * 时间:2019-04-24
         */
        async getBuildInfo(item,type){
            // console.log(item);
            let res = await api.getBuildingInfo({"schoolCode":this.xxdm,"buildingId":item.id,"withFloor":true,"withRoom":false})
            // console.log(res,545)
            //type为切换的 左边 还是 右边 还是 初始化
            //赋值楼层列表，并把当前楼楼宇ID赋值给 curBuildId_left(right);
            //如果当前楼层为空,显示提示语(根据length在html里判断) 如果楼层不为空默认把楼层列表里第一个楼层的ID赋值给 curFloorId_left(right)
            if(type == "left"){
                // this.curBuildId_left = id;
                this.curBuild_left = item;
                this.leftFloorList = res.value.floors;
                if(res.value.floors&&res.value.floors.length>0){
                    // this.curFloorId_left = res.value.floors[0].id;
                    // this.getRoomList(this.curFloorId_left,"left");
                    this.curFloor_left = res.value.floors[0]
                    this.getRoomList(this.curFloor_left,"left");

                }
            }else if(type == "right"){
                // this.curBuildId_right = id;
                this.curBuild_right = item;
                this.rightFloorList = res.value.floors;
                if(res.value.floors&&res.value.floors.length>0){
                    // this.curFloorId_right = res.value.floors[0].id;
                    // this.getRoomList(this.curFloorId_right,"right");
                    this.curFloor_right = res.value.floors[0];
                    this.getRoomList(this.curFloor_right,"right");
                }
            }else{
                this.leftFloorList = this.rightFloorList = res.value.floors;
                if(res.value.floors&&res.value.floors.length>0){
                    // this.curFloorId_left = this.curFloorId_right = res.value.floors[0].id
                    // this.getRoomList(this.curFloorId_right);
                    this.curFloor_left = this.curFloor_right = res.value.floors[0]
                    this.getRoomList(this.curFloor_right);
                }
            }
        },

        /**
         * 获取指定楼宇,指定楼层的房间列表
         * 作者:RayJ
         * 时间:2019-04-24
         */
        async getRoomList(FloorItem,type){
            // console.log(FloorItem,423)
            //先去AllFloorList查询当前楼层是否已经载入
            // let floorIndex = _.findIndex(this.AllFloorList,{"floorid":FloorId});
            let floorIndex = _.findIndex(this.AllFloorList,{"floorid":FloorItem.id});
            //临时变量
            let roomList;
            if(floorIndex>=0){
                //如果总数据里有当前楼层直接赋值给列表
                roomList = this.AllFloorList[floorIndex].roomList;
            }else{
                //如果无数据获取当前楼层的所有房间数据
                let res = await api.getRoomListWithAllot({"schoolCode":this.xxdm,"floorId":FloorItem.id,"planId":this.allotplanId})
                // console.log(res,599);
                roomList = res.value;
                //并push到总楼层数据里
                this.AllFloorList.push({"floorid":FloorItem.id,"roomList":roomList})
            }

            if(type == 'left'){
                this.curFloor_left = FloorItem;
                this.leftRoomList = roomList;
            }else if(type == 'right'){
                this.curFloor_right = FloorItem;
                this.rightRoomList = roomList;
            }else{
                this.curFloor_left = this.curFloor_right = FloorItem;
                this.leftRoomList = this.rightRoomList = roomList;
            }
        },
        /**
         * 点击房间赋值给临时div，并初始化各种属性
         * 作者:RayJ
         * 时间:2019-04-25
         */
        roomMousedown(resEvent,roomPos,curItem){

            this.roomListLeftScrollTop = this.$refs["roomListLeft"].scrollTop;
            this.roomListRightScrollTop = this.$refs["roomListRight"].scrollTop;

            // console.log(resEvent,268)
            //屏蔽右键不触发任何事件
            if(resEvent.buttons == 2){
                return;
            }
            this.checkType = "room";
            this.curRoomObj = curItem;
            //记录当前点击的房间的id
            this.curRoomID = curItem.id;
            var that = this;
            //是否点击了房间为true
            this.isCheckRoom = true;
            //记录当前点击的鼠标的坐标..移动鼠标时可以计算出difftop.diffleft来移动
            this.startPos.x = resEvent.x;
            this.startPos.y = resEvent.y;
            //记录点击的是左侧还是右侧
            this.roomPos = roomPos;
            //循环在path里找出room这个根集,然后把innerHTML 和 left,top赋值给 temproom
            //scrollTop是roomBody的差额
            var scrollTop;
            resEvent.path.forEach(function(value){
                if(value.className&&value.className.indexOf("roomList")>=0){
                    scrollTop = value.scrollTop;
                }
            });
            resEvent.path.forEach(function(value){
                if(value.className&&value.className.indexOf("roomBox")>=0){
                    that.moveElm = value.innerHTML;
                    //记录拖动的临时房间的初始位置...鼠标移动的时候。当前位置 - difftop/diffleft来移动
                    that.moveElStartPos.top = value.offsetTop-scrollTop;
                    that.moveElStartPos.left = value.offsetLeft;
                    //当前位置为了不
                    that.tempRoom.style.top = (value.offsetTop-scrollTop)+"px";
                    that.tempRoom.style.left = value.offsetLeft+"px";
                }
            });
        },

        /**
         * 点击学生赋值给临时div，并初始化各种属性
         * 作者:RayJ
         * 时间:2019-04-25
         */
        stuMousedown(resEvent,roomPos,curItem,roomid,roomItem){

            //屏蔽右键不触发任何事件
            if(resEvent.buttons == 2){
                return;
            }

            this.roomListLeftScrollTop = this.$refs["roomListLeft"].scrollTop;
            this.roomListRightScrollTop = this.$refs["roomListRight"].scrollTop;

            this.checkType = "stu";
            this.curRoomObj = roomItem;
            // console.log(resEvent)
            // console.log(roomid,268)
            //记录当前点击的学生的id
            this.curStuID = curItem.userId;
            this.curRoomID = roomid;
            var that = this;
            //是否点击了房间为true
            this.isCheckStu = true;
            //记录当前点击的鼠标的坐标..移动鼠标时可以计算出difftop.diffleft来移动
            this.startPos.x = resEvent.x;
            this.startPos.y = resEvent.y;
            //记录点击的是左侧还是右侧
            this.roomPos = roomPos;
            let curfx = (this.roomPos == 'left')?'Left':'Right'
            // console.log(resEvent,423);
            //循环在path里找出room这个根集,然后把innerHTML 和 left,top赋值给 temproom
            //scrollTop是roomBody的差额
            var scrollTop;
            resEvent.path.forEach(function(value){
                if(value.className&&value.className.indexOf("roomBody")>=0){
                    scrollTop = value.scrollTop;
                }
            });
            // console.log(that['roomList'+curfx+'ScrollTop'],708);
            resEvent.path.forEach(function(value){
                if(value.className&&value.className.indexOf("stuBox")>=0){
                    that.moveElm = value.innerHTML;
                    //记录拖动的临时房间的初始位置...鼠标移动的时候。当前位置 - difftop/diffleft来移动
                    that.moveElStartPos.top = value.offsetTop-scrollTop-that['roomList'+curfx+'ScrollTop'];
                    that.moveElStartPos.left = value.offsetLeft;
                    //当前位置为了不
                    that.tempStu.style.top = (value.offsetTop-scrollTop-that['roomList'+curfx+'ScrollTop'])+"px";
                    that.tempStu.style.left = value.offsetLeft+"px";
                }
            });
        },

        /**
         * 点击显示人员添加的弹出层
         * 参数:房间的对象roomitem,方向roomPos
         * 作者:RayJ
         * 时间:2019-04-28
         */
        async addPerson(roomitem,roomPos){
            var that = this;
            //记录点击的是左侧还是右侧
            this.roomPos = roomPos;
            //赋值当前房间对象给临时变量
            this.curRoomObj = roomitem;
            this.addRoomList = $.extend(true,[],roomitem.listAllotInfo);
            // this.addRoomList = roomitem.listAllotInfo;

            // console.log(this.curRoomObj);
            //显示弹层
            this.addPersonnelDialog = true;
            //获取当前学年学期
            var res = await getCurrentXnxq({"xxdm":this.xxdm});
            this.dqxn = res.data.xn;
            this.dqxq = res.data.xq;

            //获取初始学生分类列表
            this.groupCheckType = "student";
            this.groupCurNodeTree = {};
            this.tempRemoveObj = [];
            this.personList = [];
            // this.$refs.groupList.setCurrentKey(null);
            // console.log(this.$refs.groupList,772266);
            // this.getGroupStudent();
            this.changeGroup('student');

            //添加搜索监听
            this.$watch("searchIpt",function(val,oldval){
                that.releasePersonList(val,oldval);
            })
        },

        /**
         * 查找现有列表的人员数据
         * 作者:RayJ
         * 时间:2019-04-25
         */
        releasePersonList(val,oldval){
            this.personCheckList = [];
            // console.log("val="+val) 
            if(val==""){
                this.personList = this.personList_res;
            }else{
                this.personList = _.filter(this.personList_res, function(o) {
                    return !(o.xm.indexOf(val)==-1);
                });
            }
            //_.find(this.personList,{"xm":})
        },

        /**
         * 获取学生的分类,如果分类存在就不去访问接口
         * 作者:RayJ
         * 时间:2019-04-25
         */
        async getGroupStudent(){
            

            if(this.groupStudent.length>0){
                this.groupList = this.groupStudent;
            }else{
                var res = await getBjTree(this.xxdm);
                this.groupStudent = res;
                this.groupList = res;
            }
        },

        /**
         * 获取教师的分类,如果分类存在就不去访问接口
         * 作者:RayJ
         * 时间:2019-04-25
         */
        async getGroupTeacher(){
            if(this.groupTeacher.length>0){
                this.groupList = this.groupTeacher;
            }else{
                var res = await getBMTree({"xxdm":this.xxdm});
                this.groupTeacher = res;
                this.groupList = res;
            }
        },

        /**
         * 点击年级或者班级获取学生列表
         * 作者:RayJ
         * 时间:2019-04-28
         */
        async getGroupInfoList(nodeData){
            
            console.log(this.tempRemoveObj,786)
            
            this.personCheckList = [];
            
            if(this.groupCheckType=='student'){
                //nodeData.children存在标识点击的是年级
                if(!nodeData.bjdm){
                    this.groupCurNodeTree.type = 0;
                    this.groupCurNodeTree.id = nodeData.id
                    var res = await api.getStudentListByGrade({"schoolCode":this.xxdm,"currentYear":this.dqxn,"classIds":nodeData.njid,type:2,"planId":this.allotplanId});
                    this.personList = res.value;
                }else{
                    this.groupCurNodeTree.type = 1;
                    this.groupCurNodeTree.id = nodeData.id
                    var res = await api.getStudentListByGrade({"schoolCode":this.xxdm,"currentYear":this.dqxn,"classIds":nodeData.bjdm,type:1,"planId":this.allotplanId});
                    this.personList = res.value;
                }
                this.personList = this.formatPersonList(res.value);
                this.rejectList(this.personList);
                // console.log(this.personList,700);
            }else{
                var res = await api.getTeacherListByGroup(nodeData.id);
                this.personList = this.formatPersonList(res.data.members);
                // console.log(this.personList,718);
            }
            
            this.personList_res = $.extend(true,[],this.personList);
            // console.log(this.personList,718);

            this.checkPersonList();

            this.loadingData = false;
        },

        /**
         * 排除已经选择的学生
         * 作者:RayJ
         * 时间:2019-05-01
         */
        rejectList(plist){
            // console.log(plist,8005);
            for(var i=0;i<this.addRoomList.length;i++){
                // console.log(this.addRoomList[i],807)
                var checkIndex = _.findIndex(plist,{"userId":this.addRoomList[i].userId});
                if(checkIndex>=0){
                    this.$set(plist[checkIndex],"ishide",true)
                    // temp.ishide = true;
                    // console.log(this.personList,808);
                }
            }
        },
				
        /**
         * 添加已经删除的人员到目前人员选择类表里
         * 作者:RayJ
         * 时间:2019-05-27
         */
        checkPersonList(item){
            // console.log(this.groupCurNodeTree,842);
            // console.log(this.tempRemoveObj,843);
            // console.log(item,844)
            var that = this;
            this.tempRemoveObj.forEach(function(sitem,index){
                if(item){
                    if(sitem.bjdm==that.groupCurNodeTree.id&&item.userId==sitem.xh){
                        that.personList.push(sitem);
                    }
                }else{
                    if(sitem.bjdm==that.groupCurNodeTree.id){
                        that.personList.push(sitem);
                    }
                }
            })
        },

        /**
         * 点击切换学生或是教师的标签卡
         * 作者:RayJ
         * 时间:2019-04-29
         */
        formatPersonList(list){
            // console.log(list,733)
            if(this.groupCheckType=='student'){
                for(var i=0;i<list.length;i++){
                    //如果是学校转换xh为userid   usertype固定为4
                    list[i].userId = list[i].xh;
                    list[i].userType = 4;
                }
            }else{
							// console.log(this.addRoomList,889)
                for(var i=0;i<list.length;i++){
                    list[i].xbm = list[i].sex;
                    list[i].xm = list[i].name;
                    list[i].bjmc = "";
                    list[i].userId = list[i].usercode;
                    list[i].userType = list[i].type;
                    list[i].disable = this.addRoomList.findIndex(e=>e.userId==list[i].userId)>=0;
                }
            }
            return list;
        },

        /**
         * 点击切换学生或是教师的标签卡
         * 作者:RayJ
         * 时间:2019-04-28
         */
        async changeGroup(label){
            if(label=='student'){
                this.loadingData = true;
                await this.getGroupStudent();
                let ids = {
                    children: true,
                    njid: ''
                }
                //获取所有年级的id
                for(let group of this.groupList){
                    ids.njid += (group.njid+',')
                }
                this.getGroupInfoList(ids)//获取没选年级的学生列表
            }else if(label=='teacher'){
                await this.getGroupTeacher();
                this.personList = [];
                //获取所有部门下人员的列表
                for(let group of this.groupList){
                    var res = await api.getTeacherListByGroup(group.id);
                    this.personList = this.personList.concat(this.formatPersonList(res.data.members));     
                }
                // console.log(this.personList,919);

                //去重
                this.personList = _.uniqWith(this.personList,_.isEqual);

                this.personList_res = $.extend(true,[],this.personList); 
                this.checkPersonList();
            }
            //切换标签卡时 清空已选择列表，显示人员列表，并状态为全未选择
            this.personCheckList = [];
            // this.personList = [];
            this.isIndeterminate = false;
            this.isCheckAll = false;
            
        },

        /**
         * 选中的人员后触发的方法
         * 作者:RayJ
         * 时间:2019-04-28
         */
        changeCheckList(item){
            //未选任何人
            if(this.personCheckList.length == 0){
                this.isCheckAll = false;
                this.isIndeterminate = false;
            }else if(this.personCheckList.length == this.personList_res.length){
            //全选
                this.isCheckAll = true;
                this.isIndeterminate = false;
            }else{
            //部分选择
                this.isCheckAll = false;
                this.isIndeterminate = true;
            }
        },

        /**
         * 点击全选所有当前列表
         * 作者:RayJ
         * 时间:2019-04-28
         */
        handleCheckAllChange(val){
            //全选并排除ishide=true和disable=true的
            this.personCheckList = val ? _.reject(this.personList,{'ishide':true})  : [];
						this.personCheckList = _.reject(this.personCheckList,{'disable':true})
            this.isIndeterminate = false;
        },

        /**
         * 寝室中移除人员
         * 作者:RayJ
         * 时间:2019-04-28
         */
        async removePresonRoom(item,index){
            // console.log(item,906)
            //item.allotId为空代表是当前的数组移来移去，否则就是需要添加到现有列表里 
            if(!item.allotId||item.userType==3){
                var listIndex;
                listIndex = _.findIndex(this.personList,{"xh":this.addRoomList[index].userId});
                if(listIndex>=0){
                this.$set(this.personList[listIndex],"ishide",false);
                }
                listIndex = _.findIndex(this.personList,{"userId":this.addRoomList[index].userId});
                if(listIndex>=0){
                this.$set(this.personList[listIndex],"disable",false);
                }
                console.log(item,910)
                this.addRoomList.splice(index,1);
            }else{
                //需要去基础数据库把人查找出来
                var res = await api.getStudentById({"xxdm":this.xxdm,"xndm":this.dqxn,"xhList":item.userId})
                
                this.tempRemoveObj.push(this.formateUser(res.data.rows[0],item.userType))
                this.addRoomList.splice(index,1);
                this.checkPersonList(item);
            }
            // console.log(this.addRoomList);
        },

        /**
         * 基础数据库里取出来的结构，格式化成项目中的可用结构
         * 作者:RayJ
         * 时间:2019-05-27
         */
        formateUser(oldObj,usertype){

            var res = {};
            //usertype=4是学生 其他是老师
            if(usertype==4){
                res.bjdm = oldObj.bjid
                res.bjmc = oldObj.bjmc
                // res.ishide = false
                res.njdm = oldObj.njid
                res.njmc = oldObj.njmc
                res.userId = oldObj.uuid
                res.userType = usertype
                res.xbm = oldObj.xbm
                res.xh = oldObj.xh
                res.xm = oldObj.xm
            }
            console.log(oldObj,usertype,936)
            return res
        },

        /**
         * 选中人员添加到房间
         * 作者:RayJ
         * 时间:2019-04-28
         */
        addPresonRoom(){
            console.log(this.personCheckList,816)
            // console.log(this.curRoomObj,817)
            if(this.groupCheckType=='student'){
                var repeatNum = 0;
                //勾选的列表临时赋值一份浅拷贝
                var tempCheckList = $.extend(true,[],this.personCheckList);

                //这里是从当前列表中删除选中的学生
                for(var i=0;i<tempCheckList.length && (i+this.addRoomList.length<this.curRoomObj.maxNum);i++){
                    if(this.curRoomObj.attributes!=0 && this.curRoomObj.attributes!=tempCheckList[i].xbm){
                        var checkIndex = _.findIndex(this.personCheckList,{"userId":tempCheckList[i].userId});
                        this.personCheckList.splice(checkIndex,1);
                    }else{
                        // console.log(tempCheckList[i],824)
                        //根据学号
                        this.$set(this.personList[_.findIndex(this.personList,{"userId":tempCheckList[i].userId})],"ishide",true);
                    }
                }
            }else{
                //判断是否重复人员
                var repeatNum = 0;
                var tempCheckList = $.extend(true,[],this.personCheckList);


                for(var i=0;i<tempCheckList.length&& (i+this.addRoomList.length<this.curRoomObj.maxNum);i++){
                    //根据学号排除重复的教师
                    var checkIndex = _.findIndex(this.addRoomList,{"userId":tempCheckList[i].userId});
                    // console.log("checkIndex="+checkIndex);
                    if(checkIndex!=-1){
                        this.personCheckList.splice(_.findIndex(this.personCheckList,{"userId":tempCheckList[i].userId}),1);
                        // console.log(this.personCheckList,825);
                        repeatNum++;
                    }
										// 已选中老师置灰
										var teacherIndex = _.findIndex(this.personList,{"userId": tempCheckList[i].userId})
										if(teacherIndex!=-1){
											this.personList[teacherIndex].disable = true;
										}
                }
                if(repeatNum>0){
                    this.tipsXX("添加成功!有"+repeatNum+"位教师重复添加","warning");
                }
            }

            // console.log(this.personCheckList,825);
            var userobj = {};
            for(var i=0;i<this.personCheckList.length&& (this.addRoomList.length<this.curRoomObj.maxNum);i++){
                userobj = {};
                userobj.name = this.personCheckList[i].xm;
                userobj.userId = this.personCheckList[i].userId;
                userobj.userType = this.personCheckList[i].userType;
                userobj.fromName = this.personCheckList[i].bjmc;
                userobj.gender = this.personCheckList[i].xbm;
                userobj.roomId = this.curRoomObj.id;
                this.addRoomList.push(userobj);
            }
            this.personCheckList = [];
            this.isCheckAll = false;
        },

        /**
         * 弹出层的关闭方法;
         * 作者:RayJ
         * 时间:2019-04-28
         */
        dialogClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },

        /**
         * 判断是否和其他房间碰撞;
         * 作者:RayJ
         * 时间:2019-04-25
         */
        roomCollision(event){
            //头部高度100px offsetTop需要加上
            let topHeight = 100;
            if(this.roomPos == 'left'){
                let roomList = this.$refs["roomRight"].children;
                //循环所有另一侧的房间列表,判断是否鼠标进入了区域，如果进入的区域返回 当前的index;
                //这个循环判断可以写成一个方法调用
                for(var i=0;i<roomList.length;i++){
                    // console.log("i="+i+";  left="+roomList[i].offsetLeft+"; top="+roomList[i].offsetTop+100)
                    // console.log(roomList[i].getAttribute("data-roomid"),382);
                    if(event.x>roomList[i].offsetLeft&&event.x<(roomList[i].offsetLeft+roomList[i].offsetWidth)&&event.y>roomList[i].offsetTop+topHeight-this.roomListRightScrollTop&&event.y<(roomList[i].offsetTop+topHeight+roomList[i].offsetHeight-this.roomListRightScrollTop)){
                        return roomList[i].getAttribute("data-roomid");
                    }
                }
                //如果没有发生碰撞就返回-1
                return false
            }else{
                //循环所有另一侧的房间列表,判断是否鼠标进入了区域，如果进入的区域返回 当前的index;
                let roomList = this.$refs["roomLeft"].children;
                for(var i=0;i<roomList.length;i++){
                    if(event.x>roomList[i].offsetLeft&&event.x<(roomList[i].offsetLeft+roomList[i].offsetWidth)&&event.y>roomList[i].offsetTop+topHeight-this.roomListLeftScrollTop&&event.y<(roomList[i].offsetTop+topHeight+roomList[i].offsetHeight-this.roomListLeftScrollTop)){
                        return roomList[i].getAttribute("data-roomid")
                    }
                }
                return false
            }
        },

        /**
         * 交换2个班级的数据..;
         * 作者:RayJ
         * 时间:2019-04-25
         */
        changeRoom(curRoom,tarRoom){

            console.log(this.curRoomObj,1027);
            console.log(this.tarRoom,1028);
            
            if(this.tarRoom.attributes!=0&&this.tarRoom.attributes!=this.curRoomObj.attributes){
                console.log("11003311")
                this.tipsXX("房间指定的性别不符","error");
                return false;
            }

            let fxobj = this.fxInfo.get(this.roomPos);

            // let isSameFloor = false;
            //判断是不是属于同一楼宇同一楼层，同一楼宇同一楼层需要做左右联动
            // if(this.curFloorId_left.toString()==this.curFloorId_right.toString()){
            //     isSameFloor = true;
            // }

            // 因为是整个房间的拖动.直接取出列表后循环的push到 目标房间，然后再清空当前房间
            let curIndex = _.findIndex(this[fxobj.curfx+"RoomList"],{'id':parseInt(curRoom)});
            let tarIndex = _.findIndex(this[fxobj.tarfx+"RoomList"],{'id':parseInt(tarRoom)});
            for(var i=0;i<this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo.length;i++){
                this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[i].roomId = tarRoom;
                this[fxobj.tarfx+"RoomList"][tarIndex].listAllotInfo.push(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[i])
                this.upDateRecord(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[i],tarRoom)
            }
            this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo.length=0;

            return true
            //如果是相同楼层 那么反向的再操作一次（左右联动）
            // if(isSameFloor){
            //     for(var i=0;i<this[tarfx+"RoomList"][curIndex].listAllotInfo.length;i++){
            //         this[curfx+"RoomList"][tarIndex].listAllotInfo.push(this[tarfx+"RoomList"][curIndex].listAllotInfo[i])
            //     }
            //     this[tarfx+"RoomList"][curIndex].listAllotInfo.length=0;
            // }
        },

        /**
         * 交换学生去某个班级..;
         * 作者:RayJ
         * 时间:2019-04-26
         */
        changeStu(curRoom,tarRoom,curStuID){
            // console.log("curRoom="+curRoom);
            // console.log("tarRoom="+tarRoom);
            //console.log(tempStu,1063);
            // console.log(this.leftRoomList)

            // if(this.tarRoom.attributes!=0&&this.tarRoom.attributes!=this.curRoomObj.attributes){
            //     this.tipsXX("性别不符","error");
            //     return false;
            // }


            let fxobj = this.fxInfo.get(this.roomPos);

            // let isSameFloor = false;
            // //判断是不是属于同一楼宇同一楼层，同一楼宇同一楼层需要做左右联动
            // if(this.curFloorId_left.toString()==this.curFloorId_right.toString()){
            //     isSameFloor = true;
            // }

            // 因为是整个房间的拖动.直接取出列表后循环的push到 目标房间，然后再清空当前房间
            let curIndex = _.findIndex(this[fxobj.curfx+"RoomList"],{'id':parseInt(curRoom)});
            let tarIndex = _.findIndex(this[fxobj.tarfx+"RoomList"],{'id':parseInt(tarRoom)});
            //找出这人员在当前选中数组里的index
            let curStuIndex = _.findIndex(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo,{'userId':curStuID})
            //判断是否移入的房间就是当前房间

            var tarStuObj = _.find(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo,{'userId':curStuID});

            if(this.tarRoom.attributes!=0&&this.tarRoom.attributes!=parseInt(tarStuObj.gender)){
                this.tipsXX("性别不符","error");
                return false;
            }


            if(curRoom==tarRoom){
                return false
            }
            // console.log("curIndex="+curIndex);
            // console.log("tarIndex="+tarIndex);
            // console.log("curStuIndex="+curStuIndex);

            // //插入目标数组,删除当前数组
            // this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[curStuIndex].ischange = true;
            this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[curStuIndex].roomId = tarRoom;
            // console.log(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[curStuIndex],1048);
            this[fxobj.tarfx+"RoomList"][tarIndex].listAllotInfo.push(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[curStuIndex]);
            this.upDateRecord(this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo[curStuIndex],tarRoom)
            this[fxobj.curfx+"RoomList"][curIndex].listAllotInfo.splice(curStuIndex, 1);

            return true
            // // this[curfx+"RoomList"][curIndex].listAllotInfo.length=0;
            // //如果是相同楼层 那么反向的再操作一次（左右联动）
            // if(isSameFloor){
            //     this[curfx+"RoomList"][tarIndex].listAllotInfo.push(this[tarfx+"RoomList"][curIndex].listAllotInfo[curStuIndex]);
            //     this[tarfx+"RoomList"][curIndex].listAllotInfo.splice(curStuIndex, 1);
            // }
        },

        /**
         * 更新记录变更的信息..;
         * 作者:RayJ
         * 时间:2019-04-26
         */
        upDateRecord(item,room){

            // this.allotplanId = item.allotplanId;
            let fxobj = this.fxInfo.get(this.roomPos);

            //如果changeRecord记录为空就初始化changeRecord
            if(!this.changeRecord.content){
                this.changeRecord.planId = this.allotplanId;
                this.changeRecord.toRoomId = this.targetRoomID;
                this.changeRecord.fromRoomId = this.curRoomID;
                this.changeRecord.content = new Array;
            }
            let itemIndex = _.findIndex(this.changeRecord.content,{"userId":item.userId});
            //如果在变更记录里找到了结果就更新，如果找不到就push一个新的
            if(itemIndex>=0){
                // this.$set(this.AllFloorList.content[itemIndex],"isChange",false)
                this.changeRecord.content[itemIndex] = Object.assign({}, this.changeRecord.content[itemIndex], {
                    toBuildingId: this["curBuild_"+fxobj.tarfx].id,
                    toBuildingName: this["curBuild_"+fxobj.tarfx].name,
                    toFloorId: this["curFloor_"+fxobj.tarfx].id,
                    toFloorName: this["curFloor_"+fxobj.tarfx].alias,
                    toRoomId: room,
                    toRoomName: this.tarRoom.name
                })
                if(this.changeRecord.content[itemIndex].roomId == room){
                    // console.log("麻蛋我又换回来了")
                    this.clearRecord(this.changeRecord.content[itemIndex],itemIndex);
                }
            }else{
                item = Object.assign({}, item, {
                    toBuildingId: this["curBuild_"+fxobj.tarfx].id,
                    toBuildingName: this["curBuild_"+fxobj.tarfx].name,
                    toFloorId: this["curFloor_"+fxobj.tarfx].id,
                    toFloorName: this["curFloor_"+fxobj.tarfx].alias,
                    toRoomId: room,
                    toRoomName: this.tarRoom.name
                })
                this.changeRecord.content.push(item);
            }


            // console.log(this.changeRecord,681);
            // console.log(this.AllFloorList,682);
        },

        /**
         * 保存交换记录..;
         * 作者:RayJ
         * 时间:2019-04-26
         */
        async saveChange(curroomlist,tarroomlist){
            var res = await api.saveAllot(this.changeRecord);
            if(res.resultCode==1){
                this.tipsXX("交换成功","success");
                this.changeRecord = {};
                return true
            }else{
                let fxobj = this.fxInfo.get(this.roomPos);
                this.curRoomObj.listAllotInfo = curroomlist;
                this.tarRoom.listAllotInfo = tarroomlist;
                this.tipsXX(res.resultMessage,"error");
                this.changeRecord = {};
                return false
            }
        },

        /**
         * 播放鼠标松开后的动画..;
         * 作者:RayJ
         * 时间:2019-04-26
         */
        async changeAnimate(){
            // console.log(this.changeRecord,1090)
            // console.log(this.AllFloorList,1091)
            // for(var i=0;i<this.changeRecord.content.length;i++){

            // }
        },

        /**
         * 清除初始房间就是目标房间的状态..;
         * 作者:RayJ
         * 时间:2019-04-26
         */
        clearRecord(item,recordIndex){
            // console.log(item,693);
            // console.log(recordIndex,694);
            // console.log(this.AllFloorList,695);
            //在总的数据数中找到重复的那个人员对象
            let fid = _.findIndex(this.AllFloorList,{"floorid":item.toFloorId});
            let rid = _.findIndex(this.AllFloorList[fid].roomList,{"id":parseInt(item.toRoomId)});
            let uid = _.findIndex(this.AllFloorList[fid].roomList[rid].listAllotInfo,{"userId":item.userId});
            // console.log("fid="+fid);
            // console.log("rid="+rid);
            // console.log("uid="+uid);
            //更改重复人员的状态
            this.$set(this.AllFloorList[fid].roomList[rid].listAllotInfo[uid],"ischange",false);
            //把人从更改记录集里删了
            this.changeRecord.content.splice(recordIndex,1)

            // console.log(this.changeRecord,705);
        },

        /**
         * 消除所有碰撞的样式属性..;
         * 作者:RayJ
         * 时间:2019-04-25
         */
        setAllNoChange(){
            let temp;
            if(this.roomPos == "left"){
                temp = this.rightRoomList;
            }else{
                temp = this.leftRoomList;
            }
            for(var i=0;i<temp.length;i++){
                this.$set(temp[i],"isChange",false)
            }
        },

        /**
         * 新增人员保存方法..;
         * 作者:RayJ
         * 时间:2019-04-25
         */
        async addSaveAllotInfo(isdel){
            //userList是接口的参数
            var userList = [];
            //把房间的人员按照约定的参数重新拼接
            for(var i=0;i<this.addRoomList.length;i++){
                userList.push({
                    "name":this.addRoomList[i].name,
                    "userId":this.addRoomList[i].userId,
                    "roomId": this.curRoomObj.id,
                    "userType":this.addRoomList[i].userType,
                })
            }
            //接口需要的参数整合
            var param = {
                "buildingId":this.curRoomObj.buildingId,
                "floorId": this.curRoomObj.floorId,
                //planId 上一个列表页会传给我
                "planId": this.allotplanId,
                "roomId": this.curRoomObj.id,
                "users": userList
            }
            //调用保存接口
            // console.log(param);
            var res = await api.saveAllotInfo(param);
            if(res.resultCode==1){
                this.tipsXX("房间更新成功","success");
                //更新当前room对象
                this.addRoomList.forEach(function(item){
                    item.allotId = true;
                })
                this.curRoomObj.listAllotInfo = this.addRoomList;
                console.log(this.curRoomObj.listAllotInfo,131358)
                this.addPersonnelDialog = false;
            }else{
                this.tipsXX(res.resultMessage,"error");
            }
        },

        /**
         * 说明:Ele-UI 信息提示的二次封装
         * 作者:RayJ
         * 更新时间:2019-1-22
         */
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit?tit:"",
                message: data,
                type: xxtype,
                duration: 2000
            });
        },


        back() {
            this.$router.go(-1);// 返回上一层
        },

    }
};
</script>
<style lang="scss" scoped>
.fade-enter-active{
    animation-name:fadeIn;
    animation-duration:.5s;
}
.fade-leave-active{
    animation-name:fadeOut;
    animation-duration:.5s;
}
.tempEl_L-leave-active{
    animation-name:fadeOutLeft;
    animation-duration:.3s;
}
.tempEl_R-leave-active{
    animation-name:fadeOutRight;
    animation-duration:.3s;
}
.houseMain{
    flex:1;
    .m_assigningBox{
        width: 100%;
        min-width: 1200px;
        background: #FFF;
        padding: 15px 30px;
        border: 1px solid #eaedf4;
        border-radius: 10px;
        float: left;
        .m_assigningTop{
            width: 100%;
            float: left;
            .f_assigningTit{
                float: left;
                color: #303133;
                font-size: 20px;
            }
            .f_assigningOpt{
                float: right;
                .f_record,.f_help{
                    width: 80px;
                    height: 28px;
                    display: inline-block;
                    border: 1px solid #dbdee5;
                    float: left;
                    padding-left: 28px;
                    border-radius: 2px;
                    line-height: 26px;
                    margin-left: 10px;
                    transition: .3s all;
                    cursor: pointer;
                    position: relative;
                }
                .f_record:hover,.f_help:hover{
                    background-color: #f8f8f8;
                }
                .f_record{
                    background: url(../../../../../assets/iconfont/iconrecord.png) no-repeat 10px center;
                }
                .f_help{
                    background: url(../../../../../assets/iconfont/iconhelp.png) no-repeat 15px center;
                    .helptips{
                        position: absolute;
                        top: 32px;
                        right: 0;
                        width: 500px;
                        z-index: 10;
                    }
                    /deep/ .el-icon-info:before{
                        color: #67c23a;
                    }
                    /deep/ .el-alert--info{
                        background: #FFF;
                        border: 1px solid #dee1e8;
                        border-radius: 3px;
                        box-shadow: 0 0 4px rgba($color: #dddddd, $alpha: .1);
                        color: #444;
                        line-height: 20px;
                    }
                    /deep/ .el-alert__closebtn{
                        display: none;
                    }
                }
            }
        }
        .m_assigningBody{
            width: 100%;
            float: left;
            padding-top: 20px;
            .m_roomMain{
                float: left;
                width: 45%;
                height: 650px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eaedf4;
                display: flex;
                flex-direction: column;
                .bulidTap{
                    width: 100%;
                    height: 32px;
                    border-bottom: 1px solid #eaedf4;
                    position: relative;
                    overflow: hidden;
                    padding-right:32px;
                    .morebulid{
                        width:32px;
                        height: 32px;
                        position: absolute;
                        top: 0;
                        right: 0;
                        line-height: 32px;
                        text-align: center;
                        color: #9c9fa6;
                        cursor: pointer;
                        border: none;
                        padding: 0;
                    }
                    .morebulid:hover{
                        color: #303133;
                        background: #FFF;
                    }
                    .morebulid:active,.morebulid:focus{
                        color: #303133;
                        background: #FFF;
                    }
                    .bulidScroll{
                        white-space: nowrap;
                        overflow: hidden;
                        height: 32px;
                    }
                    span{
                        display: block;
                        float: left;
                        width:100px;
                        // padding:0 15px;
                        height: 31px;
                        line-height: 31px;
                        text-align: center;
                        font-size: 14px;
                        color: #9c9fa6;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        cursor: pointer;
                        // transition: .3s all;
                        position: relative;
                    }
                    span:after{
                        content: '\20';
                        width: 0%;
                        height: 2px;
                        background:#FFF;
                        transition: .3s all;
                    }
                    span:hover{
                        color: #303133;
                    }
                    span.cur{
                        color: #303133;
                    }
                    span.cur::after{
                        content:'\20';
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 0;
                        width: 100%;
                        height: 2px;
                        background: #409eff;
                    }
                }
                .floorTap{
                    width: 100%;
                    min-height: 48px;
                    padding: 10px 0 0 0;
                    // white-space: nowrap;
                    .noneFloor{
                        color: #999;
                    }
                    span{
                        width: 60px;
                        height: 28px;
                        border-radius: 14px;
                        background: #FFF;
                        border: 1px solid #dbdee5;
                        margin-right: 10px;
                        display: inline-block;
                        font-size: 14px;
                        color: #606266;
                        line-height: 26px;
                        text-align: center;
                        transition: .3s all;
                        margin-bottom: 10px;
                        cursor: pointer;
                    }
                    span.cur{
                        background: #409eff;
                        border: 1px solid #409eff;
                        color: #FFF;
                    }
                    span:hover{
                        background: #409eff;
                        border: 1px solid #409eff;
                        color: #FFF;
                    }
                }
                .roomList{
                    flex: 1;
                    width: 100%;
                    padding: 5px;
                    border: 1px solid #eaedf4;
                    overflow: hidden;
                    overflow-y: auto;
                }

            }
            .m_changeIcon{
                width: 10%;
                float: left;
                height: 650px;
                background: url(../../../../../assets/iconfont/iconchange.png) no-repeat center 300px;
                background-size: 40% auto;
            }
        }


    }
}
.moreBuildList{
    li{
        width: 100px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        margin: 8px;
        float: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
    }
    li:hover{
        background: #ebf4ff;
    }
    li.cur{
        background: #ebf4ff;
    }
}
.roomBox,.temproom{
    width: 210px;
    height: 255px;
    margin: 5px;
    float: left;
    border: 1px solid #eaedf4;
    border-radius: 3px;
    overflow: hidden;
    transition: .3s all;
    cursor: pointer;
    .roomHead{
        background: #f5f7fa;
        height: 60px;
        border-bottom: 1px solid #eaedf4;
        border-radius: 3px;
        line-height: 20px;
        padding: 10px;
        position: relative;
        color: #303133;
        transition: .3s all;
        .roomName{
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            background: url(../../../../../assets/iconfont/dotpeople.png) no-repeat right center;
            padding-right: 15px;
            position: relative;
        }
        .roomName.female{
            background: url(../../../../../assets/iconfont/woman.png) no-repeat right center;
        }
        .roomName.allpeople{
            background: #f5f7fa;
        }
        .roomName.allpeople:after{
            content: '\20';
            position: absolute;
            right: 20px;
            top: 0;
            width: 20px;
            height:14px;
            /*background: url(../../../../../assets/iconfont/woman.png) no-repeat right center;*/
            background-size: 100% 100%;
        }
        .roomInfo{
            font-size: 12px;
            font-family: "微软雅黑";
            span{
                margin-right:10px;
            }
        }
        .addStu{
            width: 24px;
            height: 24px;
            background: url(../../../../../assets/iconfont/addstu.png) no-repeat center;
            position: absolute;
            top: 18px;
            right: 18px;
            cursor: pointer;
            transition: .2s all;
        }
        .addStu:hover{
            transform: scale(1.1) rotate(-180deg);
        }
    }
    .roomBody{
        width: 100%;
        height: 195px;
        overflow: auto;
        padding: 5px 4px;
        .stuBox{
            width: 88px;
            height: 50px;
            border-radius: 25px;
            padding: 5px 10px;
            text-align: center;
            color: #303133;
            line-height: 20px;
            margin:5px;
            font-family: "微软雅黑";
            float: left;
            display: flex;
            align-items:center;
            justify-content:center;
            flex-direction: column;
            .stuClass{
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
            }
            .stuName{
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
            }
        }
        .stuBox:hover{
            background: #f5f7fa;
            color: #409eff;
        }
        .stuBox.stuchange{
            color: #e6a23c;
        }
    }
}
.roomBox:hover,.roomBox.change{
    border: 1px solid #b2d6fd;
    box-shadow: 0 0 5px rgba(215, 233, 255, .5);
    .roomHead{
        background:#ebf4ff;
        color:#54a1fc;
    }
}
.roomBox.overNum{
    border: 1px solid #ff5f5f;
    box-shadow: 0 0 5px rgba(215, 233, 255, .5);
    .roomHead{
        background:#ffecec;
        color:#ff5f5f;
        .addStu{
            width: 24px;
            height: 24px;
            background: url(../../../../../assets/iconfont/addstu_err.png) no-repeat center;
            position: absolute;
            top: 18px;
            right: 18px;
            cursor: pointer;
            transition: .2s all;
        }
    }
}

.temproom{
    border:1px solid #eaedf4;
    box-shadow: 0 0 5px rgba(215, 233, 255, .5);
    border-radius: 3px;
    width: 210px;
    height: 255px;
    position: absolute;
    z-index: 9999;
    top: 0px;
    left: 0px;
    background: rgba(255,255,255,.9);
    transition:none;
    margin: 0;
}
.temproom.in,.tempstu.in{
    transition: .3s all;
}
.temproom.in .roomName{
    display: none;
}
.tempstu{
    width: 90px;
    height: 50px;
    border-radius: 25px;
    padding: 5px 10px;
    text-align: center;
    color: #303133;
    line-height: 20px;
    // font-weight: bold;
    font-family: "微软雅黑";
    float: left;
    background: #f5f7fa;
    position: absolute;
    z-index: 9999;
    top: 0px;
    left: 0px;
    display: flex;
    align-items:center;
    justify-content:center;
    flex-direction: column;
    .stuClass{
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
    .stuName{
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
}
.addPersonnel /deep/ .el-dialog__body{
    padding: 10px 20px;
}
.addPersonnel{
    .dig_roomInfo{
        width: 700px;
        ul{
            float: left;
        }
        li{
            width: 200px;
            padding-right: 15px;
            font-size: 14px;
            color: #303133;
            height: 25px;
            line-height: 25px;
            float: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .dig_addMain{
        .groups{
            width: 200px;
            height: 495px;
            border: 1px solid #eaedf4;
            border-radius: 2px;
            float: left;
            display: flex;
            flex-direction: column;
            .groupTit{
                padding: 0 15px;
                background: #f5f7fa;
                border-bottom: 1px solid #eaedf4;
                width: 100%;
                height: 40px;
                line-height: 39px;
                font-size: 16px;
                color: #303133;
                span{
                    float: right;
                    font-size: 12px;
                    color: #606266;
                    line-height: 40px;
                }
            }
            .groupTab{
                width:100%;
                text-align: center;
                padding: 10px;
            }
            .groupList{
                width: 100%;
                flex: 1;
                overflow: hidden;
                overflow-y: auto;
                /deep/ .el-tree-node__content{
                    padding-left:5px;
                    height: 30px;
                }
            }
            .groupSearch{
                text-align: center;
                padding: 10px 0;
                .searchIpt{
                    width:80%;
                    /deep/ input{
                        border-radius: 18px;
                    }
                }
            }
            .presonList{
                padding:10px 15px;
                /deep/ .el-checkbox{
                    width:100%;
                }
                >li{
                    height: 30px;
                    line-height: 30px;
                    position: relative;
                    .delPreson{
                        display: none;
                        position: absolute;
                        height: 20px;
                        width: 20px;
                        top: 5px;
                        right:0px;
                        cursor: pointer;
                    }
                    .delPreson:hover{
                        color: #409eff;
                    }
                }
                >li:hover{
                    .delPreson{
                        display: block;
                    }
                }
                .male{
                    background: url(/static/img/Iconman.png) no-repeat left center;
                    background-size: auto 100%;
                    padding-left:25px;
                }
                .female{
                    background: url(/static/img/Iconwoman.png) no-repeat left center;
                    background-size: auto 100%;
                    padding-left:25px;
                }
            }
            .presonList /deep/ .el-checkbox+.el-checkbox{
                margin-left: 0;
            }

        }
        .addRoomOpt{
            flex:1;
            width: 96px;
            float: left;
            .optAdd{
                width: 36px;
                height: 36px;
                background: url(/static/img/IconRightPressed.png) no-repeat center;
                background-size: 100% 100%;
                margin: 200px 30px;
                cursor: pointer;
            }
        }
    }
}
.ml50{
    margin-left: 50px;
}
.cusscroll::-webkit-scrollbar {
    width: 10px;
    height: 1px;
}
.cusscroll::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.6);
    background-color: rgb(215, 215, 215);
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
}

.cusscroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
    border-radius: 10px;
    background: #F4f4f4;
}

.cusMiniScroll::-webkit-scrollbar {
    width: 4px;
    height: 1px;
}
.cusMiniScroll::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.6);
    background-color: rgb(157, 208, 255);
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
}

.cusMiniScroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
    border-radius: 10px;
    background: #F4f4f4;
}

.overNum .cusMiniScroll::-webkit-scrollbar {
    width: 4px;
    height: 1px;
}
.overNum .cusMiniScroll::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.6);
    background-color: rgb(255, 93, 93);
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
}

.overNum .cusMiniScroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
    border-radius: 10px;
    background: #F4f4f4;
}



</style>
