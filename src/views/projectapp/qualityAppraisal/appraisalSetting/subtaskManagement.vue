<template>
<div class="app-container calendar-list-container">
	<div class="u_TableMain columns ofhide">
		<div class="filter-container innerTab">
			<el-button icon="el-icon-plus" type="primary" @click="dialogVisible=true">新增</el-button>
		</div>
		<div class="m_GenTableBox">
			<el-table class="tableBorder dimensionTable" :data="tableData">
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="dimensionName" label="维度"></el-table-column>
				<el-table-column prop="detail" label="简介">
					<template slot-scope="scope">
						<span class="overflow2">{{scope.row.detail}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="rewardType" label="奖励">
					<template slot-scope="scope">
						{{scope.row.rewardType=='1'?'分数：':'勋章：'}} {{scope.row.evaluationRuleScore.score}}
					</template>
				</el-table-column>
				<el-table-column prop="evaluationRuleFrequency" label="频次">
					<template slot-scope="scope">
						<span v-if="scope.row.evaluationRuleFrequency.type!=1">{{optionsList[scope.row.evaluationRuleFrequency.type]+scope.row.evaluationRuleFrequency.count}}次</span>
						<span v-else>{{optionsList[scope.row.evaluationRuleFrequency.type]}}</span>
						{{scope.row.weekdayOnly?'（限工作日）':''}}
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="有效期">
					<template slot-scope="scope">
						{{scope.row.startTime.split(' ')[0]}}-{{scope.row.endTime.split(' ')[0]}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="changeEvaluation(scope.row)">编辑</el-button>
						<el-popover placement="top" width="200" v-model="scope.row.deltips">
							<p>你确认要删除该项子任务？</p>
							<div style="text-align: right; margin: 0">
								<el-button size="mini" type="text" @click="scope.row.deltips = false">取消</el-button>
								<el-button type="primary" size="mini" @click="deleteEvaluation(scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="mini">删除</el-button>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination class="pagination" background layout="prev, pager, next" :total="ruleItemSum" :page-size="pageLimit" :current-page="curPage" @current-change="rulePageChange"></el-pagination> -->
		</div>
	</div>

	<el-dialog :close-on-click-modal="false" title="子任务设置" :visible.sync="dialogVisible" width="670px" @closed="handleClose">
		<el-form ref="form" :model="form" :rules="rules" label-width="100px">
			<el-form-item label="名称：" prop="name">
				<el-input v-model="form.name" size="small" autocomplete="off" maxlength="16" placeholder="请输入1~16个字符"></el-input>
			</el-form-item>
			<el-form-item label="维度：" prop="dimensionId">
				<el-cascader class="w300" size="small" placeholder="请选择或搜索维度" filterable clearable
					v-model="form.dimensionId" :options="dimensionOptions"
					:props="{ 
					emitPath:false,
					expandTrigger: 'hover',
					checkStrictly: true,
					value: 'id',
					label: 'name',
					children:'dimensionItemVOList'}">
				</el-cascader>
			</el-form-item>
			<el-form-item label="班级/年级：" prop="targetClass">
				<el-cascader class="w300" collapse-tags size="small" placeholder="请选择班级或年级" filterable clearable
					v-model="form.targetClass" :options="GradeClassList" 
					:props="{
					multiple:true, 
					children:'bjList', 
					expandTrigger: 'hover'}"></el-cascader>
			</el-form-item>
			<el-form-item label="奖励类型：" prop="rewardType">
				<el-radio v-model="form.rewardType" label='1'>分数</el-radio>
				<el-radio v-model="form.rewardType" label='2'>勋章</el-radio>
			</el-form-item>
			<el-form-item label="奖励数量：" prop="evaluationRuleScore">
				<el-input 
					v-model="form.evaluationRuleScore.score" 
					size="small" 
					autocomplete="off" 
					maxlength="2" 
					placeholder="请输入1~99数字">
				</el-input>
			</el-form-item>
			<el-form-item label="频次：" prop="evaluationRuleFrequency">
				<el-select size="small" class="w100" v-model="form.evaluationRuleFrequency.type" @change="handleFrequencyChange" placeholder="请选择">
					<el-option v-for="item in options"
						:key="item.value" :label="item.label" :value="item.value"> 
					</el-option>
				</el-select>
				<el-input size="small" class="w60" :disabled="form.evaluationRuleFrequency.type==1" v-model="form.evaluationRuleFrequency.count" autocomplete="off" maxlength="2" placeholder="1~99"></el-input>次
				<el-checkbox style="margin-left: 10px;" v-model="form.weekdayOnly">仅限工作日</el-checkbox>
			</el-form-item> 
			<el-form-item label="有效期：" class="must must3" prop="timeRange">
				<el-date-picker size="small" type="datetimerange" range-separator="~" clearable
					value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
					start-placeholder="开始日期" end-placeholder="结束日期" 
					v-model="form.timeRange" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']"
					> 
				</el-date-picker>
			</el-form-item>
			<el-form-item label="简介：" prop="summary">
				<quill-editor ref="QuillEditor" class="ql-editor-class"
					:content="form.summary" :options="editorOption" @change="onEditorChange($event)"/>
				<el-upload class="genImg" action="/api/evaluation/file/upload" accept="image/*" name='files' :before-upload="(file) => checkSize(file,'image')" :headers="headers"  :on-success="(response,file, fileList)=> handleChange(response,file, fileList,'image')" :on-error="errUpload" :show-file-list="false">
					<el-button id="upimgshow" ref="imgUpload" size="small" type="primary">点击上传</el-button>
				</el-upload>
				<!-- 视频上传 -->
				<el-upload class="genImg" accept="video/*" name='files' action="/api/evaluation/file/upload" :before-upload="(file) => checkSize(file,'video')" :show-file-list="false" :on-success="(response,file, fileList)=> handleChange(response,file, fileList,'video')" :on-error="errUpload" :on-progress="uploadVideoProcess">
					<el-button id="upvideoshow" ref="videofilereset" size="small" type="primary">点击上传</el-button>
				</el-upload>
				<div class="floatBox" v-if="loadProgress">
					<el-progress class="floatsmBox" v-if="loadProgress" type="circle" :percentage="videoUploadPercent"></el-progress>
				</div>
			</el-form-item>
			<el-form-item label="其他：">
				<el-form-item prop="totalContributorCount" style="margin-bottom: 10px;">
					<el-checkbox v-model="form.totalContributorEnable">
						允许多人协作完成，限制
						<el-input :disabled="!form.totalContributorEnable" size="small" v-model="form.totalContributorCount" class="w60" maxlength="2"></el-input>
						人
					</el-checkbox>
				</el-form-item>
				<el-form-item prop="totalTaskCount" style="margin-bottom: 10px;">
					<el-checkbox v-model="form.totalTaskEnable">
						任务领取限制
						<el-input :disabled="!form.totalTaskEnable" size="small" v-model="form.totalTaskCount" class="w60" maxlength="2"></el-input>
						人
					</el-checkbox>
				</el-form-item>
				<el-form-item prop="totalSubmitCount">
					<el-checkbox v-model="form.totalSubmitEnable">
						每日最多提交
						<el-input :disabled="!form.totalSubmitEnable" size="small" v-model="form.totalSubmitCount" class="w60" maxlength="1"></el-input>
						次
					</el-checkbox>
				</el-form-item>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="subTaskSetting">确 定</el-button>
		</span>
	</el-dialog>


