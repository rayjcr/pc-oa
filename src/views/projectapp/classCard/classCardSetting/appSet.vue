<template>
    <div class="app-container">
        <div class="u_TableMain">
            <div class="m_GenTableBox">
                <div class="genTableTit">常用应用</div>
                <div class="commonApp">
                </div>
                <div class="genTableTips">提示：常用应用最多选择6个，选择后班牌客户端-应用中心可见 </div>

                <el-table border fit highlight-current-row style="width: 100%;margin-top:10px;">
                    <el-table-column align="center" label="类别">
                        <template slot-scope="scope">
                        <span></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用名称">
                        <template slot-scope="scope">
                        <span></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应用别称">
                        <template slot-scope="scope">
                        <span></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否为常用应用">
                        <template slot-scope="scope">
                        <span></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150">
                        <template slot-scope="scope">
                        <el-button size="small" type="success">编辑</el-button>
                        <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
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
            // inspireCardSchool:['754','1657','1658','708','1544','90035'],                      //激励卡学校列表
        }
    },
    mounted(){

    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.genTableTit{
    font-size: 20px;
}
.genTableTips{
    font-size: 16px;
    color: #999;
    margin-top: 10px;
}
.commonApp{
    width: 100%;
    height: 100px;
    margin-top: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
}

</style>
