<!--排课系统首页-->
<template>
<section>
    <div class="app-container" style="padding: 20px">
        <div class="u_TableMain columns ofhide">
            <div class="filter-container innerTab">
                <el-form :inline="true" :model="searchFrom" class="demo-form-inline">
                    <el-form-item label="状态">
                    <el-select v-model="searchFrom.status" placeholder="请选择" clearable>
                        <el-option
                        v-for="(item,index) in options"
                        :key="(index+1)"
                        :label="item"
                        :value="index">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item>
                    <el-input maxlength="10" v-model="searchFrom.name" placeholder="输入名称关键词" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="m_GenTableBox">
                <!--列表-->
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    align="center"
                    type="index"
                    width="50">
                    <template slot-scope="scope">
                        <span>{{(searchFrom.page - 1) * searchFrom.limit + scope.$index + 1}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="createTime"
                    label="创建日期"
                    width="250">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        {{scope.row.createTime}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="name"
                    label="配料名称"
                    width="320">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="status"
                    label="状态"
                    width="250">
                    <template slot-scope="scope">
                        <el-tag
                        :type="scope.row.status === 0 ? 'success' : 'danger'">{{options[scope.row.status]}}
                        </el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                      <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                      <el-button size="mini" :icon="scope.row.status === 0 ? 'el-icon-document-delete' : 'el-icon-document-checked'" type="primary" @click="handleState(scope.row)">
                        {{scope.row.status === 0 ? '禁用' : '启用'}}
                      </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page.sync="searchFrom.page" :page-sizes="[5,10,15,20,25]"
                                :page-size="searchFrom.limit"
                                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    <!--新增界面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="490px" @close="colseDialog">
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="90px" class="demo-ruleForm">
        <el-form-item label="配料名称" prop="name">
            <el-input v-model.trim="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
            <el-radio v-model="temp.status" label="0">是</el-radio>
            <el-radio v-model="temp.status" label="1">否</el-radio>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="colseDialog">取消</el-button>
        <!--修改-->
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">确认</el-button>
        <!--保存-->
        <el-button v-else type="primary" @click="saveData">确认</el-button>
        </div>
    </el-dialog>
    </div>
</section>
</template>

<script>
import * as api from '@/api/order/foodIngredients/index'

export default {
    data() {
    /** 验证名称不能重复**/
    const validaName = (rule, value, callback) => {
        if (!api.checkSpecificKey(value)) {
        callback(new Error('不能包含特殊字符'));
        } else {
        if (this.dialogStatus === 'update' && value === this.tempName) {
            callback();
        } else {
            api.getValidaName({ name: value }).then(res => {
            if (res.data) {
                callback(new Error('菜品配料名称不能重复'));
            } else {
                callback();
            }
            })
        }
        }
    };
    return {
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        options: ['启用', '禁用'],
        searchFrom: {
        /** 保存的form表单数据**/
        name: '',
        status: '',
        page: 1,
        limit: 10
        },
        dialogStatus: '',
        temp: {
        /** 保存的form表单数据**/
        id: undefined,
        name: '',
        status: '0'
        },
        textMap: {
        update: '修改配料',
        create: '新增配料'
        },
        tableData: [],
        total: 0,
        rules: {
        /** 表单验证规则**/
        name: [
            { required: true, message: '请输入名称', trigger: 'change' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' },
            { validator: validaName, trigger: 'change' }]
        },
        tempName: ''
    }
    },
    created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.getList();
    },
    methods: {
    search() {
        this.searchFrom.page = 1;
        this.getList();
    },
    getList() {
        api.getPageList(this.searchFrom).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.rows;
        this.loading = false;
        });
    },
    resetTemp() {
        this.temp = {
        /** 保存的form表单数据**/
        id: undefined,
        name: '',
        status: '0'
        }
    },
    handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
        })
    },
    saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
        if (valid) {
            const tempData = Object.assign({}, this.temp);
            api.getAdd(tempData).then(() => {
            this.dialogForm = false;
            this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
            this.searchFrom.page = 1;
            this.getList();
            })
        }
        })
    },
    handleEdit(row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.temp.id = tempData.id;
        this.temp.name = tempData.name;
        this.temp.status = tempData.status.toString();
        this.tempName = tempData.name;
        this.dialogForm = true;
        this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
        })
    },
    updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
        if (valid) {
            const tempData = Object.assign({}, this.temp);
            api.getUpdate(tempData).then(() => {
            this.dialogForm = false;
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
            this.getList();
            })
        }
        })
    },
    handleDelete(id) {
        debugger
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
        api.getDelete(id).then(result => {
            if (result.status != 200) {
            this.$notify({ title: '失败', message: result.message, type: 'warning', duration: 2000 });
            } else {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            }
            this.getList();
        });
        });
    },
    colseDialog() {
        this.dialogForm = false;
    },
    handleSizeChange(val) {
        /** 跳转到某页**/
        this.searchFrom.limit = val;
        this.getList();
    },
    handleCurrentChange(val) {
        /** 跳转到某页**/
        this.searchFrom.page = val;
        this.getList();
    },
    handleState(e) {
        const data = { id: e.id };
        let messge = '';
        /** 启用**/
        if (e.status === 0) {
        data.status = 1;
        messge = '确认要禁用吗？';
        } else {
        data.status = 0;
        messge = '确认要启用吗？';
        }
        this.$confirm(messge, '提示', { type: 'warning' }).then(() => {
        const tempData = Object.assign({}, data);
        api.getUpdate(tempData).then(() => {
            this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
            this.getList();
        });
        });
    }

    }
}

</script>
<!--此处代码请不要加scoped否则没有样式-->
<style scoped>

</style>