</div>
</template>

<script>
import * as api from '@/api/projectapp/evaluationSetting'
import * as baseXnxqApi from '@/api/admin/division';
import * as baseClassApi from '@/api/admin/class';
import Cookies from 'js-cookie'
import * as Quill from 'quill'
// 这里引入修改过的video模块并注册
import Video from './videoUpload.js'
Quill.register(Video, true)
export default {
	name: 'subtask',
	data() {
		var validateNumber = (rule, value, callback) => {
			var reg =  /^[1-9]\d*$/;
			var testValue = value.score;
			if(testValue==''){
				callback('请输入奖励数量')
			} else if (!reg.test(testValue)) {
				callback('请输入1-99之间的数字');
			} else {
				callback();
			}
		}
		var validateFrequency = (rule, value, callback) => {
			var number = value.count;
			var reg =  /^[1-9]\d*$/;
			if(number==''){
				callback('请输入频次')
			} else if (!reg.test(number)) {
				callback('请输入1-99之间的数字');
			} else {
				callback();
			}
		}
		var validateLimit = (rule, value, callback) => {
			var enable = rule.field=='totalContributorCount'?this.form.totalContributorEnable:this.form.totalTaskEnable;
			var reg =  /^[1-9]\d*$/;
			if(value==''&&enable){
				callback('请输入限制人数')
			} else if (!reg.test(value)&&enable) {
				callback('请输入1-99之间的数字');
			} else {
				callback();
			}
		}
		var validateSubmitCount = (rule, value, callback) => {
			var enable = this.form.totalSubmitEnable;
			var reg =  /^[1-9]\d*$/;
			if(value==''&&enable){
				callback('请输入最多提交次数')
			} else if (!reg.test(value)&&enable) {
				callback('请输入1-9之间的数字');
			} else {
				callback();
			}
		}
		// 工具栏配置
		const toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],
			
			[{'header': 1}, {'header': 2}],               // custom button values
			[{'list': 'ordered'}, {'list': 'bullet'}],
			[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
			[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
			[{'direction': 'rtl'}],                         // text direction
			
			[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
			[{'header': [1, 2, 3, 4, 5, 6, false]}],
			
			[{'color': []}, {'background': []}],          // dropdown with defaults from theme
			[{'font': []}],
			[{'align': []}],
			['link', 'image', 'video'],
			['clean']                                         // remove formatting button
		]
		return {
			tableData: [],
			dialogVisible: false,
			form: {
				name: '',
				dimensionName: '',
				dimensionId: '',
				targetClass: [],
				rewardType: '1',
				evaluationRuleScore: {
				score:'',
				},
				evaluationRuleFrequency: {
				type: '3',
				count: ''
				},
				timeRange: [],
				summary: '',
				weekdayOnly: false,
				totalContributorEnable: false,
				totalContributorCount: '',
				totalTaskEnable: false,
				totalTaskCount: '',
				totalSubmitEnable: false,
				totalSubmitCount: '',
			},
			options:[
				{value:"1",label:"仅一次"},
				{value:"2",label:"每天"},
				{value:"3",label:"每周"},
				{value:"4",label:"每月"}
			],
			optionsList: {
				'1': '仅一次',
				'2': '每天',
				'3': '每周',
				'4': '每月',
			},
			dimensionOptions: [],
			GradeClassList:[],                              //年级班级级联菜单
			editorOption: {
				placeholder: '请输入任务简介',
				modules: {
					toolbar: {
						container: toolbarOptions,
						handlers: {
							'image': function(value){
								if (value) {
									document.querySelector('#upimgshow').click()
								} else {
									this.quill.format('image', false);
								}
							},
							'video':function(val){
								document.querySelector('#upvideoshow').click()
								
							}
						}
					}
				},
			},
			rules: {
				name: [
				{ required: true, message: '请输入子任务名称', trigger: 'blur' },
				{ min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'change' }
				],
				dimensionId: [
				{ required: true, message: '请选择维度', trigger: 'change' }
				],
				targetClass: [
				{ required: true, message: '请选择年级或班级', trigger: 'change' }
				],
				rewardType: [
				{ required: true, message: '请选择奖励类型', trigger: 'change' }
				],
				evaluationRuleScore: [
				{ required: true,validator: validateNumber, trigger: ['blur','change'] }
				],
				evaluationRuleFrequency: [
				{ required: true,validator: validateFrequency, trigger: ['blur','change'] }
				],
				timeRange: [
				{ required: true, message: '请选择有效期', trigger: 'change'}
				],
				totalContributorCount: [
				{ validator: validateLimit, trigger: ['blur','change'] }
				],
				totalTaskCount: [
				{ validator: validateLimit, trigger: ['blur','change'] }
				],
				totalSubmitCount: [
				{ validator: validateSubmitCount, trigger: ['blur','change'] }
				],
			},
			pickerOptions:{
				disabledDate(time) {
				return time.getTime() <= (new Date(new Date().toLocaleDateString()).getTime() - 24*60*60*1000);
				},
			},
			categoryId: '',

			// 上传进度条
			loadProgress: false,
			videoUploadPercent: 0,
		}
	},
	computed:{      
		headers: function() {
			return {Authorization: Cookies.get("Admin-Token")}
		},
	},
	mounted() {
		this.init();
		this.$router.name = '测试子任务列表'
	},
	methods:{
		init(){
			this.categoryId = this.$route.query.categoryId;
			if(!this.categoryId){
				this.$notify({
					type: 'error',
					message: '获取主任务id失败'
				})
			}
			this.getDimension();
			this.getAllGradeClass()
			this.getSubCategoryList();
		},
		//获取所有维度供选择
		getDimension(){
			api.getAllDimension().then(res=>{
				var arr = res.value
				this.checkDisable(arr);
				this.dimensionOptions = arr
			})
		},
		//根据hasMedal来检查是否可选
		checkDisable(arr){
			for(var i of arr){
				i.disabled = !i.hasMedal;
				if(i.dimensionItemVOList&&i.dimensionItemVOList.length>0){
					this.checkDisable(i.dimensionItemVOList);
				}
			}
		},
		/**
		 * 获取年级班级信息做一个级联菜单
		 * by:RayJ
		 * time:2019-07-24
		 */
		async getAllGradeClass(){
			var xnxqObj = await baseXnxqApi.Getxndm({xxdm:localStorage.getItem("xxdm")})
			var res = await baseClassApi.GetNjBjList({xxdm:localStorage.getItem("xxdm"),xndm:xnxqObj.data.xn});
			this.GradeClassList = res.data;
			for(var i=0;i<this.GradeClassList.length;i++){
				this.GradeClassList[i].label = this.GradeClassList[i].njmc;
				this.GradeClassList[i].value = this.GradeClassList[i].njdm;
				for(var j=0;j<this.GradeClassList[i].bjList.length;j++){
					this.GradeClassList[i].bjList[j].value = this.GradeClassList[i].bjList[j].uuid;
					this.GradeClassList[i].bjList[j].label = this.GradeClassList[i].bjList[j].bj;
				}
			}
		},
		onEditorChange({ quill, html, text }) {
			this.form.summary = html
		},
		handleClose() {
			this.form = {
				name: '',
				dimensionName: '',
				dimensionId: '',
				targetClass: [],
				rewardType: '1',
				evaluationRuleScore: {
					score:'',
				},
				evaluationRuleFrequency: {
					type: '3',
					count: ''
				},
				timeRange: [],
				summary: '',
				weekdayOnly: false,
				totalContributorEnable: false,
				totalContributorCount: '',
				totalTaskEnable: false,
				totalTaskCount: '',
				totalSubmitEnable: false,
				totalSubmitCount: '',
			}
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate();
			})        
		},
		async changeEvaluation(row){
			var res = await api.getEvaluationItemSubCategoryDetail(row.id);
			if(res.resultCode!==1){
				this.$notify({
					type: 'error',            
					message: res.resultMessage
				})
				return ;
			}
			var value = res.value;
			var form = {
				id: value.id,
				name: value.name,
				dimensionName: value.dimensionName,
				dimensionId: value.dimensionId,
				targetClass: [],
				rewardType: value.rewardType + '',
				evaluationRuleScore: value.evaluationRuleScore,
				evaluationRuleFrequency: value.evaluationRuleFrequency,
				timeRange: [],
				summary: value.summary,
				weekdayOnly: value.weekdayOnly||false,
				totalContributorEnable: value.totalContributorCount?true:false,
				totalContributorCount: value.totalContributorCount||'',
				totalTaskEnable: value.totalTaskCount?true:false,
				totalTaskCount: value.totalTaskCount||'',
				totalSubmitEnable: value.totalSubmitCount?true:false,
				totalSubmitCount: value.totalSubmitCount||'',
			};
			value.evaluationScopeList.forEach(e=>{
				form.targetClass.push([e.gradeCode,e.classCode])
			})
			form.timeRange = [
				value.startTime,
				value.endTime
			]
			form.evaluationRuleFrequency.type += '';
			this.form = form;
			this.dialogVisible = true;
		},
		async subTaskSetting(){
			this.$refs['form'].validate((valid) => {
				if (valid) {
					var param = {
						id: this.form.id,
						categoryId: this.categoryId,
						dimensionId: this.form.dimensionId,
						endTime: this.form.timeRange[1],
						evaluationRuleFrequency:this.form.evaluationRuleFrequency,
						evaluationRuleScore: this.form.evaluationRuleScore,
						evaluationScopeList:[],
						name: this.form.name,
						rewardType: this.form.rewardType,
						startTime: this.form.timeRange[0],
						summary: this.form.summary,
						totalContributorCount: this.form.totalContributorEnable?this.form.totalContributorCount:null,
						totalSubmitCount: this.form.totalSubmitEnable?this.form.totalSubmitCount:null,
						totalTaskCount: this.form.totalTaskEnable?this.form.totalTaskCount:null,
						weekdayOnly: this.form.weekdayOnly,
					}
					this.form.targetClass.forEach(e=>{
						param.evaluationScopeList.push({
							gradeCode: e[0],
							classCode: e[1]
						})
					})
					var queryApi = param.id?api.changeEvaluationItemSubCategory:api.addEvaluationItemSubCategory;
					queryApi(param).then(res=>{
						if(res.resultCode==1){
							this.$notify({
								type: 'success',            
								message: res.resultMessage
							})
							this.getSubCategoryList();
							this.dialogVisible = false;
						} else {
							this.$notify({
								type: 'error',            
								message: res.resultMessage
							})
						}              
					})
				}
			})
		},
		async getSubCategoryList(){
			var res = await api.getEvaluationItemSubCategory({categoryId:this.categoryId});
			if(res.resultCode==1){
				res.value.map(e=>{
					var description = e.summary;
					description = description.replace(/(\n)/g, "");  
					description = description.replace(/(\t)/g, "");  
					description = description.replace(/(\r)/g, "");  
					description = description.replace(/<\/?[^>]*>/g, "");  
					description = description.replace(/\s*/g, "");
					e.detail = description;
					e.deltips = false;
				})
				this.tableData = res.value;
			} else {
				this.$notify({
					type: 'error',            
					message: res.resultMessage
				})
			}
		},
		async deleteEvaluation(row){
			var res = await api.deleteEvaluationItemSubCategoryDetail(row.id);
			if(res.resultCode!==1){
				this.$notify({
					type: 'error',            
					message: res.resultMessage
				})
				return ;
			} else {
				this.$notify({
					type: 'success',            
					message: res.resultMessage
				})
				this.getSubCategoryList();
			}
		
		},
		// 频次修改
		handleFrequencyChange(val){
			if(val==1){
				this.form.evaluationRuleFrequency.count = 1;
			}
		},
		//检查图片大小
		checkSize(file,type){
			// console.log(file,"file")
			// console.log(file.duration,"file.duration")
			// console.log(file.getTime(),"file.getTime")
			// return false;
			let filesize = file.size / 1024 / 1024
			let init;
			if(type == "image") init = 5
			if(type == "video") init = 100
			let isLtM = filesize < init

			if(!isLtM){
				this.$notify({title:'提示',message: (type=='image'?'图片':'视频') + "容量不能大于"+init+"MB!",type:'warning'});
			}
			return isLtM
		},
		//上传图片失败
		errUpload(err, file, fileList){
			if(err.status=='500'){
				this.$notify({
					type: 'error',
					message: '上传失败，请重试！',
					time: 1000
				})
			} else {
				this.$notify({
					type: 'error',
					message: '网络异常，请检查网络后重试！',
					time: 1000
				})
			}
		},
		//上传图片成功
		handleChange(response,file, fileList,type){			
			// 获取富文本组件实例
			let quill = this.$refs.QuillEditor.quill
			if (response.resultCode==1) {
				// 获取光标所在位置
				let length = quill.getSelection().index;
				// 插入，res为服务器返回的图片链接地址
				if(type == "video"){
					this.loadProgress = false;
					this.videoUploadPercent = 0;
				}
				quill.insertEmbed(length, type, response.value[0].absolutePath)
				// 调整光标到最后
				quill.setSelection(length + 1)
			}
		},
		uploadVideoProcess(event, file, fileList){
			this.loadProgress = true;
			this.videoUploadPercent = Math.floor(file.percentage);
		},
	},
}
</script>

<style scoped lang="scss"> 
	/deep/ .ql-editor-class {
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		line-height: 1.42;
		height: 100%;
		outline: none;
		padding: 0 !important;
		tab-size: 4;
		-moz-tab-size: 4;
		text-align: left;
		word-wrap: break-word;

	}
	.genImg{
		display: none;
	}
	.overflow2{
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.w60{
		width: 60px;
	}
	.w100{
		width: 100px;
	}
	.w150{
		width: 150px;
	}
	.w300{
		width: 300px;
	}
	.floatBox{
		position: fixed; top: 0; left: 0;
		width: 100%; height: 100%;
		background-color:  rgba(0,0,0,0.2);
		padding: 0 10%;
		z-index: 10;
	}
	.floatsmBox{
		position: absolute; top: 50%; left: 50%;
		transform: translate(-50%,-50%);
		padding: 50px;
		background-color: #fff;
		border-radius: 10px;
	}
</style>
