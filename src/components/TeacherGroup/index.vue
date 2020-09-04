<template>
  <div class="dialog-box">

    <el-drawer title="教师选择"
               :visible.sync="isShow"
               :direction="direction"
               :before-close="handleClose">
      <div class="selCourseTeach">
        选择的老师：
        <div class="tagTeacher"
             v-if="tagSelectedTeacherList && tagSelectedTeacherList.length > 0">
          <el-tag :key="index"
                  v-for="(tag,index) in tagSelectedTeacherList"
                  closable
                  :disable-transitions="false"
                  @close="delTeacher(index,tag)">
            {{tag.name}}
          </el-tag>
        </div>
        <div v-else
             class="tagNull">暂无录入老师</div>
      </div>

      <div class="searchBox">
        <i class="el-icon-search"></i>
        <el-input v-model="searchKey"
                  class="searchTeach"
                  clearable
                  placeholder="输入关键字查询教师"></el-input>
      </div>
      <div style="padding:0 20px 10px">
        <el-button type="text"
                   v-for="(item, index) in breadcrumbList"
                   :key="index"
                   @click="resetShowGxList(index)"
                   :style="{color:breadcrumbList.length == index + 1?'#333':''}">{{item}}{{breadcrumbList.length != index + 1 ? ' >': ''}}</el-button>
      </div>
      <div class="teacherBox"
           v-if="showGxList && showGxList.length > 0">
        <el-row :gutter="20"
                v-for="(item,index) in showGxList"
                :key="index"
                style="border-bottom:1px solid #dddddd;margin:4px">
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checked"
                           style="padding: 15px 0;"
                           @change="handlerChecked(index)"></el-checkbox>
            </div>
          </el-col>
          <el-col :span="17">
            <div class="grid-content bg-purple">
              <el-button type="text"
                         style="padding: 15px 0;font-size:16px;color:#333"
                         @click="handlerChecked(item)">{{item.name}}{{item.jsList ? ' ('+ item.jsList.length +'人)':''}}</el-button>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-button type="text"
                         style="padding: 15px 0;font-size:16px;"
                         @click="handlerOpenSubTeacher(item)"
                         v-if="item.jsList && item.jsList.length > 0">| 下级</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="teacherBox"
           v-else>
        <el-row :gutter="20"
                style="border-bottom:1px solid #dddddd;margin:4px">
          <p style="text-align:center;font-size:16px;">暂无教师数据</p>
        </el-row>
      </div>
      <div class="drawer-footer">
            <el-button type="primary" @click="submitSelect" size="medium">确 定</el-button>
            <el-button @click="handleClose" size="medium">取 消</el-button>
          </div>
    </el-drawer>
  </div>
</template>

