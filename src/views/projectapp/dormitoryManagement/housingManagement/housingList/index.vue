    <template>
    <div class="app-container housingList">
        <div class="u_TableMain">
            <div class="filter-container housingListtoped">
                <!-- <p class="housingListtile">房源管理</p> -->
                <div class="housingListnavgation">
                <el-select class="housingListselect" clearable v-model="searchvalue" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
                <el-input
                    class="housingListsearch"
                    maxlength="30"
                    v-model="searchinput"
                    clearable
                    placeholder="筛选关键字"
                ></el-input>
                <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
                <div class="housingListrifht">
                    <!--          <el-button @click="downTheTemplate" type="primary">下载模板</el-button>-->
                    <el-button @click="reportTheHousing" type="primary">上报房源</el-button>
                    <el-button @click="addTheHousing" type="primary">添加房源</el-button>
                </div>
                </div>
            </div>
            <div class="m_GenTableBox">
                <div class="housingListBoxCards">
                    <el-card v-for="item in list" :key="item.id" class="housingListBoxCard">
                    <div
                        class="housingListBoxCardtitle"
                        @click.stop="detailpage(item)"
                        style="overflow: hidden;cursor: pointer;"
                    >
                        <p class="housingListBoxCardtitlep">
                        <img src="/static/img/Icon-bulidings.png" alt>
                        <span class="housingListBoxCardtitleptitle" :title="item.name" style>{{item.name}}</span>
                        </p>
                        <img
                        src="/static/img/icon-more.png"
                        alt
                        @click.stop="detailpage(item)"
                        style="float: right;margin-right: 50px;cursor:pointer;vertical-align: middle;"
                        >
                        <!-- 取消房源信息页面 0419 -->
                        <!-- <button class="housingListBoxCardtitlebutton">房源信息</button> -->
                    </div>
                    <div @click="detailpage(item)" style="cursor: pointer;" class="housingListBoxCardContent">
                        <p class="housingListBoxCardnamepcontent">
                        <span class="housingListBoxCardname">房源地址</span>
                        <span class="housingListBoxCardcon" :title="item.address">{{item.address}}</span>
                        </p>
                        <p>
                        <span class="housingListBoxCardname">管理员</span>
                        <span
                            class="housingListBoxCardcon housingListBoxCardconmanage"
                            :title="item.manages"
                        >{{item.manages}}</span>
                        </p>
                        <p>
                        <span class="housingListBoxCardname">楼层数量</span>
                        <span class="housingListBoxCardcon">{{item.upFloors + item.downFloors}}</span>
                        </p>
                        <p>
                        <span class="housingListBoxCardname">创建时间</span>
                        <span class="housingListBoxCardcon">{{item.createTime}}</span>
                        </p>
                    </div>
                    <div class="housingListAddExport" style="cursor: pointer;" @click.stop="detailpage(item)">
                        <div class="housingListadd">
                        <el-button type="primary" @click.stop="addhouse(item)" icon="el-icon-plus">添加房间</el-button>
                        <el-button type="primary" @click.stop="exporthouse(item)" icon="el-icon-download">导入房间</el-button>
                        </div>
                        <div class="housingListdelete">
                        <el-button type="primary" @click.stop="modifyhouse(item)" icon="el-icon-edit">修改</el-button>
                        <el-button type="danger" @click.stop="deletethouse(item)" icon="el-icon-delete">删除</el-button>
                        </div>
                    </div>
                    </el-card>
                </div>

                <div class="block" style="margin-top: 32px;">
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
        </div>

        <el-dialog title="导入数据" :visible.sync="importMenVisible" width="540px" class="import_box">
        <el-row>
            <el-col :span="6" style="line-height:32px;margin-bottom:50px;">文件选择：</el-col>
            <el-col :span="18">
            <el-upload
                :limit="1"
                name="file"
                ref="studentupload"
                accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :headers="headers"
                action="/api/lock/room/importData"
                :file-list="fileList"
                :onError="uploadError"
                :onSuccess="uploadSuccess"
                :before-upload="beforeUpload"
                :auto-upload="false"
            >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
            </el-col>
        </el-row>
        <el-row>
            导入失败数据详情：
            <el-table
            :data="errData"
            style="width: 100%;max-height: 200px;
                                overflow-y: scroll;"
            >
            <el-table-column prop="buildingName" label="房源"></el-table-column>
            <el-table-column prop="actualFloor" label="楼层"></el-table-column>
            <el-table-column prop="name" label="房间名称"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="attributes" label="属性"></el-table-column>
            <el-table-column prop="result" label="错误信息"></el-table-column>
            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button
            size="medium"
            type="primary"
            @click="importSubmit('studentupload')"
            :loading="importLoading"
            >导入</el-button>
            <el-button size="medium" @click="importCancel">取 消</el-button>
            <el-button size="medium" @click="downLoadMb">
            模版生成
            <i class="el-icon-download"></i>
            </el-button>

            <el-row class="import_desc">
            <el-col :span="6" style="line-height:80px">操作说明：</el-col>
            <el-col :span="18">
                <p>1.请使用本页面提供的模版进行导入</p>
                <p>2.请勿修改模版Excel的表头内容</p>
                <p>3.模版提供的默认信息，请勿随意修改</p>
            </el-col>
            </el-row>
        </div>
        </el-dialog>

        <el-dialog
        class="dialogTheHousingForm limitsize"
        width="40%"
        top="20vh"
        :title="dialogTheHousing"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :center="true"
        :visible.sync="dialogTheHousingVisible"
        >
        <el-form
            label-position="left"
            style="padding-right:100px;"
            :model="dialogTheHousingForm"
            :rules="dialogTheHousingRules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
        >
            <el-form-item label="房源名称" prop="name">
            <el-input
                maxlength="30"
                :title="dialogTheHousingForm.name"
                v-model="dialogTheHousingForm.name"
            ></el-input>
            </el-form-item>
            <el-form-item label="房源地址" prop="address">
            <el-input
                maxlength="150"
                :title="dialogTheHousingForm.address"
                v-model="dialogTheHousingForm.address"
            ></el-input>
            </el-form-item>
            <el-row v-if="showfloors">
            <el-form-item style="float:left" label="地上楼层数" prop="upFloors">
                <el-input-number v-model="dialogTheHousingForm.upFloors" :min="1" :max="30"></el-input-number>
            </el-form-item>
            <el-form-item style="float:right" label="地下楼层数" prop="downFloors">
                <el-input-number v-model="dialogTheHousingForm.downFloors" :min="0" :max="3"></el-input-number>
            </el-form-item>
            </el-row>
            <el-form-item label="房源管理员" prop="managerList">
            <el-select
                class="housingelselecttag"
                filterable
                v-model="dialogTheHousingForm.managerList"
                multiple
                placeholder="请选择"
            >
                <el-option
                v-for="item in managerListoptions"
                :key="item.userid"
                :label="item.name + '： ' + item.departmentList"
                :value="item.userid"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item class="equipmentMaintenancePersonnel" label="设备维修人员">
            <el-button
                style="margin-bottom:10px;margin-left: -8px;"
                type="primary"
                @click="addDomain"
            >新增设备维修人员</el-button>
            <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :label="'维修人员' + Number(index + 1)"
                :key="domain.key"
            >
                <el-input style="width: 100px;" maxlength="4" placeholder="请输入姓名" v-model="domain.name"></el-input>
                <el-input
                maxlength="11"
                style="width: 160px;margin-right:10px;"
                placeholder="请输入手机号"
                v-model="domain.value"
                ></el-input>
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-form-item>
            <!-- <el-input v-model="dialogTheHousingForm.managerList"></el-input> -->
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTheHousingVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveHouses">确 定</el-button>
        </span>
        </el-dialog>
    </div>
    </template>
    <script>
    import {
    buildingGetList,
    teacherList,
    buildingDel,
    buildingAddUpdate,
    reportthehousing
    } from '@/api/projectapp/dormitoryManagement/';
    import * as api from '@/api/projectapp/dormitoryManagement/';
    import Cookies from 'js-cookie';
    export default {
    name: 'housingList',
    data() {
        return {
        modify: null, // 是否为修改
        searchvalue: '', // 搜索类型
        page: 1, // 页数
        limit: 10, // 条数
        fileList: [], // 文件列表
        total: 0, // 总条
        buildingId: '', // buildingId
        list: [], // 列表
        xxdm: '', // 学校代码
        importMenVisible: false, // 导入的弹层
        showfloors: true, // 显示楼层
        postmanalist: [], // 管理员整理后
        repairmanalist: [], // 维修人员整理后
        importLoading: false, // 是否上传导入中
        dynamicValidateForm: {
            // 维修人员
            domains: [
            {
                name: '',
                value: ''
            }
            ]
        },
        managerListoptions: [], // 管理员
        searchinput: '', // 筛选关键字
        dialogTheHousingForm: {
            name: '', // 房源名称
            address: '', // 房源地址
            upFloors: 1, // 地上楼层数
            downFloors: 0, // 地下楼层数
            managerList: [] // 房源管理员
        }, // 新增房源数据表
        errData: [],
        dialogTheHousingRules: {
            name: [{ required: true, message: '请输入房源名称', trigger: 'blur' }],
            address: [
            { required: true, message: '请输入房源地址', trigger: 'change' }
            ],
            upFloors: [
            { required: true, message: '请输入上楼层', trigger: 'change' }
            ],
            downFloors: [
            { required: true, message: '请输入下楼层', trigger: 'change' }
            ],
            managerList: [
            { required: true, message: '请选择管理员', trigger: 'change' }
            ]
        },
        dialogTheHousing: '', // dialog 的标题
        dialogTheHousingVisible: false, // dialog 默认不显示
        options: [
            {
            value: '1',
            label: '房源名称'
            },
            {
            value: '2',
            label: '房源地址'
            },
            {
            value: '3',
            label: '管理员'
            }
        ]
        };
    },
    methods: {
        /**
         * @description:  获取管理员
         * @param {type}
         * @return:
         */
        async getTeacherList() {
        await teacherList({ schoolCode: this.xxdm }).then(res => {
            if (res.resultCode === 1) {
            this.managerListoptions = res.value;
            } else {
            this.$message({
                type: 'error',
                message: res.resultMessage
            });
            }
        });
        },

        detailpage(item) {
        this.$router.push({
            path: '/buildingManage/accommodationdetails',
            query: {
            id: item.id
            }
        });
        },

        /**
         * @description:  删除房源
         * @param {type}
         * @return:
         */
        async delBuilding(value) {
        this.$confirm('确定删除房源信息吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            buildingDel({ buildingId: value }).then(res => {
            if (res.resultCode === 1) {
                this.managerListoptions = res.value;
                this.$message({
                type: 'success',
                message: '删除成功!'
                });
                this.getTeacherList();
                this.getBuildingGetList();
            } else {
                this.$message({
                type: 'error',
                message: res.resultMessage
                });
            }
            });
        });
        },

        /**
         * @description:  批量提交失败
         * @param {type}
         * @return:
         */
        uploadError() {},

        /**
         * @description:  提交批量导入
         * @param {type}
         * @return:
         */
        importSubmit(fileName) {
        if (this.$refs[fileName].uploadFiles.length < 1) {
            this.tipsXX('请选择导入文件', 'error');
            return;
        }
        this.$refs[fileName].submit();
        },

        /**
         * @description:  选择文件后
         * @param {type}
         * @return:
         */
        beforeUpload() {},

        /**
         * @description:  批量导入弹层关闭
         * @param {type}
         * @return:
         */
        importCancel() {
        this.errData = [];
        this.importMenVisible = false;
        },

        /**
         * @description:  批量提交成功
         * @param {type}
         * @return:
         */
        uploadSuccess(response, file, fileList) {
        if (response.resultCode == 1) {
            if (response.value && !response.value.length) {
            this.tipsXX('导入成功!', 'success');
            this.importMenVisible = false;
            this.fileList = [];
            } else {
            this.tipsXX('部分数据导入失败', 'warning');
            this.errData = response.value;
            this.fileList = [];
            }
        } else {
            this.tipsXX(response.resultMessage, 'warning');
            this.fileList = [];
        }
        },

        /**
         * 说明:Ele-UI 信息提示的二次封装
         * 作者:RayJ
         * 更新时间:2019-1-22
         */
        tipsXX(data, xxtype, tit) {
        this.$notify({
            title: tit ? tit : '',
            message: data,
            type: xxtype,
            duration: 2000
        });
        },
        /**
         * @description:  批量导入模版下载
         * @param {type}
         * @return:
         */
        async downLoadMb() {
        const res = await api.downLoadhomesTemplate(this.buildingId);
        const blob = new Blob([res], {
            type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '导入房间模板.xls'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
        },

        /**
         * @description:  添加或修改房源信息
         * @param {type}
         * @return:
         */
        async apiBuildingAddUpdate() {
        await buildingAddUpdate({
            address: this.dialogTheHousingForm.address,
            builldingId: this.modify, // 为空则添加，有值则修改 ,
            downFloors: this.dialogTheHousingForm.downFloors,
            managers: [...this.postmanalist, ...this.repairmanalist],
            name: this.dialogTheHousingForm.name,
            schoolCode: this.xxdm,
            upFloors: this.dialogTheHousingForm.upFloors
        }).then(res => {
            if (res.resultCode === 1) {
            if (!this.modify) {
                this.$message({
                type: 'success',
                message: '添加成功'
                });
            } else {
                this.$message({
                type: 'success',
                message: '修改成功'
                });
            }
            this.dialogTheHousingVisible = false;
            this.getBuildingGetList();
            } else {
            this.$message({
                type: 'error',
                message: res.resultMessage
            });
            }
        });
        },

        /**
         * @description:获取房源列表
         * @param {type}
         * @return:
         */
        async getBuildingGetList() {
        await buildingGetList({
            schoolCode: this.xxdm,
            page: this.page,
            pageSize: this.limit,
            keyWordsType: this.searchvalue,
            keyWords: this.searchinput
        }).then(res => {
            if (res.resultCode === 1) {
            const result = res.value.dataList;
            this.total = res.value.totalCount || 0;
            result.map(item => {
                const manages = [];

                item.managerList.forEach(itemlist => {
                manages.push(itemlist.name);
                });
                item.manages = manages.join('、');
                return item;
            });

            this.list = result;
            } else {
            this.$message({
                type: 'error',
                message: res.resultMessage
            });
            }
        });
        },

        /**
         * @description: 分页数量改变
         * @param {type}
         * @return:
         */
        handleSizeChange(val) {
        this.limit = val;
        this.getBuildingGetList();
        },

        /**
         * @description:  保存修改
         * @param {type}
         * @return:
         */
        saveHouses() {
        this.postmanalist = [];
        this.repairmanalist = [];
        this.dynamicValidateForm.domains.forEach(item => {
            const obj = {};
            // obj.userid = item.userid;
            obj.name = item.name;
            obj.mobile = item.value;
            obj.type = 3;
            this.repairmanalist.push(obj);
        });
        this.dialogTheHousingForm.managerList.forEach((itemb, indexb) => {
            this.managerListoptions.forEach((item, index) => {
            if (item.userid === itemb) {
                const obj = {};
                obj.userId = item.userid;
                obj.name = item.name;
                obj.mobile = item.mobile;
                obj.type = 1;
                this.postmanalist.push(obj);
            }
            });
        });
        if (this.$refs.ruleForm) {
            let commit = true;
            this.$refs.ruleForm.validate(valid => {
            if (valid) {
                if (this.dynamicValidateForm.domains.length > 0) {
                for (
                    let index = 0;
                    index < this.dynamicValidateForm.domains.length;
                    index++
                ) {
                    if (
                    !this.dynamicValidateForm.domains[index].name ||
                    !this.dynamicValidateForm.domains[index].value
                    ) {
                    this.$message({
                        type: 'error',
                        message: '维修人员信息请完善后提交 !'
                    });
                    commit = false;
                    break;
                    }
                    if (index === this.dynamicValidateForm.domains.length - 1) {
                    this.apiBuildingAddUpdate();
                    }
                }
                } else {
                this.apiBuildingAddUpdate();
                }
                if (!commit) {
                return;
                }
            } else {
                return false;
            }
            });
        }
        // this.dialogTheHousingVisible = false
        },

        /**
         * @description:  当前页分页改变
         * @param {type}
         * @return:
         */
        handleCurrentChange(val) {
        this.page = val;
        this.getBuildingGetList();
        },

        /**
         * @description: 搜索
         * @param {type}
         * @return:
         */
        search() {
        if (!this.searchvalue && this.searchinput) {
            this.$message({
            type: 'warning',
            message: '请选择搜索类型后搜索！'
            });
            return;
        }
        this.page = 1;
        this.getBuildingGetList();
        },

        /**
         * @description: 下载模板
         * @param {type}
         * @return:
         */
        downTheTemplate() {
        //
        },

        /**
         * @description: 上报房源
         * @param {type}
         * @return:
         */
        async reportTheHousing() {
        await reportthehousing({}).then(res => {
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
        },

        /**
         * @description: 新增设备维修人员
         * @param {type}
         * @return:
         */
        addDomain() {
        this.dynamicValidateForm.domains.push({
            value: '',
            name: '',
            key: Date.now()
        });
        },

        /**
         * @description: 添加房源
         * @param {type}
         * @return:
         */
        addTheHousing() {
        this.modify = '';
        this.showfloors = true;
        if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields();
        }
        this.dialogTheHousingForm = {
            name: '', // 房源名称
            address: '', // 房源地址
            upFloors: 1, // 地上楼层数
            downFloors: 0, // 地下楼层数
            managerList: [] // 房源管理员
        };
        this.dynamicValidateForm.domains = [];
        this.dialogTheHousing = '添加房源';
        this.dialogTheHousingVisible = true;
        },

        /**
         * @description: 删除设备维修人员
         * @param {type}
         * @return:
         */
        removeDomain(item) {
        const index = this.dynamicValidateForm.domains.indexOf(item);
        if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1);
        }
        },

        /**
         * @description: 添加房间
         * @param {type}
         * @return:
         */
        addhouse(item) {
        this.$router.push({
            name: '添加房间',
            query: {
            buildingId: item.id
            }
        });
        },

        /**
         * @description: 导入房间
         * @param {type}
         * @return:
         */
        exporthouse(item) {
        this.buildingId = item.id;
        this.importMenVisible = true;
        },

        /**
         * @description: 修改
         * @param {type}
         * @return:
         */
        async modifyhouse(item) {
        if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields();
        }
        // 返回信息给予展示
        this.dialogTheHousingForm.managerList = [];
        this.dynamicValidateForm.domains = [];
        if (item.managerList && item.managerList.length > 0) {
            item.managerList.forEach(managerItem => {
            if (managerItem.type === 1) {
                this.dialogTheHousingForm.managerList.push(managerItem.userId);
            }
            if (managerItem.type === 3) {
                const obj = {};
                obj.name = managerItem.name;
                obj.value = managerItem.mobile;
                this.dynamicValidateForm.domains.push(obj);
            }
            });
        }
        this.modify = item.id;
        this.showfloors = false;
        this.dialogTheHousingForm = {
            name: item.name || '', // 房源名称
            address: item.address || '', // 房源地址
            upFloors: item.upFloors || 1, // 地上楼层数
            downFloors: item.downFloors || 0, // 地下楼层数
            managerList: this.dialogTheHousingForm.managerList // 房源管理员
        };
        // this.dynamicValidateForm.domains = [];
        this.dialogTheHousing = '修改房源';
        this.dialogTheHousingVisible = true;
        },

        /**
         * @description: 删除
         * @param {type}
         * @return:
         */
        async deletethouse(item) {
        // if (item.canDelete) {
        await this.delBuilding(item.id);
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: '房源下存在关联的楼层或房间，不能删除!'
        //   });
        // }
        }
    },
    mounted() {
        this.xxdm = localStorage.getItem('xxdm');
        this.getTeacherList();
        this.getBuildingGetList();
    },
    computed: {
        headers() {
        return {
            Authorization: Cookies.get('Admin-Token')
        };
        }
    }
    };
    </script>

    <style>
    .housingList {
    min-width: 1007px;

    }
    .housingListnavgation {
    overflow: hidden;
    }
    .housingListselect {
    margin-right: 10px;
    width: 120px;
    }
    .housingListsearch {
    width: 280px;
    margin-right: 30px;
    }
    .housingListrifht {
    float: right;
    }
    .housingListBoxCards {
    /* margin-top: 50px; */
    }
    .housingListBoxCard {
    /* margin-top: 50px; */
    margin-bottom: 10px;
    }
    .housingListBoxCardtitlebutton {
    float: right;
    }
    .housingListBoxCardtitlep {
    float: left;
    }
    .housingListBoxCardtitle {
    width: 100%;
    overflow: hidden;
    }
    .housingListBoxCardtitlep {
    font-size: 20px;
    }

    .dialogTheHousingForm .el-dialog {
    min-width: 740px !important;
    }

    .housingListBoxCardContent p span {
    font-size: 16px;
    }
    .housingListBoxCardname {
    display: inline-block;
    width: 70px;
    margin-right: 10px;
    }
    .housingListBoxCardcon {
    color: grey;
    }

    .limitsize .el-dialog__body {
    max-height: 490px;
    overflow-y: auto;
    }
    .housingListAddExport {
    overflow: hidden;
    }
    .housingListadd {
    float: left;
    }
    .housingListdelete {
    float: right;
    }
    .housingelselecttag {
    width: 500px;
    overflow: auto;
    }
    .equipmentMaintenancePersonnel .el-form-item__label {
    margin-left: 10px;
    }
    .housingListtile {
    font-size: 24px;
    line-height: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    }
    .housingelselecttag .el-select__tags-text {
    display: inline-block;
    max-width: 444px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    }

    .housingListBoxCardtitlep .housingListBoxCardtitleptitle {
    width: 680px;
    overflow: hidden;
    display: inline-block;
    height: 22px;
    line-height: 22px;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
    font-weight: 600;
    }
    .housingelselecttag .el-select .el-input__inner {
    padding-right: 10px !important;
    }
    .housingelselecttag .el-input__suffix {
    display: none;
    }
    .housingelselecttag .el-tag__close.el-icon-close {
    top: -8px !important;
    }

    .housingListBoxCardconmanage {
    width: 600px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    }
    .housingList .import_desc {
    overflow: hidden;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    text-align: left;
    }
    .housingListBoxCardnamepcontent .housingListBoxCardcon {
    width: 600px;
    overflow: hidden;
    display: inline-block;
    height: 22px;
    line-height: 22px;
    vertical-align: middle;
    margin-top: -4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    }
    .housingList .el-select .el-select__tags>span{
    display: contents;
    }
    </style>
