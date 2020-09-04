<template>
  <div class="app-container calendar-list-container">

      <div class="transferBox">
        <div class="transferpar">
          <div class="title">选择：</div>
          <div class="con" style="height: 450px;">
            <el-input placeholder="请输入内容" v-model="searchxzspr" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click.stop="trysearch"></el-button>
            </el-input>
            <el-tabs v-model="activeName">
              <el-tab-pane v-if="sprChoseType=='bm'||sprChoseType=='all'" label="组织架构" name="first">
                <div>
                  <div>
                    <el-button v-for="(label, labindex) in tablist" :key="labindex" type="text"
                      @click.stop="getallstatus(label, labindex)">{{label.label}}</el-button>
                  </div>
                </div>
                <div class="ryCon">
                  <div class="cycon" style="height:250px;">
                    <!-- 选择人员组件 -->
                    <div>
                      <choose-member :sxbmspr="waitmember" :departmentmemberId="departmentmemberId"
                                     :search="search" :searchmenmberlist="searchmenmberlist"
                                     :departmentleader="departmentleader" :departmentmember="departmentmember"
                                     :childrendepartment="childrendepartment"
                                     :isnext="isnext" :dataSource="dapartmentlist"
                                     @checkclick="checkclick" @nextpage="nextpage">
                      </choose-member>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="sprChoseType=='js'||sprChoseType=='all'" label="角色列表" name="second">
                <div>
                  <div>
                    <el-button type="text" @click.stop="showAlljs">所有角色</el-button>
                  </div>
                </div>
                <div class="ryCon">
                  <div class="cycon">
                    <el-tree :data="searchjssj" :filter-node-method="filterNode" accordion
                             @node-click="handleNodeClick_jssj" :render-after-expand="false" >
                    </el-tree>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="transferpar">
          <div class="title">已选：</div>
          <div class="con" style="height: 450px;">
            <div class="ryCon">
              <div>
                <el-tag v-for="tag in bzspr" :key="tag.id" @close="handleClose_tag(tag)" closable>{{tag.name}}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="czbmspr">确 定</el-button>
      </div>

  </div>
</template>

