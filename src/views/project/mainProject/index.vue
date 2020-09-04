<template>
<div class="app-container calendar-list-container" >

    <div class="u_TableMain block ofhide" type="border-card">
        <div v-if="!xmqzFormVisible">
            <div class="filter-container">
                <el-form :model="formSearch" ref="Searchform" label-position="left">
                    <el-row style="padding-bottom:5px; float:left;">

                        <div class="selectBox">
                            <div class="label" label="学年学期">学年学期</div>
                            <el-select v-model="formSearch.xn" style="width:150px;" clearable placeholder="请选择" @change="searchFn">
                                <el-option v-for="(item,index) in xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
                            </el-select>
                            <el-select v-model="formSearch.xq" style="width:150px;"  clearable placeholder="请选择" @change="searchFn">
                                <el-option v-for="(item,index) in xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
                            </el-select>
                            
                        </div>


                        <div class="selectBox">
                                <div class="label" label="年级">年级</div>
                                <el-select style="width:150px;" v-model="formSearch.njdm" clearable placeholder="请选择" @change="searchFn">
                                    <el-option v-for="(item,index) in njList" :key="index" :label="item.njmc" :value="item.njdm"></el-option>
                                </el-select>
                        </div>

                        <div class="selectBox">
                            <div style="float" v-if="xxlm=='007'">
                                <div class="label" label="专业/科目">专业/科目</div>
                                <el-cascader style="width:150px;" :options="zyList" v-model="formSearch.zykc" change-on-select :props="zyprops" @change="searchFn" clearable></el-cascader>
                            </div>
                            <div style="float"  v-else>
                                <div class="label" label="学科">学科</div>
                                <el-select style="width:150px;" v-model="formSearch.kcid" clearable placeholder="请选择" @change="searchFn">
                                    <el-option v-for="(item,index) in kcList" :key="index" :label="item.kcmc" :value="item.uuid"></el-option>
                                </el-select>
                            </div>
                        </div>

                        <div class="selectBox">
                            <div class="label" label="标签">标签</div>
                            <el-select collapse-tags v-model="formSearch.bqid" filterable multiple clearable placeholder="请选择" @change="searchFn">
                                <el-option v-for="(item,index) in bqlist" :key="index" :label="item.mc" :value="item.uuid"></el-option>
                            </el-select>
                        </div>


                    </el-row>
                </el-form>
                <div class="xmHeader">
                    <el-popover placement="bottom-start" width="340" trigger="click">
                        <div class="copyDialog">
                            <div class='copyHead'>按学期复制:</div>
                            <div class="copyBody">
                                <div class="col">
                                    <div class="label" label="学年学期">学年学期</div>
                                    <el-select size="mini" v-model="copySelect.xn" style="width:110px;"  clearable placeholder="请选择">
                                        <el-option v-for="(item,index) in xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
                                    </el-select>
                                    <el-select size="mini" v-model="copySelect.xq" style="width:90px;"  clearable placeholder="请选择">
                                        <el-option v-for="(item,index) in xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
                                    </el-select>
                                </div>
                                <div class="col">
                                    将所有项目、子项目、任务
                                </div>
                                <div class="col">
                                    <span class="gray">
                                    复制至 {{xnxq.xn}} {{xnxq.xq=='01'?'上学期':'下学期'}} (当前学年学期)</span>
                                </div>
                                <div class="col">
                                    <span class="red">提示：跨学年复制后，任务发布给全年级所有班级，走班项目不可复制</span>
                                </div>

                                <div class="col alignRight">
                                    <!-- <el-button size="small">取消</el-button> -->
                                    <el-button :loading="iscopy" size="small" type="primary" @click="copySemester">确定</el-button>
                                </div>

                            </div>
                        </div>
                        <el-button type="primary" slot="reference" v-show="lguserType=='1'||lguserType=='2'" :disabled="xmKindpage.length>0" >按学期复制</el-button>
                    </el-popover>
                    <el-button type="primary" @click="reportScore" :disabled="loading">成绩上报</el-button>
                    <el-dropdown @command="newImport">
                        <el-button type="primary">数据导入</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="xm">项目数据导入</el-dropdown-item>
                            <el-dropdown-item command="bz">评分标准导入</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            
            
            <div class="m_GenTableBox">
                <div style="overflow:hidden;"  v-loading.body="listLoading">
                    <el-card class="partbox-card" shadow="hover" v-for="(item,index) in xmKindpage" :key="index">
                        <div class="partkn">
                            <div v-if="item.kcmc" class="card-kcmc">{{xxlm=='007'?(item.zymc+(item.kcmc?'/'+item.kcmc:'')):item.kcmc}}</div>
                            <div v-else class="card-kcmc">其他</div>
                            <el-tag size="mini">{{item.njmc}}</el-tag>
                        </div>
                        <div class="partcon">
                            <el-card class="box-card" shadow="hover"  v-for="(list,ind) in item.list" :key="ind">
                                <div class="card-mask">
                                    <div><el-button type="primary" class="kzbtn" size="mini" plain @click.native="handleView(list)">查看项目</el-button></div>
                                    <div v-if="list.jflx!=3 && list.jflx!=4 && list.jflx!=5">
                                        <el-button type="primary" class="kzbtn" size="mini" plain @click.stop="handleSetqz(list)">权重设置</el-button>
                                    </div>
                                    <div>
                                        <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop ="handleUpdate(list)">修 改</el-button>
                                        <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop="handleDelete(list)" v-if="list.xmlx == 0">删 除</el-button>
                                    </div>
                                    <div>
                                        <el-button type="primary" class="kzbtn-cen" size="mini" @click.stop="handleCopy(list)" plain>创建副本</el-button>
                                        <el-button type="primary" class="kzbtn-cen" size="mini" @click.stop="handleSetpfbz(list)" plain>评分标准</el-button>
                                    </div>
                                </div>
                                <div class="card-title">{{list.mc}}</div>
                                <div class="card-desc">
                                    <span>总任务 {{list.rwsl}}</span><span v-if="list.ywzx == 1" class="desc-son"> ( 子项目 {{list.zxmsl}})</span>
                                </div>
                                
                                <div class="card-progress">
                                    
                                    <el-progress v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" :percentage="0" v-if="list.ysbsl == 0"></el-progress>

                                    <!--这里的写法不好需要优化 el-progress status必须要输入固定的字符串 -->
                                    <el-progress v-show="list.ysbsl==list.rwsl" v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" status='success' :percentage="Math.floor(100 * list.ysbsl/list.rwsl)" v-if="list.ysbsl > 0"></el-progress>

                                    <el-progress v-show="list.ysbsl!=list.rwsl" v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" :percentage="Math.floor(100 * list.ysbsl/list.rwsl)" v-if="list.ysbsl > 0"></el-progress>

                                    

                                </div>
                            </el-card>
                        </div>
                    </el-card>
                </div>

                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="xmpageQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="xmpageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                </div>
            </div>
        </div>
        <!-- 设置权重 -->
        <div class="contain-setqz" v-if="xmqzFormVisible">
            <div class="setqzTop clear">
                <span class="name">设置权重</span>
                <div class="exptips">示例说明：语文总积分=第一次月考×15%+第二次月考×15%+期中考试×25%+第三次月考×15%+期末考试×30%</div>
            </div>
            <el-form :model="setXmqzform" ref="setXmqzform" label-width="80px">
                <div class="partkn">
                    <div class="card-kcmc">{{xxlm=='007'?(XmqzRes.zymc+(XmqzRes.kcmc?'/'+XmqzRes.kcmc:'')):XmqzRes.kcmc}}</div>
                    <el-tag size="mini">{{XmqzRes.njmc}}</el-tag>
                </div>
                <div v-if="XmqzList.length<1" class="empty">暂无数据</div>
                <div v-if="XmqzList.length>0" class="layXmqz_setLi clear">
                    <div class="Xmqz_setTit">
                        <div class='xmmc'>{{XmqzRes.mc}}</div>
                        <div class='xmtype'>(项目)</div>
                    </div>
                    <span class="signalg">=</span>
                    <div class="part">
                        <div class="Xmqz_setItem" v-for="(item,index) in alreadysetqz" :key="index">
                            <div class="border">
                                <i class="el-icon-close" @click="closesetqz(alreadysetqz,item)"></i>
                                <div class="rowsel">
                                    <el-select v-model="item.uuid" placeholder="请选择">
                                        <el-option v-for="data in XmqzList" :key="data.uuid" :label="data.mc" :value="data.uuid"></el-option>
                                    </el-select>
                                </div>
                                <div class="rowsign">
                                    <el-select v-model="item.jsfsbm" placeholder="请选择" class="ysfh-jsfs" size="small">
                                        <el-option label="×" :value="1">×</el-option>
                                        <el-option label="÷" :value="2">÷</el-option>
                                    </el-select>
                                </div>
                                <div class="rowinpapp">
                                    <el-input v-model="item.qzbfb" placeholder="100" class="hsInput"><template slot="append">%</template></el-input>
                                </div>
                                <span class="signalg">×</span>
                                <div class="rowinp">
                                    <el-input v-model="item.qzcs" placeholder="1" class="hsInput"></el-input>
                                </div>
                            </div>
                            <span class="signalg">+</span>
                        </div>
                        <div class="Xmqz_setAdd" @click="xmqzAdd(alreadysetqz)">
                            <div class="border">
                                <i class="el-icon-circle-plus-outline"></i>
                                <span>添加加数</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layXmqz_setLi clear" v-if="XmqzList.length>0 && XmqzRes.ywzx" v-for="(item,index) in XmqzList" :key="index">
                    <div class="Xmqz_setTit">
                        <div class='xmmc'>{{item.mc}}</div>
                        <div class='xmtype'>(子项目)</div>
                    </div>
                    <span class="signalg">=</span>
                    <div class="part">
                        <div v-if="item.ysRwQzSettingList.length<1" class="empty" style="height:62px; line-height:62px; text-align:left;">暂无数据</div>
                        <div class="Xmqz_setItem" v-if="item.ysRwQzSettingList.length>0" v-for="(setIt,ind) in item.ysRwQzSettingList" :key="ind">
                            <div class="border">
                                <i class="el-icon-close" @click="closesetqz(item.ysRwQzSettingList,setIt)"></i>
                                <div class="rowsel">
                                    <el-select v-model="setIt.uuid" placeholder="请选择">
                                        <el-option v-for="data in item.rwQzSettingList" :key="data.uuid" :label="data.mc" :value="data.uuid"></el-option>
                                    </el-select>
                                </div>
                                <div class="rowsign">
                                    <el-select v-model="setIt.jsfsbm" placeholder="请选择" class="ysfh-jsfs" size="small">
                                        <el-option label="×" :value="1">×</el-option>
                                        <el-option label="÷" :value="2">÷</el-option>
                                    </el-select>
                                </div>
                                <div class="rowinpapp">
                                    <el-input v-model="setIt.qzbfb" placeholder="100" class="hsInput"><template slot="append">%</template></el-input>
                                </div>
                                <span class="signalg">×</span>
                                <div class="rowinp">
                                    <el-input v-model="setIt.qzcs" placeholder="1" class="hsInput"></el-input>
                                </div>
                            </div>
                            <span class="signalg">+</span>
                        </div>
                        <div class="Xmqz_setAdd" v-if="item.ysRwQzSettingList.length>0" @click="xmqzAdd(item.ysRwQzSettingList)">
                            <div class="border">
                                <i class="el-icon-circle-plus-outline"></i>
                                <span>添加加数</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="center-footer">
                <el-button type="primary" :disabled="btnLimt" @click="setXmqzSure"  v-if="XmqzList.length>0">保 存</el-button>
                <el-button @click="setXmqzCancel">取 消</el-button>
            </div>
        </div>





    </div>

    <div class="menu-btn">
        <div>
            <el-button circle type="primary" icon="el-icon-plus" @click="handleCreate" class="create-btn"></el-button>
        </div>
    </div>

    <!-- 新建项目弹层 -->
    <el-dialog :title="textMap[dialogStatus]"  :close-on-click-modal='false'  :visible.sync="createFormVisible" width="850px" :before-close="createCancel" class="dialogprog">
        <el-form :model="form" ref="createform" label-width="110px" :rules="rules">
            <el-form-item label="学年学期" required>
                <el-row>
                    <!-- <el-col :span="9"><el-input disabled :value="xnxq.xn+'年'"></el-input></el-col> -->
                    <!-- <el-col :span="9" :offset="1"><el-input disabled :value="xnxq.xqmc"></el-input></el-col> -->

                    <el-col :span="9"><el-input disabled :value="form.xn+'年'"></el-input></el-col>
                    <el-col :span="9" :offset="1"><el-input disabled :value="form.xq=='01'?'上学期':'下学期'"></el-input></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="项目名称" prop="mc">
                <el-input v-model="form.mc" placeholder="请输入项目名称" :disabled="form.xmlx != 0"></el-input>
            </el-form-item>
            <el-form-item label="适用年级" prop="njdm">
                <el-radio-group v-model="form.njdm" :disabled='!isCanUpdata'>
                    <el-radio v-for="(item,index) in njList" :key="index" :label="item.njdm" border :disabled='form.xmlx != 0'>{{item.njmc}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="适用专业" prop="zykc" v-if="xxlm=='007'">
                <el-cascader :disabled='form.xmlx != 0 || !isCanUpdata' :options="zyList" v-model="form.zykc" change-on-select :props="zyprops" clearable ></el-cascader> 
                <span class="tipslayer">提示：适用学科和标签至少填一项</span>
            </el-form-item>
            <el-form-item label="适用学科" prop="kcid" v-if="xxlm!='007'">
                <el-select v-model="form.kcid" clearable placeholder="请选择" :disabled='!isCanUpdata'>
                    <el-option :disabled='form.xmlx != 0'
                        v-for="(item,index) in gradeKcList[form.njdm]" :key="index" :label="item.kcmc" :value="item.uuid">
                    </el-option>
                </el-select>
                <span class="tipslayer">提示：适用学科和标签至少填一项</span>
            </el-form-item>
            <el-form-item label="学科/专业标签" prop="bqid">
                <el-select v-model="curbq" multiple filterable allow-create default-first-option placeholder="请选择标签">
                    <el-option v-for="bqitem in bqlist" :key="bqitem.mc" :label="bqitem.mc" :value="bqitem.mc">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 添加排序beg -->
            <el-form-item label="排序">
                <el-input-number v-model="px" :min="0" :max="9999"></el-input-number>
            </el-form-item>
            <!-- 添加排序end -->
            <el-form-item label="有无子项" required>
                <el-radio v-model="ywzx" label='0' :disabled="form.xmlx != 0 || !isCanUpdata" @change="ywzxChange">无</el-radio>
                <el-radio v-model="ywzx" label='1' :disabled="form.xmlx != 0 || !isCanUpdata" @change="ywzxChange">有</el-radio>
            </el-form-item>

            <!--这里是无子项的分类-->
            <div v-if="ywzx == 0">
                <el-form-item label="计分类型" required  style="margin-bottom:10px;">
                    <el-radio v-model="jflxsel" label="0" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">原始数据换算成学分</el-radio>
                    <el-radio v-model="jflxsel" label="1" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">原始数据换算成等级</el-radio>
                    <el-radio v-model="jflxsel" label="2" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">保留原始数据，不做换算</el-radio>
                    <!--
                        根据jflxsel的数值有组合的显示下列计分形式 
                        0 原始数据换算成学分  1 原始数据换算成等级   2 保留原始数据，不做换算
                    -->
                    <div class="dashdiv">
                        原始数据：
                        <el-radio v-model="jflx" label="0" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">成绩分值</el-radio>
                        <el-radio v-model="jflx" label="1" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">累积任务数</el-radio>
                        <el-radio v-model="jflx" label="7" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">加减分</el-radio>
                        <el-radio v-model="jflx" label="3" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=0">等级</el-radio>
                        <el-radio v-model="jflx" label="5" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">体育数据</el-radio>
                        <el-radio v-model="jflx" label="4" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">图文评语</el-radio>
                        <!--元通小学项目时添加学分选项 20190509 14:28-->
                        <el-radio v-model="jflx" label="2" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=0">学分</el-radio>
                    </div>
                </el-form-item>

                <!--
                    计分类型为 0 或者 1 (排除不做转换jflxsel!=2 相当于自动排除 jflx为3,4,5)
                    且
                    计分类型不是 累计任务类型(jflx != 1)
                -->
                <el-form-item required v-if="(jflx!=1 && jflxsel!=2)&&!(jflxsel==1&&jflx==3)">

                    <div class='exptips'>{{expObj[jflxsel+jflx]}}</div>
                    <div class="baseval" v-if="jflx == 7">基准值为
                        <el-input-number v-model="form.jzz" :min="0" :max="500" :disabled='!isCanUpdata'></el-input-number>
                    </div>

                    <div class="baseval" v-if="jflxsel==1&&jflx==2">项目最高学分:
                        <el-input class="maxfxval" v-model="form.zgxf" :min="0" :max="500" ></el-input>
                    </div>

                    <div class="baseval"  v-if="jflx==0||jflx==2">
                        转换方式: 
                        <div class="hsType">
                            <el-radio v-model="hsType" label='0' :disabled="!isCanUpdata" @change="hsTypeChange" >数值型</el-radio>
                            <el-radio v-if="jflxsel==1" v-model="hsType" label='2' :disabled="!isCanUpdata" @change="hsTypeChange" >百分比</el-radio>
                            <el-radio v-model="hsType" label='1' :disabled="!isCanUpdata" @change="hsTypeChange" >班级排名</el-radio>

                            <el-radio v-if="jflxsel==1" v-model="hsType" label='3' :disabled="!isCanUpdata" @change="hsTypeChange">年级排名</el-radio>
                        </div>
                    </div>

                    <!--数值型转换-->
                    <div class="hsItem" v-if="hsType=='0'" v-for="(item,index) in HsRange" :key="index">
                        <div class="dashed">
                            最小值
                            <el-input v-model="item.zxz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            <span>至</span>
                            最大值
                            <el-input v-model="item.zdz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            区间
                        </div>
                        换算为
                            <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>{{jflxsel==0?'学分':'等级'}}</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>

                    <!--百分比转换-->
                    <div class="hsItem" v-if="hsType=='2'" v-for="(item,index) in HsRange" :key="index">
                        <div class="dashed">
                            最小百分比
                            <el-input v-model="item.zxz" placeholder="0%~100%" class="hsInputmini per" size="small" :disabled='!isCanUpdata'></el-input>%
                            <span>至</span>
                            最大百分比
                            <el-input v-model="item.zdz" placeholder="0%~100%" class="hsInputmini per" size="small" :disabled='!isCanUpdata'></el-input>%
                            区间
                        </div>
                        换算为
                            <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>{{jflxsel==0?'学分':'等级'}}</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>


                    <!--班级排名-->
                    <div class="baseval" v-if="hsType=='1'||hsType=='3'">
                        最高成绩: 
                        <el-input v-model="form.zgcj" placeholder="0~100" class="hsInput zgcj" size="small" :disabled='!isCanUpdata'></el-input>
                    </div>

                    <div class="hsItem" v-if="hsType=='1'||hsType=='3'" v-for="(item,index) in perHsRange" :key="index">
                        <div class="dashed">
                            前
                            <el-input v-model="item.zdz" placeholder="0~100" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>%
                        </div>
                        换算为
                            <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>{{jflxsel==0?'学分':'等级'}}</span>

                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>











                    <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠，区间重合处将以较高的区间进行换算)</span></el-button>
                </el-form-item>

                <!--胜利小学等级转等级 (2A、0C 转 A) 这类-->
                <el-form-item required v-if="jflxsel==1&&jflx==3">
                    <!-- <div class="baseval" v-if="jflxsel==1&&jflx==2">项目最高学分:
                        <el-input class="maxfxval" v-model="form.zgxf" :min="0" :max="500" ></el-input>
                    </div> -->
                    <div class="djlx">
                        <el-radio v-model="djlx" label="6" @change="djlxChange">获取转换等级</el-radio>
                        <el-radio v-model="djlx" label="4" @change="djlxChange">获取最高等级</el-radio>
                        <el-radio v-model="djlx" label="5" @change="djlxChange">获取星级任务的最高等级</el-radio>
                    </div>

                    <div v-if="djlx==5" style="color:#444;margin-left: 20px;">提示：若将任务设置为星级任务，则项目等级=所有星级任务的最高等级</div>

                    

                    <!--数值型转换-->
                    <div class="hsItem djRight" v-if="djlx==6" v-for="(item,index) in HsRange" :key="index">

                        <div v-if="index<HsRange.length-1">
                            <div class="dashed">
                                <div class="fl" v-for="(sitem,sindex) in item.djsZhList">
                                    <el-select size="small" class="djiptsel" v-model="sitem.djz" placeholder="等级">
                                        <el-option v-for="djitem in djList" :key="djitem" :label="djitem" :value="djitem">
                                        </el-option>
                                    </el-select>

                                    <el-select size="small" class="djiptsel" v-model="sitem.lx" placeholder="类型">
                                        <el-option v-for="djlxItem in djlxSel" :key="djlxItem.value" :label="djlxItem.label" :value="djlxItem.value">
                                        </el-option>
                                    </el-select>

                                    <el-input size="small" class="djipt" v-model="sitem.sl"placeholder="数量"></el-input>
                                    
                                </div>
                                <div class="flcontral el-icon-minus" @click="djCut(index)"></div>
                                <div class="flcontral el-icon-plus" @click="djAdd(index)"></div>
                            </div>
                            <div class="djCol">
                                换算为
                                    <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="djhsInput" size="small" :disabled='!isCanUpdata'></el-input>
                                <span>{{jflxsel==0?'学分':'等级'}}</span>
                                <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                            </div>
                        </div>
                        <div v-if="index==HsRange.length-1">

                            <div class="djCol" style="float:left;">
                                    其他情况均换算为
                                    <el-select size="small" class="djiptsel" v-model="item.sz" placeholder="等级">
                                        <el-option v-for="djitem in djList" :key="djitem" :label="djitem" :value="djitem">
                                        </el-option>
                                    </el-select> 
                            </div>

                        </div>

                    </div>

                    <el-button icon="el-icon-plus" v-if="djlx==6" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠，区间重合处将以较高的区间进行换算)</span></el-button>


                </el-form-item>


                <!--如果是累计任务并且不是保留原始数据-->
                <el-form-item style="margin-bottom:0px;" v-if="jflx==1&&jflxsel==1">  
                    <div class="baseval">
                        转换方式: 
                        <div class="hsType">
                            <el-radio v-model="rwzhfs" label='0' :disabled="!isCanUpdata" @change="rwhsTypeChange">个数型</el-radio>
                            <el-radio v-model="rwzhfs" label='1' :disabled="!isCanUpdata" @change="rwhsTypeChange">百分比</el-radio>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item required v-if="jflx == 1 && jflxsel!=2">
                    <div class='exptips'>{{expObj[jflxsel+jflx]}}</div>
                    <div class="hsItem" v-for="(item,index) in HsRange" :key="index">
                        累计完成
                        <el-input v-model="item.zxz" :placeholder="rwzhfs=='0'?'0~500':'0%~100%'" class="hsInputmini" size="small" v-if="item.type != 2" :disabled='!isCanUpdata'></el-input>{{(item.type != 2&&rwzhfs=='1')?'%':''}}
                        <span v-if="item.type == 1">至</span>
                        <el-input v-model="item.zdz" :placeholder="rwzhfs=='0'?'0~500':'0%~100%'" class="hsInputmini" size="small" v-if="item.type != 0" :disabled='!isCanUpdata'></el-input>{{(item.type !== 0&&rwzhfs=='1')?'%':''}}
                        <span v-if="item.type == 0">及以上任务获得</span>
                        <span v-if="item.type == 2">及以下任务获得</span>
                        <span v-if="item.type == 1">任务获得</span>
                            <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>{{jflxsel==0?'学分':'等级'}}</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="item.type == 1" :disabled='!isCanUpdata'></el-button>
                    </div>
                    <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠，区间重合处将以较高的区间进行换算)</span></el-button>
                </el-form-item>

                
            </div>
            <!-- 有子项的提示 -->
            <div v-else style="color: red;margin-left: 20px;margin-top: -16px;"><span>提示</span> ：子项目的成绩换算，先计算项目下的各任务原始成绩之和，再进行成绩换算
            </div>

            <!--转换等级开启-->
            <div v-if="ywzx == 1 || (jflxsel==0&&jflx==0)">
                <el-form-item label="转化等级" required>
                    <el-radio v-model="zhdj" label='0' :disabled="form.xmlx != 0 || !isCanUpdata">否</el-radio>
                    <el-radio v-model="zhdj" label='1' :disabled="form.xmlx != 0 || !isCanUpdata">是</el-radio>
                </el-form-item>
                
                <!--选择转换类型 -->
                <el-form-item>  
                    <div class="baseval" v-if="zhdj == 1">
                        转换方式: 
                        <div class="hsType">
                            <el-radio v-model="djhsType" label='0' :disabled="form.xmlx != 0 || !isCanUpdata"  @change="jfdjChange">数值型</el-radio>
                            <el-radio v-model="djhsType" label='2' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >百分比</el-radio>
                            <el-radio v-model="djhsType" label='1' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >班级排名</el-radio>

                            <el-radio v-model="djhsType" label='3' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >年级排名</el-radio>

                            <!-- <el-radio v-model="djhsType" label='3' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >年级排名</el-radio> -->

                            <!-- <el-radio v-model="djhsType" label='1' :disabled="form.xmlx != 0 || !isCanUpdata"  @change="jfdjChange">百分比</el-radio> -->
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="换算规则" required v-if="zhdj == 1">

                    <!--数值型转换-->
                    <div class="hsItem" v-if="djhsType=='0'" v-for="(item,index) in zhdjHsRange" :key="index">
                        <div class="dashed">
                            最小值
                            <el-input v-model="item.zxz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            <span>至</span>
                            最大值
                            <el-input v-model="item.zdz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            区间
                        </div>
                        换算为
                            <el-input v-model="item.sz" placeholder="请输入ABCD" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>等级</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletezhdj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>

                    <!--百分比转换-->
                    <div class="hsItem" v-if="djhsType=='2'" v-for="(item,index) in zhdjHsRange" :key="index">
                        <div class="dashed">
                            最小百分比
                            <el-input v-model="item.zxz" placeholder="0%~100%" class="hsInputmini per" size="small" :disabled='!isCanUpdata'></el-input>%
                            <span>至</span>
                            最大百分比
                            <el-input v-model="item.zdz" placeholder="0%~100%" class="hsInputmini per" size="small" :disabled='!isCanUpdata'></el-input>%
                            区间
                        </div>
                        换算为
                            <el-input v-model="item.sz" placeholder="请输入ABCD" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>等级</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletezhdj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>

                    <!--班级排名转换-->
                    <div class="hsItem" v-if="djhsType=='1'||djhsType=='3'" v-for="(item,index) in perDjHsRange" :key="index">
                        <div class="dashed">
                            前
                            <el-input v-model="item.zdz" placeholder="0~100" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>%
                        </div>
                        换算为
                            <el-input v-model="item.sz" placeholder="请输入ABCD" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>等级</span>

                        <el-button type="text" icon="el-icon-minus" @click="deletezhdj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>



                    <el-button icon="el-icon-plus" @click="addzhdj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠，区间重合处将以较高的区间进行换算)</span></el-button>
                </el-form-item>
            </div>


            <div style="color:red;margin-left: 20px;"><span>注意事项</span> : 项目创建后如果各子项之间和各任务之间有计算规则的，请不要忘记设置权重规则
                <span class="setqz" v-if="dialogStatus=='update'" @click="handleSetqz(form)">权重设置</span>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createSubmit('createform')" :disabled="btnLimt">保 存</el-button>
            <el-button @click="createCancel">取 消</el-button>
        </div>
    </el-dialog>

    <!-- 评分标准弹层 -->
    <el-dialog title='评分标准' width="440px"  :close-on-click-modal='false' :visible.sync="pfbzDialogVisible" append-to-body :before-close="pfbzCancel">
        <el-form label-width="110px" label-position="top">
            <el-form-item>
                <el-input type="textarea" :rows="12" maxlength="5000" placeholder="请输入内容" v-model="pfbz"></el-input>
            </el-form-item>

            <el-form-item>
                <el-upload
                class="upimgLi"
                action="/api/netcore/smartcredit/v1/Upload/UploadFile"
                :headers="headers"
                list-type="picture-card"
                :file-list="upImageList"
                :on-error="handleError"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-exceed="outLimit"
                :limit=1
                >
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="upImgVisible">
                    <img width="100%" :src="upImageUrl" alt="">
                </el-dialog>

            </el-form-item>



        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="pfbzSubmit">确 定</el-button>
            <el-button @click="pfbzCancel">取消</el-button>
        </div>
    </el-dialog>


    <!-- 数据导入弹层 -->
    <el-dialog title="项目数据导入" :visible.sync="rwImportData" width="540px" class="import_box">
        
        <el-alert  title="导入前需创建好所有任务,确定全部创建完成?"   type="info"   close-text="知道了"></el-alert>

        <el-row style="margin:10px 0;">
            <el-col :span="6" class="colLineTit">执行学科：</el-col>
            <el-col :span="18">
                <el-select v-model="BatchSelKc" size="small"  placeholder="请选择" @change="changeKc">
                    <el-option v-if="item.kcmc" v-for="item in hasKcList" :key="item.kcid" :label="item.kcmc" :value="item.kcid"></el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row style="margin:10px 0;">
            <el-col :span="6" class="colLineTit">执行标签：</el-col>
            <el-col :span="18">
                <el-select v-model="BatchBq" size="small"  multiple filterable allow-create default-first-option placeholder="请选择标签" @change="changeKc">
                    <el-option v-for="(item,index) in bqlist" :key="index" :label="item.mc" :value="item.uuid">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>


        <el-row style="margin-bottom:10px;">
            <el-col :span="6" class="colLineTit">执行班级：</el-col>
            <el-col :span="18">
                <el-select v-model="BatchSelClass" clearable :disabled="!hasBjList.length" size="small"  placeholder="请选择">
                    <el-option v-for="item in hasBjList" :key="item.uuid" :label="item.bj" :value="item.uuid"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class="colLineTit">文件选择：</el-col>
            <el-col :span="18">
                <el-upload
                    :limit="1"
                    name="excelfile"
                    ref="BatchbzForm"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action="/api/netcore/smartcredit/v2/Xmcj/BatchImportExcel"
                    :headers="headersV2"
                    :file-list="bzList"
                    :onError="uploadError"
                    :onSuccess="(res,file,fileList)=>{return uploadSuccess(res,file,fileList,'xm')}"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <el-row> 
            <el-col :span="6" class="colLineTit">失败数据详情：</el-col>
            <!-- <div class="errDataTit">导入失败数据详情：</div> -->
            <el-table
            :data="errData"
            style="width: 100%;max-height: 200px;
                            overflow-y: scroll;">
            <el-table-column
                width="100"
                prop="xm"
                label="姓名">
            </el-table-column>

            <el-table-column
                prop="errorMessage"
                label="错误信息">
            </el-table-column>

            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="importSubmit('BatchbzForm')">确 定</el-button>
            <el-button size="medium" @click="BatchimportCancel">取 消</el-button>
            <el-button size="medium" @click="BatchimportMb('xm')">模版生成<i class="el-icon-download"></i></el-button>
            <el-row class="import_desc">
                <el-col :span="6" style="line-height:80px">
                    操作说明：
                </el-col>
                <el-col :span="18">
                    <p>1.请使用本页面提供的模版进行导入</p>
                    <p>2.请勿修改模版Excel的表头内容</p>
                    <p>3.模版提供的默认信息，请勿随意修改</p>
                </el-col>
            </el-row>
        </div>

    </el-dialog>



    <!-- 评分标准导入弹层 -->
    <el-dialog title="评分标准导入" :visible.sync="bzImportData"  :close-on-click-modal='false'  width="540px" class="import_box">
        
        <el-alert  title="导入前需创建好所有项目,确定全部创建完成?"   type="info"   close-text="知道了"></el-alert>

        <el-row style="margin:10px 0;">
            <el-col :span="6" class="colLineTit">执行学科：</el-col>
            <el-col :span="18">
                <el-select v-model="BatchSelKc" size="small"  placeholder="请选择" @change="changeKc">
                    <el-option v-for="item in hasKcList" :key="item.kcid" :label="item.kcmc" :value="item.kcid"></el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="6" class="colLineTit">文件选择：</el-col>
            <el-col :span="18">
                <el-upload
                    :limit="1"
                    name="excelfile"
                    ref="BatchcjForm"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :action="'/api/netcore/smartcredit/v2/Xm/ImportBz?kc='+BatchSelKc"
                    :headers= "headersV2"
                    :file-list="fileList"
                    :onError="uploadError"
                    :onSuccess="(res,file,fileList)=>{return uploadSuccess(res,file,fileList,'xm')}"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <el-row> 
            <el-col :span="6" class="colLineTit">失败数据详情：</el-col>
            <!-- <div class="errDataTit">导入失败数据详情：</div> -->
            <el-table
            :data="errData"
            style="width: 100%;max-height: 200px;
                            overflow-y: scroll;">
            <el-table-column
                prop="result"
                label="结果信息">
            </el-table-column>

            <el-table-column
                prop="mc"
                label="项目名称">
            </el-table-column>

            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="importSubmit('BatchcjForm')">确 定</el-button>
            <el-button size="medium" @click="BatchimportCancel">取 消</el-button>
            <el-button size="medium" @click="BatchimportMb('bz')">模版生成<i class="el-icon-download"></i></el-button>
            <el-row class="import_desc">
                <el-col :span="6" style="line-height:80px">
                    操作说明：
                </el-col>
                <el-col :span="18">
                    <p>1.请使用本页面提供的模版进行导入</p>
                    <p>2.请勿修改模版Excel的表头内容</p>
                    <p>3.模版提供的默认信息，请勿随意修改</p>
                </el-col>
            </el-row>
        </div>

    </el-dialog>


    <!-- 批量复制项目弹层 -->
    <el-dialog title="创建副本" :visible.sync="createCopyVisible"  :close-on-click-modal='false'  width="800px" >
        <el-radio v-model="copyItem.type" label="1">按年级批量复制</el-radio>
        <el-radio v-model="copyItem.type" label="2">按学科批量复制</el-radio>
        <div class="copyItemInfo" v-if="createCopyVisible">
          <div class="item line">项目创建时间： {{copyItem.originItem.xn}} {{copyItem.originItem.xq=='02'?'下学期':'上学期'}}</div>
          <div class="item">项目名称： {{copyItem.originItem.mc}}</div>
          <div class="item">年级： {{copyItem.originItem.njmc}}</div>
          <div class="item" v-if="copyItem.originItem.kcmc">课程类别： {{copyItem.originItem.kclx}}</div>
          <div class="item" v-if="copyItem.originItem.kcmc">学科名称： {{copyItem.originItem.kcmc}}</div>
          <div class="item flex" :class="showbqlbList?'overflow':''" v-if="copyItem.originItem.bqIdList.length">
            <p>标签类别： {{copyItem.originItem.bqlb}}</p><i v-if="copyItem.originItem.bqlb.length>21" :class="!showbqlbList?'el-icon-arrow-up':'el-icon-arrow-down'" @click="showbqlbList = !showbqlbList"></i>
          </div>
          <div class="item flex" :class="showbqList?'overflow':''" v-if="copyItem.originItem.bqIdList.length">
            <p>标签名称： {{copyItem.originItem.bqmc}}</p><i v-if="copyItem.originItem.bqmc.length>21" :class="!showbqList?'el-icon-arrow-up':'el-icon-arrow-down'" @click="showbqList = !showbqList"></i>
          </div>
        </div>
        <div v-if="copyItem.type==1">
            <div class="copySelectTip">请选择一个或多个年级进行批量复制：</div>
            <el-select v-model="copyItem.values[0]" clearable multiple placeholder="请选择">
              <el-option
                v-for="(item,index) in njList"
                :key="index"
                :label="item.njmc"
                :value="item.njdm">
              </el-option>
            </el-select>
        </div>
        <div v-if="copyItem.type==2">
            <div class="copySelectTip">请选择一个或多个学科进行批量复制：</div>
            <el-cascader
              v-model="copyItem.values[1]"
              :options="copySelectOptions.options"
              :props="copySelectOptions.props"
              clearable></el-cascader>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="createCopy">保 存</el-button>
            <el-button size="medium" @click="createCopyVisible = false">取 消</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
