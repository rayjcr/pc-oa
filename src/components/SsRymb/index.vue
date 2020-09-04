<template>
  <div>
    <el-select
      style="width: 100%;margin-bottom: 5px;"
      size="medium"
      v-model="checkUser"
      filterable
      placeholder="搜索" multiple
      clearable @change="handleChangeSel">
      <el-option
        v-for="item in teacherList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    <!--  <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
    </el-select>
    <el-row :gutter="12">
      <el-col :span="14">
        <el-card shadow="never">
        <el-tree
          class="filter-tree"
          :data="data2"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleCheckClick"
          @check-change="handleCheckChange"
          ref="tree2">
        </el-tree>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <div>
            <template>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in departmentmember" :label="city" :key="city.id">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
       <!--  <el-checkbox-group v-model="checkUser" size="small">
              <el-checkbox
                v-for="(student,index) in departmentmember"
                :key="student.id"
                :label="student.id"
                @change="handleCheckedCitiesChange"
                border>{{student.name}}
              </el-checkbox>
            </el-checkbox-group>-->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { fetchTree, getUsers, Searchmember, Getallteacher } from 'api/admin/group/index'
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    created() {
      console.log(this.xxdm)
      this.getdepartmentlist();
      this.cxbmsj();
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 获取部门列表
      getdepartmentlist() {
        const xxdm = window.localStorage.getItem('xxdm');
        const QueryIt2 = { xxdm, groupType: '2' };
        fetchTree(QueryIt2).then(data => {
          this.data2 = data;
        });
      },
      // 获取部门+部门下的成员 -----角色
      cxbmsj() {
        const xxdm = window.localStorage.getItem('xxdm');
        const params = { page: 1, limit: 2000, type: 3, xxdm }
        Getallteacher(params).then(json => {
          this.teacherList = json.data.rows;
        })
        /* fetchTree(QueryIt2).then(data => {
           this.bmsj = data;
         });
         fetchTree(QueryIt1).then(data => {
           this.jssj = data;
           this.searchjssj = data;
         });*/
      },
      // 获取部门成员
      getdapartmentmember(id) {
        getUsers(id).then(response => {
          if (response.status === 200) {
            response.data.members.forEach(el => {
              this.$set(el, 'IsSelect', false)
            });
            response.data.leaders.forEach(el => {
              this.$set(el, 'IsSelect', false)
            });
            this.departmentmember = response.data.members
            this.departmentleader = response.data.leaders
          }
        })
      },
      handleCheckChange(data, checked) {  /** @树形插件勾选触发事件方法**/
        if (checked) {

        }
      },
      handleCheckClick(data, node, e) {
        this.getdapartmentmember(data.id);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      isSelected() {

      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.departmentmember : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length;
        this.checkAll = checkedCount === this.departmentmember.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.departmentmember.length;
        const $this = this;
        this.departmentmember.forEach(e => {
          if ($this.checkedCities.includes(e)) {
            if ($this.checkUser.includes(e.id)) {
              $this.checkUser.push(e.id);
            }
          } else {
            $this.checkUser.splice(this.checkUser.indexOf(e.id),1);
          }
        })
      },
      handleChangeSel() {
        if (this.checkUser.length > 0) {
          const $this = this;
          this.checkUser.forEach(e => { // 遍历已选人员
            $this.departmentmember.forEach((j, i) => {
              if (e === j.id && !$this.checkedCities.includes(j)) {
                $this.checkedCities.push(j);
              }
              if (!$this.checkUser.includes(j.id)) {
                $this.checkedCities.splice(i, 1); // 取消选中不存在的人员
              }
            })
          })
        } else {
          this.checkedCities = [];
        }
        // 是否全选
        const checkedCount = this.checkedCities.length;
        this.checkAll = checkedCount === this.departmentmember.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.departmentmember.length;
      }
    },
    data() {
      return {
        checkedCities: [],
        checkAll: false,
        isIndeterminate: false,
        activeName: 'second',
        teacherList: [],
        bmmc: '',
        checkUser: [],
        departmentmember: [], // 部门成员暂存
        departmentleader: [], // 部门领导暂存
        dapartmentlist: [],
        filterText: '',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  };
</script>
<style scoped>
  .el-checkbox+.el-checkbox {
     margin-left: 0px;
  }
</style>
