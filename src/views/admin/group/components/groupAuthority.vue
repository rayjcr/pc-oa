<template>
  <div class="groupAuthority">
    <el-row>
        <div style="width:200px;">
          <el-input class="groupAuthorityelinput" placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
        </div>
    </el-row>
    <el-row>
      <el-col :span="12" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-menu :default-active="defaultVal"
                   ref="elmenugroupauth"
                   background-color="#ffffff"
                   text-color="#303133"
                   class="el-menu-vertical-demo"
                   @select="handleEvent">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">PC端权限设置</span>
            </el-menu-item>
            <!-- <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">钉钉端权限设置</span>
            </el-menu-item> -->
            <el-menu-item index="3">
              <i class="el-icon-menu"></i>
              <span slot="title">微信/钉钉端权限设置</span>
            </el-menu-item>
            <el-menu-item index="4">
            <i class="el-icon-menu"></i>
            <span slot="title">数据权限分配</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-menu"></i>
              <span slot="title">第三方权限设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="12" style='margin-top:15px;'>
        <div style="height:500px; overflow:auto" v-if="keyType==3">
            <div class="filterTit"><b>智慧校园应用列表</b></div>
            <el-tree class="filter-tree"
                  :data="oaData"
                  show-checkbox node-key="id" accordion
                  highlight-current ref="oaTree"
                  @node-click="setNodeData">
            </el-tree>
            <div class="filterTit"><b>校讯通应用列表</b></div>
            <el-tree class="filter-tree"
                  :data="xxtData"
                  show-checkbox node-key="id" accordion
                  highlight-current ref="xxtTree"
                  @node-click="setNodeData">
            </el-tree>
        </div>
        <div style="height:500px; overflow:auto" v-show="keyType!=3">
          <el-tree class="filter-tree" style="height:500px; overflow:auto"
                  :data="treeData"
                  show-checkbox node-key="id" accordion
                  highlight-current
                  :props="defaultProps" :filter-node-method="filterNode" ref="menuTree"
                  @node-click="getNodeData"
                  :default-expanded-keys='[]'>
          </el-tree>
        </div>
      </el-col>
      <!-- <el-col :span="16" style='margin-top:15px;'>
          <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" style="width: 100%">
            <el-table-column v-if="groupManager_element" type="selection" width="55"> </el-table-column>
            <el-table-column width="200px" align="center" label="资源编码">
                <template slot-scope="scope">
                    <span>{{scope.row.code}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源类型">
                <template slot-scope="scope">
                    <span>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源地址">
                <template slot-scope="scope">
                    <span>{{scope.row.uri}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="资源请求类型">
                <template slot-scope="scope">
                    <span>{{scope.row.method}}</span>
                </template>
            </el-table-column>
          </el-table>
      </el-col> -->
    </el-row>
    <el-row>
      <el-button style="float:right;margin-right:50px;margin-top:20px;" type="primary" v-if="groupManager_menu"
                 @click="isHidden">取消
      </el-button>
      <el-button style="float:right;margin-right:50px;margin-top:20px;" type="primary" v-if="groupManager_menu"
                 @click="update">保存
      </el-button>
    </el-row>

  </div>
</template>
<script>
  import { fetchTree, fetchddTree, fetchwxTree,fetchxxtTree } from 'api/admin/menu/index';
  import { page } from 'api/admin/element/index';
  import {
    removeElementAuthority,
    addElementAuthority,
    getElementAuthority,
    modifyMenuAuthority,
    modifyMenuAuthority2,
    modifyWXMenuAuthority,
    getMobileWXMenuAuthority,
    modifySJMenuAuthority,
    getMobileDDMenuAuthority,
    getMobileSJMenuAuthority,
    modifyDDMenuAuthority,
    getMenuAuthority,
    modifyUpdateMenuAuthority,
    getMobileXxtMenuAuthority,
    saveMobileXxtMenuAuthority
  } from 'api/admin/group/index';
  import {
    getdqxn
  } from 'api/admin/grade/index';
  import {
    getBjTree
  } from 'api/admin/student/index';

  import { mapGetters } from 'vuex';

  export default {
    name: 'groupAuthority',
    props: {
      groupId: {
        default: '1'
      },
      xxdm: {},
      userid: {},
      dialogAuthorityVisible: false
    },
    data() {
      return {
        temArr: [], // 请求传参
        isHandle: '',
        dqxnoptions: '',
        defaultVal: '1',
        filterText: '',
        list: null,
        total: null,
        listQuery: {
          name: undefined,
          userid: this.userid
        },
        treeData: [],
        xxtData:[],
        oaData:[],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        groupManager_menu: true,
        groupManager_element: true,
        keyType:0,
        wxAuthorList:[],
        xxtAuthorList:[],
      };
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      },
      dialogAuthorityVisible(val) {
        this.$nextTick(() => {
          this.$refs.elmenugroupauth.activeIndex = this.isHandle = '1';
          this.keyType = 0,
          console.log("这里是初始化？")
          this.getList();
        })
      }
    },
    computed: {},
    mounted() {
      this.isHandle = '1';
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters(['elements'])
    },
    methods: {
      isHidden() {
        this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
      },
      getCurrentXN(temArr) {
        getdqxn({ xxdm: this.xxdm }).then(res => {
          this.dqxnoptions = res.data.xn;
          temArr.forEach((item, index) => {
            item.xndm = this.dqxnoptions
          })
          this.temArr = temArr
          modifySJMenuAuthority(this.temArr).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        });
      },
      // menuEvent
      handleEvent(index, keyPath) {
        this.keyType = 0;
        if (index == 1) {
          this.isHandle = '1'
          this.getList();
        } else if (index == 2) {
          this.isHandle = '2'
          this.treeData = []
          fetchddTree({ id: this.userid }).then(data => {
            this.treeData = data;
            this.initMobileDDAuthoritys()
          });
        } else if (index == 3) {
          this.keyType = 3;
          this.isHandle = '3'
          this.treeData = []
          // fetchwxTree({ id: this.userid }).then(data => {
          //   this.treeData = data;
          //   console.log("this.treeDate",this.treeData);
          //   // this.initMobileWXAuthoritys()
          // });
          this.getWxDdXxtTree();

        } else if (index == 4) {
          this.isHandle = '4'
          this.treeData = []
          getBjTree(this.xxdm)
            .then(response => {
              this.treeData = this.handleTree(response, 1)
              this.initMobileSJAuthoritys()
            })
        } else if (index == 5) {
          this.isHandle = '5'
          this.treeData = []
          fetchTree({ title: '成绩单查询', userid: this.userid }).then(data => {
            this.treeData = data;
            this.initAuthoritys();
          });
        }
      },
      handleTree(arr, fl) {
        arr.forEach(item => {
          if (fl) {
            delete item.id;
            item.id = item.bjdm;
            if (item.hasOwnProperty('name')) {
              item.title = item.name;
              item.label = item.name;
            }
          } else {
            if (item.hasOwnProperty('name')) {
              item.title = item.name;
            }
          }
          if (item.hasOwnProperty('children')) {
            this.handleTree(item.children, fl)
          }
        })
        return arr;
      },
      getList() {
        fetchTree(this.listQuery).then(data => {
          this.treeData = data;
          this.initAuthoritys();
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        this.listQuery.menuId = data.id;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          getElementAuthority(this.groupId).then(data => {
            const obj = {};
            for (let i = 0; i < this.list.length; i++) {
              obj[this.list[i].id] = this.list[i];
            }
            const toggle = {};
            if (data.data !== undefined) {
              for (let i = 0; i < data.data.length; i++) {
                const id = data.data[i];
                if (obj[id] !== undefined && toggle[id] === undefined) {
                  this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
                  toggle[id] = true;
                }
              }
            }
          });
        });
        this.currentId = data.id;
        this.showElement = true;
      },
      setNodeData(data){
        
        // console.log(this.wxAuthorList,"this.wxAuthorList");
        // console.log(this.xxtAuthorList,"this.xxtAuthorList");
        if(_.find(this.wxAuthorList,{id:data.id})){
            data.icon = _.find(this.wxAuthorList,{id:data.id}).icon
        }
        if(_.find(this.xxtAuthorList,{id:data.id})){
            data.icon = _.find(this.xxtAuthorList,{id:data.id}).icon
        }
        console.log(data,"data");
        window.sessionStorage.setItem('nodeData',JSON.stringify(data));
        this.$emit('openSetAppLayer');
        // console.log('setNodeData_304',data)
      },
      getTreeNodeKey(node) {
        return node.id;
      },
      handleSelectionChange(val, row) {
        let flag = true;
        for (let i = 0; i < val.length; i++) {
          if (val[i].id === row.id) {
            addElementAuthority(this.groupId, {
              menuId: this.currentId,
              elementId: row.id
            });
            flag = false;
            break;
          }
        }
        if (flag) {
          removeElementAuthority(this.groupId, {
            menuId: this.currentId,
            elementId: row.id
          });
        }
      },

      async update() {
        const self = this;
        const nodes = this.$refs.menuTree.getCheckedNodes();
        const ids = [];
        for (let i = 0; i < nodes.length; i++) {
          ids.push(nodes[i].id);
        }
        var param = {}
        param.id = this.groupId
        param.menuTrees = ids
        param.schoolCode = this.xxdm

        if (this.isHandle == 1) {
          var res = await modifyMenuAuthority2(param);
          console.log(res);
          if(res.status==200){
              this.$notify({title: '成功',message: '保存成功',type: 'success',duration: 2000});
          }else{
              this.$notify({title: '提示',message: '保存失败',type: 'warning',duration: 2000});
          }
          // modifyMenuAuthority(this.groupId, {
          //   menuTrees: ids.join(),
          //   xxdm: this.xxdm
          // }).then(() => {
          //   this.$notify({
          //     title: '成功',
          //     message: '保存成功',
          //     type: 'success',
          //     duration: 2000
          //   });
          //   this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          // });
        } else if (this.isHandle == 2) {
          modifyDDMenuAuthority(this.groupId, {
            menuTrees: ids.join(),
            xxdm: this.xxdm
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        } else if (this.isHandle == 3) {
          this.saveWxXxtAuthority();

          // modifyWXMenuAuthority(this.groupId, {
          //   menuTrees: ids.join(),
          //   xxdm: this.xxdm
          // }).then(() => {
          //   this.$notify({
          //     title: '成功',
          //     message: '保存成功',
          //     type: 'success',
          //     duration: 2000
          //   });
          //   this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          // });
        } else if (this.isHandle == 4) {
          const temArr = [];
          ids.forEach((item, index) => {
            const obj = {};
            obj.bjid = item;
            obj.jsid = this.groupId;
            obj.xxdm = this.xxdm
            if (item != undefined) {
              temArr.push(obj)
            }
          });
          this.getCurrentXN(temArr)
        } else if (this.isHandle == 5) {
          const a = [];
          for (const e of this.treeData) {
            a.push(e.id);
          }
          const b = this.$refs.menuTree.getCheckedKeys();
          modifyUpdateMenuAuthority(this.groupId, {
            menuTrees: a,
            checkedTrees: b,
            xxdm: this.xxdm
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()
          });
        }
      },
      initAuthoritys() {
        getMenuAuthority(this.groupId).then(data => {
          const result = [];
          for (let i = 0; i < data.data.length; i++) {
            result.push(data.data[i].id);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      initMobileWXAuthoritys() {
        getMobileWXMenuAuthority(this.groupId).then(data => {
          const result = [];
          for (let i = 0; i < data.data.length; i++) {
            result.push(data.data[i].id);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      initMobileSJAuthoritys() {
        getMobileSJMenuAuthority(this.groupId).then(data => {
          const result = [];
          const tempArr = data
          for (let i = 0; i < tempArr.length; i++) {
            result.push(tempArr[i].bjid);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      initMobileDDAuthoritys() {
        getMobileDDMenuAuthority(this.groupId).then(data => {
          const result = [];
          for (let i = 0; i < data.data.length; i++) {
            result.push(data.data[i].id);
          }
          this.$refs.menuTree.setCheckedKeys(result);
        });
      },

      async getWxDdXxtTree(){
        // var treeTemp = [];
        this.oaData = [];
        // var res = await fetchddTree({id: this.userid});
        var res = await fetchwxTree();
        res.forEach(tem => {
            tem.isxxt = false;
        })
        this.oaData.push(...res);
        // res = await fetchwxTree();
        // this.oaData.push(...res);
        res = await fetchxxtTree();
        res.forEach(tem => {
            tem.isxxt = true;
        })
        this.xxtData = res

        this.getAuthorWxDdXxtTree();
        // console.log("res",res);
        // console.log("this.treeData",this.oaData);
      },
      async getAuthorWxDdXxtTree(){
        var result = [];
        var checkRes = [];
        var xxtResult = [];
        var xxtCheckRes = [];
        var res = await getMobileWXMenuAuthority(this.groupId);
        this.wxAuthorList = res.data
        result.push(...res.data);
        // res = await getMobileWXMenuAuthority(this.groupId);
        // result.push(...res);

        res = await getMobileXxtMenuAuthority(this.groupId,this.xxdm);
        this.xxtAuthorList = res.data
        xxtResult.push(...res.data);

        console.log("result",result)
        console.log("xxtResult",xxtResult)

        for(let i=0;i<result.length;i++){
          checkRes.push(result[i].id);
        }

        for(let i=0;i<xxtResult.length;i++){
          xxtCheckRes.push(xxtResult[i].id);
        }
        this.$refs.oaTree.setCheckedKeys(checkRes);
        this.$refs.xxtTree.setCheckedKeys(xxtCheckRes);

      },
      async saveWxXxtAuthority(){
        let nodes = this.$refs.oaTree.getCheckedNodes();
        let ids = [];
        for (let i = 0; i < nodes.length; i++) {
          ids.push(nodes[i].id);
        }
        var res = await modifyWXMenuAuthority(this.groupId,{menuTrees:ids.join(),xxdm: this.xxdm})
        console.log(res,"保存后的res")

        nodes = this.$refs.xxtTree.getCheckedNodes();
        ids = [];
        for (let i = 0; i < nodes.length; i++) {
          ids.push(nodes[i].id);
        }
        var res = await saveMobileXxtMenuAuthority(this.groupId,{menuTrees:ids.join(),xxdm: this.xxdm})
        console.log(res,"保存后的res22")
        if(res.status==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
        }
        this.$emit('closeauthoritydialog')._events.closeAuthorityDialog[0]()

      },
    }
  };
</script>
<style scope>
  .filterTit{
    font-size: 16px;
    padding: 10px 0;
    padding-left:20px;
  }
  .box-card .el-menu-item:focus,.box-card .el-menu-item:hover,.box-card .el-submenu__title:hover{
    background: #d9d9d9 !important;
  }
  .groupAuthority .el-menu-item * {
    color: #303133 !important;
  }

  .groupAuthority .el-menu-item.is-active {
    color: #409EFF !important;
    background-color: #d9d9d9 !important;
  }

  .groupAuthorityelinput .el-input__inner {
    height: 56px;
    line-height: 56px;
  }

  .groupAuthority .box-card {
    position: absolute;
    left: 0;
    right: 50%;
    bottom: 0;
    top: 15px;
  }

  .groupAuthority .box-card .el-card__body {
    padding: 0;
  }

  .el-menu {
    border: none !important;
  }
</style>
