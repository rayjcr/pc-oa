<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 17:12:54
 * @LastEditTime: 2019-08-13 18:45:52
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div class="s_display_ib fullLength">
        <el-cascader class="fullLength" v-model="targetClass" :disabled="disable" size="small" placeholder="请选择班级或年级" :options="GradeClassList" filterable :props="{multiple:true, children:'children', expandTrigger: 'hover' }" clearable></el-cascader>
    </div>
</template>
<script>
import * as baseClassApi from '@/api/admin/class';
import * as baseXnxqApi from '@/api/admin/division';
export default {
name:"multipleselect",
data(){
    return{
        targetClass:[],                         //目标范围
        GradeClassList:[],                      //年级班级级联菜单
    }
},
props:{
    /* 是否全选 */
    checkAll:{
        type: Boolean
    },
    /* 是否可点击 */
    disable:{
        type: Boolean
    },
    /* 已经选中的班级或者年级 */
    checkClass:{
        type: Array,
        required: true
    },
    baseList:{
        type: Array,
        required: true
    }
},
created() {
    this.init();
},
watch: {
    'targetClass':function(val){
        this.$emit("change",val);
    }
},
methods: {
    /**
     * 组件初始化方法
     * by:RayJ
     * time:2019-07-29
     */
    init(){
        this.getAllClassData();
    },
    /**
     * 获取年级班级信息做一个级联菜单
     * by:RayJ
     * time:2019-07-29
     */
    async getAllClassData(){
        //var xnxqObj = await baseXnxqApi.Getxndm({xxdm:localStorage.getItem("xxdm")})
        //var res = await baseClassApi.GetNjBjList({xxdm:localStorage.getItem("xxdm"),xndm:xnxqObj.data.xn});
        this.GradeClassList = _.cloneDeep(this.baseList);
        for(var i=0;i<this.GradeClassList.length;i++){
            this.GradeClassList[i].label = this.GradeClassList[i].name;
            this.GradeClassList[i].value = this.GradeClassList[i].code;
            for(var j=0;j<this.GradeClassList[i].children.length;j++){
                this.GradeClassList[i].children[j].value = this.GradeClassList[i].children[j].code;
                this.GradeClassList[i].children[j].label = this.GradeClassList[i].children[j].name;
                //如果是全选那就把每个班级都push到已选数组中

                console.log(this.checkAll,7777)
                if(this.checkAll){
                    this.targetClass.push([this.GradeClassList[i].value,this.GradeClassList[i].children[j].value]);
                }else{
                    this.targetClass = $.extend(true,[],this.checkClass);
                }
            }
        }
        
    },
},
}
</script>
<style scoped>
.fullLength{
    width: 100%;
}
</style>
