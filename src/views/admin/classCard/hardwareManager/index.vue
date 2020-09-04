<template>
    <div class="app-container">
        <div class="u_TableMain">
            <!-- <div class="filter-container innerTab">
                <el-button icon="el-icon-plus" type="primary" @click="addCollect"></el-button>
            </div> -->
            <div class="m_GenTableBox">
                <el-table :data="dataList">
                    <el-table-column label="设备码" width="150" prop="xxdm"></el-table-column>
                    <el-table-column label="学校" prop="xxmc"></el-table-column>
                    <el-table-column label="厂家" width="150"  align="center"></el-table-column>
                    <el-table-column label="版本号" width="200"  align="center"></el-table-column>
                    <el-table-column label="一键重启" width="200" align="center"></el-table-column>
                </el-table>
                <el-pagination class="pagination" background layout="prev, pager, next" :total="ItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="pageChange"></el-pagination>

            </div>

        </div>
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
            dataList:[],
            ItemSum:0,
            curPage:1,                                      //当前页码
            pageLimit:20,                                   //每页限制记录条数                   
        }
    },
    mounted(){
       this.init();
    },
    methods: {
        init(){
        },
        async getHardwareList(){
            
        },
        pageChange(curpage){
            this.curPage = curpage;
            this.getHardwareList();
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

</style>