<script>
  import * as api from 'api/audit/approvalprocess/szspbz'
  import { fetchTree, getUsers, Searchmember, Getallteacher } from 'api/admin/group/index'
  import ChooseMember from './ChooseMember'
  import { setlocal, getlocal, clearlocal } from '../../../utils/local'
  import Vue from 'vue'
  export default {
    components: {
      ChooseMember
    },
    data() {
      return {
        sprChoseType: 'all',
        isnext: true, // 部门数据显示
        tablist: [{ label: '所有部门', id: 1 }], // 上部导航数组暂存
        bzspr: [],
        searchjssj: [], // 筛选后的角色
        departmentmemberId: null,
        dapartmentlist: [], // 部门列表
        searchxzspr: '',
        waitmember: [],
        childrendepartment: [],
        departmentmember: [], // 部门成员暂存
        departmentleader: [], // 部门领导暂存
        searchmenmberlist: [], // 搜索数据列表
        search: false, // 是否为搜索
        sxbmspr: [],
        jssj: []
      }
    },
    computed: {
      activeName() {
        if (this.sprChoseType === 'all' || this.sprChoseType === 'bm') {
          return 'first'
        } else {
          return 'second'
        }
      }
    },
    created() {
      this.cxbmsj()
    },
    mounted() {
      this.getdepartmentlist()
    },
    methods: {
      cxbmsj() {
        const xxdm = window.localStorage.getItem('xxdm');
        const QueryIt1 = { xxdm, groupType: '1' };
        const QueryIt2 = { xxdm, groupType: '2' };
        const params = {
          page: 1,
          limit: 2000,
          type: 3,
          xxdm
        }
        Getallteacher(params).then(data => {
          data.data.rows.forEach(item => {
            Vue.delete(item, 'updTime')
            Vue.delete(item, 'updName')
            Vue.delete(item, 'password')
            Vue.delete(item, 'updUser')
            Vue.delete(item, 'crtTime')
          })
          // console.log(data)
          this.bmsjallrem = data.data.rows
        })
        fetchTree(QueryIt2).then(data => {
          this.bmsj = data;
        });
        fetchTree(QueryIt1).then(data => {
          this.jssj = data;
          this.searchjssj = data;
        });
      },
      // 初始化
      cxspbztj() {
        api.cxlcbz(this.mbid).then(response => {
          this.lcmc = response.data.lcmc;
          this.tzfs = response.data.tzfs;             // 通知抄送人方式
          this.bdid = response.data.bdid;             // 表单id
          const allbz = response.data.spbz;           // 审批步骤
          const alltj = response.data.sptj;           // 审批条件
          const mrspbzs = [];
          const spbztj = [];                          // 分条件审批
          let csr = [];
          alltj.forEach(item => {       // 按优先级平排列--分条件审批
            const yxj = item.yxj;
            const yxjtj = _.find(spbztj, ['yxj', yxj]);
            if (yxjtj) {
              yxjtj.sptj.push(item);
            } else {
              const obj = {};
              obj.yxj = yxj;
              obj.sptj = [];
              obj.spbz = [];
              obj.csr = [];
              obj.sptj.push(item);
              spbztj.push(obj);
            }
          });
          allbz.forEach(item => {         // 按优先级平排列--分条件审批--审批人+抄送人
            const sfmr = item.sfmr;        // 是否默认   为1则为默认审批流程  其余为按优先级排
            if (sfmr === 1) {
              mrspbzs.push(item);          // 默认审批流程--审批人
              if (item.csr || csr === []) {                 // 默认审批流程-- 抄送人
                csr = item.csr.split(',');
              }
            } else {
              const yxj = item.spyxj;       // 优先级
              const yxjbz = _.find(spbztj, ['yxj', yxj]);
              if (yxjbz) {
                yxjbz.spbz.push(item);
                if (item.csr) {
                  yxjbz.csr = item.csr.split(',');
                }
              } else {
                const obj = {};
                obj.yxj = yxj;
                obj.spbz = [];
                obj.spbz.push(item);
                spbztj.push(obj);
              }
            }
          });
          this.mrspbz = mrspbzs;          // 默认审批流程--默认审批人
          this.bztj = spbztj;             // 分条件审批
          let bmsjall = []
          const treeShow = setInterval(() => {
            if (this.bmsjallrem === bmsjall) {
              this.mrcsr = this.matchspr(csr);        // 默认审批流程--默认抄送人
              this.bztj.forEach(item => {
                item.csrData = this.matchspr(item.csr);        // 按条件审批流程--抄送人
                item.sptj.forEach(tj => {
                  if (tj.splcbdx.bdbm === 'sqr') {
                    // 匹配spr
                    tj.zffwArrOnly = this.matchspr(tj.zffwArr);
                    const zffJson = []
                    tj.zffwArrOnly.forEach(zff => {
                      zffJson.push(zff.name)
                    })
                    tj.zffwname = zffJson.join(',')
                  }
                })
              })
              clearInterval(treeShow)
            } else {
              bmsjall = this.bmsjallrem
            }
          }, 100);
          api.cxbzbdx(this.bdid).then(response => {
            this.bzbdx = response;
          });
          api.cxbtbdx(this.bdid).then(response => {
            this.tjbdx = response;
          })
        });
      },
      // 搜索部门成员
      trysearch() {
        if (this.activeName === 'first') {
          this.waitmember = this.bzspr
          const params = {
            xxdm: window.localStorage.getItem('xxdm'),
            name: this.searchxzspr
          }
          Searchmember(params).then(data => {
            data.forEach(item => {
              this.$set(item, 'IsSelect', false)
            })
            this.searchmenmberlist = data;
            this.search = true;
          })
        } else if (this.activeName === 'second') {
          this.searchjssj = [];
          if (this.searchxzspr !== '') {
            this.jssj.forEach(js => {
              if (js.name.indexOf(this.searchxzspr) !== -1) {
                this.searchjssj.push(js);
              }
            })
          } else {
            this.searchjssj = this.jssj;
          }
        }
      },
      showAlljs() {
        this.searchxzspr = '';
        this.searchjssj = this.jssj;
      },
      // 选择人员
      checkclick(datas) {
        this.bzspr = datas;
      },
      // 获取部门成员列表
      nextpage(datas) {
        this.isnext = true
        this.tablist.push(datas)
        this.waitmember = this.sxbmspr.length ? this.sxbmspr : this.bzspr.length ? this.bzspr : []
      },
      // 搜索
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 所选指定角色选择
      handleNodeClick_jssj(data) {
        if (this.sprChoseType === 'js') {
          this.bzspr = [];
        }
        if (this.bzspr.indexOf(data) === -1) {
          this.bzspr.push(data);
        }
      },
      // 所选成员确定
      czbmspr() {
        //
      },
      // 点击获取所有部门/上一级部门成员
      getallstatus(datas, index) { // 通过暂存数据，将路径缓存为tab切换数据源保存，通过点击再次利用部门id获取到该部门成员
        this.search = false
        this.searchxzspr = ''
        const that = this
        if (index === 0) {
          this.waitmember = [] // 将所有已选指定人员暂存清除以待下次子组件对数据监听，避免数据未发生变化造成舰艇失败
          that.tablist.splice(1, that.tablist.length - 1)
          that.getdepartmentlist()
          that.bzspr = getlocal('departmentmembers') ? getlocal('departmentmembers') : this.sxbmspr.length ? this.sxbmspr : []
          that.isnext = false
        } else {
          that.isnext = true
          that.tablist.splice(index + 1, that.tablist.length - index)
          that.childrendepartment = datas.children
          that.getdapartmentmember(datas.id)
        }
      },
      // 获取部门列表
      getdepartmentlist() {
        const xxdm = window.localStorage.getItem('xxdm');
        const QueryIt2 = { xxdm, groupType: '2' };
        fetchTree(QueryIt2).then(data => {
          this.dapartmentlist = data;
        });
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
      // 所选成员删除
      handleClose_tag(tag) {
        if (this.bzspr.length !== 1) {
          this.bzspr.splice(this.bzspr.indexOf(tag), 1);
          this.waitmember = this.bzspr;
          this.departmentmemberId = tag.id;
          setlocal('departmentmembers', this.bzspr)
        } else {
          this.bzspr.splice(this.bzspr.indexOf(tag), 1);
          this.departmentmemberId = tag.id;
          clearlocal('departmentmembers', 'appoint')
        }
      }
    }
  }
</script>
<style scoped>
  .el-radio.is-bordered+.el-radio.is-bordered {
    margin-left: 0px;
  }
  .tj-bdmc{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