<script>
import jcsj from '@/api/jcsj'
export default {
  name: 'teacherGroup',
  data () {
    return {
      direction: 'rtl',             // 抽屉方向
      isShow: false,                // 是否打开弹层
      xxdm: '',                     // 学校代码
      dqxn: '',                     // 当前学年
      jsList: [],                   // 教师列表
      jszList: [],                  // 教师组列表
      jsgxList: [],                 // 教师关系列表
      gxList: [],
      showGxList: [],               // 显示用
      tagSelectedTeacherList: [],            // 已选教师列表 tag
      externalSelectedTeacherList: [],       // 已选教师列表
      searchKey: '',                         // 搜索关键字
      breadcrumbList: ['全部组'],             // 面包屑列表
      maxSelected: 1,                        // 用户最多可选数量
      isIndeterminate: true,                 // 多选不确定状态
    }
  },
  props: {
    types: String,                   // 弹层类型
    dialogVisiable: {                // 弹层显示
      type: Boolean,
      required: true
    },
    selectedTeacher: {               // 用户已选的老师列表
      type: Array,
      required: true
    },
    limit: Number,                   // 用户最多可以选择几个老师
  },
  watch: {
    /**
     * 搜索关键字
     */
    searchKey (val, oldval) {
      if (val == "") {
        this.showGxList = this.gxList
      } else {
        this.breadcrumbList = ['全部组']
        let allJsList = []
        this.gxList.forEach(item => {
          allJsList = allJsList.concat(item.jsList)
        })
        log(allJsList, 'alljs')
        this.showGxList = _.filter(allJsList, function (o) {
          return !(o.name.indexOf(val) == -1)
        })
        log(this.showGxList,'watch')
      }
      // this.jsListSign();
    }
  },
  mounted () {
    // 初始化数据
    this.xxdm = window.localStorage.getItem('xxdm');
    this.dqxn = this.$route.query.ksxn
    this.isShow = this.dialogVisiable
    this.externalSelectedTeacherList = this.selectedTeacher
    this.maxSelected = this.limit ? this.limit:5
    this.selectedTeacher.forEach(item => {
      const obj = {}
      obj.name = item.teacherName
      obj.code = item.teacherCode
      obj.checked = true
      this.tagSelectedTeacherList.push(obj)   // 获取 tag 显示的数据
    })
    /** 初始化基础数据**/
    jcsj.remove(jcsj.JS_KEY);
    jcsj.remove(jcsj.JSZ_KEY);
    log(this.selectedTeacher,'select')
    log(this.tagSelectedTeacherList,'select')
    this.getInit()
  },
  methods: {
    async getInit () {
      const parm = { xxdm: this.xxdm, xn: this.dqxn }
      /** 获取教师**/
      await jcsj.hqjslb(parm).then(res => {
        log(res, '教师')
        this.jsList = res;
      })
      /** 获取教师组**/
      const v = { xxdm: this.xxdm };
      await jcsj.hqjszlb(v).then(res => {
        log(res, '教师组')
        this.jszList = res;
      })
      /** 获取教师关系 */
      await jcsj.getJszjsgxList(v).then(res => {
        log(res, '关系')
        this.jsgxList = res
      })
      const undefinedJsList = []
      const groupJsList = []
      this.jszList.forEach(item => {
        const tempObj = {}
        tempObj.name = item.zmc
        tempObj.isIndeterminate = false
        // 获取同一教师组的信息
        const tempJsz = this.jsgxList.filter(fItem => {
          // debugger
          return fItem.zdm == item.zdm
        })
        const tempArr = []
        log(tempJsz, 'jsz')
        tempJsz.forEach(jsItem => {
          
          const tempArrSubObj = {}
          const tempJs = _.find(this.jsList, { gh: jsItem.zgh })
          if (tempJs) {
            tempArrSubObj.code = tempJs.gh
            tempArrSubObj.name = tempJs.xm
            const tempJsObj = _.find(this.tagSelectedTeacherList,{code: tempJs.gh})
            log(tempJsObj,'tempJsObj')
            if(tempJsObj) {
              tempArrSubObj.checked = tempJsObj.checked
              tempObj.isIndeterminate = true
            }else {
              tempArrSubObj.checked = false
            }
            tempArr.push(tempArrSubObj)
            groupJsList.push(tempArrSubObj.code)
          }
        })
        
        tempObj.jsList = tempArr
        tempObj.checked = false
        this.gxList.push(tempObj)   // 获取教师关系组信息
        
      })
      log(groupJsList,'group')
      const tempObj = {}
      tempObj.isIndeterminate = false
      this.jsList.forEach(item => {
        if(groupJsList.indexOf(item.gh) == -1) {
          const temp = {}
          temp.name = item.xm
          temp.code = item.gh
          const tempJsObj = _.find(this.tagSelectedTeacherList,{code: item.gh})
          if(tempJsObj) {
            temp.checked = tempJsObj.checked
            tempObj.isIndeterminate = true
          }else {
            temp.checked = false
          }
          undefinedJsList.push(temp)
        }
      })
      tempObj.name = '未分类'
      tempObj.jsList = undefinedJsList
      tempObj.checked = false
      
      this.gxList.push(tempObj)
      
      this.gxList.forEach(item => {
        let count = 0
        item.jsList.forEach(it => {
          if(it.checked) {
            count++
          }
        })
        log(count,item.name)
        if(count != 0 && count === item.jsList.length) {
          item.isIndeterminate = false
          item.checked = true
        }
      })
      this.showGxList = this.gxList
      log(this.gxList, 'gxlistttttttttttt')
      // log(_.find(this.showGxList[2].jsList,{code: '106'}),'贾智')
    },
    /**
     * 关闭弹层
     */
    handleClose () {

      this.$emit('handlerClose')
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     this.isShow = false
      //     this.$emit('handlerClose')
      //     // done();
      //   })
      //   .catch(_ => { });
    },
    /**
     * 重新显示数据
     */
    resetShowGxList (index) {
      if (index === 0) {
        this.showGxList = this.gxList
        this.breadcrumbList = ['全部组']
      }
    },
    /**
     * 选择
     */
    handlerChecked (item) {
      log(item)
      if (typeof item == 'number') {   // 点击复选框
        if (this.showGxList[item].checked) {     // 选中状态
          if (!this.showGxList[item].jsList) {    // 不是组状态，为 tag 添加选中的数据
            if (this.tagSelectedTeacherList.length < this.maxSelected) {
              const tempObj = {}
              tempObj.name = this.showGxList[item].name
              tempObj.code = this.showGxList[item].code
              this.tagSelectedTeacherList.push(tempObj)
              // this.gxList[item].isIndeterminate = true    // 复选横杆状态
              
            } else {
              this.showGxList[item].checked = false
              this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
            }
          } else {
            if(this.showGxList[item].jsList.length == 0) {
              this.showGxList[item].checked = false
              this.$notify({ title: '提示', message: '该教师组下无教师',type: 'warning'})
            }else {   // 组添加
              let alternativeCount = 0
              this.showGxList[item].jsList.forEach(itm => {
                if(!itm.checked) {
                  alternativeCount ++
                }
              })
              if (this.tagSelectedTeacherList.length + alternativeCount <= this.maxSelected) {  // 限制选中个数
                
                const tempArr = []
                this.showGxList[item].jsList.forEach(itm => {
                  itm.checked = true
                  if(!_.find(this.tagSelectedTeacherList,{code: itm.code})){
                    tempArr.push(itm)
                  }
                })
                this.tagSelectedTeacherList = this.tagSelectedTeacherList.concat(tempArr)   // 全选
                // this.showGxList[item].isIndeterminate = false
              } else {
                this.showGxList[item].checked = false
                this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
              }
            }
            
          }
        } else {                                   // 未选中状态
          if(!this.showGxList[item].isIndeterminate) {
            if (this.tagSelectedTeacherList.length > 1 ) {
              if (!this.showGxList[item].jsList) {
                this.tagSelectedTeacherList.forEach((itm, index) => {
                  if (itm.code == this.showGxList[item].code) {
                    this.tagSelectedTeacherList.splice(index, 1)
                  }
                })
                for(let i=0;i<this.gxList.length;i++) {
                  if(_.find(this.gxList[i].jsList,{code:this.showGxList[item].code})) {
                    this.gxList[i].checked = false
                  }
                }
              } else {   // 组移除
                
                  this.showGxList[item].checked = false
                  this.showGxList[item].jsList.forEach(itm => {   // 移除老师选中状态
                    itm.checked = false
                    log(itm,this.tagSelectedTeacherList,'tagremove')
                    this.tagSelectedTeacherList.forEach((tagItem,inx) => {
                      if(tagItem.code === itm.code){
                        this.tagSelectedTeacherList.splice(inx, 1)
                      }
                    })
                  })
              }
            } else {
                this.showGxList[item].checked = true
                this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
            }
          }
        }
        log(this.gxList,this.showGxList,'showwww')
        log(this.showGxList[item].code,'item')
        // 遍历列表判断 item 是那个分组下的，并给该分组复选添加横杆状态
        if(!this.showGxList[item].jsList) {
          for(let i=0;i<this.gxList.length;i++) {
            if(_.find(this.gxList[i].jsList,{code:this.showGxList[item].code})) {
              let trueCount = 0
              this.gxList[i].jsList.forEach(itm => {
                if(itm.checked) {
                  trueCount ++
                }
              })
              if(trueCount === 0) {
                this.gxList[i].isIndeterminate = false
                this.gxList[i].checked = false
              }else {
                if(trueCount !=this.gxList[i].jsList.length) {
                  this.gxList[i].isIndeterminate = true
                }else {
                  this.gxList[i].isIndeterminate = false
                  this.gxList[i].checked = true
                }
              }
            }
          }
        }else {   // 组状态，控制复选横杆
          let trueCount = 0
          this.gxList[item].jsList.forEach(itm => {
            if(itm.checked) {
              trueCount ++
            }
          })
          log(trueCount,'trueCount')
          if(trueCount === 0) {
            this.gxList[item].isIndeterminate = false
          }else {
            if(trueCount !=this.gxList[item].jsList.length) {
              this.gxList[item].isIndeterminate = true   // 复选横杆状态
            }else {
              this.gxList[item].isIndeterminate = false
              this.gxList[item].checked = true
            }
          }
        }
        
      } else {                          // 点击文字
        item.checked = !item.checked     // 文字按钮需要先进行切换状态
        if (item.checked) {    // 选中添加
          if (!item.jsList) {   // 非组状态
            if (this.tagSelectedTeacherList.length < this.maxSelected) {
              const tempObj = {}
              tempObj.name = item.name
              tempObj.code = item.code
              this.tagSelectedTeacherList.push(tempObj)   // 添加 tag
            } else {
              item.checked = false
              this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
            }
          } else {   // 组状态
            if(item.jsList.length == 0) {
              item.checked = false
              this.$notify({ title: '提示', message: '该教师组下无教师',type: 'warning'})
            }else {    // 组添加
              let alternativeCount = 0
              item.jsList.forEach(itm => {
                if(!itm.checked) {
                  alternativeCount ++
                }
              })
              if (this.tagSelectedTeacherList.length + alternativeCount <= this.maxSelected) {
                const tempArr = []
                item.jsList.forEach(itm => {
                  itm.checked = true
                  if(!_.find(this.tagSelectedTeacherList,{code: itm.code})){
                    tempArr.push(itm)
                  }
                })
                this.tagSelectedTeacherList = this.tagSelectedTeacherList.concat(tempArr)   // 全选
                // item.checked = true
                // item.isIndeterminate = false
                // item.isIndeterminate = false   // 不确定状态移除-就是复选的横杆状态
              } else {
                item.checked = false
                this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
                
              }
            }
          }
        } else {   // 反选移除
          if (this.tagSelectedTeacherList.length > 1) {
            if (!item.jsList) {
              this.tagSelectedTeacherList.forEach((itm, index) => {
                if (itm.code == item.code) {
                  this.tagSelectedTeacherList.splice(index, 1)
                }
              })
              
              for(let i=0;i<this.gxList.length;i++) {
                  if(_.find(this.gxList[i].jsList,{code: item.code})) {
                    this.gxList[i].checked = false
                  }
                }
            } else {  // 组移除
              item.jsList.forEach(itm => {
                itm.checked = false
                this.tagSelectedTeacherList.forEach((tagItem,inx) => {
                  if(tagItem.code === itm.code){
                    this.tagSelectedTeacherList.splice(inx, 1)
                  }
                })
              })
            }
          } else {
            item.checked = true
            this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
          }
        }
        if(!item.jsList) {
          for(let i=0;i<this.gxList.length;i++) {
            if(_.find(this.gxList[i].jsList,{code:item.code})) {
              let trueCount = 0
              this.gxList[i].jsList.forEach(itm => {
                if(itm.checked) {
                  trueCount ++
                }
              })
              log(trueCount,'trueCount')
              if(trueCount === 0) {
                this.gxList[i].isIndeterminate = false
                this.gxList[i].checked = false
              }else {
                if(trueCount !=this.gxList[i].jsList.length) {
                  this.gxList[i].isIndeterminate = true
                }else {
                  this.gxList[i].isIndeterminate = false
                  this.gxList[i].checked = true
                }
              }
            }
          }
        }else {
          log(item,this.gxList,'showwwe')
          for(let i=0;i<this.gxList.length;i++) {
            log(item.name == this.gxList[i].name,'iii')
            if(this.gxList[i].name == item.name) {
              let trueCount = 0
              this.gxList[i].jsList.forEach(itm => {
                if(itm.checked) {
                  trueCount ++
                }
              })
              log(trueCount,'trueCount')
              if(trueCount === 0) {
                this.gxList[i].isIndeterminate = false
              }else {
                if(trueCount !=this.gxList[i].jsList.length) {
                  this.gxList[i].isIndeterminate = true
                }else {
                  this.gxList[i].isIndeterminate = false
                  this.gxList[i].checked = true
                }
              }
            }
          }
        }
      }
    },
    /**
     * 提交数据
     */
    submitSelect() {
      if(this.tagSelectedTeacherList.length > 0 && this.tagSelectedTeacherList.length <= this.maxSelected) {
        this.$emit('sumbit-select-teacher',this.tagSelectedTeacherList)
        this.handleClose()
      }else {
        this.$notify({ title: '提示', message: '录入老师最少1个最多' + this.maxSelected + '个', type: 'warning' })
      }
    },
    /**
     * 教师组下一级
     */
    handlerOpenSubTeacher (item) {
      this.showGxList = item.jsList
      this.breadcrumbList.push(item.name)
    },
    /**
     * 清空搜索
     */
    clearSearch () {

    },
    /**
     * tag 删除
     */
    delTeacher (index, tag) {
      if (this.tagSelectedTeacherList.length > 1) {
        this.tagSelectedTeacherList.splice(index, 1)
        for(let i=0;i<this.gxList.length;i++) {
          if(_.find(this.gxList[i].jsList,{code:tag.code})) {
            let trueCount = 0
            this.gxList[i].jsList.forEach(item => {   // 取消勾选删除的项
              if (item.code == tag.code) {
                item.checked = false
              }
              if(item.checked) {
                trueCount ++
              }
            })
            if(trueCount === 0) {
              this.gxList[i].isIndeterminate = false
            }else {
              if(trueCount !=this.gxList[i].jsList.length) {
                this.gxList[i].isIndeterminate = true
              }else {
                this.gxList[i].isIndeterminate = false
                this.gxList[i].checked = true
              }
            }
          }
        }
        
      } else {
        this.$notify({
          title: '提示',
          message: '录入老师最少1个最多' + this.maxSelected + '个',
          type: 'warning'
        })
      }
    },
  }
}
</script>
<style lang="">
.el-drawer__body{
    overflow-y: auto;
  }
