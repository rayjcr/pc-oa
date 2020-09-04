<template>
<div class="app-container calendar-list-container">


    <div class="u_TableMain block ofhide" type="border-card">
        <div v-if="!xmqzFormVisible">
            <!-- 项目详情描述   -->
            <div class="filter-container">
                <div class="detail">
                    <div class="detail-box">
                        <el-row class="detail-title">
                            <el-col :span="12">项目名称：</el-col>
                            <el-col :span="12">{{zxmInfo.mc}}</el-col>
                        </el-row>
                        <el-collapse-transition>
                            <el-row class="detail-content" v-if="!showPull">
                                <el-tag size="small">{{xxlm=='007'?(zxmInfo.zymc+(zxmInfo.kcmc?'/'+zxmInfo.kcmc:'')):zxmInfo.kcmc}}</el-tag>
                                <el-tag size="small">{{zxmInfo.njmc}}</el-tag>
                            </el-row>
                        </el-collapse-transition>
                    </div>
                    <div class="detail-box">
                        <div class="detail-title">目前该项目下的子项目有{{itemNum}}个，考核任务有{{taskTotalNum}}个</div>
                        <el-collapse-transition>
                            <el-row class="detail-content" v-if="!showPull">
                                <el-col style="width: 80px;" class="content-title">权重规则：</el-col>
                                <el-col :span="20">{{zxmInfo.qzgz}}</el-col>
                            </el-row>
                        </el-collapse-transition>
                    </div>
                </div>
                <div class="detail-pull">
                    <el-button :icon="showPull? 'el-icon-arrow-down':'el-icon-arrow-up'" class="detail-pullbtn"  @click="showPull=!showPull"></el-button>
                </div>
                <div class="cj-header">
                    <el-button type="primary"  class="right mleft" @click="importData">数据导入</el-button>    
                    <el-button type="primary" class="right mleft" @click="reportCj">成绩上报</el-button>
                </div>
            </div>


            <div class="m_GenTableBox">
                <div style="overflow:hidden;"  v-loading.body="listLoading">
                    <el-card class="box-card" shadow="hover"  v-for="(list,ind) in xmInfoList" :key="ind">
                        <div class="card-mask">
                            <div><el-button type="primary" class="kzbtn" size="mini" plain @click.native="handleView(list)">查看子项目</el-button></div>
                            <div v-if="list.jflx!=3 && list.jflx!=4 && list.jflx!=5">
                                <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop="handleSetqz(list)">权重设置</el-button>
                                <el-button type="primary" class="kzbtn-cen" size="mini" @click.stop="handleCopy(list)" plain>创建副本</el-button>
                            </div>
                            <div v-else>
                                <el-button type="primary" class="kzbtn" size="mini" @click.stop="handleCopy(list)" plain>创建副本</el-button>
                            </div>
                            <div>
                                <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop ="handleUpdate(list)">修 改</el-button>
                                <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop="handleDelete(list)" v-if="list.xmlx == 0">删 除</el-button>
                            </div>
                        </div>
                        <div class="card-title">{{list.mc}}</div>
                        <div class="card-desc">
                            <span>总任务 {{list.rwsl}}</span><span v-if="list.ywzx == 1" class="desc-son"> ( 子项目 {{list.zxmsl}})</span>
                        </div>
                        <div class="card-progress">
                            <el-progress v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" :percentage="0" v-if="list.ysbsl == 0"></el-progress>
                            <el-progress v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" :status="list.ysbsl==list.rwsl?'success':''" :percentage="Math.floor(100 * list.ysbsl/list.rwsl)" v-if="list.ysbsl > 0"></el-progress>
                        </div>
                    </el-card>
                </div>
                <div class="menu-btn" v-if="xmlx == 0">
                    <div>
                        <el-button circle type="primary" icon="el-icon-plus" @click="handleCreate" class="create-btn"></el-button>
                    </div>
                </div>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                </div>
            </div>
        </div>
        <!-- 设置权重 -->
        <div class="contain-setqz" v-if="xmqzFormVisible">
            <div class="setqzTop clear">
                <span class="name">设置权重</span>
                <div class="exptips">示例说明：语文总学分=第一次月考×15%+第二次月考×15%+期中考试×25%+第三次月考×15%+期末考试×30%</div>
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
            </el-form>
            <div slot="footer" class="center-footer">
                <el-button type="primary" :disabled="btnLimt" @click="setXmqzSure"  v-if="XmqzList.length>0">保 存</el-button>
                <el-button @click="setXmqzCancel">取 消</el-button>
            </div>
        </div>
    </div>




    <!-- 新建子项目弹层 -->
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal='false' :visible.sync="createFormVisible" width="850px" :before-close="createCancel" class="dialogprog">
        <el-form :model="form" ref="createform" label-width="110px" :rules="rules">
            <el-form-item label="项目名称" prop="mc">
                <el-input v-model="form.mc" placeholder="请输入项目名称" :disabled="form.xmlx != 0"></el-input>
            </el-form-item>
            <!-- 添加排序beg -->
            <el-form-item label="排序">
                <el-input-number v-model="form.px" controls-position="right" :min="1" :max="9999"></el-input-number>
            </el-form-item>
            <!-- 添加排序end -->
            <el-form-item label="计分类型" required style="margin-bottom:10px;">
                <el-radio v-model="jflxsel" label="0" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">原始数据换算成学分</el-radio>
                <el-radio v-model="jflxsel" label="1" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">原始数据换算成等级</el-radio>
                <el-radio v-model="jflxsel" label="2" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange" v-if='fjzhdj==0'>保留原始数据，不做换算</el-radio>
                <div class="dashdiv">
                    原始数据：
                    <el-radio v-model="jflx" label="0" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">成绩分值</el-radio>
                    <el-radio v-model="jflx" label="1" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2&&fjzhdj==0">累积任务数</el-radio>
                    <el-radio v-model="jflx" label="7" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2&&fjzhdj==0">加减分</el-radio>
                    <el-radio v-model="jflx" label="3" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=0">等级</el-radio>
                    <el-radio v-model="jflx" label="5" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">体育数据</el-radio>
                    <el-radio v-model="jflx" label="4" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">图文评语</el-radio>
                    <!--元通小学项目时添加学分选项 20190509 14:28-->
                    <el-radio v-model="jflx" label="2" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=0">学分</el-radio>
                </div>
            </el-form-item>
            
            <el-form-item required v-if="(jflx != 1 && jflxsel!=2)&&!(jflxsel==1&&jflx==3)">
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
                        <el-radio v-model="hsType" label='0' :disabled="!isCanUpdata" @change="hsTypeChange">数值型</el-radio>
                        <el-radio v-if="jflxsel==1" v-model="hsType" label='2' :disabled="!isCanUpdata" @change="hsTypeChange" >百分比</el-radio>
                        <el-radio v-model="hsType" label='1' :disabled="!isCanUpdata" @change="hsTypeChange">班级排名</el-radio>

                        <el-radio v-if="jflxsel==1" v-model="hsType" label='3' :disabled="!isCanUpdata" @change="hsTypeChange">年级排名</el-radio>
                    </div>
                </div>

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

                <!--班级排名转换-->
                <div class="baseval" v-if="hsType=='1'||hsType=='3'">
                    最高成绩: 
                    <el-input v-model="form.zgcj" placeholder="0~100" class="hsInput zgcj" size="small" :disabled='!isCanUpdata'></el-input>
                </div>

                <div class="hsItem" v-if="hsType=='1'||hsType=='3'" v-for="(item,index) in perHsRange" :key="index">
                    <div class="dashed">
                        前
                        <el-input v-model="item.zdz" placeholder="0.00~100.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>%
                    </div>
                    换算为
                        <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                    <span>{{jflxsel==0?'学分':'等级'}}</span>

                    <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                </div>
                <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button>
            </el-form-item>


            <el-form-item required v-if="jflxsel==1&&jflx==3">
                <!-- <div class="baseval" v-if="jflxsel==1&&jflx==2">项目最高学分:
                    <el-input class="maxfxval" v-model="form.zgxf" :min="0" :max="500" ></el-input>
                </div> -->
                <div class="djlx">
                    <el-radio v-model="djlx" label="6" @change="djlxChange">获取转换等级</el-radio>
                    <el-radio v-model="djlx" label="4" @change="djlxChange">获取最高等级</el-radio>
                    <el-radio v-model="djlx" label="5" @change="djlxChange">获取星级任务的最高等级</el-radio>
                </div>

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

                <el-button icon="el-icon-plus" v-if="djlx==6" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button>


            </el-form-item>


            <el-form-item style="margin-bottom:0px;" v-if="jflx==1&&jflxsel==1">  
                <div class="baseval">
                    转换方式: 
                    <div class="hsType">
                        <el-radio v-model="rwzhfs" label='0' :disabled="!isCanUpdata" @change="rwhsTypeChange">个数型</el-radio>
                        <el-radio v-model="rwzhfs" label='1' :disabled="!isCanUpdata" @change="rwhsTypeChange">百分比</el-radio>
                    </div>
                </div>
            </el-form-item>


            <!--如果是累计任务并且不是保留原始数据-->
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
                <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button>
            </el-form-item>


            <!--转换等级开启-->
            <div v-if="jflxsel==0&&jflx==0">
                
                <el-form-item label="转化等级" required>
                    <el-radio v-model="zhdj" label='0' :disabled="form.xmlx != 0 || !isCanUpdata">否</el-radio>
                    <el-radio v-model="zhdj" label='1' :disabled="form.xmlx != 0 || !isCanUpdata">是</el-radio>
                </el-form-item>


                <!--转换等级开启 -->
                <el-form-item>  
                    <div class="baseval" v-if="zhdj == 1">
                        转换方式: 
                        <div class="hsType">
                            <el-radio v-model="djhsType" label='0' :disabled="form.xmlx != 0 || !isCanUpdata"  @change="jfdjChange">数值型</el-radio>
                            <el-radio v-model="djhsType" label='2' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >百分比</el-radio>
                            <el-radio v-model="djhsType" label='1' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >班级排名</el-radio>

                            <el-radio v-model="djhsType" label='3' :disabled="form.xmlx != 0 || !isCanUpdata" @change="jfdjChange" >年级排名</el-radio>
                            
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
                            <el-input v-model="item.zdz" placeholder="0.00~100.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>%
                        </div>
                        换算为
                            <el-input v-model="item.sz" placeholder="请输入ABCD" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>等级</span>

                        <el-button type="text" icon="el-icon-minus" @click="deletezhdj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>





                    <el-button icon="el-icon-plus" @click="addzhdj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button>
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






    <!-- 项目在线导入 -->
    <!-- <el-dialog width="440px" title="项目导入" :visible.sync="DialogVisibleTips">
        <p>该操作仅限项目导入，导入前需创建好所有任务，确定全部创建完成？</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="TipsSure">确 定</el-button>
            <el-button @click="DialogVisibleTips = false">取 消</el-button>
        </div>
    </el-dialog> -->
    <el-dialog title="数据导入" :visible.sync="BatchimportCjFormVisible" width="540px" :before-close="BatchimportCancel" class="import_box">
        <el-alert  title="导入前需创建好所有任务,确定全部创建完成?"   type="info"   close-text="知道了"></el-alert>
        <el-row style="margin:10px 0;">
            <el-col :span="6" style="line-height:32px">执行班级:</el-col>
            <el-col :span="18">
                <el-select v-model="BatchSelClass" size="small"  placeholder="请选择">
                    <el-option v-for="item in bjList" :key="item.uuid" :label="item.bj" :value="item.uuid"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" style="line-height:32px">文件选择：</el-col>
            <el-col :span="18">
                <el-upload
                    :limit="1"
                    name="excelfile"
                    ref="BatchcjForm"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action="/api/netcore/smartcredit/v2/Xmcj/BatchImportExcel"
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
            <el-button size="medium" type="primary" @click="importSubmit('BatchcjForm')" :loading="importLoading">确 定</el-button>
            <el-button size="medium" @click="BatchimportCancel">取 消</el-button>
            <el-button size="medium" @click="BatchimportMb">模版生成<i class="el-icon-download"></i></el-button>
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


