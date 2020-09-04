<template>
    <div class="app-container">
        <div class="u_TableMain">
            <!-- <div class="filter-container innerTab">
                <el-button icon="el-icon-plus" type="primary" @click="addCollect"></el-button>
            </div> -->
            <div class="m_GenTableBox">
                <div class="minTableBox">
                    <el-table :data="dataList">
                        <el-table-column label="版本号" width="150" prop="xxdm"></el-table-column>
                        <el-table-column label="更新时间" width="150" prop="xxmc"></el-table-column>
                        <el-table-column label="使用范围" width="150"  align="center"></el-table-column>
                    </el-table>
                    <el-pagination class="pagination" background layout="prev, pager, next" :total="ItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="pageChange"></el-pagination>
                </div>

                <el-table :data="dataListArea" class="dataListArea">
                    <el-table-column label="学校名称" width="150" prop="xxdm"></el-table-column>
                    <el-table-column label="使用地点" prop="xxmc"></el-table-column>
                    <el-table-column label="操作" width="150" align="center"></el-table-column>
                </el-table>



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
            dataListArea:[],
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
.setWhiteList{
    padding-left: 10px;
    color: #1387f4;
}
.minTableBox{
    width: 450px;
    float: left;
    margin-right: 25px;
}

.dataListArea{
    width: auto;
}


</style>
