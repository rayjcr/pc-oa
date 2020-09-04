<template>
  <div class="searchapp">
    <div>
      <el-card shadow="always">
        <span class="fliterTit"><b>查询条件：</b> </span>
        <el-input style="vertical-align: middle;" :placeholder="searchPlaceholder" v-model="form.curValue" class="input-with-select ssnr searchIpt" size="medium">
          <el-select v-if="searchInputSelect" v-model="form.type" slot="prepend" placeholder="全部" >
            <el-option v-for="(item,index) in searchTypes" :key="index" :label="item.label"
                       :value="item.value" style="border:none;"></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" slot="append" @click="search"></el-button>
        </el-input>
        &nbsp; &nbsp;
        <a v-if="conditionItems.length>0" v-bind:class="{active:moreset}" @click="moreset=!moreset">
          <i class="el-icon-caret-top edit_icon" v-if="moreset"></i>
          <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
          <span v-if="moreset">收起更多</span>
          <span v-else>展开更多</span>
        </a>
        <div class="selectSearch" style="margin-top:12px" v-if="selectedCondition">
          <span class="fliterTit"><b>已选条件：</b></span>
          <el-tag size="small"
                  v-for="(tag,index) in conditions"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
            {{tag.text}}
          </el-tag>
          <span>&nbsp;</span>
        </div>
        <my-transition>
          <div class="detailSearch" style="margin-top: 20px" v-show="moreset">
            <el-form ref="form1" :model="form" label-width="80px">
              <template v-for="(item,index) in conditionItems">
                <el-form-item v-if="item.type == 'Radio'" :label="item.label">
                  <!--radio 类型-->
                  <el-radio-group v-model="form.temp[index]">
                    <el-radio v-for="(loop,i) in item.values" :key="loop.value"
                              :label="loop.value"
                              v-on:change="handleCheckedRadio($event,item.values[i],index)">
                      {{loop.text}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="item.type == 'Checkbox'" :label="item.label">
                  <!--checkbox 类型-->
                  <el-checkbox-group v-model="form.temp[index]">
                    <el-checkbox v-for="(loop,i) in item.values" :key="(index+i)"
                                 :label="loop.value"
                                 v-on:change="handleCheckedBox($event,item.values[i],index)">
                      {{loop.text}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="item.type == 'Date'" :label="item.label">
                  <!--date 类型-->
                  <el-date-picker
                    v-model="form.temp[index]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" v-on:change="handleCheckedCitiesChange($event,item.values[i],index)">
                  </el-date-picker>
                </el-form-item>
              </template>

            </el-form>
          </div>
        </my-transition>
      </el-card>
    </div>
  </div>
</template>

<script>
  import MyTransition from '@/views/components/mtransition'

  export default {
    name: 'App',
    components: {
      MyTransition
    },
    data() {
      return {
        /* xxdm: '',
        dqxn: '',
        dqxq: '',*/
        form: {
          curValue: '',
          type: '',
          temp: [[],[],[],[]]
        },
        conditions: [], // 已选条件
        moreset: false
      }
    },
    created() {
      if (this.searchTypes.length > 0) {
        this.type = this.searchTypes[0].value
      }
    },
    mounted(){
        // this.$nextTick(() => {
        //     this.setChecked();
        // })
    },
    computed: {
      selectedCondition() {
        return this.conditions.length > 0;
      }
    },
    methods: {

      /** 处理默认选中**/
      setChecked() {
        if (this.conditionItems.length > 0) {
          this.conditions = [];
          for (let o = 0, z = this.conditionItems.length; o < z; o++) {
            const item = this.conditionItems[o];

            const selectedValue = item.selected;

            if (selectedValue) {
                if (item.type === 'Checkbox') {

                    /** 复选**/
                    const arr = [], e = {};
                    /** 选中**/
                    arr.push(selectedValue.value);
                    // this.form.temp[o].push(arr);

                    this.$set(this.form.temp[o],0,selectedValue.value)

                    /** 已选**/
                    e.index = o;
                    e.value = selectedValue.value;
                    e.text = selectedValue.text;
                    e.type = 'checkbox';
                    this.conditions.push(e);
                }
                if (item.type === 'Radio') {
                    /** 单选**/
                    const e = {};
                    /** 选中**/
                    // this.form.temp.push(selectedValue.value);
                    this.$set(this.form.temp[o],0,selectedValue.value)
                    /** 已选**/
                    e.index = o;
                    e.value = selectedValue.value;
                    e.text = selectedValue.text;
                    e.type = 'radio';
                    this.conditions.push(e);
                }
            } else {
            //   this.form.temp.push([]);
            }
          }
        }
        console.log(this.form,666)
      },
      handleCheckedRadio(check, arry, index) {
        /** 单选框**/
        const yxArry = this.conditions;
        yxArry.forEach((e, i) => {
          if (e.index == index) {
            yxArry.splice(i, 1);
          }
        });
        arry.index = index;
        arry.type = 'radio';
        this.conditions.push(arry);
      },
      handleCheckedBox(check, arry, index) {
        /** 多选框**/
        if (check) { // 选中
          arry.index = index;
          arry.type = 'checkbox'
          this.conditions.push(arry);
        } else {
          const curObj = this.conditions.find(item => item.value === arry.value);
          this.conditions.splice(this.conditions.indexOf(curObj), 1);
        }
      },
      handleClose(v) {
        /** 已选条件关闭方法**/
        this.conditions.splice(this.conditions.indexOf(v), 1);
        if (v.type == 'radio') {
          this.form.temp[v.index] = [];
        }
        if (v.type == 'checkbox') {
          let checkBox = this.form.temp[v.index];
          checkBox = checkBox.splice(checkBox.indexOf(v.value), 1);
        }
      },
      search() {
        /** 搜索**/
        this.$emit('searchClick', this.form);
      },
      getParam(){
        return this.form;
      }
    },
    props: {
      searchInputSelect: {
        /** 搜索类型是否显示，true：显示；false：不显示；默认不显示**/
        type: Boolean,
        default: false
      },
      searchPlaceholder: {
        /** 搜索提示文字**/
        type: String,
        required: true
      },
      searchTypes: {
        /** 搜索类型列表数据**/
        type: Array,
        required: true
      },
      conditionItems: {
        /** 多选checkBox返回数据**/
        type: Array,
        required: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .searchapp /deep/ .el-input-group {
    width: 45%;
  }

  .searchapp /deep/ .el-form-item__label {
    line-height: 40px;
  }

  .searchapp /deep/ .el-form-item__content {
    /*border-bottom: 1px solid #e5e5e5;*/
  }
  .searchIpt{
      /deep/ .el-select .el-input{
        width: 110px;
      }
  }
  .selectSearch /deep/ .el-tag + .el-tag {
    margin-left: 10px;
  }
  .ssnr /deep/ .el-input-group__prepend{
    padding: 0 20px;
  }
  /* .ssnr /deep/ .el-input__suffix{
    right: 10px;
  } */

  .searchapp a {
    color: #999;
  }

  .fliterTit{
    color: #666;
  }

  .searchapp a:hover {
    color: #409eff;
  }
  .searchapp /deep/ .content-container .el-select .el-input {
    width: 105px;
    text-align: center;
  }
  .searchapp /deep/ .el-input-group__append, .el-input-group__prepend{
    background-color: #fff;
  }
</style>

