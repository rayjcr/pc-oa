<!--菜品统计-->
<template>
<section>
    <div class="app-container" style="padding: 20px">
        <div class="u_TableMain columns ofhide">
            <div class="filter-container innerTab">
                <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
                    <!--<el-form-item>
                    <el-input v-model="searchFrom.name" placeholder="输入名称关键词" clearable></el-input>
                    </el-form-item>-->
                    <el-form-item label="日期">
                    <el-date-picker
                        v-model="value7"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" maxlength="10" icon="el-icon-search" @click="search">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="handleDownload" :loading="downloadLoading" icon="el-icon-download" class="handle-del mr10">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="m_GenTableBox">
                <!--列表-->
                <el-table
                    v-loading="loading"
                    :header-cell-style="tableHeaderColor"
                    :data="tableData.slice((searchFrom.pageNum - 1) * searchFrom.limit, searchFrom.pageNum * searchFrom.limit)"
                    border
                    style="width: 100%">
                    <el-table-column
                    align="center"
                    type="index"
                    width="60">
                    <template slot-scope="scope">
                        <span>{{(searchFrom.pageNum - 1) * searchFrom.limit + scope.$index + 1}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="name"
                    label="配料名称"
                    width="400">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="count"
                    label="数量">
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination  class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page.sync="searchFrom.pageNum" :page-sizes="[5,10,15,20,25]"
                                :page-size="searchFrom.limit"
                                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import * as api from '@/api/order/foodReport/index'
export default {
    data() {
    return {
        loading: false,
        downloadLoading: false,
        searchFrom: {
        /** 保存的form表单数据**/
        name: '',
        startDate: '',
        endDate: '',
        pageNum: 1,
        limit: 10
        },
        tableData: [],
        total: 0,
        pickerOptions2: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
            }
        }]
        },
        value7: ''
    }
    },
    created() {
    this.getList();
    },
    methods: {
    search() {
        this.searchFrom.pageNum = 1;
        if (this.value7 && this.value7.length > 0) {
        this.searchFrom.startDate = this.value7[0]
        this.searchFrom.endDate = this.value7[1]
        } else {
        this.searchFrom.startDate = ''
        this.searchFrom.endDate = ''
        }
        this.getList();
    },
    getList() {
        this.loading = true
        api.getIngredientsPageCountList(this.searchFrom).then(res => {
        this.total = res.value.totalCount;
        this.tableData = res.value.dataList;
        this.loading = false;
        });
    },
    handleSizeChange(val) {
        /** 跳转到某页**/
        this.searchFrom.limit = val;
        this.getList();
    },
    handleCurrentChange(val) {
        /** 跳转到某页**/
        this.searchFrom.pageNum = val;
        this.getList();
    },
    handleDownload() {
    /** 下载excel**/
        this.downloadLoading = true;
        import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['配料名称', '数量']
        const filterVal = ['name', 'count']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, '菜品配料统计表格')
        this.downloadLoading = false;
        })
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        return 'background: #fafafa;color: rgba(0, 0, 0, 0.85);border-bottom: 1px solid #e8e8e8;font-weight: 500;'
    }

    }
}

</script>
<!--此处代码请不要加scoped否则没有样式-->
<style scoped>
</style>


