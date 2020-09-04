<template>
    <div class="app-container">
        <div class="u_TableMain">
            <div class="filter-container">
                <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select" style="width: 400px;">
                    <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="场地名称" value="cdmc"></el-option>
                    <el-option label="场地简称" value="cdjc"></el-option>
                    <el-option label="场地地址" value="cddz"></el-option>
                    <el-option label="场地用途" value="cdyt"></el-option>
                    <el-option label="可容纳人数" value="ksrns"></el-option>
                    </el-select>
                </el-input>
                <el-button class="filter-item" type="primary" style="margin-left: 5px;" v-waves icon="search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" style="margin-left: 5px;" @click="handleCreate" type="primary" icon="edit">导入</el-button>
            </div>
            <div class="m_GenTableBox">
                <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序列号">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="关联校区">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="关联场地">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="班牌名称">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="班牌类型">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="班牌状态">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="网络状态">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column>
                    
                    <el-table-column align="center" label="操作" width="150">
                        <template slot-scope="scope">
                        <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
        const yzcdmc = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('场地名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
            callback(new Error('请输入场地名称'));
        } else {
            callback();
        }
        };
        const yzcdjc = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('场地简称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
            callback(new Error('请输入场地简称'));
        } else {
            callback();
        }
        };
        return {
           xxdm: '',
            listLoading: false, // 加载
            listQuery: {
                page: 1,
                limit: 20,
                name: undefined
            },
            searchsel: 'all', // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

            tableKey: 0, // 表格
            list: null,
            total: null,
            purpose: [], // 场地用途
            formsel_jcdyt: [],

            dialogFormVisible: false, // 弹层是否显示
            dialogStatus: '',
            textMap: {
                // 判断弹层是添加还是编辑
                update: '编辑',
                create: '创建'
            },
            tabPosition: 'left',
            form: {}, // 表单

            changeSure: false, // 防止重复提交
            rules: {
                cdmc: [
                { required: true, validator: yzcdmc, trigger: 'blur' }
                ],
                cdjc: [
                { required: true, validator: yzcdjc, trigger: 'blur' }
                ]
            } 
        }
    },
    mounted(){
       
    },
    methods: {
        getList() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        page(this.listQuery).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
        });
        },
        fuzzyQuery() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        fuzzyQuery(this.listQuery).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
        });
        },
        // 搜索
        handleFilter() {
        if (this.searchsel === 'all') {
            this.listQuery = { page: 1, limit: 20, cdmc: this.listQuery[this.searchsel], cdjc: this.listQuery[this.searchsel],
            cddz: this.listQuery[this.searchsel], cdyt: this.listQuery[this.searchsel], ksrns: this.listQuery[this.searchsel] };
            this.fuzzyQuery();
            return;
        }
        this.getList();
        },
        searchChange() {
        this.listQuery = {
            page: 1,
            limit: 20,
            xxdm: this.xxdm,
            name: undefined
        };
        },
        // 分页
        handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
        },
        handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
        },
        // 添加
        handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        },
        resetTemp() {
        this.form = {};
        this.formsel_jcdyt = [];
        this.changeSure = false;
        },
        // 编辑
        handleUpdate(row) {
        this.changeSure = false;
        getObj(row.uuid).then(response => {
            this.form = response.data;
            this.judgecdty(this.form.cdyt);
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
        });
        },
        // 删除
        handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
            delObj(row.uuid).then(() => {
                this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
            });
            })
            .catch(e => {
            console.log(e);
            });
        },
        // 取消按钮
        cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
        },
        // 添加页面
        create(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
            this.changeSure = true;
            this.form.cdyt = '';
            this.form.xxdm = this.xxdm;
            if (this.formsel_jcdyt.length > 0) { this.form.cdyt = this.formsel_jcdyt.join(); }
            this.form.xxdm = window.localStorage.getItem('xxdm');
            addObj(this.form).then(res => {
                if (res.status === 200) {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                });
                } else {
                this.$notify({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                });
                }
            });

            const that = this;
            setTimeout(() => {
                that.changeSure = false;
            }, 1500);
            } else {
            this.$notify({
                title: '失败',
                message: '还有未填项',
                type: 'error',
                duration: 2000
            });
            return false;
            }
        });
        },
        // 编辑页面
        update(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
            this.changeSure = true;
            this.dialogFormVisible = false;
            this.form.cdyt = '';
            if (this.formsel_jcdyt.length > 0) { this.form.cdyt = this.formsel_jcdyt.join(); }
            putObj(this.form.uuid, this.form).then(res => {
                if (res.status === 200) {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                });
                } else {
                this.$notify({
                    title: '失败',
                    message: res.message,
                    type: 'error',
                    duration: 2000
                });
                }
            });
            const that = this;
            setTimeout(() => {
                that.changeSure = false;
            }, 1500);
            } else {
            this.$notify({
                title: '失败',
                message: '还有未填项',
                type: 'error',
                duration: 2000
            });
            return false;
            }
        });
        },
        // 场地用途
        judgecdty(val) {
        if (val) {
            const str = val.split(',');
            this.formsel_jcdyt = str;
        }
        return this.formsel_jcdyt;
        }
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.filter-container .filter-item {
  vertical-align: inherit;
}
.el-input-group__append,
.input-with-select /deep/ .el-input-group__prepend {
  padding: 0;
}
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.el-checkbox {
  margin-right: 30px;
}

.line {
  text-align: center;
}
</style>