import Cookies from 'js-cookie'
import { Loading } from 'element-ui';
import { delwj } from 'api/project/reportActive/index';
import { CopyByDuringSemester } from 'api/project/mainProject/index';
import * as xnxqApi from 'api/components/searchbar';
import * as detailPapi from 'api/project/projectDetail/index'
import * as reportapi from "api/project/report/index";
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import {
    page,getAllList,createItem,updateItem,delItem,getItem,getNj,getXk,dqxnxqObj ,getjcZysjlx,getQzInfo,GetQzListByxmId,AddBatchQz,getCopy,putBz,downLoadBzMb,downLoadXmMb,ReportScore,bjListByGh,getLabelList,addLabel
} from 'api/project/mainProject/index'
import {getXxdmInfo} from 'api/admin/school/index'
import {getCourseList} from 'api/admin/major/index'
import {getAllKcnjgx,getKclbByXxdm} from 'api/admin/course/index'
import _ from 'lodash'
export default {
    name: "mainProject",
    data() {
        return {
            xnList:[],                  //学年列表
            xqList:[],                  //学期列表
            xxdm:'',
            uuid: null,
            listLoading: true, // 加载
            xmInfoList:[],                  //项目列表
            xmKindList:[],                  //按年级与科目排列的项目列表
            xmKindpage:[],                  //分页后每页的项目列表
            total: null,                    //分页
            xmpageQuery:{
                pageIndex: 1,
                pageSize: 20,
            },
            listQuery: {
                xxdm: window.localStorage.getItem('xxdm'),
                kcIds: null,
                njdms: null,
                zyIds: null,
            },
            njList: [],                     //所有年级
            kcList: [],                     //所有学科
            zyList:[],                      //所有专业
            xnxq: {},                       //当前学年学期信息
            xxlm:'',                        //007--职高技校
            formSearch:{},                  //条件搜索
            zyprops: {                      //配置选项
                value: 'uuid',
                label:'mc',
                children: 'kcList'
            },

            isCanUpdata: true,              //是否可以修改
            dialogStatus: '',
            createFormVisible: false,
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑项目',
                create: '新建项目'
            },
            btnLimt: false,                 //防止重复点击BUG
            form: {},                       //项目编辑form
            ywzx: '0',                      //默认无子项
            zhdj:'0',                       //转化等级
            hsType:'0',                     //换算方式 0 数值型(默认)  1 百分比
            djhsType:'0',                   //换算方式等级 0 数值型(默认)  1 百分比
            //表单较检规则
            rules: {
                mc: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度不得超过12个字符', trigger: 'blur' }
                ],
                njdm: [
                    { required: true, message: '请选择适用年级', trigger: 'change' },
                ],
                // kcid: [
                //     { required: true, message: '请选择适用学科', trigger: 'change' },
                // ],
                // zykc: [
                //     { required: true, message: '请选择适用专业', trigger: 'change' },
                // ],
            },
            HsRange:[                       //转化     type: 1--区间
                {type: 1},{type: 1},{type: 1}
            ],
            zhdjHsRange:[                   //转化等级换算规则  type: 1--区间
                {type: 1},{type: 1},{type: 1}
            ],
            perHsRange:[                    //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ],
            perDjHsRange:[                  //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ],
            jflxsel:'0',                     //计分类型       0 原始数据换算成积分  1 原始数据换算成等级   2 保留原始数据，不做换算
            jflx: '0',                      //计分形式
            expObj:{                        //示例
                '00':'示例：A同学该项目根据一定的权重计算后总分为82，换算成最终学分为10学分',           //积分--成绩分值
                '01':'示例：A同学该项目累计完成了6个任务，换算成最终学分为8学分',                      //积分--累积量
                '07':'示例：A同学在基准值60分的基础上额外获得了8分，最终得分为68，转化后得8积分',       //积分--加减分
                '10':'示例：A同学该项目根据一定的权重计算后总分为82，最终换算成等级为A',               //等级--成绩分值
                '11':'示例：A同学该项目累计完成了6个任务，最终换算成等级为B',                         //等级--累积量
                '17':'示例：A同学在基准值60分的基础上额外获得了8分，最终得分为68，最终换算成等级为B',   //等级--加减分
                '12':'示例：A同学该项目根据一定的权重计算后总学分为8，最终换算成等级为B',   //等级--加减分
            },

            lrrylxList:['1'],                       //录入人员 录入人员类型 1:教师 2：学生 1+2=3:教师+学生
            xmqzFormVisible:false,          //设置权重页面
            setXmqzform:{},                 //权重
            XmqzRes:{},                     //权重res
            XmqzList:[],                    //权重list
            alreadysetqz:[],                //已经设置过的权重
            alreadysetqzZX:[],              //已经设置过的权重--子项目

            // 评分标准
            pfbzDialogVisible:false,
            pfbz:'',                        //评分标准
            xmMaxCredit:0,                  //项目最高学分
            rwImportData:false,             //项目数据导入
            bzImportData:false,             //评分标准导入
            hasKcList:[],                   //已有的课程
            hasBjList:[],                   //已有可选的班级列表

            /**胜利新增需求 */
            BatchSelKc:"",                  //已选课程信息
            BatchSelClass:"",               //已选执行班级
            importLoading:false,            //上传等待指示变量
            fileList: [],                   //上传文件列表(一般目前只支持单选)
            upImgVisible:false,             //图片上传显示与否
            upImageUrl:"",                  //上传图片地址
            // upImageList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            upImageList:[],
            bzList:[],                      //标准list(一般目前只支持单选)
            djlx:"6",
            djList:["A","B","C","D","待评"],
            djlxSel:[{"value":0,"label":"="},{"value":1,"label":">="},{"value":2,"label":"<="},{"value":3,"label":">"},{"value":4,"label":"<"},{"value":5,"label":"存在"}],
            errData:[],                    //结果信息
            uploadfile_bz:"",               //项目标准中使用的图片的uuid
            loading:false,                   //加载等待
            rkList:[],                      //任课班级List
            rwzhfs:"0",                     //累计任务的转换方式
            bqlist:[],                      //标签列表
            curbq:[],
            BatchBq:[],
            px:0,
            copySelect:{},
            gradeKcList: {},                // 按年级区分课程
            createCopyVisible: false,
            copyItem:{
                originItem: null,
                type: '1',
                values: [
                  [],[]
                ]
            },
            showbqList: false,
            showbqlbList: false,
            copySelectOptions: {
              options: [],
              props: {
                multiple: true,
                value: 'uuid',
                label: 'kcmc',
                children: 'kcList'
              }
            },
            iscopy: false,
            lguserType: window.localStorage.getItem('lguserType'),
        }
    },
    created() {
        this.xxdm = window.localStorage.getItem('xxdm');
        this.getDicy()
        this.getList();
        window.localStorage.setItem('fjxmId','')
    },
    mounted(){
        this.getXnList();
        this.getXqList();
        this.getBjListByGh();
        this.getBqList();
    },
    computed: {
        ...mapGetters(["elements"]),
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        },
        headersV2: function() {
            return {Authorization: Cookies.get("Admin-Token")}
        },
    },
    directives: {
        textDesc: {
            inserted: function (el, params) {
                let progressDom = el.children[0].children[0].children[0].children[0];
                let percentageText = progressDom.innerText;
                let descText = '已完成 '+params.value.ysbsl;
                progressDom.innerText = descText + ' (' + percentageText + ')'
            }
        }
    },
    methods: {
        //获取登录账号的任课班级权限
        async getBjListByGh(){
            if(localStorage.getItem("lguserType")==3){
                var res = await bjListByGh({xxdm:this.xxdm,gh:localStorage.getItem('usercode')});
                this.rkList = res.data
                console.log(this.rkList,832)
            }
        },

        async getXnList(){
            this.xnList = await xnxqApi.getxnList({xxdm:this.xxdm})
        },

        async getXqList(){
            this.xqList = await xnxqApi.getxqList({xxdm:this.xxdm})
        },


        // 项目列表
        getList() {
            this.listLoading = true;
            var query={
                xxdm: this.xxdm
            }
            getAllList(this.listQuery).then(response => {
                var that = this
                this.xmInfoList = response.xmInfoList
                this.total = this.xmInfoList.length;
                this.xmKindList = [];            //按年级与科目排列的项目列表

                if(this.xmInfoList && this.xmInfoList.length>0){
                    this.xmInfoList.forEach(function(item,index){
                        var isSame = false
                        that.xmKindList.forEach(function(nj,njind){
                            if(item.njdm == nj.njdm && item.njmc == nj.njmc && item.kcid == nj.kcid && item.kcmc == nj.kcmc && item.zyid == nj.zyid && item.zymc == nj.zymc){
                                isSame = true
                                nj.list.push(item)
                            }
                        })
                        if(!isSame){
                            var exp = []
                            exp.push(item)
                            that.xmKindList.push({'njmc':item.njmc,'njdm':item.njdm,'kcid':item.kcid,'kcmc':item.kcmc,'zyid':item.zyid,'zymc':item.zymc,'list':exp})
                        }
                    })
                }
                this.xmPageChange(this.xmpageQuery.pageSize,this.xmpageQuery.pageIndex)
                this.listLoading = false;
                // console.log(this.xmInfoList,6666)
            })
            
        },
        // 分页后每页的项目列表
        xmPageChange(size,index){
            var that = this
            this.xmKindpage = [];
            var num = 0;
            var allsize = size*index
            var othersize = size*(index-1)
            if(this.xmKindList && this.xmKindList.length>0){
                var pagesize = null;
                this.xmKindList.forEach(function(item,inditem){
                    var listdata = [];
                    if(item.list && item.list.length>0){
                        item.list.forEach(function(list,ind){
                            if(allsize>num){
                                num++
                                if(num>othersize){
                                    pagesize = inditem
                                    listdata.push(list)
                                }
                            }
                        })
                        if(inditem==pagesize){
                            that.xmKindpage.push({'njmc':item.njmc,'njdm':item.njdm,'kcid':item.kcid,'kcmc':item.kcmc,'zyid':item.zyid,'zymc':item.zymc,'list':listdata})
                        }
                    }
                })
            }
        },
        // 分页
        handleSizeChange(val) {
            this.xmpageQuery.pageSize = val
            this.xmPageChange(val,this.xmpageQuery.pageIndex)
        },
        handleCurrentChange(val) {
            this.xmpageQuery.pageIndex = val
            this.xmPageChange(this.xmpageQuery.pageSize,val)
        },
        //  条件搜索
        searchFn() {
            
            this.listQuery.xn = this.formSearch.xn;
            this.listQuery.xq = this.formSearch.xq;
            this.listQuery.zyIds =  this.formSearch.zykc?this.formSearch.zykc[0]:undefined;
            this.listQuery.kcIds =  this.formSearch.zykc?this.formSearch.zykc[1]:this.formSearch.kcid;
            this.listQuery.BqIds = this.formSearch.bqid.join(",");
            this.listQuery.njdms = this.formSearch.njdm;
            // console.log(this.listQuery,10281028)
            this.getList()
        },
        //基础信息获取(学年学期/学校信息(专业)/年级/学科)
        getDicy(){
            var that = this
            this.getXk()
            dqxnxqObj({xxdm: this.xxdm,}).then(response => {
                this.xnxq = response.data
                // console.log(this.xnxq,727);
                this.formSearch.xn = this.xnxq.xn;
                this.formSearch.xq = this.xnxq.xq;
            })
            getXxdmInfo({xxdm: this.xxdm,}).then(response => {
                this.xxlm = response.data.xxbxlxm               //学校类型--判别是专业还是学科
                if(this.xxlm == '007'){   //职高
                    getjcZysjlx({xxdm: this.xxdm}).then(response => {   //专业
                        var zyresList = response
                        this.zyList = []
                        if(zyresList && zyresList.length>0){
                            zyresList.forEach(function(item,index){
                                that.zyList.push({uuid:item.uuid,mc:item.zymc})
                                if(item.kcList && item.kcList.length>0){
                                    that.zyList[index].kcList=[]
                                    item.kcList.forEach(function(kc,ind){
                                        if(that.kcList && that.kcList.length>0){        //学科列表
                                            that.kcList.forEach(function(kcall,indall){
                                                if(kc.kcid==kcall.uuid){
                                                    that.zyList[index].kcList.push({uuid:kcall.uuid,mc:kcall.kcmc})
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            getNj({
                xxdm: this.xxdm, page: 1,limit: 50,
            }).then(response => {
                this.njList = response.data.rows
            })
        },
        getXk(){                            //学科
            getXk({
                xxdm: this.xxdm, page: 1, limit: 50,
            }).then(response => {
                this.kcList = response.data.rows;
                this.groupKcByGrade();
                this.getSubjectType();
            })
        },
        // 新建项目
        handleCreate() {
            this.btnLimt = false
            this.dialogStatus = 'create';
            this.isCanUpdata = true
            this.createFormVisible = true;
            this.form.xn = this.xnxq.xn;
            this.form.xq = this.xnxq.xq;
            this.form.xmlx = '0';
            this.px = 1;
            this.zhdj = '0';
            this.curbq = [];
            this.arrinit();
            this.getBqList();

        },
        // 获取最新的标签列表
        async getBqList(){
            var res = await getLabelList({"xxdm":localStorage.getItem("xxdm")});
            this.bqlist = res.data;
        },
        // 初始化数组
        arrinit(){
            this.HsRange=[                       //转化     type: 1--区间
                {type: 1},{type: 1},{type: 1}
            ];
            this.zhdjHsRange=[                   //转化等级换算规则  type: 1--区间
                {type: 1},{type: 1},{type: 1}
            ];
            this.perHsRange=[                    //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ];
            this.perDjHsRange=[                  //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ];
        },
        // 修改项目
        async handleUpdate(item) {
            let _this = this;
            await this.getBqList();
            _this.btnLimt = false;
            _this.uuid = item.uuid;
            _this.dialogStatus = 'update';
            getItem({id: item.uuid,}).then(response => {
                console.log(response,666);
                _this.form = response
                if(_this.xxlm=='007'){                              //职校
                    _this.form.zykc = []                            //专业
                    _this.form.zykc.push( _this.form.zyid,_this.form.kcid)
                }
                _this.ywzx = _this.form.ywzx ? '1':'0';
                _this.zhdj = String(_this.form.zhdj)
                _this.jflx = String(_this.form.jflx)
                _this.px = _this.form.px;
                _this.rwzhfs="0";

                //如果有子项直接jflxsel设置为0
                if(_this.form.ywzx){
                    this.jflxsel = '0'
                }else{
                    //如果是无子项 && 转换等级开启 && 学分不转换 jflxse设置为 1  (原始数据转换为等级)
                    if(_this.zhdj=='1'&&_this.form.zhxf==0){                     
                    //转化等级0--转化为积分或者是不做换算   1--转化为等级
                        this.jflxsel = '1'
                    }else if(_this.zhdj=='0'){
                        if(_this.jflx=='4' || _this.jflx=='5' || _this.jflx=='3'|| _this.jflx=='2'){
                            this.jflxsel = '2'
                        }else{
                            this.jflxsel = '0'
                        }
                    }
                }



                //转换学分分类   1.不转换学分 zhxf=0 2.不转换学分 zhxf=1 3.不转换学分 zhxf=2、3
                //如果是第一种选项卡 转换学分不等于0  代表 转换学分开启 用的就是HsRange或者perHsRange
                if(_this.form.zhxf!=0){
                    var RangStr = "";
                    //转学分,数值转换/或者百分比转换
                    if(_this.form.zhxf==1){
                        _this.hsType="0";
                        RangStr = "HsRange";
                    }else{
                        _this.hsType="1";
                        RangStr = "perHsRange";
                    }
                    //给_this.HsRange 或者 _this.perHsRange 赋值
                    if(_this.form.hs && _this.form.hs.length>0){
                        _this[RangStr] = []
                        _this.form.hs.forEach(function(item,index){
                            _this[RangStr].push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.xf})
                        })
                    }
                    
                    console.log(this.zhdjHsRange,1120)
                }
                //如果是非转换学分类型 并且 真实转换等级不为零(1、数值转换  2、3班级排名转换  4、5、6 等级转换等级的3种形式 7、百分比转换)
                else if(_this.form.zhxf==0&&_this.form.realZhdj!=0){

                    console.log("aaaaaaa")
                
                    var RangStr = "";
                    if(_this.form.realZhdj==1){
                        _this.hsType="0";
                        RangStr = "HsRange";
                    }else if(_this.form.realZhdj==6){
                        _this.hsType="0";
                        RangStr = "HsRange";
                        _this.djlx == _this.form.realZhdj.toString();
                    }else if(_this.form.realZhdj==7){
                        if(_this.form.ywzx){
                            _this.djhsType="2";
                            RangStr = "HsRange";
                        }else{
                            if(_this.form.jflx==1){
                                _this.rwzhfs="1";
                                RangStr = "HsRange";
                            }else{
                                _this.hsType="2";
                                RangStr = "HsRange";
                            }
                        }
                    }else if(_this.form.realZhdj==4||_this.form.realZhdj==5){
                        _this.hsType="0";
                        _this.djlx = _this.form.realZhdj.toString();
                        RangStr = "HsRange";
                    }else{
                        if(_this.form.realZhdj==9){
                            _this.hsType="3";
                            RangStr = "perHsRange";
                        }else{
                            _this.hsType="1";
                            RangStr = "perHsRange";
                        }
                        
                    }
                    
                    if(_this.form.realZhdj==6){
                        _this[RangStr] = [];
                        _this.form.djHs.forEach(function(item,index){
                            var djsZhListTemp = [];
                            item.djsZhList.forEach(function(sitem,sindex){
                                djsZhListTemp.push({lx:sitem.lx,sl:sitem.sl,djz:sitem.djz,px:sitem.px})
                            })

                            if(index==_this.form.djHs.length-1){
                                _this[RangStr].push({type:4,sz:item.djz,djsZhList:djsZhListTemp});
                            }else{
                                _this[RangStr].push({type:3,sz:item.djz,djsZhList:djsZhListTemp});
                            }
                            
                        })
                    }else{
                        if(_this.form.djHs && _this.form.djHs.length>0){
                            _this[RangStr] = [];
                            _this.form.djHs.forEach(function(item,index){
                                _this[RangStr].push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.djz})
                            })
                        }
                    }
                }


                //如果开启了转换学分 且 转换等级的设置 || 开启了有子项 且 起开了转换等级  （都属于动了下方的区间变量）
                if((_this.form.zhxf!=0 && _this.form.zhdj!=0)||(_this.form.ywzx!=0 && _this.form.zhdj!=0)){
                    if(_this.form.realZhdj==1){
                        _this.djhsType="0";
                        RangStr = "zhdjHsRange";
                    }else if(_this.form.realZhdj==2||_this.form.realZhdj==3){
                        _this.djhsType="1";
                        RangStr = "perDjHsRange";
                    }else if(_this.form.realZhdj==9){
                        _this.djhsType="3";
                        RangStr = "perDjHsRange";
                    }else if(_this.form.realZhdj==7){
                        _this.djhsType="2";
                        RangStr = "zhdjHsRange";
                    }

                    if(_this.form.djHs && _this.form.djHs.length>0){
                        _this[RangStr] = []
                        _this.form.djHs.forEach(function(item,index){
                            _this[RangStr].push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.djz})
                        })
                    }
                }






                //如果是转换等级 转换等级 realZhdj = 0, 数值转等级 = 1, 百分比转等级 =2、3
                // if(_this.form.realZhdj!=0&&_this.form.zhxf==0){
                //     console.log("bbbbbbb")
                //     var RangStr = "";
                //     if(_this.form.realZhdj==1){
                //         _this.djhsType="0";
                //         RangStr = "zhdjHsRange";
                //     }else if(_this.form.realZhdj==7){
                //         console.log("ddfffaaa")
                //         _this.djhsType="2";
                //         RangStr = "zhdjHsRange";
                //     }else{
                //         _this.djhsType="1";
                //         RangStr = "perDjHsRange";
                //     }
                //     if(_this.form.djHs && _this.form.djHs.length>0){
                //         _this[RangStr] = []
                //         _this.form.djHs.forEach(function(item,index){
                //             _this[RangStr].push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.djz})
                //         })
                //     }
                // }
    
                console.log(_this.form.bqIdList,1270)
                _this.curbq = [];
                for(var i=0;i<_this.form.bqIdList.length;i++){
                    var tempobj = _.find(_this.bqlist,{'uuid':_this.form.bqIdList[i]});
                    _this.curbq.push(tempobj.mc);
                }

                //_this.curbq = 

                _this.createFormVisible = true;
                
                if(_this.form.allRwCount>0 || _this.form.childXmCount>0){
                    // _this.isCanUpdata = false
                    //临时放开
                    _this.isCanUpdata = true
                }else{
                    _this.isCanUpdata = true
                }
            })
        },
        //表单内容初始化
        dataInit() {
            this.$refs['createform'].resetFields();
            this.uuid = null;
            this.form = {};
            this.ywzx = '0';
            this.jflxsel = '0';
            this.jflx = '0';
            this.isCanUpdata = true;
            this.bqlist = [];
            this.HsRange = [
                {type: 1},{type: 1},{type: 1}
            ]
            this.getBqList();
        },
        //转化--添加区间
        adddj(){
            //RayJ
            console.log(this.djlx,1176)
            if(this.djlx=='6'&&this.jflx=='3'){
                let len = this.HsRange.length;
                this.HsRange.splice(len-1, 0,{
                    type:3,
                    djsZhList:[{sl:0,djs:"",lx:0}]
                    }
                );
                return;
            }
    
            if(this.hsType=='1'||this.hsType=='3'){
                let len = this.perHsRange.length;
                this.perHsRange.splice(len, 0, {
                    type: 2,zxz:0
                });
                return;
            }

            let len = this.HsRange.length;
            if(this.jflx=='1'){
                this.HsRange.splice(len-1, 0, {
                    type: 1
                });
            }else{
                this.HsRange.splice(len, 0, {
                    type: 1
                });
            }
        },
        //转化--删除区间
        deletedj(index) {
            if(this.hsType=='1'||this.hsType=='3'){
                this.perHsRange.splice(index,1);
                return;
            }
            this.HsRange.splice(index, 1);
        },
        //转化等级-换算规则添加区间
        addzhdj(){
            
            if(this.djhsType=='1'||this.djhsType=='3'){
                let len = this.perDjHsRange.length;
                this.perDjHsRange.splice(len, 0, {
                    type: 2,zxz:0
                });
                return;
            }
            let len = this.zhdjHsRange.length;
            this.zhdjHsRange.splice(len, 0, {
                type: 1
            });
        },
        //转化等级-换算规则删除区间
        deletezhdj(index) {
            if(this.djhsType=='1'||this.djhsType=='3'){
                this.perDjHsRange.splice(index,1);
                return;
            }
            this.zhdjHsRange.splice(index, 1);
        },
        //有无子项  选择
        ywzxChange(val){
            this.jflxsel = '0';
            this.jflx = '0';
            this.HsRange = [
                {type: 1},{type: 1},{type: 1}
            ]
        },
        // 计分类型 选择
        jflxselChange(val){
            this.rwzhfs = '0';
            if(val==2){
                this.jflx = '3';
                this.zhdj = '0'
            }else{
                this.form.hs = null;
                this.form.djHs = null;
                this.jflx = '0'
                // this.zhdj = '0'
                if(val == 0) this.zhdj = '0'
                if(val == 1) this.zhdj = '1'
            }
            this.HsRange=[
                {type: 1},{type: 1},{type: 1}
            ]
            this.zhdjHsRange=[
                {type: 1},{type: 1},{type: 1}
            ]
            this.perHsRange=[                    //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ]
            this.hsType = "0"
        },
        // 转换方式变换
        jfdjChange(val){
            this.zhdjHsRange=[
                {type: 1},{type: 1},{type: 1}
            ]
           this.perDjHsRange=[                    //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ] 
        },
        // 成绩换算change
        jflxChange(val){
            this.rwzhfs = '0';
            if(val=='1'){             //累积任务数
                this.HsRange=[
                    {type: 0},{type: 1},{type: 2}
                ]
            }else if(this.jflxsel==1&&val=='3'){
                this.djlx = '6';
                this.HsRange=[
                    {type:3,djsZhList:[{sl:0,djz:"",lx:0}]},
                    {type:3,djsZhList:[{sl:0,djs:"",lx:0}]},
                    {type:4,djsZhList:[]}
                ]
            }else{
                this.HsRange=[
                    {type: 1},{type: 1},{type: 1}
                ]
            }

            this.zhdjHsRange=[
                {type: 1},{type: 1},{type: 1}
            ]
            this.perHsRange=[                    //百分比换算规则  type: 1--区间
                {type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}
            ]
            this.hsType = "0"
        },

        // 等级类型换算change
        djlxChange(val){
            console.log(val)
            if(val=='6'){             
                this.HsRange=[
                    {type:3,djsZhList:[{sl:0,djz:"",lx:0}]},
                    {type:3,djsZhList:[{sl:0,djs:"",lx:0}]},
                    {type:4,djsZhList:[]}
                ]
            }else{
               
            }
        },

        /**
         * 添加等级转换等级小规则
         * By:RayJ
         * Time:2019-05-21
         */
        djAdd(index){
            this.HsRange[index].djsZhList.push({sl:0,djz:"",lx:0});
        },

        /**
         * 删除等级转换等级小规则
         * By:RayJ
         * Time:2019-05-21
         */
        djCut(index){
            if(this.HsRange[index].djsZhList.length>1){
                this.HsRange[index].djsZhList.splice(this.HsRange[index].djsZhList.length-1,1);
            }else{
                this.tipsXX("最后一个不能删除","warning");
            }
        },

        //提示信息
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit,
                message: data,
                type: xxtype,
                duration: 2000
            });
        },
        // 提交按钮
        createSubmit(formName) {
            let _this = this
            _this.$refs[formName].validate(async valid => {
                // console.log(_this.form.zykc)
                // // console.log(_this.form.kcid)
                // // console.log(_this.curbq)
                // console.log(!_this.form.zykc[0])
                // console.log(!_this.form.kcid)
                // console.log(_this.curbq.length==0)
                // if(this.xxlm=='007')
                if((!_this.form.zykc||!_this.form.zykc[0])&&!_this.form.kcid&&_this.curbq.length==0){
                    _this.tipsXX("适用学科和标签至少填一项！",'warning')
                    return
                }

                if (valid) {
                    let unfilled = false                          //提示有未填项
                    let iszhdjbz = false                          //提示请按标准填写等级
                    let isoverlap = false                         //设定的区间有重叠
                    let isoverlapdj = false                       //设定的等级不能相同

                    _this.btnLimt = true
                    _this.form.px = _this.px
                    _this.form.xn = _this.xnxq.xn
                    _this.form.xq = _this.xnxq.xq
                    _this.form.xxdm = _this.xxdm
                    _this.form.uuid = _this.uuid
                    _this.form.ywzx = _this.ywzx == 0 ? false : true
                    _this.form.zhdj = Number(_this.zhdj)        //转化等级
                    _this.form.jflx = Number(_this.jflx)        //记分类型 0 成绩换算 1 累计量换算 2 学分 3 等级 4 图文 5 健康   6 阅读   7 加减分
                    
                    //是否是百分比显示 0-否 1-按成绩 2-按班级排名 3-按班级排名(同分并列名次)
                    _this.form.zhxf = Number(_this.ywzx)==1?0:(_this.jflxsel==1||_this.jflxsel==2)?0:_this.hsType==0?1:3;
                    // _this.form.realZhdj =_this.zhdj==0?0:_this.jflxsel==1&&_this.hsType==0?1:_this.djhsType==0?1:3;
                    // console.log("_this.jflxsel="+_this.jflxsel);
                    // console.log("_this.hsType="+_this.hsType);
                    // console.log("_this.zhdj="+_this.zhdj);
                    // console.log("_this.djhsType="+_this.djhsType);


                    //转换等级判定  0为不转换等级  1为转为等级   3为按百分比转换等级
                    if((_this.jflxsel==1&&_this.hsType==1)||(_this.jflxsel==0&&_this.zhdj==1&&_this.djhsType==1)){
                        _this.form.realZhdj = 3;
                    }else if((_this.jflxsel==0&&_this.zhdj==0)||_this.jflxsel==2){
                         _this.form.realZhdj = 0;
                    }else{
                        //如果是等级转换成等级
                        console.log("_this.jflx="+_this.jflx);
                        console.log("_this.jflxsel="+_this.jflxsel);
                        console.log("_this.rwzhfs="+_this.rwzhfs);
                        if(_this.jflx==3&&_this.jflxsel==1){
                            _this.form.realZhdj = _this.djlx;
                        }else if(_this.hsType==2 || _this.djhsType==2){
                            _this.form.realZhdj = 7;
                        }else if(_this.hsType==3 || _this.djhsType==3){
                            _this.form.realZhdj = 9;
                        }else if(_this.jflx==1&&_this.jflxsel==1&&_this.rwzhfs==1){
                            _this.form.realZhdj = 7;
                        }else{
                            _this.form.realZhdj = 1;
                        }
                    }

                    //  _this.form.realZhdj = _this.jflxsel==1&&_this.hsType==0?1:_this.jflxsel==1&&_this.hsType==1?3:
                    

                    //form---njmc+kcmc+zymc 转化
                    for(let i = 0; i < _this.njList.length; i++) {
                        if(_this.form.njdm == _this.njList[i].njdm) {
                            _this.form.njmc = _this.njList[i].njmc
                            break
                        }
                    }
                    _this.form.kcid =  _this.form.zykc?_this.form.zykc[1]:this.form.kcid;
                    _this.form.zyid =  _this.form.zykc?_this.form.zykc[0]:undefined;

                    for(let j = 0; j < _this.kcList.length; j++) {
                        if(_this.form.kcid == _this.kcList[j].uuid) {
                            _this.form.kcmc = _this.kcList[j].kcmc
                            break
                        }
                    }
                    for(let i = 0; i < _this.zyList.length; i++) {
                        if(_this.form.zyid == _this.zyList[i].uuid) {
                            _this.form.zymc = _this.zyList[i].mc
                            break
                        }
                    }

                    if(_this.form.jflx == 7){       //加减分--规则基准值
                        if(_this.form.jzz==undefined){
                            unfilled = true
                        }
                        if(!(/^([0-9]*)?$/.test(_this.form.jzz))){
                            _this.btnLimt = false;
                            _this.tipsXX("基准值是在0~500之间的整数",'warning');
                            return false
                        }
                    }




                    //非保留原始数据 并且 (有子项且转化等级 或者 无子项)
                    // console.log("_this.jflxsel="+_this.jflxsel);
                    // console.log("_this.form.ywzx="+_this.form.ywzx);
                    // console.log("_this.form.zhdj="+_this.form.zhdj);


                    if(_this.jflxsel!=2 && ((_this.form.ywzx && _this.form.zhdj==1) || !_this.form.ywzx)){      //无子项 且 未开启等级转换 
                        console.log(1488)
                        if(!_this.form.ywzx&&_this.zhdj=="0"){
                            console.log("A")
                            console.log(_this.perHsRange,1565)
                            //判断是否有区间字段为空
                            if(_this.hsType=="1"||_this.hsType=="3"){
                                _this.HsRange = _this.perHsRange;
                            }

                            unfilled = _this.isRuleNone(['HsRange']);

                            //如果都不为空再验证区间字段是否合理
                            if(!unfilled){
                                if(_this.hsType=="1"){
                                    _this.HsRange = _this.perHsRange;
                                }
                                iszhdjbz = _this.ifVerifyRule(['HsRange']);
                            }
                        }
                        //如果选择的是原始数据转换成等级
                        else if(_this.jflxsel=="1"){
                            console.log("B")
                            if(_this.djlx=='4'||_this.djlx=='5'){
                                
                            }else{
                                if(_this.hsType=="1"||_this.hsType=="3"){
                                    _this.HsRange = _this.perHsRange;
                                }
                                if(_this.djhsType==2){
                                    unfilled = _this.isRuleNone(['zhdjHsRange']);
                                }else{
                                    unfilled = _this.isRuleNone(['HsRange']);
                                }
                                
                                if(!unfilled){
                                    if(_this.hsType=="1"||_this.hsType=="3"){
                                         console.log(1517)
                                        _this.HsRange = _this.perHsRange;
                                    }
                                    iszhdjbz = _this.ifVerifyRule(['HsRange']);
                                }
                            }
                        }
                        //无子项 且 开启等级转换
                        else if(!_this.form.ywzx&&_this.zhdj=="1"){
                            console.log("C")
                            if(_this.hsType=="1"||_this.hsType=="3"){
                                _this.HsRange = _this.perHsRange;
                            }
                            if(_this.djhsType=="1"||_this.djhsType=="3"){
                                _this.zhdjHsRange = _this.perDjHsRange;
                            }
                            unfilled = _this.isRuleNone(['HsRange','zhdjHsRange']);

                            if(!unfilled){
                                if(_this.hsType=="1"||_this.hsType=="3"){
                                    _this.HsRange = _this.perHsRange;
                                }
                                if(_this.djhsType=="1"||_this.djhsType=="3"){
                                    _this.zhdjHsRange = _this.perDjHsRange;
                                }
                                iszhdjbz = _this.ifVerifyRule(['HsRange','zhdjHsRange']);
                            }
                        }

                        //有子项 且 开启等级转换
                        else if(_this.form.ywzx&&_this.zhdj=="1"){
                            console.log("C")
                            console.log(_this.zhdjHsRange,1543)
                            if(_this.djhsType=="1"||_this.djhsType=="3"){
                                console.log("aaaaa");
                                _this.zhdjHsRange = _this.perDjHsRange;
                            }
                            unfilled = _this.isRuleNone(['zhdjHsRange']);
                            if(!unfilled){
                                console.log("BBBBB");
                                if(_this.djhsType=="1"||_this.djhsType=="3"){
                                    _this.zhdjHsRange = _this.perDjHsRange;
                                }
                                iszhdjbz = _this.ifVerifyRule(['zhdjHsRange']);
                            }
                        }
                    }






                    //如果输入区间为空提示并跳出方法
                    if(unfilled){                               
                        //未填项
                        _this.btnLimt = false;
                        _this.tipsXX("有未填项",'warning','提示');
                        return false
                    }
                    //如果区间不合法跳出方法
                    if(iszhdjbz){
                        _this.btnLimt = false;
                        return false
                    }

                    _this.formateRange();


                    // console.log(_this.curbq,2267)
                    // console.log(_this.bqlist,2268)
                    _this.form.bqIdList = [];
                    for(var i=0;i<_this.curbq.length;i++){
                        var bqIndex = _.findIndex(_this.bqlist,{"mc":_this.curbq[i]})
                        // console.log("bqIndex="+bqIndex);
                        if(bqIndex==-1){
                            var res = await addLabel({'xxdm':localStorage.getItem('xxdm'),'mc':_this.curbq[i]})
                            _this.form.bqIdList.push(res.data);
                            // res.data  = f0f837c7-0b27-4b6d-8f0b-240c9ddf95da
                        }else{
                            _this.form.bqIdList.push(_this.bqlist[bqIndex].uuid);
                        }
                    }

                    // console.log(_this.form.bqIdList,22762276)


                    // console.log(_this.form,99999999)

                    //表单提交
                    switch(_this.dialogStatus) {
                        //更新
                        case 'update':
                            updateItem({
                                id: _this.uuid,info: _this.form,
                            }).then(() => {
                                _this.createFormVisible = false;
                                _this.dataInit();
                                _this.getList();
                                _this.tipsXX("修改成功",'success','成功');
                            }).catch(()=>{
                                setTimeout(function(){
                                    _this.btnLimt = false;
                                },1500);
                            })
                            break;
                        //创建
                        case 'create':
                            console.log(_this.form,1039);
                            _this.btnLimt = false;
                            //调试暂时中断
                            createItem(_this.form).then(() => {
                                _this.createFormVisible = false;
                                _this.dataInit();
                                _this.formSearch={}
                                this.listQuery.zyIds =  '';
                                this.listQuery.kcIds =  '';
                                this.listQuery.njdms = '';
                                _this.getList();
                                _this.tipsXX("创建成功",'success','成功');
                            }).catch(()=>{
                                setTimeout(function(){
                                    _this.btnLimt = false;
                                },1500);
                            })
                            break;
                        }
                
                } else {
                    return false;
                }
            });
        },
        // 取消按钮
        createCancel() {
            this.createFormVisible = false;
            this.dataInit();
        },
        //进入子项目 或是 项目详情
        handleView(item) {
            window.localStorage.setItem('xmlx',item.xmlx);
            window.localStorage.setItem('xxlm',this.xxlm);
            if(item.ywzx == true) {
                window.localStorage.setItem('fjxmId',item.uuid);
                window.localStorage.setItem('fjzhdj',item.zhdj);
                this.$router.push({
                    path: '/projectManager/sonProject',
                })
            }else {
                window.localStorage.setItem('xmid',item.uuid);
                this.$router.push({
                    path: '/projectManager/projectDetail',
                })
            }
        },
        //删除项目
        handleDelete(item) {
            let tishiMessage = undefined
            // if(item.zxmsl > 0) {
            //     tishiMessage = '该项目包含子项目，请先删除子项目'
            // }else if(item.rwsl > 0) {
            //     tishiMessage = '该项目包含任务，请先删除任务'
            // }
            // if(tishiMessage) {
            //     this.$confirm(tishiMessage, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     })
            // }else {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delItem({
                        id: item.uuid,
                    }).then(() => {
                        this.tipsXX("删除成功",'success','成功');
                        this.getList()
                    });
                });
            // }
        },
        //  创建副本
        async handleCopy(item){
          var res = await getItem({id: item.uuid,})
          this.copyItem.originItem = res;
          this.copyItem.type = '1',
          this.copyItem.values = [[],[]];
          var bqlist = [...this.bqlist];
          var bqlb = [];
          var bqmc = [];
          var kclx = '';//课程类别
          for(var i=0;i<bqlist.length;i++){
            var e = bqlist[i];
            res.bqIdList.forEach(bqid => {
              var bq = e.children.find((b)=>{return b.uuid==bqid})
              console.log(bq)
              if(bq){
                bqlb.push(e.mc);
                bqmc.push(bq.mc);
              }              
            });
          }
          if(res.kcmc){
            var kc = this.kcList.find(kc1=>kc1.uuid==res.kcid);
            if(kc){
              var kclxid = kc.kclx;
              var kc1 = this.copySelectOptions.options.find(o=>o.uuid == kclxid);
              if(kc1){
                kclx = kc1.kcmc;
              }              
            }
          }

          bqlb = Array.from(new Set(bqlb))
          this.copyItem.originItem.kclx = kclx;
          this.copyItem.originItem.bqlb = bqlb.join('、');
          this.copyItem.originItem.bqmc = bqmc.join('、');
          this.showbqList = this.copyItem.originItem.bqmc.length>21;
          this.showbqlbList = this.copyItem.originItem.bqlb.length>21;    
          this.createCopyVisible = true;

        },
        // 设置权重取消按钮
        qzCancel(){
            this.xmqzFormVisible = false
        },
        // 设置权重
        handleSetqz(item){
            this.createFormVisible = false
            var that = this
            this.xmqzFormVisible = true
            getQzInfo({id: item.uuid}).then(response => {
                this.XmqzRes = response
                var newobj = []
                this.alreadysetqz = []                                  //已设置过的权重
                if(item.ywzx){              //有无子项
                    this.XmqzList = response.childXmQzSettingList;
                    newobj = response.ysChildXmQzSettingList
                    if(this.XmqzList && this.XmqzList.length>0){
                        this.XmqzList.forEach(function(list,ind){
                            if(list.ysRwQzSettingList && list.ysRwQzSettingList.length>0){
                                list.ysRwQzSettingList.forEach(function(rw,indrw){
                                    that.$set(rw,'jsfsbm',rw.jsfs)
                                    if(rw.jsfs=='0'){
                                        rw.jsfsbm =''
                                    }
                                })
                            }else{
                                if(list.rwQzSettingList && list.rwQzSettingList.length>0){
                                    var pushitem = list.rwQzSettingList[0]
                                    list.ysRwQzSettingList.push(pushitem)
                                }
                            }
                        })
                    }
                }else{
                    this.XmqzList = response.rwQzSettingList;
                    newobj =  response.ysRwQzSettingList
                }
                if(newobj && newobj.length>0){
                    newobj.forEach(function(list,ind){
                        that.$set(list,'jsfsbm',list.jsfs)
                        if(list.jsfs=='0'){
                            list.jsfsbm =''
                        }
                        that.alreadysetqz.push(list)
                    })
                }else{
                    if(this.XmqzList && this.XmqzList.length>0){
                        that.alreadysetqz.push(this.XmqzList[0])
                    }
                }
            })
        },
        //保存权重
        setXmqzSure(){
            var data = this.alreadysetqz
            var query = []
            var that = this
            var isZero = false
            var isbfb = false
            var isqzcs = false
            var isSame = false        //名称相同
            var sameName = ''
            this.btnLimt = true
            query.push({uuid:this.XmqzRes.uuid,mc:this.XmqzRes.mc,qzList:[]})

            if(data && data.length>0){
                data.forEach(function(item,index){
                    if(that.XmqzRes.ywzx){                  //有子项
                        item.qzlx = 0
                    }else{
                        item.qzlx = 1
                    }
                    item.jsfs = item.jsfsbm==''? 0 : item.jsfsbm

                    that.XmqzList.forEach(function(xmit,ind){
                        if(item.uuid == xmit.uuid){
                            item.mc = xmit.mc
                        }
                    })

                    data.forEach(function(same,indsame){
                        if(index != indsame && item.uuid == same.uuid){
                            isSame = true
                            sameName = that.XmqzRes.mc
                        }
                    })
                    if(item.jsfs==2 && item.qzbfb==0){           //除以--不能为 0
                        isZero = true
                    }
                    if(item.qzbfb<0 || item.qzbfb>100 || !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.qzbfb))){
                        isbfb = true
                    }
                    if(item.qzcs<0 || item.qzcs>100 || !(/^([0-9]*)?$/.test(item.qzcs))){
                        isqzcs = true
                    }

                    query[0].qzList.push(item)
                })
            }
            if(this.XmqzRes.ywzx){
                if(this.XmqzList && this.XmqzList.length>0){
                    this.XmqzList.forEach(function(item,index){
                        var allrw = item.rwQzSettingList
                        var surerw = item.ysRwQzSettingList
                        query.push({uuid:item.uuid,mc:item.mc,qzList:[]})
                        if(allrw && allrw.length>0){
                            if(surerw && surerw.length>0){
                                surerw.forEach(function(rw,ind){
                                    rw.jsfs = rw.jsfsbm==''? 0 : rw.jsfsbm
                                    rw.qzlx = 1
                                    allrw.forEach(function(al,indal){
                                        if(rw.uuid == al.uuid){
                                            rw.mc = al.mc
                                        }
                                    })
                                    surerw.forEach(function(same,indsame){
                                        if(ind != indsame && rw.uuid == same.uuid){
                                            isSame = true
                                            sameName = item.mc
                                        }
                                    })
                                    if(rw.jsfs==2 && rw.qzbfb==0){           //除以--不能为 0
                                        isZero = true
                                    }
                                    if(rw.qzbfb<0 || rw.qzbfb>100 || !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(rw.qzbfb))){
                                        isbfb = true
                                    }
                                    if(rw.qzcs<0 || rw.qzcs>100 || !(/^([0-9]*)?$/.test(rw.qzcs))){
                                        isqzcs = true
                                    }
                                    query[index+1].qzList.push(rw)
                                })
                            }
                        }
                    })
                }
            }

            if(isZero){
                this.btnLimt = false;
                this.tipsXX("除数不能为0",'warning','提示');
                return false
            }
            if(isbfb){
                this.btnLimt = false;
                this.tipsXX("百分比范围为0-100%，允许两位小数",'warning','提示');
                return false
            }
            if(isqzcs){
                this.btnLimt = false;
                this.tipsXX("权重系数范围为0-100整数",'warning','提示');
                return false
            }
            if(isSame){
                this.btnLimt = false;
                this.tipsXX("【"+sameName+"】设置了重复权重",'error','错误');
                return false
            }

            AddBatchQz(query).then(response => {
                this.btnLimt = false
                this.tipsXX("保存成功",'success','成功');
                this.xmqzFormVisible = false
            })
        },
        // 取消权重
        setXmqzCancel(){
            this.btnLimt = false
            this.xmqzFormVisible = false

        },
        // 添加加数
        xmqzAdd(data){
            data.push({
              jsfsbm: 1,
              qzcs:1
            })
        },
        // 删除加数
        closesetqz(data,item){
            const index = data.indexOf(item);
            data.splice(index, 1);
        },

        // 评分标准
        handleSetpfbz(item){
            let _this = this;
            _this.btnLimt = false;
            _this.uuid = item.uuid
            getItem({id: item.uuid}).then(response => {
                this.pfbz = response.bz
                if(response.bzFileUUID){
                    this.upImageList.push({url:response.bzFileUrl,uuid:response.bzFileUUID});
                    console.log(this.upImageList.length,2059)
                }
                _this.pfbzDialogVisible = true;

            })
        },
        outLimit(){
            this.tipsXX("只能上传一张图片,更换图片请移除当前图片",'warning');
        },
        pfbzSubmit(){
            var data={
                xmId:this.uuid,
                wjId:this.uploadfile_bz,
                bz:this.pfbz
            }

            this.btnLimt = true
            if(!this.pfbz){
                this.tipsXX("请填写内容",'error','错误');
                this.btnLimt = false
                return false
            }
            if(this.pfbz.length>5000){
                this.tipsXX("评分标准不得超过5000个字",'error','错误');
                this.btnLimt = false
                return false
            }

            putBz(data).then(response => {
                this.btnLimt = false
                this.upImageList = [];
                this.tipsXX("修改成功",'success','成功');
                this.pfbzDialogVisible = false;

            })
        },
        pfbzCancel(){
            this.upImageList = [];
            this.pfbz = '';
            this.pfbzDialogVisible = false;
        },
        /**
         * 切换转换方式(数值型,百分比) 注：非转换等级的转换区间
         * by:RayJ
         * time:2019-05-13
         */
        hsTypeChange(){
            this.HsRange = [{type: 1},{type: 1},{type: 1}];
            this.perHsRange = [{type: 2},{type: 2},{type: 2}];
        },
        rwhsTypeChange(val){
            this.HsRange = [{type: 0},{type: 1},{type: 2}];
            // if(val==0){
            //     this.HsRange = [{type: 0},{type: 1},{type: 2}];
            // }else{
            //     this.HsRange = [{type: 1},{type: 1},{type: 1}];
            // }
        },

        /**
         * 判断转换规则是否为空
         * by:RayJ
         * time:2019-05-11
         */
        isRuleNone(HsRangeArr){
            console.log(HsRangeArr,1394)
            // console.log(this[HsRangeArr])
            for(var i=0;i<HsRangeArr.length;i++){
                console.log(this[HsRangeArr[i]],1395)
                for(var j=0;j<this[HsRangeArr[i]].length;j++){
                    var item = this[HsRangeArr[i]][j];

                    if(!item.sz){
                        console.log("A")
                        return true
                    }else{
                        if(item.type==3){
                            item.djsZhList.forEach(function(sitem,index){
                                if(!sitem.djz||!sitem.sl){
                                    console.log("innerA")
                                    return true
                                }
                            })
                        }
                        if(item.type==4&&!item.sz){
                            console.log("innerB")
                            return true
                        }
                        if(item.type==1&&((!item.zxz&&item.zxz!=0) || !item.zdz)){
                            console.log("B")
                            return true
                        }
                        if(item.type==0&&!item.zxz){
                            console.log("C")
                            return true
                        }
                        if(item.type==2&&!item.zdz){
                            console.log("D")
                            return true
                        }
                    }
                }
            }
            console.log("安全通过!");
            return false;
        },

        /**
         *  验证规则是否合理
         * by:RayJ
         * time:2019-05-11
         */
        ifVerifyRule(HsRangeArr){
            var szmax = 0
            for(var i=0;i<HsRangeArr.length;i++){
                // console.log(this[HsRangeArr[i]],1395)
                for(var j=0;j<this[HsRangeArr[i]].length;j++){
                    var item = this[HsRangeArr[i]][j];
                    //设置最大值
                    if(szmax < Number(item.zdz)){
                        szmax = Number(item.zdz)
                    }
                    //如果是基础转换规则
                    //如果是基础数据转换成等级
                    console.log(item,1494)
                    if(this.jflxsel==1||HsRangeArr[i].indexOf("zhdj")>=0){
                        /**判断转换等级这一栏 (判断是否是ABCDEF) */
                        if(item.sz != 'A' && item.sz != 'B' && item.sz != 'C' && item.sz != 'D'&& item.sz != 'E'&& item.sz != 'F'&& item.sz != '待评'){
                            this.tipsXX("等级请输入A~D之间的字母或者待评",'warning','提示');
                            return true
                        }
                    }
                    //如果是基础数据转换成学分
                    else if(this.jflxsel==0 && (HsRangeArr[i]=="HsRange"||HsRangeArr[i]=="perHsRange")){
                        /**判断转换学分这一栏 (判断是否是数字 或者 大于999) */
                        if((!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.sz)) || Number(item.sz)>999)){
                            this.tipsXX("不是数字或者数字大于999",'warning','提示');
                            // console.log("不是数字或者数字大于999");
                            return true
                        }
                    }

                    //选择的类型并非是累计任务类型
                    if(this.jflx!=1&&this.jflx!=3){
                        //如果是百分比显示 最小值zxz=0 通过验证,也可以在定义初始化的时候写死zxz=0;
                        if(this.hsType=='1'||this.hsType=='3'||(HsRangeArr[i].indexOf("zhdj")>=0&&this.djhsType=='1')){
                            item.zxz = 0;
                        }
                        //区间是否为数字且两位小数点
                        if(!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.zdz)) || !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.zxz))){
                            this.tipsXX("最小值,最大值必须为数字且最多两位小数点",'warning','提示');
                            // console.log("最小值,最大值必须为数字且最多两位小数点");
                            return true
                        }
                        if(Number(item.zdz)<=Number(item.zxz) || Number(item.zdz)>500 || Number(item.zxz)>500){ 
                            
                            //最小值<最大值  且值在1-500
                            this.tipsXX("最大值需大于最小值,最大值、最小值不能大于500",'warning','提示');
                            // console.log("最大值需大于最小值,最大值、最小值不能大于500");
                            return true
                        }
                        if(this.hsType=='1'||this.hsType=='3'){
                            if(Number(item.zdz)>100){
                                this.tipsXX("百分比请小于等于100",'warning','提示');
                                // console.log("百分比请小于等于100");
                                return true
                            }
                        }
                    }
                    //选择的类型是累计任务类型 jflx=2 的时候  0-以上 1-区间 2-以下
                    if(this.jflx==1){              
                        if(item.type==0){           //以上
                            item.zdz = 99999
                            if(!(/^([0-9]*)?$/.test(item.zxz)) || Number(item.zxz)>500){
                                this.tipsXX("请填入0~500之间的整数",'warning','提示');
                                // console.log("请填入0~500之间的整数");
                                return true
                            }
                        }
                        if(item.type==1){           //区间
                            if((!(/^([0-9]*)?$/.test(item.zxz)) && !(/^([0-9]*)?$/.test(item.zdz))) || Number(item.zdz)<=Number(item.zxz) || Number(item.zdz)>500 || Number(item.zxz)>500){
                                this.tipsXX("最大值需大于最小值,最大值、最小值不能大于500",'warning','提示');
                                // console.log("最大值需大于最小值,最大值、最小值不能大于500");
                                return true
                            }
                        }
                        if(item.type==2){           //以下
                            item.zxz = 0
                            if(!(/^([0-9]*)?$/.test(item.zdz)) || Number(item.zdz)>500){
                                this.tipsXX("请填入0~500之间的整数",'warning','提示');
                                // console.log("请填入0~500之间的整数");
                                return true
                            }
                        }     
                    }

                    //判断输入的区间是否有重叠
                    for(var k=0;k<this[HsRangeArr[i]].length;k++){
                        var sitem = this[HsRangeArr[i]][k];
                        if(j != k){
                            if(item.type!=2){
                                if(Number(item.zxz)>Number(sitem.zxz) && Number(item.zxz)<Number(sitem.zdz)){ //区间不能有重叠
                                    this.tipsXX("输入的区间不能有重叠",'warning','提示');
                                    // console.log("输入的区间不能有重叠");
                                    return true
                                }
                            }
                            if(this.jflxsel==1 && item.sz==sitem.sz){               //等级不能相同
                                this.tipsXX("输入的等级不能相同",'warning','提示');
                                // console.log("输入的等级不能相同");
                                return true
                            }         
                        }
                    }

                    // _this.HsRange.forEach(function(item, index){
                    //     _this.HsRange.forEach(function(over, ind){
                    //         if(ind != index){
                    //             if(Number(item.zxz)>=Number(over.zxz) && Number(item.zxz)<=Number(over.zdz)){ //区间不能有重叠
                    //                 isoverlap = true
                    //                 return false
                    //             }
                    //             if(_this.jflxsel==1 && item.sz==over.sz){               //等级不能相同
                    //                 isoverlapdj = true
                    //                 return false
                    //             }
                    //         }
                    //     })
                    // })
                }

                // 判断是否选择了加减分规则
                if(this.form.jflx == 7){   
                    //基准值不能大于输入的最高值
                    if(this.form.jzz > szmax){
                        this.tipsXX("基准值大于最高值",'warning','提示');
                        // console.log("基准值大于最高值"+szmax);
                        // _this.tipsXX("基准值大于最高值"+szmax,'warning','提示');
                        return true
                    }
                }
            }
        },

        /**
         * 将区间数据转换成form表单的数据
         * by:RayJ
         * time:2019-05-13
         */
        async formateRange(){
            console.log(this.form,1548);
            let _this = this;

            if(this.form.ywzx==0&&this.jflxsel==0){       //原始数据换算成学分
                this.form.hs = []
                console.log(this.HsRange,1552);
                this.HsRange.forEach(function(item, index){
                    if(item.type==0) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),xf:Number(item.sz)})
                    if(item.type==1) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),xf:Number(item.sz)})
                    if(item.type==2) _this.form.hs.push({type:item.type,zdz:Number(item.zdz),xf:Number(item.sz)})
                })
            }

            if(this.form.zhdj==1){       //原始数据换算成等级
                this.form.djHs = []
                if(this.jflxsel=="1"){
                    if(this.djlx=='4'||this.djlx=='5'){
                        _this.form.djHs = [];
                    }else{
                        this.HsRange.forEach(function(item, index){
                            if(item.type==0) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),djz:item.sz})
                            if(item.type==1) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),djz:item.sz})
                            if(item.type==2) _this.form.djHs.push({type:item.type,zdz:Number(item.zdz),djz:item.sz})
                            //等级转换等级用的3、4
                            console.log(item,2003)
                            if(item.type==3||item.type==4) _this.form.djHs.push({type:item.type,djz:item.sz,djsZhList:item.djsZhList})
                        }) 
                    }
                }else{
                    this.zhdjHsRange.forEach(function(item, index){
                        if(item.type==0) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),djz:item.sz})
                        if(item.type==1) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),djz:item.sz})
                        if(item.type==2) _this.form.djHs.push({type:item.type,zdz:Number(item.zdz),djz:item.sz})
                    })
                }
            }
            

        },

        /**
         * 获取执行班级信息
         * by:RayJ
         * time:2019-05-17
         */
        async getAllBj (njdm) {
            var res = await detailPapi.getBj({
                page: 1,limit: 500,
                xxdm: this.xxdm,
                njdm: njdm,
                jbny: this.xnxq.xn,
            })
            //this.bjList = res.data.rows;
            console.log(res.data.rows,1762)
            return res.data.rows;
        },

        /**
         * 数据导入
         * by:RayJ
         * time:2019-05-16
         */
        importData(){
            this.rwImportData = true;
            this.formatXmInfoList(this.xmInfoList);
            // console.log(this.xmInfoList);
            // this.getAllBj();
        },

        /**
         * 提交导入数据
         * by:RayJ
         * time:2019-05-16
         */
        importSubmit(refName){
            // if(this.BatchSelKc == ""){
            //     this.tipsXX("请选择需要导入的课程","warning");
            //     return
            // }
            if(this.$refs[refName].uploadFiles.length<1){
                this.tipsXX('请选择导入文件','error');
                return
            }
            this.$refs[refName].submit();
        },
        
        /**
         * 模版生成
         * by:RayJ
         * time:2019-05-16
         */
        async BatchimportMb(command){
            if(command=="xm"){
                console.log(this.BatchBq.join(','),2393)
                if(this.BatchSelKc == ""&&this.BatchBq.length==0){
                    this.tipsXX("执行科目和执行标签至少选一项!","warning");
                    return
                }
                if(this.BatchSelClass == ""){
                    this.tipsXX("请选择执行班级","warning");
                    return
                }  

                var param = {};
                param.xxdm = this.xxdm;
                param.kcid = this.BatchSelKc;
                param.bqIds = this.BatchBq.join(',');
                param.bjid = this.BatchSelClass;
                param.xn = this.xnxq.xn;
                param.xq = this.xnxq.xq;
                var kcobj = _.find(this.hasKcList,{"kcid":this.BatchSelKc});
                var bjobj = _.find(this.hasBjList,{"uuid":this.BatchSelClass});
                console.log(kcobj,2143)
                console.log(bjobj,2144)
                var res = await downLoadXmMb(param);
                const blob = new Blob([res], {
                    type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                
                const downloadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = (kcobj?(kcobj.kcmc+'-'):'')+bjobj.bj+'模版.xlsx'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象 
            }
            if(command=="bz"){
                
                if(this.BatchSelKc == ""){
                    this.tipsXX("请选择下载的课程名称","warning");
                    return
                }
                var param = {};
                param.xxdm = this.xxdm;
                param.kc = this.BatchSelKc;
                param.xn = this.xnxq.xn;
                param.xq = this.xnxq.xq;
                console.log(param,1978)
                var res = await downLoadBzMb(param);
                var kcobj = _.find(this.hasKcList,{"kcid":this.BatchSelKc});
                console.log(res,1980);
                const blob = new Blob([res], {
                    type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                const downloadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = kcobj.kcmc+'模版.xlsx'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象 
            }
        },


        /**
         * 选择课程显示可执行的班级
         * by:RayJ
         * time:2019-05-20
         */
        // changeKc(){
        //     // console.log(this.BatchSelKc,1800);
        //     var that = this;
        //     var NjList = _.find(this.hasKcList, {'kcid':this.BatchSelKc});        
        //     // console.log(this.hasBjList,1803);
        //     // console.log(NjList.njList,1804)
        //     this.BatchSelClass = "";
        //     this.hasBjList = [];
        //     NjList.njList.forEach(async function(item,index){
        //         var res = await that.getAllBj(item.njdm);
        //         // console.log(res,2212)
        //         // 只把存在的年级中的有任课权限的班级录入
        //         for(var i=0;i<res.length;i++){
        //             // console.log(that.rkList.length,0);
        //             if(localStorage.getItem("lguserType")==3){
        //                 for(var j=0;j<that.rkList.length;j++){
        //                     if(res[i].uuid==that.rkList[j].bjid){
        //                         that.hasBjList.push(res[i]);
        //                     }
        //                 }
        //             }else{
        //                 that.hasBjList.push(res[i]);
        //             }
                    
        //         }
        //     })
        // },
        changeKc(){
            //console.log(this.xmInfoList,1800);
            var NjList = [];
            for(var i=0;i<this.xmInfoList.length;i++){
                var flag = false;
                for(var j=0;j<NjList.length;j++){
                    if(NjList[j].njdm == this.xmInfoList[i].njdm){
                        flag = true;
                        //return
                    }
                }
                if(!flag){
                    NjList.push({'njdm':this.xmInfoList[i].njdm,'njmc':this.xmInfoList[i].njmc})
                }
            }
            // console.log(NjList,250000);

            var that = this;
            //var NjList = _.find(this.hasKcList, {'kcid':this.BatchSelKc});


            //var NjList =   
            // console.log(this.hasBjList,1803);
            // console.log(NjList.njList,1804)
            this.BatchSelClass = "";
            this.hasBjList = [];
            NjList.forEach(async function(item,index){
                var res = await that.getAllBj(item.njdm);
                // console.log(res,2212)
                // 只把存在的年级中的有任课权限的班级录入
                for(var i=0;i<res.length;i++){
                    // console.log(that.rkList.length,0);
                    // if(localStorage.getItem("lguserType")==3){
                    //     for(var j=0;j<that.rkList.length;j++){
                    //         if(res[i].uuid==that.rkList[j].bjid){
                    //             that.hasBjList.push(res[i]);
                    //         }
                    //     }
                    // }else{
                        that.hasBjList.push(res[i]);
                    // }
                    
                }
            })
        },




        /**
         * 关闭数据导入弹层
         * by:RayJ
         * time:2019-05-16
         */
        BatchimportCancel(){
            this.rwImportData = false;
            this.bzImportData = false;
        },

        /**
         * 格式化总项目列表
         * by:RayJ
         * time:2019-05-17
         */
        formatXmInfoList(xmList){
            this.hasKcList = [];
            var that = this;
            xmList.forEach(function(item,index){
                // console.log(that.hasKcList,1806);
                // console.log(item.kcid,11111);
                // console.log(_.findIndex(that.hasKcList,{"kcid":item.kcid}),22222)
                var kcIndex = _.findIndex(that.hasKcList,{"kcid":item.kcid})
                if(kcIndex >= 0){
                    var njIndex = _.findIndex(that.hasKcList[kcIndex].njList,{"njdm":item.njdm})
                    if(njIndex==-1){
                       that.hasKcList[kcIndex].njList.push({"njdm":item.njdm,"njmc":item.njmc});
                    }
                }else{
                    that.hasKcList.push({"kcid":item.kcid,"kcmc":item.kcmc,"njList":[]});
                    that.hasKcList[that.hasKcList.length-1].njList.push({"njdm":item.njdm,"njmc":item.njmc});
                }
                // console.log(item,index,1812);
                // console.log(that.hasKcList,1813);
            })
            
            console.log(this.hasKcList,1821);
        },

        /**
         * 上传错误
         * by:RayJ
         * time:2019-05-20
         */
        uploadError (response, file, fileList) {
            this.importLoading = false;
            console.log(response+"");
            this.tipsXX(response+"",'error','失败');
        },

        /**
         * 上传前对文件的大小的判断
         * by:RayJ
         * time:2019-05-20
         */
        beforeUpload (file) {
            this.importLoading = true;
            let extension = file.name.split('.')[1] === 'xlsx'
            let isLt2M = file.size / 1024 / 1024 < 10
            if (!extension) {
                this.tipsXX('上传模版只支持xlsx格式！','info','提示');
                this.importLoading = false;
            }else if (!isLt2M) {
                this.tipsXX('上传模板大小不能超过 10MB','info','提示');
                this.importLoading = false;
            }
            return extension && isLt2M
        },

        /**
         * 数据导入
         * by:RayJ
         * time:2019-05-20
         */
        newImport(command){
            if(command=='xm'){                  //按项目导入
                this.importData();
            }
            if(command=='bz'){                  //按标准导入
                this.importStandardData();
            }
        },

        /**
         * 上传成功后的回调
         * by:RayJ
         * time:2019-05-20
         */
        uploadSuccess (response, file, fileList, type) {
            this.errData = [];
            console.log(response);
            if(response.status==200){
                if(response.value.data.length>0){
                    this.tipsXX(response.value.message,"warning");
                    this.errData = response.value.data;
                }else{
                    this.tipsXX("导入成功","success");
                    this.bzImportData = false;
                }   
            }else if(response.status==1){
                if(response.data.length>0){
                    this.tipsXX(response.message,"warning");
                    this.errData = response.data;
                }else{
                    this.tipsXX("导入成功","success");
                    this.bzImportData = false;
                }   
            }else{
                this.tipsXX("导入失败","error");
            }
            this.fileList = [];
            // var isfilename = [];                   //正确的文件名
            // var that = this
            // if(type =='xm'){                    //项目导入
            //     if(this.bjList && this.bjList.length>0){
            //         this.bjList.forEach(function(item,index){
            //             isfilename.push(that.zxmInfo.mc+item.bj+'.xlsx')
            //         })
            //     }
            // }
            // var isSure = false;             //判断上传的文件名是否正确
            // isfilename.forEach(item => {
            //     if(item==file.name){
            //         isSure = true
            //     }
            // })
            // if(isSure){
            //     if(response.status=="200"){
            //         this.importLoading = false;
            //         this.tipsXX("上传成功",'success','成功');
            //         if(type=='xm')                           //项目导入
            //             this.BatchimportCjFormVisible = false;
            //         this.fileList = [];
            //         this.getList();
            //     }else{
            //         this.importLoading = false;
            //         this.fileList = [];
            //         this.tipsXX(response.resultMessage,'error','失败');
            //     }
            // }else{
            //     this.importLoading = false;
            //     this.fileList = [];
            //     this.tipsXX("上传文件名不一致",'error','失败');
            // }
        },

        /**
         * 和标准上传图片有关的方法 以下
         */
        async handleRemove(file, fileList){
            var res = await delwj({id:file.uuid});
            this.uploadfile_bz = "";
            this.upImageList = [];
            this.tipsXX("图片删除成功","success");
        },
        handleError(){
            console.log("1231231312312");
        },
        handleSuccess(file, fileList){
            this.uploadfile_bz = file.value.data.uuid;
            this.upImageList.push({url:file.value.data.webUrl,uuid:file.value.data.uuid});
        },
        /**
         * 以上 和标准上传图片有关的方法
         */

        /**
         * 数据导入----批量导入标准方法
         * by:RayJ
         * time:2019-05-16
         */
        importStandardData(){
            this.bzImportData = true;
            this.formatXmInfoList(this.xmInfoList);
        },

        /**
         * 成绩上报
         * By:RayJ
         * Time:2019-05-22
         */
        async reportScore(){
            this.loading = true;
            var notifyObj = this.$notify({title: '提示',message: '成绩正在上报中...',duration: 0,showClose:false});
            var res = await ReportScore();
            this.loading = false;
            this.tipsXX("上报成功","success");
            notifyObj.close();
            this.getList();
        },


        /**
         * 拷贝其他学期的项目
         * By:RayJ
         * Time:2019-05-22
         */
        async copySemester(){
            console.log(this.copySelect,'this.copySelect')
            if(!this.copySelect.xn||!this.copySelect.xq){
                this.tipsXX('请选择要复制的学年学期','warning','提示');
                return 
            }
            let params = {
                xxdm: window.localStorage.getItem("xxdm"),
                xn: this.copySelect.xn,
                xq: this.copySelect.xq
            }
            this.iscopy = true;
            let res = await reportapi.CopyBySemester(params);
            if(res.status==1){
                this.tipsXX(res.message,'success','成功');
                this.searchFn()
            }else{
                this.tipsXX(res.message,'error','失败');
            }
            this.iscopy = false;
        },
        
        // 按年级区分学科
        async groupKcByGrade(){
          var res = await getAllKcnjgx({xxdm: this.xxdm});
          var kclist = JSON.parse(JSON.stringify(this.kcList));
          var gradeKcList = {};
          res.forEach(e=>{
            var kc = kclist.find(k=>e.kcdm==k.uuid);
            if(kc){
              if(!gradeKcList[e.njdm]){
                 gradeKcList[e.njdm] = [];
              }
              gradeKcList[e.njdm].push(kc);
            }
          })
          gradeKcList[''] = [];
          this.gradeKcList = gradeKcList;
          console.log(gradeKcList);
        },
        
        
        // 获取科目类型
        async getSubjectType(){
          var res = await getKclbByXxdm({page: 1,limit: 500, xxdm: this.xxdm,});
          var type = res;
          type.forEach(e=>{
            e.kcmc = e.lbmc;
            e.uuid = e.lbid;
          })
          this.kcList.forEach(e=>{
            var ind = type.findIndex(t=>t.lbid==e.kclx);
            if(ind>=0){
              if(!type[ind].kcList){
                type[ind].kcList = [];
              }
              type[ind].kcList.push(e);             
            }
          })
          console.log('change')
          this.copySelectOptions.options = type;
        },
        
        // 保存创建副本
        createCopy(){
          var item = this.copyItem.originItem;
          var type = Number(this.copyItem.type);
          var value = this.copyItem.values[type-1];
          if(!value||value.length==0){
            this.tipsXX('请选择'+(type==1?'年级':'学科'),'error','错误');
            return;
          }          
          var params = {
            xmId: this.copyItem.originItem.uuid,
            njList: [],
            kcList: []
          }
          if(type==1){
            // 选年级
            value.forEach(e=>{
              var nj = this.njList.find(n=>n.njdm==e);
              if(nj){
                params.njList.push({njdm:nj.njdm,njmc:nj.njmc});
              }
            })
          } else {
            // 选学科         
            value.forEach(e=>{
              var kc = this.kcList.find(k=>k.uuid==e[1]);
              if(kc){
                params.kcList.push({kcid:kc.uuid,kcmc:kc.kcmc});
              }
            })
          }
          console.log(params,3169)
          const h = this.$createElement;
          this.$msgbox({
              title: '创建副本',
              message: h('div', null, [
                  h('div', { style: 'padding: 10px 0; text-align: center;' } , '你确定要复制项目【'+item.mc+'】吗?'),
                  h('div', { style: 'color: #E51C23; text-align: center; padding: 10px 0;' }, '注意事项：副本所有的设置保持不变，但数据会清零')
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = '创建中...';
                      CopyByDuringSemester(params).then(response => {
                          done();
                          instance.confirmButtonLoading = false;
                          this.tipsXX("创建副本成功",'success','成功');
                          this.createCopyVisible = false;
                          this.getList()
                      })
                  } else {
                      done();
                  }
              }
          }).then(action => {});
          
        }
        
        
    }
};
</script>

<style scoped lang="scss">
    .errDataTit{
        font-size: 14px;
        padding-top: 10px;
    }
    .djRight{
        width: 100%;
        margin-bottom: 10px;
        float: left;
    }
    .djRight .dashed{
        max-width: 495px;
    }
    .djCol{
        // width: 250px;
        // float: right;
        float: left;
        margin-left: 10px;
    }
    .fl{
        float: left;
    }
    .djhsInput{
        width: 70px;
    }
    .djipt{
        width: 48px;
        margin-right: 10px;
        text-align: center;
    }
    .djipt /deep/ .el-input__inner{
        padding: 0;
    }
    .djipt /deep/ input,.djiptsel /deep/ input{
        text-align: center;
    }
    .flcontral{
        float: left;
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #FFF;
        background-color:#409Eff;
        border-radius: 4px;
        margin: 5px;
        margin-left:0;
        cursor: pointer;
    }
    .flcontral:hover{
        background-color:#66b1ff;
    }
    .djiptsel{
        width: 80px;
        text-align: center;
        margin-right:5px;
    }
    //在线导入
    .import_box {
        .import_body {
            overflow: hidden;
        }
        .import_desc {
            overflow: hidden;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: left;
        }
    }
    .selectBox{
        white-space:nowrap; float:left;
        padding-right: 15px;
        .label{
            float: left;
            font-weight: bold;
            color: #606266;
            line-height: 38px;
            font-size: 16px;
        }
    }
    .right {
        float: right;
    }
    .partbox-card{
        position: relative;
        margin-bottom: 20px;
        width: 100%;
        // min-width: 680px;
    }
    .partkn{
        height: 40px;
        .card-kcmc{
            float: left;
            font-size: 18px;
            font-weight: bold;
            color: #444;
            margin-right: 10px;
        }
    }
    .partcon{
        margin: 0 -10px;
    }
    .box-card {
        position: relative;
        cursor: pointer;
        width: 300px;
        height: 165px;
        float: left;
        margin: 0 10px 20px;

        .card-mask{
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(255, 255, 255, .95);
            z-index: 1;
            padding: 0 20px;
            div{
                margin: 10px 0;
                .kzbtn{ width: 100%;}
                .kzbtn-cen{
                    width: 121px;
                }
            }
        }
        :hover .card-mask {
            display: block;
        }
        :hover .card-btn {
            display: block;
        }
        .card-btn {
            display: none;
            .delete-btn {
                margin-left: 10px;
            }
        }
        .card-title {
            font-size: 20px;
            margin-bottom: 20px;
        }
        .card-tag {
            margin-bottom: 16px;
        }
        .card-desc {
            color: #606266;
            font-size: 16px;
            margin-bottom: 25px;
            .desc-son {

                color: #909399;
            }
        }
    }

    .menu-btn {
        position: fixed;
        bottom: 60px;
        right: 52px;
        width: 70px;
        z-index: 2;
        .create-btn {
            width: 70px;
            height: 70px;
            font-size: 30px;
        }
        .search-btn {
            width: 70px;
            height: 70px;
            margin-top: 20px;
            font-size: 30px;
            &.search-btn-setpjqz{
                font-size:12px;
                line-height: 16px;
                white-space: initial;
                padding: 0 10px;
            }
        }

    }

    .searchWrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: 0;
        z-index: 2001;
        background: rgba(33,33,33,0.5);
        .searchKeyBox {
            overflow-y: scroll;
            overflow-x: hidden;
            height: 100%;
            width: 300px;
            background: white;
            float: right;
            .searchKey {
                line-height: 40px;
            }
            .searchKeyDetail {
                .searchKeyItem {
                    padding: none;
                    // margin-bottom: 5px;
                    .select-item{
                        border: none;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                }

            }
        }
    }

    .hsItem {
        margin-bottom: 10px;
        .dashed{
            float: left;
            border: 1px dashed #ccc;
            padding: 0 10px;
            margin-right: 10px;
        }
        .hsInput {
            width: 120px;
            margin: 0 10px;
        }
        .hsInputmini {
            width: 105px;
            margin: 0 10px;
        }
        .hsInputmini.per{
            width:90px;
            margin: 0 5px;
        }
    }
    .hsInput.zgcj{ 
        display: inline-block;
        width: 200px;
    }

    .dashdiv{
        border: 1px dashed #ccc;
        padding: 0 10px;
        width: 600px;
    }
    .djlx{
        margin-bottom: 10px;
        padding: 0 10px;
        width: 600px;
    }
    .tipsbtn{
        color: red; margin-left: 5px;
    }
    .exptips{
        margin-bottom: 11px;
        line-height: 40px;
        color: #999;
    }
    .setqz{
        color: #3F51B5;
        margin-left: 10px;
        cursor: pointer;
    }
    .baseval{
        margin-bottom: 11px;
        .maxfxval{
            display: inline-block;
            padding-left:10px;
            width: 200px;
        }
        .hsType{
            display: inline-block;
            padding-left: 20px;
        }
    }
    .empty{
        font-size: 16px;
        color: #666;
        text-align: center;
    }
    .dialogprog{
        .exptips{
            border-bottom: 1px solid #ccc;
            width: 600px;
        }
    }
    .layXmqz_setLi{
        min-width: 880px;
        color: #101010;
        .Xmqz_setTit{
            float: left;
            width: 150px;
            .xmmc{
                text-align: center;
                font-size: 24px; line-height: 40px; padding-top: 11px;
            }
            .xmtype{
                font-size: 14px;
                text-align: center;
            }
        }
        .signalg{
            float: left; line-height: 40px; width: 30px; text-align: center; padding-top: 11px;
        }
        .part{
            position: relative;
            margin-left: 180px
        }
        .border{
            border: 1px dashed #bbb;
            height: 62px; padding: 10px;
            float: left;
        }
        .Xmqz_setItem{
            display: inline-block;
            .border{
                cursor: pointer;
                width: 430px;
                position: relative;
                .signalg{
                    padding-top: 0;
                }
                .el-icon-close{
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    font-size: 20px;
                    display: none;
                }
            }
            .border:hover{
                .el-icon-close{
                    display: block;
                }
            }
            .rowsel{
                float: left; width: 110px;
            }
            .rowsign{
                float: left; width: 100px;
            }
            .rowinpapp{
                float: left; width: 92px;
            }
            .rowinp{
                float: left; width: 72px;
            }
        }
        .Xmqz_setAdd{
            display: inline-block;
            cursor: pointer;
            .border{
                width: 130px;
                i{
                    font-size: 28px;  line-height: 40px; float: left;
                }
                span{
                    line-height: 40px; float: left; margin-left: 10px;
                }
            }
        }
        .ysfh-jsfs{
            width: 88px;
            margin: 0 auto;
            display: block;
            margin-top: 4px;
        }
    }
    .setqzTop{
        .name{
            float: left; margin-right: 10px; line-height: 40px; font-size: 18px;
        }
        .exptips{
            float: left; color: #5C97CA;
        }
    }
    .contain-setqz{
        .center-footer{
            text-align: center; padding: 20px 0;
        }
    }
    .xmHeader{
        text-align: right;
    }
    .import_box /deep/ .el-dialog__body{
        padding: 10px 20px;
    }
    .colLineTit{
        line-height: 32px;
        text-align: right;
        padding-right: 10px;
    }
    .upimgLi{
        position: relative;
    }
    .upimgLi /deep/ li,.upimgLi /deep/ .el-upload{
        width: 92px;
        height: 92px;
    }
    .upimgLi /deep/ .el-upload{
        line-height:96px;
    }
    .tipslayer{
        padding-left:20px;
        color: #999;
        font-size: 14px;
    }
.copyDialog{
    width: 100%;
    .copyHead{
        width: 100%;
        height: 40px;
        font-size: 16px;
        line-height: 40px;
        // background: #f2f2f2;
    }
    .copyBody{
        width: 100%;
        .col{
            width: 100%;
            padding: 5px 0;
            .label{
                font-size: 14px;
                color: #444;
            }
            .gray{
                color: #999;
                font-size: 12px;
            }
            .red{
                color: #F00;
                font-size: 12px;
            }
        }
        .col.alignRight{
            text-align: right;
        }
    }
}
/deep/ .additem{
    font-size: 16px;
    padding:0 20px;
    height:50px;
    line-height: 50px;
    display: inline-block;
    cursor: pointer;
}
/deep/ .additem:hover{
    color: #FF9600;
}

.copyItemInfo{
  background-color: #f2f2f2;
  font-size: 18px;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  &::after {
      content: '';
      height: 0;
      line-height: 0;
      display: block;
      visibility: hidden;
      clear: both;
  }
  .item{
    display: inline-block;
    width: 49%;
    line-height: 40px;
    float: left;
    box-sizing: border-box;
    padding-right: 20px;
    &.line{
      width: 100%; 
    }
    &.flex{
      display: flex;
    }
    &.overflow{
      overflow: hidden;
      height: 50px;
      p{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    i{
      line-height: 40px;
    }
  }
}

.copySelectTip{
  margin-bottom: 20px;
}
/deep/ .el-select .el-select__tags{
  z-index: 2;
}
.filter-container::after{
  content:""; 
  display: block; 
  clear:both; 
}
</style>
<style>
    .el-cascader-menu{
        height:auto;
        max-height: 250px;
    }
    .dialogprog .el-radio-group label{
        margin: 0 10px 10px 0;
    }
    .el-radio.is-bordered+.el-radio.is-bordered{
        margin-left: 0;
    }
    .rowinpapp .el-input-group__append{ padding: 0 5px;}

</style>



