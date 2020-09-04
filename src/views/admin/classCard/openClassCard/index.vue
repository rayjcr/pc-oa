<template>
    <div class="app-container">
        <div class="u_TableMain">
            <!-- <div class="filter-container innerTab">
                <el-button icon="el-icon-plus" type="primary" @click="addCollect"></el-button>
            </div> -->
            <div class="m_GenTableBox">
                <el-table :data="schoolList">
                    <el-table-column label="学校编号" width="150" prop="xxdm"></el-table-column>
                    <el-table-column label="学校名称" prop="xxmc"></el-table-column>
                    <el-table-column label="是否开通" width="150"  align="center">
                        <template slot-scope="scope">
                            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="推送方式" width="200"  align="center">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.method"  size="small" placeholder="选择方式">
                                <el-option v-for="item in pushedList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="防火墙开关" width="200" align="center">
                        <template slot-scope="scope">
                            <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                            <span class="setWhiteList" @click="setWhiteList(scope)">白名单设置</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination" background layout="prev, pager, next" :total="ItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="pageChange"></el-pagination>

            </div>
        </div>

        <el-dialog title="白名单设置" :visible.sync="isShowWhiteList" width="400px">
            <div>
                <el-form ref="form" label-width="80px">
                    <ul class="whiteList">
                        <li>
                            <span>192.168.0.1</span>
                            <span class="del">
                                <el-button size="mini" circle type="primary" icon="el-icon-delete"></el-button>
                            </span>
                        </li>
                        <li>
                            <span>192.168.0.1</span>
                            <span class="del">
                                <el-button size="mini" circle type="primary" icon="el-icon-delete"></el-button>
                            </span>
                        </li>
                        <li>
                            <span>192.168.0.1</span>
                            <span class="del">
                                <el-button size="mini" circle type="primary" icon="el-icon-delete"></el-button>
                            </span>
                        </li>
                    </ul>
                    <div class="addWhiteList">
                        <el-input size="mini" style="width:200px;"></el-input> <el-button type="primary" size="mini">新增</el-button>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowWhiteList = false">关闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash';
import * as schoolApi from '@/api/admin/school/index'
export default {
    name: "setReport",
    components: {
    },
    data() {
        return {
            schoolList:[],
            ItemSum:0,
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制记录条数
            pushedList:[                                    //推送方式列表
                {
                    value:"公众号",
                    label:"公众号"
                },{
                    value:"短信",
                    label:"短信"
                }
            ],
            isShowWhiteList:false,                        
        }
    },
    mounted(){
       this.init();
    },
    methods: {
        init(){
            this.getSchoolList();
        },
        /**
         * 获取学校列表
         * by:RayJ
         * time:2019-10-21
         */
        async getSchoolList(){
            var param = {};
            param.query = {};
            param.query.page = this.curPage;
            param.query.limit = this.pageLimit;
            var res = await schoolApi.getPageSchool(param);
            console.log(res);
            this.schoolList = res.data.rows;
            this.ItemSum = res.data.total
            // console.log(res,666);
        },
        /**
         * 翻页
         * by:RayJ
         * time:2019-10-21
         */
        pageChange(curpage){
            this.curPage = curpage;
            this.getSchoolList();
        },
        /**
         * 打开白名单设置弹层
         * by:RayJ
         * time:2019-10-21
         */
        setWhiteList(scope){
            this.isShowWhiteList = true;
        },
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
// .u_TableMain{
//     padding: 10px 30px;
// }
.setWhiteList{
    padding-left: 10px;
    color: #1387f4;
    cursor: pointer;
}
.setWhiteList:hover{
    color: #ffcc41;
}
.whiteList{
    width: 100%;
    padding: 10px;
    float: left;
    li{
        width: 100%;
        padding: 5px;
        height: 40px;
        line-height: 30px;
        float: left;
        border-radius: 4px;
        overflow: hidden;
        .del{
            float: right;
            display: none;
        }
    }
    li:hover{
        background: #f2f2f2;
        .del{
            display: block;
        }
    }
}
</style>
