<template>
    <div class="app-container">
        <div class="u_TableMain">
            <div class="filter-container innerTab">
                <el-button icon="el-icon-plus" type="primary">新增应用</el-button>
            </div>
            <div class="m_GenTableBox">
                    <el-table :data="dataList">
                        <el-table-column label="应用名称" width="150" prop="xxdm"></el-table-column>
                        <el-table-column label="类型" width="100"  align="center"></el-table-column>
                        <el-table-column label="数量" width="100" prop="xxmc"></el-table-column>
                        <el-table-column label="分配学校" prop="xxmc"></el-table-column>
                        <el-table-column label="H5地址" prop="xxmc"></el-table-column>
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :total="ItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="pageChange"></el-pagination>


            </div>

        </div>

    </div>
</template>

<script>
import _ from 'lodash';
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
       
    },
    methods: {
        pageChange(){
        },
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
// .u_TableMain{
//     // padding: 10px 30px;
// }

</style>
