<template>
    <div class="app-container" style="position: relative;">
        <div class="u_TableMain noTransform ofhide" style="width:300px;">
            <el-tabs v-model="activeTab" @tab-click="changeSet" class="tabs">
                <el-tab-pane label="首页应用设置" name="appset">
                    <div class="settingMain">
                        <div class="areaBox">
                            <div class="genTableTit">A区（可投放多个应用，轮播展示）</div>
                            <div class="genSmallTit">推荐应用</div>
                            <div class="tjList clear">
                                <div class="appBox">班级课表</div>
                                <div class="appBox">考勤展示</div>
                                <div class="appBox">学生风采</div>
                                <div class="appBox">班级竞赛</div>
                            </div>
                            <div class="genSmallTit">其他应用</div>
                            <div class="tjList clear">
                                <el-select class="checkApp" size="small" v-model="appStr" multiple clearable placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                
                            </div>
                        </div>

                        <div class="areaBox clear">
                            <div class="areaColBox" style="border-right:1px solid #ddd;">
                                <div class="genTableTit">B区</div>
                                <div class="genSmallTit">推荐应用</div>
                                <div class="tjList clear">
                                    <div class="appBox">班级课表</div>
                                </div>
                                <div class="genSmallTit">其他应用</div>
                                <div class="tjList clear">
                                    <el-select class="checkApp" size="small" v-model="appStr" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                    
                                </div>
                            </div>

                            <div class="areaColBox" style="padding-left:10px;padding-right:0px;">
                                <div class="genTableTit">C区</div>
                                <div class="genSmallTit">推荐应用</div>
                                <div class="tjList clear">
                                    <div class="appBox">班级课表</div>
                                </div>
                                <div class="genSmallTit">其他应用</div>
                                <div class="tjList clear">
                                    <el-select class="checkApp" size="small" v-model="appStr" placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                    
                                </div>
                            </div>

                        </div>

                        <div class="areaBox">
                            <div class="genTableTit">通知区</div>
                            <div class="tjList clear" style="margin-top:10px;">
                                <el-select class="checkApp" size="small" v-model="appStr" placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>




                    </div>
                </el-tab-pane>
                <el-tab-pane label="模板风格" name="styleset">模板风格</el-tab-pane>
            </el-tabs>
        </div>

        <div class="showClassCard"></div>

    </div>
</template>

<script>
import _ from 'lodash';
import * as qualityApi from '@/api/projectapp/qualityAppraisal';
export default {
    name: "setReport",
    components: {

    },
    data() {
        return {
            activeTab:"appset",
            options: [{
                value: '班级竞赛',
                label: '班级竞赛'
            }, {
                value: '学生风采',
                label: '学生风采'
            }, {
                value: '班级课表',
                label: '班级课表'
            }, {
                value: '考勤展示',
                label: '考勤展示'
            }, {
                value: '班级相册',
                label: '班级相册'
            }],
            appStr: [],
        }
    },
    mounted(){

    },
    methods: {
        changeSet(){

        },
    }
}
</script>

<style scoped lang="scss">
*{
    font-family: "微软雅黑";
}
.genTableTit{
    font-size: 16px;
}
.genSmallTit{
    width: 100%;
    margin-top: 10px;
    padding-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
}
.tjList{
    width: 100%;
}
.settingMain{
    padding: 0 20px;
}
.tabs{
    /deep/ .el-tabs__nav{
        width: 100%;
    }
    /deep/ .el-tabs__item{
        width: 50%;
        padding: 0;
        text-align: center;
    }
    /deep/ .el-tabs__item.is-active{
        background: #409eff;
        color: #FFF;
    }
}
.areaBox{
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    .areaColBox{
        width: 50%;
        padding-right: 10px;
        float: left;
    }
    .appBox{
        width: 45px;
        height: 45px;
        border-radius: 5px;
        float: left;
        border: 1px solid #409eff;
        text-align: center;
        padding: 5px;
        line-height: 16px;
        font-size: 12px;
        margin-right: 10px;
        background: #409eff;
        color: #FFF;
    }

    .checkApp{
        width: 100%;
        /deep/ .el-select__tags{
            z-index: 2;
        }
    }  
}

.showClassCard{
    width: 1000px;
    height: 564px;
    // background: #FFF;
    border-radius: 20px;
    position: absolute;
    left: 340px;
    top: 0px;
    background: url("/static/classcard/classcard.jpg") no-repeat center;
    background-size: 100% 100%;
}


</style>
