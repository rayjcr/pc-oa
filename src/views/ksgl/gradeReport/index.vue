<template>
  <div class="app-container calendar-list-container" style="height: 60px;">
    <el-card shadow="hover">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select placeholder="请选择学年">
            <el-option label="2018-2019" value="shanghai"></el-option>
            <el-option label="2017-2018" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选学期">
            <el-option label="上学期" value="shanghai"></el-option>
            <el-option label="下学期" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="考试名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择年级">
            <el-option label="语文" value="shanghai"></el-option>
            <el-option label="数学" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择班级">
            <el-option label="语文" value="shanghai"></el-option>
            <el-option label="数学" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择课程">
            <el-option label="语文" value="shanghai"></el-option>
            <el-option label="数学" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-pie-chart" type="primary" @click="dialogVisible = true">统计</el-button>
          <el-button icon="el-icon-download" type="primary" @click="onSubmit">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="学号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="年级"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="班级">
        </el-table-column>
        <el-table-column
          prop="aa"
          label="语文">
        </el-table-column>
        <el-table-column
          prop="bb"
          label="分数">
        </el-table-column>
        <el-table-column
          prop="bb"
          label="...">
        </el-table-column>
        <el-table-column
          prop="bb"
          label="班级排名">
        </el-table-column>
        <el-table-column
          prop="bb"
          label="年级排名">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-pie-chart"
              @click="handleEdit(scope.$index, scope.row)">统计分析
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="margin-top: 6px;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper" :total="20"></el-pagination>
      </el-col>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="一致性 Consistency" name="1">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
        <el-collapse-item title="反馈 Feedback" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="效率 Efficiency" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="可控 Controllability" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-collapse>
      <el-dialog
        title="统计维度"
        :visible.sync="dialogVisible"
        width="40%"
        height="40%"
        :before-close="handleClose">
        <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>-->
       <!-- <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="最高分"></el-checkbox>
          <el-checkbox label="最低分"></el-checkbox>
          <el-checkbox label="中位分"></el-checkbox>
          <el-checkbox label="平均分"></el-checkbox>
          <el-checkbox label="量化贡献值"></el-checkbox>
          <el-checkbox label="前"></el-checkbox>
          <el-checkbox label="后"></el-checkbox>
          <el-checkbox label="等级比例"></el-checkbox>
        </el-checkbox-group>-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
      <p>&nbsp;</p>
    </el-card>
  </div>
</template>

<script>
  const cityOptions = ['最高分', '最低分', '中位分', '平均分', '量化贡献值'];
  export default {
    data() {
      return {
        dialogVisible: false,
        checkAll: false,
        checkedCities: ['上海', '北京'],
        cities: cityOptions,
        isIndeterminate: true,
        tableData: [{
          date: '一年级',
          name: '200',
          address: '2000'
        }, {
          date: '二年级',
          name: '200',
          address: '5000'
        }, {
          date: '三年级',
          name: '200',
          address: '8000'
        }, {
          date: '四年级',
          name: '200',
          address: '6600'
        }]
      }
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    }
  }
</script>
