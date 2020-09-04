<template>
  <div class="cardMaintenance-detail">
    <div class="wrapper">
      <p class="title">卡片类型</p>
      <div style="margin-top: 32px;">
        <el-form
          :model="cardForm"
          label-position="left"
          ref="ruleForm"
          :inline="true"
          class="demo-ruleForm"
        >
          <el-row>
            <el-form-item label-width="42px" label="学年" prop="name">
              <el-input
                disabled
                class="formitese formiteright"
                placeholder
                maxlength="10"
                v-model="cardForm.dqxn"
              ></el-input>
              <!-- <el-select class="formiteip formiteright" v-model="cardForm.value" placeholder="请选择">
                <el-option
                  v-for="item in cardForm.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item label-width="78px" label="卡片名称" prop="name">
              <el-input
                disabled
                class="formitese formiteright"
                placeholder="卡片名称10个字以内"
                maxlength="10"
                @blur="getkpcf"
                v-model="cardname"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="120px" label="是否有考评分项" prop="name">
              <el-radio disabled @change="kpchange" v-model="cardForm.kpradio" label="0">否</el-radio>
              <el-radio disabled @change="kpchange" v-model="cardForm.kpradio" label="1">是</el-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label-width="43px" label="学期" prop="name">
              <el-input
                disabled
                class="formitese formiteright"
                placeholder
                maxlength="10"
                v-model="cardForm.dqxq"
              ></el-input>
              <!-- <el-select class="formitexq formiteright" v-model="cardForm.value" placeholder="请选择">
                <el-option
                  v-for="item in cardForm.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item class="formitebu kptb" label-width="78px" label="卡片图标" prop="name">
              <div class="bigimg" style="position: relative;overflow: hidden;">
                <!-- <div v-if="tplj">
                  <img :src="tplj" alt>
                  <span class="lookBigPic" @click="lookbigppic">查看大图</span>
                </div>
                <div v-else class="none"></div>-->

                <el-upload
                  disabled
                  class="uploadkptb"
                  :limit="1"
                  name="file"
                  :file-list="fileList2"
                  ref="newupload"
                  :before-upload="tbbeforeUpload"
                  :on-change="sigbeforeUpload"
                  :on-exceed="sighandleExceed"
                  :on-success="sighandleSuccess"
                  accept=".jpg, .png"
                  action="/api/jlk/jlkfj/uploadFile"
                  :headers="importHeaders"
                  list-type="picture-card"
                  :on-preview="sighandlePictureCardPreview"
                  :on-remove="sighandleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="sigdialogVisible">
                  <img width="50%" :src="sigtempImagesrc" alt>
                </el-dialog>
              </div>
              <!-- <el-dialog :visible.sync="dialogVisible">
                <img width="700" height="317" :src="dialogImageUrl" alt>
              </el-dialog>-->
            </el-form-item>
            <el-form-item class="formitebu" label-width="120px" label="是否有升级" prop="name">
              <el-radio disabled v-model="cardForm.sjradio" label="0">否</el-radio>
              <el-radio disabled v-model="cardForm.sjradio" label="1">是</el-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <p class="kpsa">请谨慎修改卡片可见范围，若已发卡，将影响数据准确性！</p>
          </el-row>
          <el-row>
            <el-form-item
              style="margin-left:0 !important;"
              class="formitebu"
              label-width="110px"
              label="卡片可见范围"
            >
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                disabled
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox
                  disabled
                  v-for="city in cities"
                  :label="city.njdm"
                  :key="city.njdm"
                >{{city.njmc}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>

    <el-dialog width="25%" top="10vh" title="升级规则" :visible.sync="cardsj">
      <div>
        <el-row class="elrowcarddiog">
          <el-col :span="6">等级</el-col>
          <el-col :span="16">{{cardform.name}}</el-col>
        </el-row>
        <el-row class="elrowcarddiog">
          <el-col :span="6">等级别称</el-col>
          <el-col :span="16">
            <el-input placeholder="卡片名称10个字以内" maxlength="10" v-model="cardform.djbc"></el-input>
          </el-col>
        </el-row>
        <el-row class="elrowcarddiog">
          <el-col :span="6">升级规则</el-col>
          <el-col :span="16">
            <el-input
              maxlength="3"
              @keyup.native="proving1"
              class="elrowcarddioginput"
              v-model="cardform.sl"
            ></el-input>
            个{{cardform.gzname? cardform.gzname :(cardform.name === '一级卡'? '普通卡':(this.tableData.length>=1?this.tableData[this.tableData.length-1].name: '普通卡'))}}兑换一个{{cardform.name}}
          </el-col>
        </el-row>
        <el-row class="elrowcarddiog">
          <el-col :span="6">卡片图标</el-col>
          <!-- <el-col :span="16">{{cardform.img}}</el-col> -->
          <el-col :span="16">
            <el-upload
              :before-upload="cardsjbeforeUpload"
              :limit="1"
              name="file"
              :file-list="fileList3"
              ref="newupload"
              :on-change="beforeUpload"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              accept=".jpg, .png"
              action="/api/jlk/jlkfj/uploadFile"
              :headers="importHeaders"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog width="30%" :append-to-body="true" :visible.sync="dialogVisible">
              <img
                style="width: 80%;
                margin-left:10%;
                border-radius: 2px;"
                :src="dialogImageUrl"
                alt
              >
            </el-dialog>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cardsj = false">取 消</el-button>
        <el-button type="primary" @click="cardsjYes">确 定</el-button>
      </span>
    </el-dialog>

    <div class="wrapper" v-if="cardForm.kpradio == 1">
      <p class="title">分项维护</p>
      <p class="tip kpsj">温馨提示:考评项数最少1项,最多10项</p>
      <div class="fxxqactive">
        <el-table
          class="fxwhtable"
          :data="fwhtable"
          border
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          @row-click="fwhtableclick"
          @expand-change="exchange"
          key="fxtable"
          ref="refTable"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <!-- <p v-if="dynamicValidateForm.kppyList.length === 0" class="qtjpy">请添加评语</p> -->
              <!-- <p>{{props.row}}</p> -->
              <el-form
                :model="props.row.dynamicValidateForm"
                ref="dynamicValidateForm"
                label-width="100px"
                class="demo-dynamic"
              >
                <el-form-item
                  style="margin-left: 30px;"
                  v-for="(domain, domainindex) in props.row.dynamicValidateForm.kppyList"
                  :label="'评语' + Number(domainindex + 1) + ':' "
                  :key="domain.domainindex"
                >
                  <el-input
                    clearable
                    maxlength="50"
                    :title="domain.pynr"
                    :disabled="!domain.disabled"
                    style="width:200px;"
                    placeholder="请输入评语,50个字以内"
                    v-model="domain.pynr"
                  ></el-input>
                </el-form-item>

                <el-form-item v-if="props.row.show" style="margin-left: 30px;" label="评语:">
                  <el-input
                    clearable
                    style="width:200px;"
                    maxlength="50"
                    placeholder="请输入评语,50个字以内"
                    v-model="props.row.savenewdata"
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="考评分项">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-if="scope.row.showip"
                  clearable
                  style="width:200px;"
                  maxlength="50"
                  placeholder="请输入考评分项"
                  :ref="`ref${scope.row.id}`"
                  @blur.prevent="blurhandla(scope.$index, scope.row )"
                  v-model="scope.row.newname"
                ></el-input>
                <span v-else>{{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="wrapper" v-if="cardForm.kpradio != 1">
      <p class="title">评语维护</p>

      <p class="tip kpsa">温馨提示:评语项数最少1项,最多30项</p>
      <div class="fxxqactive">
        <el-table
          :row-key="getpjRowKeys"
          class="fxwhtable"
          :data="fxwhpytable"
          @row-click="pytableclick"
          border
          ref="refaTable"
          key="pytable"
          style="width: 100%"
        >
          <el-table-column width="60" label="序号">
            <template slot-scope="scope">{{scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="评语">
            <template slot-scope="scope">
              <div>
                <el-input
                  clearable
                  :key=" 'ab' + scope.row.id"
                  v-if="scope.row.showip"
                  style="width:200px;"
                  maxlength="50"
                  placeholder="请输入评语内容"
                  :ref="`refpy${scope.row.id}`"
                  @blur="pyblurhand(scope.row,
                  scope.$index)"
                  @change="pychange"
                  v-model="scope.row.pynewdata"
                ></el-input>
                <span v-else>{{scope.row.pynr}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="wrapper" v-if="cardForm.sjradio == 1">
      <p class="title">卡片升级</p>
      <p class="tip kpsj">请谨慎修改升级规则！若已生成卡片,修改规则会导致学生端卡片生成条件不同！</p>
      <div class="kpsjdiv">
        <el-table key="datakpsj" class="kptable" border :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="等级" width="180"></el-table-column>
          <el-table-column prop="djbc" label="等级别称" width="180"></el-table-column>
          <el-table-column prop="slall" label="升级规则"></el-table-column>
          <el-table-column width="200" label="卡片图标">
            <template slot-scope="scope">
              <div class="bigimg" style="position: relative;overflow: hidden;">
                <div v-if="scope.row.src">
                  <img :src="scope.row.src" alt>
                  <span class="lookBigPic" @click="lookbigppic(scope)">查看大图</span>
                </div>
                <div v-else style="width: 160px;height: 72px;background-color: #d2d2d2;"></div>
              </div>
              <div>
                <!--// 原图标准 700 315-->
                <el-dialog width="30%" :append-to-body="true" :visible.sync="listdialogVisible">
                  <img
                    style="width: 80%;
                    margin-left:10%;
                    text-align: center;
                    border-radius: 2px;"
                    :src="bigImages || ''"
                    alt
                  >
                </el-dialog>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottomrap">
      <el-button size="medium" type="primary" style="margin: 16px 0;" @click.stop="savenew">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from 'utils/auth';
import {
  allnj,
  allxn,
  allxq,
  dqxnxq,
  findcardlist,
  xnxqcardinformations,
  copycard,
  delcard,
  itemcard,
  kpcf,
  savejlk
} from '@/api/projectapp/incentiveCard/';
export default {
  name: 'detail',
  data() {
    return {
      allNjArr: [], // 所有年级
      checkedCities: [], // 已选年级
      cities: [], // 选项
      isIndeterminate: false,
      checkAll: false,
      bigImages: '', // 查看大图
      nomodifysrc: '', // 修改时图标默认
      jlid: '', // 记录ID
      flag: 'xz', // 标识符
      currentCardIndex: '', // 当前记录索引
      fxcount: 0, // 是否有分项评语数
      iscf: false, // 卡片不重复
      cardname: '', // 卡片名称
      tempImagesrc: '', // 临时卡片地址
      sigtempImagesrc: '', // 临时卡片地址
      sigdialogImageUrl: '', // 单个图片上预览
      dialogImageUrl: '', // 批量图片上预览
      isModify: false, // 修改关键字
      kptba: '', // 卡片图标
      min: 1, // 最小值
      max: 10, // 最大值
      cardNone: false, // 卡片超过五级
      count: 4, // 常量4
      cardform: {
        name: '', // 名称
        sl: '', // 规则
        img: '', // 图片,
        djbc: '' // 别名,
      }, // 卡片升级
      fxmc: '', // 分项名称
      pymc: '', // 评语名称
      blurindex: '', // 未失去焦点
      fxname: '', // 分项保存值
      pyname: '', // 评语保存值
      show: false, // 展示评论
      expands: [],
      fileList3: [], // 表格图片
      fileList2: [], // 表单图片
      indexvalue: 0, // 分项递增数值
      indexpyvalue: 0, // 评语递增数值
      num3: '', // 分项维护 增加分项
      num4: '', // 评语维护 增加评语
      fxxsindex: '', // 分项显示索引
      pyitemindex: '', // 评语显示索引
      xxdm: '', // 学校代码
      idvalue: 0, // id递增数值
      dataImgArr: [],
      sigdataImgArr: [],
      submitImgArr: [],
      sigsubmitImgArr: [],
      tempfjid: '', // 临时附件id
      sigtempfjid: '', // 临时附件id
      savedata: '', // 评语添加数据
      cardsj: false, // 卡片升级
      listdialogVisible: false, // 卡片显示
      savenewdata: '', // 评语新增默认数据
      srcurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548222999433&di=2ac9e035387de64090fe7aa8e3c904a8&imgtype=0&src=http%3A%2F%2Fimg15.3lian.com%2F2015%2Ff1%2F140%2Fd%2F40.jpg',
      // srcurl: '',
      dialogVisible: false, // 显示图片
      sigdialogVisible: false, // 显示图片
      activeName: '1',
      importHeaders: {
        enctype: 'multipart/form-data',
        Authorization: getToken()
      },
      cardForm: {
        name: '',
        region: '',

        options: [
          // Mock数据
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          },
          {
            value: '选项4',
            label: '龙须面'
          },
          {
            value: '选项5',
            label: '北京烤鸭'
          }
        ],
        value: '',
        kpradio: '0',
        sjradio: '0'
      },
      tplj: '', // 图片地址
      tableData: [], // Mock数据  卡片升级数据
      // tableData: [
      //   {
      //     date: '一级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '二级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   },
      //   {
      //     date: '三级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   },
      //   {
      //     date: '四级',
      //     date1: '白银',
      //     role: '5个普通卡兑换一个一级卡',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   }
      // ],
      // fwhtable: [{
      //   id: '1',
      //   name: '考评分项1',
      //   category: '江浙小吃、小吃零食',
      //   desc: '荷兰优质淡奶,奶香浓而不腻',
      //   address: '上海市普陀区真北路',
      //   shop: '王小虎夫妻店',
      //   shopId: '10333'
      // }, {
      //   id: '2',
      //   name: '考评分项2',
      //   category: '江浙小吃、小吃零食',
      //   desc: '荷兰优质淡奶,奶香浓而不腻',
      //   address: '上海市普陀区真北路',
      //   shop: '王小虎夫妻店',
      //   shopId: '10333'
      // }, {
      //   id: '3',
      //   name: '考评分项3',
      //   category: '江浙小吃、小吃零食',
      //   desc: '荷兰优质淡奶,奶香浓而不腻',
      //   address: '上海市普陀区真北路',
      //   shop: '王小虎夫妻店',
      //   shopId: '10333'
      // }, {
      //   id: '4',
      //   name: '考评分项4',
      //   category: '江浙小吃、小吃零食',
      //   desc: '荷兰优质淡奶,奶香浓而不腻',
      //   address: '上海市普陀区真北路',
      //   shop: '王小虎夫妻店',
      //   shopId: '10333'
      // }],
      // dynamicValidateForm: {
      //   kppyList: [{
      //     value: '阿萨德'
      //   }, {
      //     value: '的说法大声道'
      //   }, {
      //     value: '发的发的飒飒的'
      //   }],
      //   kppyList: [],
      //   email: ''
      // },
      fwhtable: [], // 分项维护表格数据
      fxwhpytable: [], // 评语表格数据
      dynamicValidateForm: {
        kppyList: [],
        domainsa: [],
        email: ''
      }
    };
  },
  computed: {},
  mounted() {
    this.getnj();
    this.jlid = this.$route.query.jlid;
    this.xxdm = window.localStorage.getItem('xxdm');

    if (this.$route.query.bsf === false || this.$route.query.bsf === 'false') {
      this.flag = false;
      this.getitemcard();
    } else {
      this.flag = true;
    }
    this.getdqxnxq();
  },
  methods: {
    /**
     * @description: 获取所有年级
     * @param {type}
     * @return:
     */
    async getnj() {
      const xxdm = this.xxdm = window.localStorage.getItem("xxdm");
      await allnj({ xxdm }).then(res => {
        this.cities = res;
        const arr = [];
        res.forEach(item => {
          arr.push(item.njdm);
        });
        this.checkAll = true;
        this.allNjArr = this.objDeepCopy(arr);
        this.checkedCities = this.objDeepCopy(arr);
      });
    },

    /**
     * @description: 全选
     * @param {type}
     * @return:
     */
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.allNjArr : [];
      this.isIndeterminate = false;
    },

    /**
     * @description: 勾选单个CheckBox
     * @param {type}
     * @return:
     */
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },

    /**
     * @description: 深拷贝
     * @param {type}
     * @return:
     */
    objDeepCopy(source) {
      const sourceCopy = source instanceof Array ? [] : {};
      for (const item in source) {
        sourceCopy[item] =
          typeof source[item] === 'object'
            ? objDeepCopy(source[item])
            : source[item];
      }
      return sourceCopy;
    },

    /**
     * @description: 增加评语项
     * @param {type}
     * @return:
     */
    addDomain(r) {
      const that = this;
      that.idvalue++;
      this.fwhtable.forEach((item, i) => {
        if (r.id === item.id) {
          if (
            this.fwhtable[i].dynamicValidateForm &&
            this.fwhtable[i].dynamicValidateForm.kppyList
          ) {
            // 停止
          } else {
            that.$set(this.fwhtable[i], 'dynamicValidateForm', {});
            that.$set(this.fwhtable[i].dynamicValidateForm, 'kppyList', []);
          }
        }
      });
    },

    // Todo:卡片增加
    /**
     * @description: 卡片升级
     * @param {type}
     * @return:
     */
    cardsjmethod() {
      this.submitImgArr = [];
      this.fileList3 = [];
      this.dataImgArr = [];
      this.isModify = false;
      this.cardform = {};
      if (this.tableData.length === 5) {
        this.$message({
          type: 'warning',
          message: '卡片最多添加五级!'
        });
        return;
      }
      // 显示遮罩层
      this.cardsj = true;

      const len = this.tableData.length;

      switch (len) {
        case 0:
          this.cardform.name = '一级卡';
          break;
        case 1:
          this.cardform.name = '二级卡';
          break;
        case 2:
          this.cardform.name = '三级卡';
          break;
        case 3:
          this.cardform.name = '四级卡';
          break;
        case 4:
          this.cardform.name = '五级卡';
          break;
        default:
          break;
      }
    },

    /**
     * @description: 获取当前学期学年
     * @param {type}
     * @return:
     */
    async getdqxnxq() {
      const that = this;
      await dqxnxq({ xxdm: this.xxdm }).then(res => {
        that.$set(that.cardForm, 'dqxn', res.data.xn);
        that.$set(that.cardForm, 'dqxq', res.data.xqmc);
        that.$set(that.cardForm, 'dqxqdm', res.data.xq);
      });
    },

    /**
     * @description: 获取信息
     * @param {type}
     * @return:
     */
    async getitemcard() {
      const that = this;
      await itemcard({
        xxdm: this.xxdm,
        jlid: this.jlid
      }).then(res => {
        if (res.status === 200) {
          this.cardForm.sjradio = res.data.sfsj;
          const fxwhpytable = res.data.kppyList;
          const gjkList = res.data.gjkList;
          const kpxxList = res.data.kpxxList;
          const gradeList = res.data.gradeList;
          this.checkedCities = gradeList;
          if (
            this.checkedCities.length > 0 &&
            this.checkedCities.length === this.allNjArr.length
          ) {
            this.checkAll = true;
            this.isIndeterminate = false;
          } else if (this.checkedCities.length > 0) {
            this.isIndeterminate = true;
            this.checkAll = false;
          }
          if (res.data.kpxxList && res.data.kpxxList.length > 0) {
            kpxxList.map((item, index) => {
              item.jlid = item.jlid;
              item.name = item.kpmc;
              item.newname = item.kpmc;
              item.showbj = false;
              item.showip = false;
              item.id = 'a' + index + 'bc';
              if (item.hasOwnProperty('kppyList')) {
                item.dynamicValidateForm = {};
                item.dynamicValidateForm.kppyList = item.kppyList;
                item.dynamicValidateForm.kppyList.map((itema, indexa) => {
                  itema.id = itema.jlid;
                  return itema;
                });
              }
              return item;
            });
            this.fwhtable = kpxxList;
          }
          if (res.data.kppyList && res.data.kppyList.length > 0) {
            fxwhpytable.map((item, index) => {
              item.jlid = item.jlid;
              item.id = 'a' + index + 'b';
              item.pynewdata = item.pynr;
              item.showbj = false;
              item.showip = false;
              return item;
            });
            this.fxwhpytable = fxwhpytable;
          }
          if (res.data.gjkList && res.data.gjkList.length > 0) {
            const len = gjkList.length;

            gjkList.map((item, index) => {
              item.jlid = item.jlid;
              switch (len) {
                case 1:
                  item.sl = `${item.sl}个一级卡兑换一个普通卡`;
                  break;
                case 2:
                  item.sl = `${item.sl}个二级卡兑换一个一级卡`;
                  break;
                case 3:
                  item.sl = `${item.sl}个三级卡兑换一个二级卡`;
                  break;
                case 4:
                  item.sl = `${item.sl}个四级卡兑换一个三级卡`;
                  break;
                case 5:
                  item.sl = `${item.sl}个五级卡兑换一个四级卡`;
                  break;
                default:
                  break;
              }

              const len = item.dj;

              item.slall = item.sl + item.slgzstr;
              switch (len) {
                case '1':
                  item.name = '一级卡';
                  break;
                case '2':
                  item.name = '二级卡';
                  break;
                case '3':
                  item.name = '三级卡';
                  break;
                case '4':
                  item.name = '四级卡';
                  break;
                case '5':
                  item.name = '五级卡';
                  break;
                default:
                  break;
              }
              item.src = item.alltplj;
              return item;
            });
            this.tableData = gjkList;
          }
          this.cardForm.kpradio = res.data.iskpfx || '0';
          this.cardname = res.data.kpmc;
          this.kptba = res.data.alltplj;
          this.nomodifysrc = '';
          this.nomodifysrc = res.data.tplj;
          this.$set(this.fileList2, [0], {
            name: 'pic',
            url: res.data.alltplj || ''
          });
          //
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      });
    },

    /**
     * @description: 验证卡片名称是否重复
     * @param {type}
     * @return:
     */
    async getkpcf() {
      if (!this.cardname) {
        this.$message({
          title: '提示',
          message: '卡片名称不能为空',
          type: 'warning'
        });
        return;
      }
      await kpcf({ kpmc: this.cardname }).then(res => {
        if (res.status === 200) {
          if (res.data === 0) {
            this.iscf = false;
          } else {
            this.iscf = true;
            this.$message({
              title: '提示',
              message: '同一学年学期，卡片名称重复',
              type: 'warning'
            });
          }
        } else {
          this.$message({
            title: '提示',
            message: res.message,
            type: 'error'
          });
        }
      });
    },

    /**
     * @description: 删除评语项
     * @param {type}
     * @return:
     */
    removeDomain(item) {
      const index = this.dynamicValidateForm.kppyList.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.kppyList.splice(index, 1);
      }
    },

    /**
     * @description: 查看大图
     * @param {type}
     * @return:
     */
    lookbigppic(a) {
      this.bigImages = a.row.src;
      this.listdialogVisible = true;
    },

    /**
     * @description: 卡片编辑
     * @param {type}
     * @return:
     */
    handleEdit(index, row) {
      //
    },

    /**
     * @description: 分项删除
     * @param {type}
     * @return:
     */
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fwhtable.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },

    /**
     * @description:评语删除
     * @param {type}
     * @return:
     */
    pyhandleDelete(index, row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fxwhpytable.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },

    // 上传图片成功
    handleSuccess(response, file, fileList) {
      // this.submitImgArr = []
      this.cardform.tplj = response.data.path;
      this.cardform.basetplj = response.data.basePath + response.data.path;
      this.tempImagesrc = response.data.basePath + response.data.path;
      // const parm = {};
      // this.submitImgArr.push(parm);
      this.$set(this.fileList3, [0], {
        name: 'pic',
        url: this.tempImagesrc
      });
    },
    carsjbeforeUpload(file) {
      if (
        (file.type === 'image/png' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg') &&
        file.size / 1024 / 1024 < 1
      ) {
        return true;
      } else {
        this.$message({
          type: 'warning',
          message: '支持格式为png、jpg的不大于1M的图片上传!'
        });
        return false;
      }
    },
    /**
     * @description: 图标上传前控制
     * @param {type}
     * @return:
     */
    tbbeforeUpload(file) {
      if (
        (file.type === 'image/png' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg') &&
        file.size / 1024 / 1024 < 1
      ) {
        return true;
      } else {
        this.$message({
          type: 'warning',
          message: '支持格式为png、jpg、jpeg的不大于1M的图片上传!'
        });
        return false;
      }
    },

    /**
     * @description: 卡片升级上传前控制
     * @param {type}
     * @return:
     */
    cardsjbeforeUpload(file) {
      if (
        (file.type === 'image/png' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg') &&
        file.size / 1024 / 1024 < 1
      ) {
        return true;
      } else {
        this.$message({
          type: 'warning',
          message: '支持格式为png、jpg、jpeg的不大于1M的图片上传!'
        });
        return false;
      }
    },

    beforeUpload(file) {
      this.tempfjid = file.uid;
    },
    sigbeforeUpload(file) {
      this.sigtempfjid = file.uid;
    },
    /**
     * @description: 卡片删除
     * @param {type}
     * @return:
     */
    kpDelete(index, row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1);

        // this.cardform.name = this.yjkmc.shift()

        this.count++;

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },
    sighandleRemove(file, fileList) {
      // 删除图片
      // const del_id = file.uid;
      // this.sigsubmitImgArr = []
      // this.sigdataImgArr = [];
      // for (let i = 0; i < this.sigsubmitImgArr.length; i++) {
      //   const map = this.sigsubmitImgArr[i];
      //   const fjid = map.fjid;
      //   if (fjid != del_id) {
      //     this.sigdataImgArr.push(map);
      //   }
      // }
      // this.sigsubmitImgArr = this.sigdataImgArr
      this.fileList2 = [];
    },

    // 单个上传图片成功
    sighandleSuccess(response, file, fileList) {
      // this.sigsubmitImgArr = []
      this.sigtempImagesrc = response.data.basePath + response.data.path;
      this.nomodifysrc = response.data.path;
      // const parm = {};
      // this.sigsubmitImgArr.push(parm);

      this.$set(this.fileList2, [0], {
        name: 'pic',
        url: this.sigtempImagesrc
      });
    },

    /**
     * @description: 获得分项id
     * @param {type}
     * @return:
     */
    getRowKeys(row) {
      return row.id;
    },

    /**
     * @description: 获得评语id
     * @param {type}
     * @return:
     */
    getpjRowKeys(row) {
      return row.id;
    },

    /**
     * @description: 行展开
     * @param {type}
     * @return:
     */
    toggleRowExpansion(row) {
      this.expands = [];
      this.expands.push(row.id);
    },

    /**
     * @description: 行点击
     * @param {type}
     * @return:
     */
    clickfwhtable(row) {
      this.show = false;
      this.$refs.refTable.toggleRowExpansion(row);
    },

    /**
     * @description: 外上移
     * @param {type}
     * @return:
     */
    up(index) {
      const that = this;
      const __index = that.fwhtable[index - 1];

      if (index > 0) {
        that.fwhtable.splice(index - 1, 1);
        that.fwhtable.splice(index, 0, __index);
      } else {
        // 索引不满足条件不做处理
      }
    },

    kpchange() {
      this.$forceUpdate();
    },

    /**
     * @description: 点击转换数据
     * @param {type}
     * @return:
     */
    fwhtableclick(r) {
      const that = this;
      if (this.fxxsindex !== r.id) {
        this.fwhtable.forEach((item, i) => {
          if (r.id !== item.id) {
            that.$set(this.fwhtable[i], 'showip', false);
            that.$set(this.fwhtable[i], 'showbj', false);
          }
        });
      }
    },

    /**
     * @description: 评语数据处理
     * @param {type}
     * @return:
     */
    pytableclick(r) {
      const that = this;
      if (this.pyitemindex !== r.id) {
        this.fxwhpytable.forEach((item, i) => {
          if (r.id !== item.id) {
            that.$set(this.fxwhpytable[i], 'showip', false);
            that.$set(this.fxwhpytable[i], 'showbj', false);
          }
        });
      }
    },

    pychange(value) {
      // this.fxwhpytable.forEach((item, i) => {
      //   if (this.pyitemindex === item.id) this.$set(this.fxwhpytable[i], 'name', this.pymc)
      // })
    },

    /**
     * @description: 编辑分项
     * @param {type}
     * @return:
     */
    modipy(r, i) {
      this.fxmc = r.name;
      this.$set(this.fwhtable[i], 'newname', this.fxmc);
      this.$set(this.fwhtable[i], 'showip', true);
      this.$set(this.fwhtable[i], 'showbj', true);
      this.$nextTick(() => {
        this.$refs[`ref${r.id}`].focus();
      });
    },

    /**
     * @description: 超出限制提示
     * @param {type}
     * @return:
     */
    handleExceed(files, fileList) {
      if (fileList.length === 1) {
        this.$message({
          title: '提示',
          message: '最多上传一张卡片图标',
          type: 'warning'
        });
      }
    },

    /**
     * @description: 编辑评语
     * @param {type}
     * @return:
     */
    modipingyu(r, i) {
      this.pymc = r.name;
      this.$set(this.fxwhpytable[i], 'pynewdata', this.pymc);
      this.$set(this.fxwhpytable[i], 'showip', true);
      this.$set(this.fxwhpytable[i], 'showbj', true);
      this.$nextTick(() => {
        this.$refs[`refpy${r.id}`].focus();
      });
    },

    /**
     * @description: 保存分项
     * @param {type}
     * @return:
     */
    savefx(r, i) {
      this.$set(this.fwhtable[i], 'showip', false);
      this.$set(this.fwhtable[i], 'showbj', false);
    },

    /**
     * @description: 超出限制提示
     * @param {type}
     * @return:
     */
    sighandleExceed(files, fileList) {
      if (fileList.length === 1) {
        this.$message({
          title: '提示',
          message: '最多上传一张卡片图标',
          type: 'warning'
        });
      }
    },

    /**
     * @description: 展开
     * @param {type}
     * @return:
     */
    exchange(row, a) {
      this.fwhtable.forEach((item, i) => {
        if (this.fwhtable[i].dynamicValidateForm) {
          if (this.fwhtable[i].dynamicValidateForm.hasOwnProperty('kppyList')) {
            this.$set(
              this.fwhtable[i].dynamicValidateForm,
              'kppyList',
              item.dynamicValidateForm.kppyList || []
            );
          } else {
            this.$set(this.fwhtable[i].dynamicValidateForm, 'kppyList', []);
          }
        } else {
          this.$set(this.fwhtable[i], 'dynamicValidateForm', {});
        }
      });
    },

    handleRemove(file, fileList) {
      // 删除图片
      // const del_id = file.uid;

      // this.dataImgArr = [];
      // this.submitImgArr = [];
      // for (let i = 0; i < this.submitImgArr.length; i++) {
      //   const map = this.submitImgArr[i];
      //   const fjid = map.fjid;
      //   if (fjid != del_id) {
      //     this.dataImgArr.push(map);
      //   }
      // }
      // this.submitImgArr = this.dataImgArr;
      this.fileList3 = [];
    },

    handlePictureCardPreview(file) {
      // 预览
      this.sigdialogVisible = false;
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },

    sighandlePictureCardPreview(file) {
      // 预览
      this.sigtempImagesrc = file.url;
      this.sigdialogVisible = true;
    },

    /**
     * @description: 单个图片上传
     * @param {type}
     * @return:
     */
    siglePictureCardPreview(file) {
      // 预览

      this.dialogVisible = false;
      this.sigdialogVisible = true;
      this.sigdialogImageUrl = file.url;
    },
    /**
     * @description: 外下移
     * @param {type}
     * @return:
     */
    down(index) {
      const that = this;
      const __index = that.fwhtable[index + 1];

      if (index + 1 === that.fwhtable.length) {
        // 个数相同不做处理
      } else {
        that.fwhtable.splice(index + 1, 1);
        that.fwhtable.splice(index, 0, __index);
      }
    },

    /**
     * @description: 内上移
     * @param {type}
     * @return:
     */
    upa(i, index) {
      const that = this;
      const __index = that.fwhtable[index].dynamicValidateForm.kppyList[i - 1];

      if (this.fwhtable[index].hasOwnProperty('show')) {
        if (this.fwhtable[index].show) {
          this.$message({
            title: '提示',
            message: '评语内容不能为空',
            type: 'warning'
          });
          return;
        }
      }

      if (i <= 0) return;

      that.fwhtable[index].dynamicValidateForm.kppyList.splice(i - 1, 1);
      that.fwhtable[index].dynamicValidateForm.kppyList.splice(i, 0, __index);
    },

    /**
     * @description: 分项维护失去焦点
     * @param {type}
     * @return:
     */
    blurhandla(i, r) {
      this.fxxsindex = r.id;
      this.fxname = r.newname;
      this.fwhtable.forEach((item, i) => {
        if (r.id === item.id) this.$set(this.fwhtable[i], 'name', this.fxmc);
      });
    },

    /**
     * @description: 分项保存
     * @param {type}
     * @return:
     */
    kpfxsave(i, r) {
      this.fwhtable.forEach((item, i) => {
        if (r.id === item.id) {
          if (!item.newname) {
            this.$message({
              title: '提示',
              message: '考评分项不能为空',
              type: 'warning'
            });
            return;
          }

          this.$set(this.fwhtable[i], 'name', this.fxname);
        }
      });
      this.$set(this.fwhtable[i], 'showip', false);
      this.$set(this.fwhtable[i], 'showbj', false);
    },

    /**
     * @description: 评语保存
     * @param {type}
     * @return:
     */
    pyitemsave(r) {
      this.fxwhpytable.forEach((item, i) => {
        if (r.id === item.id) {
          if (!item.pynewdata) {
            this.$message({
              title: '提示',
              message: '评论内容不能为空',
              type: 'warning'
            });
            return;
          }
          this.$set(this.fxwhpytable[i], 'pynr', this.pyname);
          this.$set(this.fxwhpytable[i], 'showip', false);
          this.$set(this.fxwhpytable[i], 'showbj', false);
        }
      });
    },

    /**
     * @description:内下移
     * @param {type}
     * @return:
     */
    downa(i, index) {
      const that = this;
      const __index = that.fwhtable[index].dynamicValidateForm.kppyList[i + 1];

      if (this.fwhtable[index].show) {
        this.$message({
          title: '提示',
          message: '评语内容不能为空',
          type: 'warning'
        });
        return;
      }
      if (i + 1 === that.fwhtable[index].dynamicValidateForm.kppyList.length) {
        // 个数相同不做处理
      } else {
        that.fwhtable[index].dynamicValidateForm.kppyList.splice(i + 1, 1);
        that.fwhtable[index].dynamicValidateForm.kppyList.splice(i, 0, __index);
      }
    },

    /**
     * @description: 评语维护失去焦点
     * @param {type}
     * @return:
     */
    pyblurhand(r) {
      this.pyitemindex = r.id;
      this.pyname = r.pynewdata;
      this.fxwhpytable.forEach((item, i) => {
        if (r.id === item.id) this.$set(this.fxwhpytable[i], 'name', this.pymc);
      });
    },

    /**
     * @description: 卡片升级确定
     * @param {type}
     * @return:
     */
    cardsjYes() {
      let obj;
      obj = {};

      if (!this.cardform.djbc) {
        this.$message({
          type: 'warning',
          message: '等级别称不能为空!'
        });
        return;
      }
      if (!this.cardform.sl) {
        this.$message({
          type: 'warning',
          message: '升级规则不能为空!'
        });
        return;
      }

      if (!this.fileList3.length) {
        this.$message({
          type: 'warning',
          message: '卡片图标不能为空!'
        });
        return;
      }

      if (!this.isModify) {
        if (this.tempImagesrc) {
          this.cardform.src = this.tempImagesrc;
        }
        obj = { ...this.cardform };
        // tableData赋值
        this.tableData.push(obj);
        this.cardsj = false;
        return;
      }

      if (this.tempImagesrc) {
        this.cardform.src = this.tempImagesrc;
      }
      // this.tableData[this.currentCardIndex] = this.cardform
      this.$set(this.tableData, this.currentCardIndex, this.cardform);

      // 弹窗
      this.cardsj = false;
    },

    /**
     * @description: 数字校验
     * @param {type}
     * @return:
     */
    proving1() {
      // eslint-disable-next-line no-useless-escape
      this.cardform.sl = this.cardform.sl.replace(/[^\.\d]/g, '');
      this.cardform.sl = this.cardform.sl.replace('.', '');
    },

    /**
     * @description: 编辑升级卡片
     * @param {type}
     * @return:
     */
    bjsjkp(row, index, isModify) {
      let obj;
      obj = {};
      this.currentCardIndex = index;

      this.isModify = isModify;
      this.cardsj = true;
      this.cardform = {};
      obj = { ...row };
      this.cardform = obj;
      if (this.tableData.length > 2) {
        this.cardform.gzname = this.tableData[index - 1].name;
      }
      if (row.src) {
        this.fileList3 = [{ url: row.src }];
      }
      // Todo:编辑升级卡片
    },

    /**
     * @description: 保存
     * @param {type}
     * @return:
     */
    save(props) {
      const that = this;
      this.fwhtable.forEach((item, i) => {
        if (props.row.id === item.id) {
          if (
            this.fwhtable[i].dynamicValidateForm &&
            this.fwhtable[i].dynamicValidateForm.kppyList
          ) {
            // 停止
          } else {
            that.$set(this.fwhtable[i], 'dynamicValidateForm', {});
            that.$set(this.fwhtable[i].dynamicValidateForm, 'kppyList', []);
          }
          that.fwhtable[i].dynamicValidateForm.kppyList.push({
            pynr: that.savedata,
            id: Date.now()
          });
          that.fwhtable[i].show = false;
        }
      });
    },
    /**
     * @description: 失去焦点
     * @param {type}
     * @return:
     */
    blurhand(value) {
      setTimeout(() => {
        this.savedata = value;
      }, 0);
    },

    /**
     * @description: 新增卡片信息
     * @param {type}
     * @return:
     */
    async savenew() {
      this.$router.push({
        path: '/incentiveCard/cardMaintenance'
        // query: { jlid: row.jlid }
      });
    },
    // 取消
    quxiaoa(props) {
      const that = this;
      //
      that.fwhtable.forEach((item, i) => {
        if (props.row.id === item.id) {
          const a = { ...that.fwhtable[i] };
          that.fwhtable[i] = [];
          that.$nextTick(() => {
            that.$set(that.fwhtable, i, a);
            that.$set(that.fwhtable[i], 'show', false);
          });
        }
      });
    },

    /**
     * @description: 新增评语
     * @param {type}
     * @return:
     */
    addfxPy(row) {
      const that = this;
      this.fwhtable.forEach((item, i) => {
        if (row.id === item.id) {
          if (this.fwhtable[i].dynamicValidateForm) {
            if (
              this.fwhtable[i].show &&
              (this.fwhtable[i].dynamicValidateForm.kppyList.length === 0 ||
                this.fwhtable[i].dynamicValidateForm.kppyList.length)
            ) {
              if (this.fwhtable[i].savenewdata) {
                this.$message({
                  title: '提示',
                  message: '请保存后新增',
                  type: 'warning'
                });
              } else {
                this.$message({
                  title: '提示',
                  message: '评语内容不能为空',
                  type: 'warning'
                });
                return;
              }
            }
          }
          that.fwhtable[i].show = true;
          that.fwhtable[i].savenewdata = '';
          this.toggleRowExpansion(row);
          this.addDomain(row);
        }
      });
    },

    /**
     * @description: 失去焦点事件
     * @param {type}
     * @return:
     */
    pyblur(i, domainindex, props) {
      this.fwhtable[i].dynamicValidateForm.kppyList[
        domainindex
      ].disabled = false;
    },

    /**
     * @description: 编辑评语类
     * @param {type} i: 外索引
     * @param {type} di: 内索引
     * @param {type} props: 数据
     * @return:
     */
    editpy(i, di, props) {
      this.$set(
        this.fwhtable[i].dynamicValidateForm.kppyList[di],
        'disabled',
        true
      );
      this.fwhtable[i].dynamicValidateForm.kppyList.forEach((item, index) => {
        if (di !== index) {
          this.$set(
            this.fwhtable[i].dynamicValidateForm.kppyList[index],
            'disabled',
            false
          );
        }
      });
    },

    /**
     * @description: 增加分项
     * @param {type}
     * @return:
     */
    addFx(item) {
      if (this.fwhtable.length + item > 10) {
        this.$message({
          type: 'warning',
          message: '考评项数最少1项，最多10项！'
        });
        return;
      }
      for (let i = 0; i < item; i++) {
        this.fwhtable.push({
          id: `a${Number(this.indexvalue)}`,
          name: '请编辑考评分项'
        });
        this.indexvalue++;
      }
    },

    /**
     * @description: 增加评语
     * @param {type}
     * @return:
     */
    addPy(item) {
      if (this.fxwhpytable.length + item > 30) {
        this.$message({
          type: 'warning',
          message: '评语项数最少1项，最多30项!'
        });
        return;
      }
      for (let i = 0; i < item; i++) {
        this.fxwhpytable.push({
          id: `a${Number(this.indexpyvalue)}`,
          pynr: '请编辑评语,50字以内'
        });
        this.indexpyvalue++;
      }
    },

    /**
     * @description: 全部删除评语
     * @param {type}
     * @return:
     */
    handleDeletepy() {
      this.$confirm('此操作将永久删除所有信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fxwhpytable = [];
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },

    /**
     * @description: 全部删除分项
     * @param {type}
     * @return:
     */
    handleDeleteAllfx() {
      this.$confirm('此操作将永久删除所有信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fwhtable = [];
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },

    /**
     * @description: 删除
     * @param {type}
     * @return:
     */
    delet(i, di) {
      this.$confirm('此操作将永久删除该条评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fwhtable[i].dynamicValidateForm.kppyList.splice(di, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../commonsty/common";

.cardMaintenance-detail {
  min-width: 1025px;
  padding: 32px 24px;
  .wrapper {
    border: $block-wrapper;
    padding: $block-wrapper-padding;
    border-radius: 4px;
    box-shadow: $block-wrapper-boxshadow;
    margin-bottom: 32px;
    .title {
      padding: 0 !important;
      margin: 0 !important;
      font-size: 18px;
      color: #303133;
    }
    .tip {
      font-size: 14px;
      line-height: 36px;
    }
    .fxxq {
      margin-top: 5px;
      color: #909399;
    }
    .kpsj {
      margin-top: 20px;
      margin-bottom: 18px;
      background-color: #fdf6ec;
      padding-left: 20px;
      border-radius: 4px;
      /*width: 533px;*/
      color: #e6a23c;
    }
    .kpsjdiv {
      border-radius: 3px;
      overflow: hidden;
    }
  }
}

.cardMaintenance-detail .formiteip {
  width: 125px;
}
.cardMaintenance-detail .formitese {
  width: 177px;
}
.cardMaintenance-detail .formitexq {
  width: 100px;
}
.cardMaintenance-detail .formitebu {
  margin-left: 10px;
}
.cardMaintenance-detail .formitebu .none {
  background-color: #d2d2d2;
  width: 160px;
  height: 72px;
}
.cardMaintenance-detail .el-form-item {
  margin-right: 80px;
}
.cardMaintenance-detail .el-form-item__label {
  padding: 0 !important;
}
.cardMaintenance-detail .fxxqactive {
  border: $block-wrapper;
}
.cardMaintenance-detail .fxxqactive {
  border: $block-wrapper;
}
.cardMaintenance-detail .kpfxp {
  padding: 0 !important;
  padding: 18px 41px !important;
  font-size: 14px;
  color: #303133;
  margin: 0 !important;
}
</style>

<style>
.cardMaintenance-detail .el-collapse-item__header {
  padding: 18px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}
.cardMaintenance-detail .el-collapse-item__content div {
  padding: 5px 41px !important;
  line-height: 14px;
  font-size: 14px;
  color: #909399;
  margin: 0 !important;
}
.cardMaintenance-detail .el-collapse-item__arrow {
  line-height: 14px !important;
}
.cardMaintenance-detail .kpsjdiv .el-table td,
.cardMaintenance-detail .kpsjdiv .el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
  padding: 18px 36px;
  font-size: 14px;
}
.cardMaintenance-detail .bigimg img {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}
.cardMaintenance-detail .lookBigPic {
  display: none;
  line-height: 14px !important;
}
.cardMaintenance-detail .el-dialog {
  width: 600px;
  margin-top: 15% !important;
}
.cardMaintenance-detail .bigimg:hover .lookBigPic {
  position: absolute;
  display: block;
  background-color: rgba(148, 148, 148, 0.69);
  color: #fff;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  bottom: 0;
  line-height: 14px !important;
}

.cardMaintenance-detail .optionc {
  font-size: 14px;
  line-height: 36px;
  margin-right: 14px;
  cursor: pointer;
}
.cardMaintenance-detail .optionca {
  color: #606266;
}
.cardMaintenance-detail .optioncb {
  color: #409eff;
}
.cardMaintenance-detail .optioncc {
  color: #606266;
}
.cardMaintenance-detail .optioncd {
  color: #606266;
}
.cardMaintenance-detail .optionce {
  color: #f56c6c;
}
.cardMaintenance-detail .optionf {
  color: #409eff;
}
.cardMaintenance-detail .demo-table-expand {
  font-size: 0;
}
.cardMaintenance-detail .demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.cardMaintenance-detail .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.cardMaintenance-detail .fxwhtable .el-form-item__error {
  padding-top: 1px !important;
}

.cardMaintenance-detail .fxwhtable .el-form-item__label {
  color: #909399 !important;
  font-size: 14px !important;
  font-weight: normal !important;
}

.cardMaintenance-detail .bottomrap {
  width: 100%;
  text-align: center;
}

.cardMaintenance-detail .qtjpy {
  padding: 0 60px;
  font-size: 16px;
  color: #a6a5a5;
}

.cardMaintenance-detail .elrowcarddioginput {
  width: 100px;
  margin-right: 20px;
}
.cardMaintenance-detail .elrowcarddiog {
  margin-bottom: 16px;
  line-height: 3.5;
}
.cardMaintenance-detail .uploadkptb {
  width: 160px;
  height: 72px;
}
.cardMaintenance-detail .uploadkptb .el-upload--picture-card {
  width: 160px !important;
  height: 100% !important;
}
.cardMaintenance-detail
  .uploadkptb
  .el-upload-list--picture-card
  .el-upload-list__item {
  width: 160px !important;
  height: 100% !important;
}
.cardMaintenance-detail .bigimg .el-dialog__body {
  text-align: center;
}
.cardMaintenance-detail
  .kptb
  .el-upload-list__item.is-success
  .el-upload-list__item-status-label {
  display: none !important;
}
.cardMaintenance-detail .fxwhtable .el-form-item {
  margin-bottom: 20px !important;
}
.cardMaintenance-detail .fxwhtable .el-table__expanded-cell[class*="cell"] {
  padding: 20px 0px !important;
}
</style>
<style scoped>
.cardMaintenance-detail .kpsa {
  margin-top: 20px;
  margin-bottom: 18px;
  background-color: #fdf6ec;
  padding-left: 20px;
  border-radius: 4px;
  color: #e6a23c;
  font-size: 14px;
  line-height: 36px;
}
</style>