</style>
<style lang="scss" scoped>
.dialog-box {
  overflow-y: auto;
}
.selBox {
  display: inline-block;
  position: relative;
  width: 300px;
}
.selBox-input {
  position: relative;
  font-size: 14px;
  display: block;
  width: 100%;
}
.selBox .el-input__inner {
  cursor: pointer;
}
.selBox .el-input__icon {
  display: none;
}
.selBox:hover .el-input__icon {
  display: block;
}
.selCourseTeach {
  padding: 0 20px;
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  min-height: 70px;
  border-bottom: 1px dotted #f8f8f8;
  position: relative;
  .tagTeacher {
    width: 100%;
    /deep/ .el-tag {
      margin-top: 10px;
      margin-right: 10px;
    }
  }
  .tagNull {
    position: absolute;
    bottom: 0;
    padding-top: 15px;
    line-height: 30px;
    color: #999;
    font-size: 14px;
    width: 100%;
    text-align: center;
  }
}
.searchBox {
  padding: 20px 20px;
  position: relative;
  i {
    position: absolute;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  /deep/ input {
    text-indent: 10px;
  }
}
.teacherBox {
  margin: 0 20px;
  overflow-y: auto;
  width: calc(100% - 40px);
  height: 500px;
  border: 1px solid #dcdfe6;
}
.drawer-footer{
  margin: 22px 20px 30px;
}
</style>