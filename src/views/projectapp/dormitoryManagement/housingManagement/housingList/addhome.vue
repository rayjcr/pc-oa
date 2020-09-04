    <template>
    <div class="app-container addhome">

        <!-- <p class="addhometile">添加房间</p> -->
        <div class="u_TableMain">
            <div class="m_GenTableBox">
                <div class="addhometitledormitoryname">
                    <span class="homename">房源名称:</span>
                    <span class="homedormitory">{{buildname || ''}}</span>
                    <span class="homeaddress">房源地址:</span>
                    <span class="addressplace">{{address || ''}}</span>
                </div>
                <div class="addhomecontent">
                    <el-collapse border v-model="collapseArr" @change="addhomecontentcollapse" accordion>
                    <el-collapse-item
                        :key="item.id"
                        :name="item.id"
                        v-for="(item, index) in buildingGetInformationData.floors"
                    >
                        <template slot="title">
                        <div class="addhomecontentwrapper">
                            <div class="addhomecontentleft">
                            <span class="addhomecontentleftfloor">{{item.actualFloor}}</span>
                            <el-input
                                maxlength="20"
                                class="addhomecontentleftinput"
                                placeholder="请输入楼层别名, 长度限制20"
                                suffix-icon="el-icon-edit"
                                @click.native.stop="modifyfloor"
                                v-model="item.alias"
                                @focus="getInitvalue(index)"
                                @blur="getuUpdateFloorName(item, index)"
                            ></el-input>
                            <span
                                class="addhomecontentleftfloorhomenumber"
                            >房间: {{sheetsStatisticsArray[item.id][0]}}</span>
                            </div>
                            <div class="addhomecontentbutton" @click.stop="createHome(item, index)">添加房间</div>
                        </div>
                        </template>

                        <div class="addhomect">
                        <div
                            style="display: inline-block;"
                            :key="'a' + homeindex"
                            v-for="(itemhome, homeindex) in item.roomList"
                        >
                            <el-card shadow="hover" class="addhomectcard" v-if="itemhome.isShow">
                            <div class="addhomeclosedIco">
                                <p style="font-size:20px;">
                                <img
                                    v-show="itemhome.type == 0 && itemhome.attributes == 1"
                                    class="addhomectcardimg"
                                    src="../../../../../../static/img/Iconman.png"
                                    alt
                                >
                                <img
                                    v-show="itemhome.type == 0 && itemhome.attributes == 2"
                                    class="addhomectcardimg"
                                    src="../../../../../../static/img/Iconwoman.png"
                                    alt
                                >
                                <span style="vertical-align: middle;">{{itemhome.name || ''}}</span>
                                </p>
                                <p class="addhomectcardcontent addhomectcardcimportant">
                                <span class="addhomectcardlx" v-if="itemhome.type=='0'">类型：宿舍</span>
                                <span class="addhomectcardlx" v-if="itemhome.type=='1'">类型：办公</span>
                                <span class="addhomectcardlx" v-if="itemhome.type=='2'">类型：教室</span>
                                <span class="addhomectcardlx" v-if="itemhome.type=='3'">类型：公共场所</span>
                                <span class="addhomectcardrs">人数：{{itemhome.maxNum || 0}}</span>
                                </p>
                                <p
                                class="addhomectcarPdModify"
                                @click.prevent="modifyhome(itemhome, index, homeindex)"
                                style="width:70px;cursor: pointer;"
                                >
                                <span class="addhomectcardModify">编辑</span>
                                <img
                                    class="addhomectcardimg"
                                    style="width: 16px;height: 16px;"
                                    src="../../../../../../static/img/modi.png"
                                    alt
                                >
                                </p>
                                <img
                                @click="getDeleteHome(itemhome, index, homeindex)"
                                class="addhomectcardimgclose"
                                src="../../../../../../static/img/Icondelet.png"
                                alt
                                >
                            </div>
                            </el-card>
                            <el-card v-else shadow="hover" class="addhomectcard addhomectcardblurcontentpsave">
                            <div>
                                <!--                    <p class="addhomectcardblurp">A101</p>-->
                                <span class="addhomectcardblurcontentp">
                                <span class="label">名称:</span>
                                <el-input
                                    class="homenameinput"
                                    v-model="itemhome.ename"
                                    placeholder="请输入房间名称"
                                    size="mini"
                                    maxlength="10"
                                ></el-input>
                                </span>
                                <div class="addhomectcardcontent">
                                <span class="addhomectcardblurcontentp">
                                    <span class="label">类别：</span>
                                    <el-radio-group v-model="itemhome.etype" @change="fixMax($event,homeindex,index)" size="mini">
                                    <el-radio-button label="0">宿舍</el-radio-button>
                                    <el-radio-button label="1">办公</el-radio-button>
                                    <el-radio-button label="2">教室</el-radio-button>
																		<el-radio-button label="3">公共场所</el-radio-button>
                                    </el-radio-group>
                                </span>
                                <span class="addhomectcardblurcontentp" v-show="itemhome.etype == 0">
                                    <span class="label">性别：</span>
                                    <el-radio-group v-model="itemhome.esex" size="mini">
                                    <el-radio-button label="1">男</el-radio-button>
                                    <el-radio-button label="2">女</el-radio-button>
                                    </el-radio-group>
                                </span>
                                <!-- <span class="addhomectcardblurcontentp" style="height:33px;">
                                </span>-->
                                <span class="addhomectcardblurcontentp">
                                    <span class="label">人数:</span>
                                    <el-input-number
                                    v-model="itemhome.enum"
                                    size="mini"
                                    :min="1"
                                    :max="itemhome.etype=='3'?900:90"
                                    label="描述文字"
                                    ></el-input-number>
                                </span>
                                <div class="modifypopbottom">
                                    <el-button
                                    size="small"
                                    @click="getaddmodihome(itemhome, index, homeindex)"
                                    type="primary"
                                    >保存</el-button>
                                    <el-button
                                    size="small"
                                    @click="isNone(itemhome, index, homeindex)"
                                    type="default"
                                    >取消</el-button>
                                </div>
                                </div>
                            </div>
                            </el-card>
                        </div>
                        </div>
                    </el-collapse-item>
                    </el-collapse>
                </div>
                <p style="text-align:center;margin-top: 50px;">
                    <el-button @click="back" type="primary">返回</el-button>
                </p>
            </div>
        </div>


        <el-dialog
            :append-to-body="true"
            class="dialogAddHomeForm AddHomelimitsize"
            width="40%"
            top="25vh"
            title="添加房间"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :center="true"
            :visible.sync="dialogTheHousingVisible">
            <div>
            <div class="addhomectcardcontentdialog">
                <span class="addhomectcardblurcontentp">
                <span class="label">类别：</span>
                <el-radio-group @change="choicethetype" v-model="typevalue" size="mini">
                    <el-radio-button label="0">宿舍</el-radio-button>
                    <el-radio-button label="1">办公</el-radio-button>
                    <el-radio-button label="2">教室</el-radio-button>
                    <el-radio-button label="3">公共场所</el-radio-button>
                </el-radio-group>
                </span>
                <span class="addhomectcardblurcontentp" v-if="sex">
                <span class="label">性别：</span>
                <el-radio-group v-model="sexvalue" size="mini" style="inline-block;">
                    <el-radio-button label="1">男</el-radio-button>
                    <el-radio-button label="2">女</el-radio-button>
                </el-radio-group>
                </span>
                <span class="addhomectcardblurcontentp">
                <span class="label">数量:</span>
                <el-input-number
                    class="elnumber"
                    ref="inputnumber"
                    v-model="typevaluenumber"
                    size="mini"
                    :min="1"
                    :max="50"
                ></el-input-number>
                </span>
                <!-- <span class="addhomectcardblurcontentp" style="height:33px;">
                </span>-->
                <span class="addhomectcardblurcontentp">
                <span class="label">人数:</span>
                <el-input-number v-model="membernumber" size="mini" :min="1" :max="typevalue=='3'?900:90"></el-input-number>
                </span>
                <div style="margin-left: 54px;">
                <el-button size="small" @click="addhome" type="primary">保存</el-button>
                </div>
            </div>
            </div>
        </el-dialog>
    </div>
    </template>
    <script>
    import {
    buildingGetInformation,
    sheetsStatistics,
    addmodihome,
    updateFloorName,
    deletehome
    } from '@/api/projectapp/dormitoryManagement/';

    export default {
    name: '',
    data() {
        return {
        initValue: '', // 初始名称
        floorid: '', // 楼层id
        typevaluenumber: '', // 数量
        membernumber: '', // 人数
        homename: '', // 房间名称
        typevalue: '0', // 默认类型
        sexvalue: '1', // 性别
        sheetsStatisticsArray: null, // 统计数据
        dialogTheHousingVisible: false, // 是否显示添加房间
        buildingGetInformationData: [], // 房间信息
        buildingId: 0, // 上页面传来的房源id
        address: '', // 房源地址
        xxdm: '', // 学校代码
        buildname: '', // 房源名称
        currentrow: null, // 当前行
        currentindex: 0, // 当前行序列
        radio2: '宿舍',
        radio4: '男',
        isShow: true,
        sex: true, // 性别
        num: 1,
        floor: '', //
        collapseArr: null,
        status: ''
        };
    },
    watch: {
			typevalue(val){				
				var max = val=='3'?900:90;
				if(this.membernumber>max){
					this.membernumber = max
				}
			}
		},
    methods: {
        /**
         * @description: 新增房间
         * @param {type}
         * @return:
         */
        addhome() {
        for (let i = 0; i < this.typevaluenumber; i++) {
            const obj = {};
            obj.type = this.typevalue;
            obj.attributes = this.sexvalue;
            obj.maxNum = this.membernumber;
            obj.isShow = true;
            this.buildingGetInformationData.floors[this.currentindex].roomList.push(
            { ...obj }
            );
        }
        this.dialogTheHousingVisible = false;
        },
        /**
         * @description: 选择类型
         * @param {type}
         * @return:
         */
        choicethetype(val) {
        if (val === '0') {
            this.sex = true;
        } else {
            this.sex = false;
        }
        },

        /**
         * @description: 删除房间
         * @param {type}
         * @return:
         */
        async getDeleteHome(itemhome, index, homeindex) {
        console.log(index)
        this.$confirm('确定删除房间吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (itemhome.hasOwnProperty('id')) {
            deletehome({
                roomId: itemhome.id
            }).then(res => {
                if (res.resultCode === 1) {
                this.buildingGetInformationData.floors[
                    index
                ].roomList.splice(homeindex, 1);
                this.$message({
                    type: 'success',
                    message: res.resultMessage
                });
                this.getSheetsStatistics();
                } else {
                this.$message({
                    type: 'error',
                    message: res.resultMessage
                });
                }
            });
            } else {
            this.buildingGetInformationData.floors[
                index
            ].roomList.splice(homeindex, 1);
            }
        });
        },

        /**
         * @description: 获取考勤记录统计
         * @param {type}
         * @return:
         */
        async getSheetsStatistics() {
        await sheetsStatistics({
            schoolCode: this.xxdm,
            buildingId: this.buildingId
        }).then(res => {
            if (res.resultCode === 1) {
            this.sheetsStatisticsArray = res.value;
            } else {
            this.$message({
                type: 'error',
                message: res.resultMessage
            });
            }
        });
        },

        /**
         * @description: 修改房间
         * @param {type}
         * @return:
         */
        modifyhome(itemhome, index, homeindex) {
        this.buildingGetInformationData.floors[index].roomList.forEach(
            (i, id) => {
            this.changeTheValue(itemhome, index, id, 'isShow', true);
            }
        );
        this.changeTheValue(itemhome, index, homeindex, 'ename', itemhome.name);
        this.changeTheValue(itemhome, index, homeindex, 'enum', itemhome.maxNum);
        this.changeTheValue(
            itemhome,
            index,
            homeindex,
            'etype',
            String(itemhome.type)
        );
        this.changeTheValue(
            itemhome,
            index,
            homeindex,
            'esex',
            String(itemhome.attributes)
        );
        this.changeTheValue(itemhome, index, homeindex, 'isShow', false);
        this.handlerWay(this.buildingGetInformationData.floors[index].roomList);
        },

        /**
         * @description: 取消修改
         * @param {type}
         * @return:
         */
        isNone(itemhome, index, homeindex) {
        this.changeTheValue(itemhome, index, homeindex, 'isShow', true);
        this.handlerWay(this.buildingGetInformationData.floors[index].roomList);
        },

        /**
         * @description: 初始化楼层名称
         * @param {type}
         * @return:
         */
        getInitvalue(index) {
        this.initValue = this.buildingGetInformationData.floors[index].alias;
        },

        /**
         * @description: 修复房间显示问题
         * @param {type}
         * @return:
         */
        handlerWay(value) {
        value.unshift(1);
        value.shift();
        },

        /**
         * @description: 添加或修改房间信息
         * @param {type}
         * @return:
         */
        async getuUpdateFloorName(value, index) {
        if (value.alias !== this.initValue && value.alias) {
            await updateFloorName({
            floorId: value.id,
            alias: value.alias
            }).then(res => {
            if (res.resultCode === 1) {
                this.$message({
                type: 'success',
                message: res.resultMessage
                });
            } else {
                this.$message({
                type: 'error',
                message: res.resultMessage
                });
            }
            });
        }
        if (!value.alias) {
            this.buildingGetInformationData.floors[index].alias = this.initValue;
        }
        },

        /**
         * @description: 值渲染封装
         * @param {type}
         * @return:
         */
        changeTheValue(itemhome, index, homeindex, item, key) {
        this.$set(
            this.buildingGetInformationData.floors[index].roomList[homeindex],
            item,
            key
        );
        },

        /**
         * @description: 添加或修改房间信息
         * @param {type}
         * @return:
         */
        async getaddmodihome(itemhome, index, homeindex) {
        console.log(itemhome);
        if (!itemhome.ename) {
            this.$message({
            type: 'warning',
            message: '请输入名称后保存'
            });
            return;
        }

        if (!Number(itemhome.etype) && !Number(itemhome.esex)) {
            this.$message({
            type: 'warning',
            message: '请选择性别后保存'
            });
            return;
        }

        if (arguments.length) {
            await this.addmodihomeFunction(itemhome, index, homeindex);
        }
        },

        /**
         * @description: 添加或修改房间信息接口callback
         * @param {type}
         * @return:
         */
        async addmodihomeFunction(itemhome, index, homeindex) {
        const tem = itemhome.etype;
        await addmodihome({
            roomId: arguments.length ? itemhome.id : '',
            name: itemhome.ename,
            floorId: this.floorid,
            maxNum: itemhome.enum,
            type: itemhome.etype,
            attributes: tem != 0 ? '0' : itemhome.esex
        }).then(res => {
            if (res.resultCode === 1) {
            this.$message({
                type: 'success',
                message: res.resultMessage
            });

            this.changeTheValue(
                itemhome,
                index,
                homeindex,
                'name',
                itemhome.ename
            );
            if (res.value) {
                this.changeTheValue(itemhome, index, homeindex, 'id', res.value);
            }
            this.changeTheValue(
                itemhome,
                index,
                homeindex,
                'maxNum',
                itemhome.enum
            );
            this.changeTheValue(
                itemhome,
                index,
                homeindex,
                'type',
                String(itemhome.etype)
            );
            if (itemhome.etype == 0) {
                this.changeTheValue(
                itemhome,
                index,
                homeindex,
                'attributes',
                String(itemhome.esex)
                );
            }
            if (itemhome.etype != 0) {
                this.changeTheValue(itemhome, index, homeindex, 'attributes', '0');
            }
            this.changeTheValue(itemhome, index, homeindex, 'isShow', true);
            this.handlerWay(
                this.buildingGetInformationData.floors[index].roomList
            );
            } else {
            this.$message({
                type: 'error',
                message: res.resultMessage
            });
            }

            this.getSheetsStatistics();
        });
        },

        /**
         * @description: 获取房源信息
         * @param {type}
         * @return:
         */
        async getBuildingGetInformation(value, mounted) {
        await buildingGetInformation({
            schoolCode: this.xxdm,
            buildingId: this.buildingId,
            withFloor: true,
            withRoom: true
        }).then(res => {
            if (res.resultCode === 1) {
            this.buildingGetInformationData = res.value;
            if (mounted) {
                this.floorid = this.buildingGetInformationData.floors[0].id;
            }
            if (value) {
                this.collapseArr = [this.buildingGetInformationData.floors[0].id];
            }
            this.buildingGetInformationData.floors.forEach((j, ji) => {
                this.buildingGetInformationData.floors[ji].roomList.forEach(
                k => k.isShow = true
                );
            });
            this.buildname = res.value.name;
            this.address = res.value.address;
            } else {
            this.$message({
                type: 'error',
                message: res.resultMessage
            });
            }
        });
        },

        /**
         * @description: 创建房间
         * @param {type}
         * @return:
         */
        createHome(item, index) {
        this.currentrow = item;
        this.currentindex = index;
        this.typevalue = '0';
        this.sex = '1';
        this.typevaluenumber = 1;
        this.membernumber = 1;
        this.floorid = item.id;
        this.dialogTheHousingVisible = true;
        },

        /**
         * @description: 修改楼层
         * @param {type}
         * @return:
         */
        modifyfloor() {
        //
        },

        /**
         * @description:  返回
         * @param {type}
         * @return:
         */
        back() {
        this.$router.go(-1); // 返回上一层
        },

        /**
         * @description: 折叠callback
         * @param {type}
         * @return:
         */
        addhomecontentcollapse(a) {
        this.floorid = a;
        this.status = this.collapseArr;
        },
				fixMax(val,hind,ind){					
						var max = val=='3'?900:90;
						var item = this.buildingGetInformationData.floors[ind].roomList[hind].enum
						if(item>max){
							this.buildingGetInformationData.floors[ind].roomList[hind].enum = max
						}
				}
    },
    mounted() {
        this.xxdm = localStorage.getItem('xxdm');
        this.buildingId = this.$route.query.buildingId;
        this.getSheetsStatistics();
        this.getBuildingGetInformation(1, 1);
    }
    };
    </script>
    <style>
    .addhome {
    width: 100%;
    min-width: 1007px;
    }

    .addhometile {
    font-size: 28px;
    margin-bottom: 20px;
    }
    .addhometitledormitoryname {
    margin: 21px 0 30px 0;
    }
    .homename {
    font-size: 14px;
    line-height: 9px;
    color: #303133;
    }

    .homedormitory {
    font-size: 14px;
    line-height: 9px;
    color: #303133;
    margin-right: 55px;
    }

    .homeaddress {
    font-size: 14px;
    line-height: 9px;
    color: #303133;
    }

    .addressplace {
    font-size: 14px;
    line-height: 9px;
    color: #303133;
    }
    .addhomecontentwrapper {
    overflow: hidden;
    width: 100%;
    }
    .addhomecontentbutton {
    float: right;
    width: 104px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    background-color: #409eff;
    border-radius: 20px;
    margin-top: 10px;
    margin-right: 50px;
    }
    .addhomecontent .el-collapse-item__header {
    height: 60px;
    line-height: 60px;
    background-color: #f5f7fa;
    border-top: none;
    margin-bottom: 20px;
    }
    .addhomecontent .el-collapse-item__content {
    padding: 14px 20px;
    }
    .addhomecontent .el-collapse-item__arrow {
    line-height: 60px !important;
    }
    .addhomecontent .el-collapse-item__wrap {
    border: none;
    }
    .addhomecontent .el-collapse > .is-active {
    border: 1px solid #eaedf4;
    margin-bottom: 20px;
    }
    .addhomecontentleft {
    float: left;
    padding-left: 30px;
    }
    .addhomecontentleftfloor {
    font-size: 30px;
    line-height: 60px;
    color: #c6c9ce;
    display: inline-block;
    width: 50px;
    vertical-align: middle;
    }
    .addhomecontentleftinput {
    width: 345px;
    margin-right: 30px;
    }
    .addhomecontentleftfloorhomenumber {
    color: #606266;
    }
    .addhomect {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    max-height: 600px;
    overflow-y: auto;
    }
    .addhomectcard {
    min-width: 260px;
    min-height: 230px;
    margin-right: 20px;
    margin-bottom: 20px;
    }
    .addhomeclosedIco {
    position: relative;
    }
    .addhomectcardlx {
    font-size: 17px;
    margin-right: 10px;
    vertical-align: middle;
    }
    .addhomectcardrs {
    font-size: 17px;
    vertical-align: middle;
    }
    .addhomectcardimg {
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -1px;
    }
    .addhomectcardimgclose {
    position: absolute;
    right: -5px;
    top: -10px;
    }
    .addhomectcardcontent {
    position: relative;
    margin-top: 10px;
    }
    .modifypopbottom {
    margin-left: 54px;
    margin-top: 30px;
    }
    .addhomectcardblurp {
    background-color: #f5f7fa;
    border-radius: 2px;
    padding: 0px 10px;
    }
    .addhomectcardblurcontentp {
    display: block;
    margin-bottom: 10px;
    }
    .addhomectcardcontentdialog {
    position: relative;
    }
    .addhomectcardblurcontentp .label {
    text-align: left;
    display: inline-block;
    width: 50px;
    font-size: 12px;
    line-height: 24px;
    color: #606266;
    }
    .addhomectcardblurcontentpsave {
    box-shadow: 0px 3px 9px 0px #d7e9ff;
    border-radius: 10px;
    border: solid 1px #b2d6fd;
    }
    .addhomectcardcimportant {
    margin-top: 32px;
    }
    .addhomectcarPdModify {
    margin-top: 41px;
    }
    .addhomectcardModify {
    font-size: 14px;
    vertical-align: middle;
    margin-right: 10px;
    color: grey;
    }
    .dialogAddHomeForm .el-dialog {
    max-width: 350px !important;
    }
    .AddHomelimitsize .el-dialog__body {
    max-height: 490px;
    overflow-y: auto;
    }
    .homenameinput {
    width: auto !important;
    }
    </style>