</div>
</template>


<script>
import Cookies from 'js-cookie'
import { Loading } from 'element-ui';
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import  * as mainPapi from "api/project/mainProject/index";
import  * as detailPapi from 'api/project/projectDetail/index'

export default {
    name: "mainProject",
    components: {

    },
    data() {
        return {
            uuid: null,
            xmlx: window.localStorage.getItem('xmlx'),
            listLoading: true, // 加载
            total: null,
            listQuery: {
                pageIndex: 1,
                pageSize: 20,
                fjxmId: window.localStorage.getItem('fjxmId'),
                xxdm: window.localStorage.getItem('xxdm'),
            },
            fjzhdj: window.localStorage.getItem('fjzhdj'),                  //父级是否转化等级
            zxmInfo:{},             //主项目信息
            xxlm: window.localStorage.getItem('xxlm'),                //学校类型   007--职高
            xmInfoList:[],                  //项目列表
            itemNum: 0,                     //子项目共计
            taskTotalNum: 0,                //任务共计
            showPull:true,                 //下拉

            isCanUpdata:true,               //是否可以修改项目
            dialogStatus: "",
            createFormVisible: false,
            textMap: {                      //判断弹层是添加还是编辑
                update: "编辑子项目",
                create: "新建子项目"
            },
            btnLimt: false, //防止重复提交BUG
            form: {},
            zhdj:'0',                       //转化等级
            hsType:'0',                     //换算方式 0 数值型(默认)  1 百分比
            djhsType:'0',                   //换算方式等级 0 数值型(默认)  1 百分比
            jflxsel:'0',                     //计分类型       0 原始数据换算成积分  1 原始数据换算成等级   2 保留原始数据，不做换算
            jflx: '0',                      //计分形式
            expObj:{                        //示例
                '00':'示例：A同学该项目根据一定的权重计算后总分为82，换算成最终学分为10学分',           //积分--成绩分值
                '01':'示例：A同学该项目累计完成了6个任务，换算成最终学分为8学分',                      //积分--累积量
                '07':'示例：A同学在基准值60分的基础上额外获得了8分，最终得分为68，转化后得8学分',       //积分--加减分
                '10':'示例：A同学该项目根据一定的权重计算后总分为82，最终换算成等级为A',               //等级--成绩分值
                '11':'示例：A同学该项目累计完成了6个任务，最终换算成等级为B',                         //等级--累积量
                '17':'示例：A同学在基准值60分的基础上额外获得了8分，最终得分为68，最终换算成等级为B',   //等级--加减分
                '12':'示例：A同学该项目根据一定的权重计算后总学分为8，最终换算成等级为B',   //等级--加减分
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
            //表单较检规则
            rules: {
                mc: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度不得超过12个字符', trigger: 'blur' }
                ],
            },

            xmqzFormVisible:false,          //设置权重页面
            setXmqzform:{},                 //权重
            XmqzRes:{},                     //权重res
            XmqzList:[],                    //权重list
            alreadysetqz:[],                //已经设置过的权重

            // 项目在线导入
            DialogVisibleTips:false,
            BatchimportCjFormVisible: false,
            importLoading: false,
            BatchSelClass:'',           //所选的班级
            bjList: [],                                //所有的班级List
            xnxq: {},
            fileList: [],

            djlx:"6",
            djList:["A","B","C","D","E","F","待评"],
            djlxSel:[{"value":0,"label":"="},{"value":1,"label":">="},{"value":2,"label":"<="},{"value":3,"label":">"},{"value":4,"label":"<"},{"value":5,"label":"存在"}],
            errData:[],                    //结果信息
            uploadfile_bz:"",               //项目标准中使用的图片的uuid
            loading:false,                   //加载等待
            rwzhfs:"0",                     //累计任务的转换方式
        }

    },
    created() {
        this.init();                        //获取主项目的信息
        this.dqXnXqObj();

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
        // 获取主项目的信息
        init(){
            if(this.listQuery.fjxmId){
                mainPapi.getItem({id: this.listQuery.fjxmId}).then(response => {
                    this.zxmInfo = response
                })
                this.getList();
            }else{
                this.listLoading = false
                this.$router.push({
                    path: '/projectManager/mainProject',
                })
            }
        },
        getList() {
            mainPapi.page(this.listQuery).then(response => {
                this.total = response.totalCount;
                this.xmInfoList = response.list;
                this.itemNum = response.list.length;                //子项目共计
                this.taskTotalNum = response.rwCount;               //任务共计
                this.listLoading = false;
            });
        },
        // 分页
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageIndex = val;
            this.getList();
        },
        // 新建项目
        handleCreate() {
            this.btnLimt = false;
            this.dialogStatus = "create";
            this.createFormVisible = true;
            this.isCanUpdata = true
            this.form.xmlx = '0';
            this.zhdj = '0';
            this.arrinit();
        },
        // 修改项目
        handleUpdate(item) {
            let _this = this;
            _this.HsRange = [{type: 1},{type: 1},{type: 1}];
            _this.zhdjHsRange = [{type: 1},{type: 1},{type: 1}];
            _this.perHsRange = [{type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}];
            _this.perDjHsRange = [{type: 2,zxz:0},{type: 2,zxz:0},{type: 2,zxz:0}];

            _this.btnLimt = false;
            _this.uuid = item.uuid;
            _this.dialogStatus = 'update';
            mainPapi.getItem({id: item.uuid}).then(response => {
                _this.form = response
                console.log(_this.form,555)
                _this.zhdj = String(_this.form.zhdj)
                _this.jflx = String(_this.form.jflx)
                _this.rwzhfs="0";
                if(_this.zhdj=='1'&&_this.form.zhxf==0){                     //转化等级0--转化为积分或者是不做换算   1--转化为等级
                    this.jflxsel = '1'
                }else if(_this.zhdj=='0'){
                    if(_this.jflx=='4' || _this.jflx=='5'|| _this.jflx=='3'|| _this.jflx=='2'){
                        this.jflxsel = '2'
                    }else{
                        this.jflxsel = '0'
                    }
                }


                //转换学分分类   1.不转换学分 zhxf=0 2.不转换学分 zhxf=1 3.不转换学分 zhxf=2、3
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
                    console.log(_this.form.hs,777777)
                    if(_this.form.hs && _this.form.hs.length>0){
                        _this[RangStr] = []
                        _this.form.hs.forEach(function(item,index){
                            _this[RangStr].push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.xf})
                        })
                    }
                }else if(_this.form.zhxf==0&&_this.form.realZhdj!=0){
                    var RangStr = "";
                    console.log(_this.form,8888888)

                    if(_this.form.realZhdj==1){
                        _this.hsType="0";
                        RangStr = "HsRange";
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


                    }else if(_this.form.realZhdj==6){
                        _this.hsType="0";
                        RangStr = "HsRange";
                        _this.djlx == _this.form.realZhdj.toString();
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
                            _this[RangStr] = []
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
                if(_this.form.realZhdj!=0&&_this.form.zhxf==0){
                    var RangStr = "";
                    if(_this.form.realZhdj==1){
                        _this.djhsType="0";
                        RangStr = "zhdjHsRange";
                    }else{
                        _this.djhsType="1";
                        RangStr = "perDjHsRange";
                    }
                    if(_this.form.djHs && _this.form.djHs.length>0){
                        _this[RangStr] = []
                        _this.form.djHs.forEach(function(item,index){
                            _this[RangStr].push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.djz})
                        })
                    }
                }



                _this.createFormVisible = true;

                if(_this.form.allRwCount>0){
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
            this.jflxsel = '0';
            this.jflx = '0';
            this.isCanUpdata = true
            this.HsRange = [
                {type: 1},{type: 1},{type: 1}
            ]
        },
        // 计分类型 选择
        jflxselChange(val){
            if(val==2){
                this.jflx = '3';
                this.zhdj = '0'
            }else{
                this.form.hs = null;
                this.form.djHs = null;
                this.jflx = '0'
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
                {type: 0},{type: 1},{type: 2}
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


        //转化--添加区间
        adddj(){
            if(this.djlx=='6'&&this.jflx=='3'){
                let len = this.HsRange.length;
                this.HsRange.splice(len-1, 0,{
                    type:3,
                    djsZhList:[{sl:0,djs:"",lx:0}]
                    }
                );
                return;
            }

            let len = this.HsRange.length;
            if(this.hsType=='1'||this.hsType=='3'){
                this.perHsRange.splice(len-1, 0, {
                    type: 1
                });
                return;
            }
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
                this.perDjHsRange.splice(len-1, 0, {
                    type: 1
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
        //提示信息
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit,
                message: data,
                type: xxtype,
                duration: 2000
            });
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
        // 提交按钮
        createSubmit(formName) {
            let _this = this
            _this.$refs[formName].validate(valid => {
                if (valid) {
                    let unfilled = false                          //提示有未填项
                    let iszhdjbz = false                          //提示请按标准填写等级
                    let isoverlap = false                         //设定的区间有重叠
                    let isoverlapdj = false                       //设定的等级不能相同

                    _this.btnLimt = true
                    _this.form.xxdm = _this.listQuery.xxdm
                    _this.form.uuid = _this.uuid
                    _this.form.fjxmid = _this.listQuery.fjxmId
                    _this.form.zhdj = Number(_this.zhdj)        //转化等级
                    _this.form.jflx = Number(_this.jflx)        //记分类型 0 成绩换算 1 累计量换算 2 学分 3 等级 4 图文 5 健康   6 阅读   7 加减分

                    //是否是百分比显示 0-否 1-按成绩 2-按班级排名 3-按班级排名(同分并列名次)
                    _this.form.zhxf = Number(_this.ywzx)==1?0:(_this.jflxsel==1||_this.jflxsel==2)?0:_this.hsType==0?1:3;

                    if((_this.jflxsel==1&&_this.hsType==1)||(_this.jflxsel==0&&_this.zhdj==1&&_this.djhsType==1)){
                        _this.form.realZhdj = 3;
                    }else if((_this.jflxsel==0&&_this.zhdj==0)||_this.jflxsel==2){
                         _this.form.realZhdj = 0;
                    }else if(_this.hsType==2 || _this.djhsType==2 || _this.rwzhfs==1){
                        _this.form.realZhdj = 7;
                    }else if(_this.hsType==3 || _this.djhsType==3){
                            _this.form.realZhdj = 9;
                    }else{
                         //如果是等级转换成等级
                        if(_this.jflx==3&&_this.jflxsel==1){
                            _this.form.realZhdj = _this.djlx;
                        }else{
                            _this.form.realZhdj = 1;
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


                    //非保留原始数据
                    if(_this.jflxsel!=2){           
                        //未开启等级转换 或 选择的是原始数据转换成等级
                        if(_this.zhdj=="0"||_this.jflxsel=="1"){

                            if(_this.djlx=='4'||_this.djlx=='5'){
                                
                            }else{
                                //如果是百分比显示 perHsRange赋值到HsRange
                                if(_this.hsType=="1"||_this.hsType=="3"){
                                    _this.HsRange = _this.perHsRange;
                                }
                                unfilled = _this.isRuleNone(['HsRange']);
                                if(!unfilled){
                                    if(_this.hsType=="1"||_this.hsType=="3"){
                                        _this.HsRange = _this.perHsRange;
                                    }
                                    iszhdjbz = _this.ifVerifyRule(['HsRange']);
                                }
                            }
                            console.log("aaaa")
                        }
                        //开启等级转换
                        else if(_this.zhdj=="1"){
                            if(_this.hsType=="1"||_this.hsType=="3"){
                                _this.HsRange = _this.perHsRange;
                            }
                            if(_this.djhsType=="1"||_this.djhsType=="3"){
                                _this.zhdjHsRange = _this.perDjHsRange;
                            }
                            unfilled = _this.isRuleNone(['HsRange','zhdjHsRange']);

                            if(!unfilled){
                                if(_this.djhsType=="1"||_this.djhsType=="3"){
                                    _this.zhdjHsRange = _this.perDjHsRange;
                                }
                                if(_this.hsType=="1"||_this.hsType=="3"){
                                    _this.HsRange = _this.perHsRange;
                                }
                                iszhdjbz = _this.ifVerifyRule(['HsRange','zhdjHsRange']);
                            }
                            console.log("bbbbb")
                        }



                        // if(_this.form.zhdj==0){       //原始数据换算成积分
                        //     _this.form.hs = []
                        //     _this.HsRange.forEach(function(item, index){
                        //         if(item.type==0) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),xf:Number(item.sz)})
                        //         if(item.type==1) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),xf:Number(item.sz)})
                        //         if(item.type==2) _this.form.hs.push({type:item.type,zdz:Number(item.zdz),xf:Number(item.sz)})
                        //     })
                        // }
                        // if(_this.form.zhdj==1){       //原始数据换算成等级
                        //     _this.form.djHs = []
                        //     _this.HsRange.forEach(function(item, index){
                        //         if(item.type==0) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),djz:item.sz})
                        //         if(item.type==1) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),djz:item.sz})
                        //         if(item.type==2) _this.form.djHs.push({type:item.type,zdz:Number(item.zdz),djz:item.sz})
                        //     })
                        // }

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

                    //表单提交
                    switch(_this.dialogStatus) {
                        //更新
                        case 'update':
                            mainPapi.updateItem({
                                id: _this.uuid,info: _this.form
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
                            mainPapi.createItem(_this.form).then(() => {
                                _this.createFormVisible = false;
                                _this.dataInit();
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
        //删除项目
        handleDelete(item) {
            let tishiMessage = undefined
            // if(item.rwsl > 0) {
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
                    mainPapi.delItem({
                        id: item.uuid,
                    }).then(() => {
                        this.tipsXX("删除成功",'success','成功');
                        const index = this.xmInfoList.indexOf(item);
                        this.xmInfoList.splice(index, 1);
                        this.getList();
                    });
                });
            // }
        },
        //  创建副本
        handleCopy(item){
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
                        mainPapi.getCopy({id: item.uuid}).then(response => {
                            done();
                            instance.confirmButtonLoading = false;
                            this.tipsXX("创建副本成功",'success','成功');
                            this.getList()
                        })
                    } else {
                        done();
                    }
                }
            }).then(action => {});

        },
        // 设置权重
        handleSetqz(item){
            this.createFormVisible = false
            var that = this
            this.xmqzFormVisible = true
            mainPapi.getQzInfo({id: item.uuid}).then(response => {
                this.XmqzRes = response
                var newobj = []
                this.alreadysetqz = []                                  //已设置过的权重

                this.XmqzList = response.rwQzSettingList;
                newobj =  response.ysRwQzSettingList

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
                    item.qzlx = 1
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

            mainPapi.AddBatchQz(query).then(response => {
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
            data.push({})
        },
        // 删除加数
        closesetqz(data,item){
            const index = data.indexOf(item);
            data.splice(index, 1);
        },
        //进入子项目 或是 项目详情
        handleView(item) {
            window.localStorage.setItem('xmid',item.uuid);
            this.$router.push({
                path: '/projectManager/projectDetail',
            })
        },
        /********************************2018.12.7--学分系统V2.1查询导出*******************************************/
        //数据导入选择
        importData(command){
            this.BatchSelClass = '';
            this.BatchimportCjFormVisible = true;
            this.getAllBj()
            var that = this
            setTimeout(function(){
                that.DialogVisibleTips = false;
            },100)
        },
        //成绩上报（逻辑）
        reportCj() {
            let notReportNum = 0; //未录入的人员总数
            detailPapi.GetXmStatistics({
                xxdm: this.listQuery.xxdm,
                xmid: this.listQuery.fjxmId,
            }).then((response) => {
                notReportNum = response.noEntryCount
                if(notReportNum > 0) {
                    this.$confirm('还有未录入的学生，是否将未录入的学生标记为缺考', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.reportCjAction()
                    });
                    return false
                }else{
                    this.reportCjAction()
                }
            })
        },
        //成绩上报（动作）
        reportCjAction() {
            detailPapi.CurrencyReport({
                xmid: this.listQuery.fjxmId,
                xxdm: this.listQuery.xxdm,
                rwid: '',
            }).then(response => {
                this.tipsXX("上报成功",'success','成功');
                this.getList()
            })
        },
        //----按项目导入
        // 提示确定
        TipsSure(){
            this.BatchSelClass = '';
            this.BatchimportCjFormVisible = true;
            this.getAllBj()
            var that = this
            setTimeout(function(){
                that.DialogVisibleTips = false;
            },100)
        },
        //取消上传
        BatchimportCancel() {
            this.importLoading = false;
            this.BatchimportCjFormVisible = false;
        },
        // 上传成功后的回调
        uploadSuccess (response, file, fileList, type) {
            var isfilename = [];                   //正确的文件名
            var that = this
            if(type =='xm'){                    //项目导入
                if(this.bjList && this.bjList.length>0){
                    this.bjList.forEach(function(item,index){
                        isfilename.push(that.zxmInfo.mc+"-"+item.bj+'.xlsx')
                    })
                }
            }
            var isSure = true;             //判断上传的文件名是否正确
            // isfilename.forEach(item => {
            //     console.log(item,file.name,1328)
            //     if(item==file.name){
            //         isSure = true
            //     }
            // })
            if(isSure){
                if(response.status=="200"){
                    this.importLoading = false;

                    if(response.value.data.length>0){
                    this.tipsXX(response.value.message,"warning");
                    this.errData = response.value.data;
                    }else{
                        this.tipsXX("导入成功","success");
                        this.BatchimportCjFormVisible = false;
                    }   
                    this.fileList = [];
                    this.getList();
                }
                else if(response.status==1){
                    this.importLoading = false;
                    if(response.data.length>0){
                        this.tipsXX(response.message,"warning");
                        this.errData = response.data;
                    }else{
                        this.tipsXX("导入成功","success");
                        this.BatchimportCjFormVisible = false;
                    }   
                }

                    // this.tipsXX("上传成功",'success','成功');
                    // if(type=='xm')                           //项目导入
                    //     this.BatchimportCjFormVisible = false;
                    // this.fileList = [];
                    // this.getList();
                else{
                    this.importLoading = false;
                    this.fileList = [];
                    this.tipsXX(response.resultMessage,'error','失败');
                }
            }else{
                this.importLoading = false;
                this.fileList = [];
                this.tipsXX("上传文件名不一致",'error','失败');
            }
        },
        // 上传错误
        uploadError (response, file, fileList) {
            this.importLoading = false;
            this.tipsXX('上传失败，请重试！','error','失败');
        },
        // 上传前对文件的大小的判断
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
        // 下载模版
        BatchimportMb(){
            var that = this
            var className = ''
            if(this.BatchSelClass>0){
                if(this.bjList && this.bjList.length>0){
                    this.bjList.forEach(function(item,index){
                        if(item.uuid==that.BatchSelClass){
                            className = item.bj
                        }
                    })
                }
                detailPapi.xmBatchexportExcel({
                    xxdm: this.listQuery.xxdm,
                    xmid: this.listQuery.fjxmId,
                    bjid: this.BatchSelClass,
                }).then(response => {
                    var blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                    var downloadElement = document.createElement('a');
                　　var href = window.URL.createObjectURL(blob); //创建下载的链接
                　　downloadElement.href = href;
                　　downloadElement.download = this.zxmInfo.mc+"-"+className+'.xlsx'; //下载后文件名
                　　document.body.appendChild(downloadElement);
                　　downloadElement.click(); //点击下载
                　　document.body.removeChild(downloadElement); //下载完成移除元素
                　　window.URL.revokeObjectURL(href); //释放掉blob对象
                }).catch(function(err,response){
                        
                });
            }else{
                this.tipsXX("请选择执行班级",'warning','提示');
            }
        },

        //在线导入
        importSubmit(fileName){
            if(!this.$refs[fileName].uploadFiles || this.$refs[fileName].uploadFiles.length<1){
                this.tipsXX("请选择文件",'error','失败');
                return false
            }
            this.$refs[fileName].submit();
        },
        //加载所在年级的所有班级
        getAllBj () {
            detailPapi.getBj({
                page: 1,limit: 500,
                xxdm: this.listQuery.xxdm,
                njdm: this.zxmInfo.njdm,
                jbny: this.xnxq.xn,
            }).then(response => {
                this.bjList = response.data.rows
            })
        },
        //基础信息获取(年级/学年学期/课程)
        dqXnXqObj() {
            mainPapi.dqxnxqObj({
                xxdm: this.listQuery.xxdm,
            }).then(response => {
                this.xnxq = response.data
            })
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
            // console.log(HsRangeArr,1394)
            for(var i=0;i<HsRangeArr.length;i++){
                // console.log(this[HsRangeArr[i]],1395)
                for(var j=0;j<this[HsRangeArr[i]].length;j++){
                    var item = this[HsRangeArr[i]][j];
                    console.log(item,1402)
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
                    console.log(item,1364);
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
                        if(Number(item.zdz)<Number(item.zxz) || Number(item.zdz)>500 || Number(item.zxz)>500){ 
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
                            if((!(/^([0-9]*)?$/.test(item.zxz)) && !(/^([0-9]*)?$/.test(item.zdz))) || Number(item.zdz)<Number(item.zxz) || Number(item.zdz)>500 || Number(item.zxz)>500){
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
        formateRange(){
            console.log(this.form,1548);
            let _this = this;
            //原始数据换算成学分
            if(this.jflxsel==0){       
                this.form.hs = []
                console.log(this.HsRange,1552);
                this.HsRange.forEach(function(item, index){
                    if(item.type==0) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),xf:Number(item.sz)})
                    if(item.type==1) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),xf:Number(item.sz)})
                    if(item.type==2) _this.form.hs.push({type:item.type,zdz:Number(item.zdz),xf:Number(item.sz)})
                })
            }
            //原始数据换算成等级
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
    .djlx{
        margin-bottom: 10px;
        padding: 0 10px;
        width: 600px;
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
    .el-radio{
        &.is-bordered{
            margin-left:0!important;
            margin-right:10px;
        }
    }
    .detail {
        background: #fff;
        display: flex;
        .detail-box {
            width: 0;
            flex-grow: 1;
            &:nth-child(n+2) {
                margin-left: -1px;
            }
            line-height: 40px;
            border: 1px solid #eceff1;
            border-bottom: none;
            .detail-title {
                padding-left: 20px;
                font-weight: 500;
                border-bottom: 1px dashed #eceff1;
            }
            .detail-content {
                word-wrap:break-word;
                padding-left: 20px;
                .content-title {
                    color: #758a9d;
                }
            }
        }
    }
    .detail-pull {
        margin-bottom: 10px;
        .detail-pullbtn {
            background: #f7f8fa;
            width: 100%;
        }
    }

    .dashdiv{
        border: 1px dashed #ccc;
        padding: 0 10px;
        width: 600px;
    }
    .exptips{
        margin-bottom: 11px;
        line-height: 40px;
        color: #999;
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
    .setqz{
        color: #3F51B5;
        margin-left: 10px;
        cursor: pointer;
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
                width: 120px;
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
    .partkn{
        height: 40px;
        .card-kcmc{
            float: left;
            margin-right: 10px;
        }
    }
    .empty{
        font-size: 16px;
        color: #666;
        text-align: center;
    }
    // 2018.12.7--学分系统V2.1查询导出
    .cj-header{
        height: 50px;
    }
    .mleft {
        margin-left: 15px;
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
    .import_box /deep/ .el-dialog__body{
        padding: 10px 20px;
    }

</style>
<style>
    .rowinpapp .el-input-group__append{ padding: 0 5px;}
</style>

