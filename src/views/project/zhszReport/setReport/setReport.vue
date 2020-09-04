<template>
    <div class="app-container">
        <div class="u_TableMain">
            <el-tabs type="card" class="Tcdreport" v-model="step" @tab-click="handleTab">
                
                <el-tab-pane label="基础设置" name='step0'>
                    <div class="m_GenTableBox">
                        
                        <!-- <div class="njBox" v-for="(item,index) in njList" :class="{'open':njdmSel.indexOf(item.njdm)!=-1}">
                            <div class="njtit">{{item.njmc}}</div>
                        </div> -->

                        <el-checkbox-group v-model="njdmSel" class='mpt'>
                            <el-checkbox v-for="(item,index) in njList" :key="index" :label="item.njdm" border @change="handleSelNj($event,item)">{{item.njmc}}</el-checkbox>
                        </el-checkbox-group>

                        <el-card shadow="never" v-if='njdmSel&&njdmSel.length>0'>
                            <div v-for="(item,index) in njListSel" :key="index" class="partbox">
                                <div class="title clearfix">
                                    <span>{{item.njmc}}</span>
                                </div>
                                <div class='pbcon'>
                                    <el-checkbox :indeterminate="item.kcindeter" v-model="item.kccheckAll" @change="handleCheckAllKC($event,item)">全部课程</el-checkbox>
                                    <div style="height:5px;"></div>
                                    <el-checkbox-group v-model="item.kcidSelect" class="select-item" @change="handleCheckedKC($event,item)">
                                        <el-checkbox class="selec-check" v-for="(kc,kcind) in uniftList" :label="kc.uuid" :key="kcind" size="medium" @change="handleSelKC($event,item,kc)">{{kc.mc}}</el-checkbox>
                                    </el-checkbox-group>
                                </div> 
                                <div class='pbcon'>
                                    <el-checkbox :indeterminate="item.classindeter" v-model="item.classcheckAll" @change="handleCheckAllClass($event,item)">全部班级</el-checkbox>
                                    <div style="height:5px;"></div>
                                    <el-checkbox-group v-model="item.bjidSelect" class="select-item" @change="handleCheckedClass($event,item)">
                                        <el-checkbox class="selec-check" v-for="(bj,bjind) in item.class" :label="bj.uuid" :key="bjind" size="medium">{{bj.bj}}</el-checkbox>
                                    </el-checkbox-group>
                                </div> 
                            </div>
                        </el-card>                
                        <div class="report-footer">
                            <el-button type="primary" :disabled="btnLimt" @click="saveReport('step0')">下一步</el-button>
                        </div>


                    </div>
                </el-tab-pane>
                

                <el-tab-pane label="内容设置" name='step1' :disabled='step=="step0"'>
                    <el-tabs type="border-card" class='step1box' v-model="nrsetclassInd" @tab-click="handleTabclass">
                        <el-tab-pane :label="item.njmc" v-for='(item,index) in njListSel' :key='index' >
                            <div class='dragcon'>


                                <el-table ref="multipleTable" stripe height="520" :show-header='true' :data="item.addkcSelect" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange" @select='handleSelect' @row-click="selectRowKc" :row-class-name="tableRowClassName">
                                    
                                    <el-table-column width="40">
                                        <template slot-scope="scope">
                                            <div class="drag" draggable="true" @dragend="handleDragend"  @dragstart="handleDragStart($event,scope.row)" @drop="handleDrop($event,item.addkcSelect,scope.row)"  @dragover='handleDropOver($event)'>
                                                <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive='false'></hamburger>
                                            </div>
                                        </template>
                                    </el-table-column>

                                    <el-table-column type="selection" width="30"></el-table-column>

                                    <el-table-column  label="全选">
                                        <template slot-scope="scope"><span class='txthid'>{{ scope.row.mc}}</span></template>
                                    </el-table-column>

                                    <el-table-column width="50">
                                        <template slot-scope="scope">
                                            <el-popover placement="right" trigger="hover" :title='scope.row.mc' @show='ShowPopover(scope.row)' @hide='HidePopover(scope.row)'>
                                                <km-Table :TableData="kcTableData" width='420px' bjzt v-if='scope.row.isPopover && scope.row.mbx==0'></km-Table>
                                                <!-- 身体素质曲线 -->                                                
                                                <!-- <bar-chart :chartData='chartData' v-if='scope.row.isPopover && scope.row.mbx==1' width='390px' height='300px'></bar-chart> -->
                                                <!-- 学业学习表现 --> 
                                                <!-- <radar-chart :type='0' :chartData='radarchartData' v-if='scope.row.isPopover && scope.row.mbx==2' width='390px' height='250px'></radar-chart> -->

                                                <!-- 出勤记录\奖惩记录\班主任寄语\附言 --> 
                                                <rep-Part :PartData='PartData' width='520px' :type='scope.row.mbx' v-if='scope.row.isPopover && (scope.row.mbx==3 || scope.row.mbx==4 || scope.row.mbx==5 || scope.row.mbx==6)'></rep-Part>
                                                <!-- 总评 -->
                                                <!-- <div v-if='scope.row.isPopover && scope.row.mbx==7' class='zqPage'>
                                                    <zp-Table class='zqpgtable' :TableData="zq.zpTableData" width='380px' v-for="(zq,zqInd) in zqpage" :key="zqInd"></zp-Table>
                                                </div>                                             -->
                                                <el-button type='text' icon="el-icon-tickets" slot="reference"></el-button>
                                            </el-popover>
                                        </template>
                                        
                                    </el-table-column>

                                </el-table>

                            </div>

                            <el-card shadow="never" v-if='curLeftkcData.mbx==0 || curLeftkcData.mbx==1 || curLeftkcData.mbx==2 || curLeftkcData.mbx==6 || curLeftkcData.mbx==16'>                            
                                <div v-if='curLeftkcData.mbx==1' class="ptips">
                                    <p>注：将所有计分类型为【保留原始数据，不做换算】-【体育数据】的项目显示出来</p>
                                    <el-radio v-model="curLeftkcData.stsztp" label="1">数值</el-radio>
                                    <el-radio v-model="curLeftkcData.stsztp" label="2">学分</el-radio>
                                </div>  
                                <div v-if="curLeftkcData.mbx==2" class="ptips">
                                    <el-checkbox v-model="curLeftkcData.zsjf">积分雷达图</el-checkbox>
                                    <el-checkbox v-model="curLeftkcData.zsdj">得A率雷达图</el-checkbox>    
                                </div>                         
                                <el-checkbox v-if='(curLeftkcData.mbx==0 || curLeftkcData.mbx==1) && curxmList.length>0'  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-tree ref="tree" :data="curxmList" show-checkbox node-key="uuid" :props="defaultProps"  @check='handleCheckTreeChange' :default-checked-keys="curLeftkcData.curcheck" v-if='curLeftkcData.mbx==0 || curLeftkcData.mbx==1'></el-tree>
                                <div v-if="curLeftkcData.mbx==6">
                                    <el-input type="textarea" :rows="10" v-model="curLeftkcData.fy" placeholder="请输入附言" resize='none'></el-input>
                                    <!-- <div class='fybtn'>
                                        <el-button type="primary" @click='clickfysure'>保存</el-button>
                                    </div>-->
                                </div>
                                <div v-if="curLeftkcData.mbx==16">
                                    <el-checkbox v-model="curLeftkcData.zsxzqm" >校长签名</el-checkbox>
                                    <el-checkbox v-model="curLeftkcData.zsjwzrqm" >教务主任签名</el-checkbox>
                                    <el-checkbox v-model="curLeftkcData.zsbzrqm" >班主任签名</el-checkbox>
                                </div>
                            </el-card>


                            
                        </el-tab-pane>
                    </el-tabs>
                    <div class='step1foot'>
                        <div class="uploadlogo">
                            <el-checkbox v-model="checkedlogo" class='tit'>添加学校水印logo</el-checkbox>
                            <div class="uploadpt">    
                                <el-upload
                                    list-type="picture-card"
                                    action="/api/netcore/smartcredit/v1/Xmcj/UploadPictures"
                                    :headers= "headers"
                                    :limit="1"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handlePictureRemove"
                                    :on-success="uploadSuccessPic"
                                    :before-upload="BatchbeforeUploadPicture"
                                    :file-list="logofile">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogPictureVisible">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>        
                            </div> 
                        </div>
                        <el-button type="primary" @click="saveReport('step1')">生成报告单模板</el-button>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="预览报告单" name='step2' :disabled='step!="step2"'>
                    <el-tabs type="border-card" class='step1box' v-model="preVInd" @tab-click="handleTabPrev">
                        <el-tab-pane :label="item.njmc" v-for='(item,index) in njListSel' :key='index' > 
                            <!-- 胜蓝模板 -->
                            <div class="sltable" v-if="mbinfo.mbdm=='A02'">
                                <h3 class="tabletitle" style="text-align:center">{{reportInfo.mc}}</h3>
                                <p style="text-align:center"><span><span style="text-decoration:underline">{{item.njmc}}</span>年级<span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span>班</span> <span style="margin-left:10px">姓名<span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span></span> </p>
                                <table ref="bgdtb" border="1">
                                    <tr>
                                        <th width="25%" id="lineTd" colspan="2">
                                            <span style="float:left;margin-top:20px;">课程</span>
                                            <span style="float:right;">评价</span>
                                        </th>
                                        <th width="12.5%">知识能力</th>
                                        <th width="12.5%">态度习惯</th>
                                        <th width="30%">班主任寄语</th>
                                        <th width="20%">身体状况</th>
                                    </tr>
                                    <tbody v-html="A02Table"></tbody>
                                    <!-- <div v-for="(row,rowind) in BgdXmInfoList" :key="rowind" style="display: contents;">
                                        <div v-for="(bgd,bgdInd) in row" :key="bgdInd" v-if="bgd.lx==0" style="display: contents;">                                     
                                            <tr v-if="bgd.xmReportList&&bgd.xmReportList.length>0&&bgd.lx==0"  height='22' class="1">
                                                <div v-if="bgd.lx==0" style="display: contents;" ref="bgdtable">
                                                    <th  height='22' width="12.5%" :rowspan="bgd.xmReportList.length" :colspan="bgd.zkmc==bgd.xmReportList[0].mc?2:1">{{bgd.zkmc}}</th>
                                                    <th  height='22' v-if="!(bgd.zkmc==bgd.xmReportList[0].mc)">{{bgd.xmReportList[0].mc}}</th>
                                                    <td height='22'>{{bgd.xmReportList[0].lx}}</td>
                                                    <td height='22' :rowspan="bgd.xmReportList.length"></td>
                                                    <td v-if="rowind==0&&bgdInd==0" :rowspan="allrowspan"> -->
                                                        <!-- 班主任寄语下面的表格 -->
                                                        <!-- <table border='1' style="border:0;width:100%">
                                                            <tr></tr>
                                                            <tr>
                                                                <td :height='bzrjyheight'>{{PartData.bzrjy}}</td>
                                                            </tr>
                                                            <tr>
                                                                <th height='22'>所获荣誉</th>
                                                            <tr>
                                                                <td  style="border: 0;" :height='shryheight'>{{PartData.jcjl}}</td>
                                                            </tr>  
                                                        </table> -->
                                                        <!-- /班主任寄语下面的表格 -->
                                                    <!-- </td>   
                                                    <td v-if="rowind==0&&bgdInd==0" :rowspan="allrowspan"> -->
                                                        <!-- 身体状况下面的表格 -->
                                                        <!-- <table border='1' class="stqktable" style="border:0;width:100%">
                                                            <tr></tr>
                                                            <tr>
                                                                <th height='22'>{{getKMname()}}</th>
                                                            </tr>
                                                            <tr><th>{{tydata.mc}}</th></tr>
                                                            <div v-for="(item,index) of tydata.zxmList" :key="index" style="display:contents;">
                                                                <tr>
                                                                    <th height='22'>{{item.mc}}</th>
                                                                </tr>      
                                                                <tr v-if="item.jflx==4">
                                                                    <td height='22'>{{item.rwList[0].twnr}}</td>
                                                                </tr>                             
                                                                <tr v-else v-for="(rw,rwind) of item.rwList" :key="rwind">
                                                                    <td height='22'>{{rw.mc!=item.mc?rw.mc+':':''}}{{rw.sz}}</td>
                                                                </tr>
                                                            </div>
                                                            <tr v-for="n in (bzrjyheight/22-1-(chartData.length*2))" :key="n+'n'">
                                                                <td height='22'> </td>
                                                            </tr>
                                                            <tr>
                                                                <th :height="Math.round((shryheight+22)/2)">{{getKQ()}}</th>
                                                            </tr>
                                                            <tr class="qmtr">
                                                                <th :height="shryheight-Math.round((shryheight+22)/2)+22">
                                                                    <div v-for="(qm,qmind) of qmlist" :key="qmind" class='right'>
                                                                        {{qm.zc}}：<span v-if="qm.qm.indexOf('http')==-1">{{qm.qm}}</span>
                                                                        <img v-else :src="qm.qm" alt="">
                                                                    </div>
                                                                    <div v-if="qmlist.length==0">
                                                                        <p>班主任：</p> 
                                                                        <p>教务主任：</p>
                                                                        <p>校长：</p>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </table> -->
                                                        <!-- /身体状况下面的表格 -->
                                                    <!-- </td>  
                                                </div>
                                            </tr>
                                            <tr  height='22' v-else-if="bgd.lx==0" class="2">
                                                <div v-if="bgd.lx==0" style="display: contents;">
                                                    <th  height='22' width="12.5%" colspan="2">{{bgd.zkmc}}</th>
                                                    <td height='22'></td>
                                                    <td height='22'></td>
                                                    <td v-if="rowind==0&&bgdInd==0" :rowspan="allrowspan"> -->
                                                        <!-- 班主任寄语下面的表格 -->
                                                        <!-- <table border='1' style="border:0;width:100%">
                                                            <tr></tr>
                                                            <tr>
                                                                <td :height='bzrjyheight'>{{PartData.bzrjy}}</td>
                                                            </tr>
                                                            <tr>
                                                                <th height='22'>所获荣誉</th>
                                                            <tr>
                                                                <td :height='shryheight' style="border: 0;">{{PartData.jcjl}}</td>
                                                            </tr>  
                                                        </table> -->
                                                        <!-- /班主任寄语下面的表格 -->
                                                    <!-- </td>   
                                                    <td v-if="rowind==0&&bgdInd==0" :rowspan="allrowspan"> -->
                                                        <!-- 身体状况下面的表格 -->
                                                        <!-- <table border='1' class="stqktable" style="border: 0px;width: 100%;">
                                                            <tr></tr>
                                                            <tr>
                                                                <th height='22'>{{getKMname()}}</th>
                                                            </tr>
                                                            <tr><th>{{tydata.mc}}</th></tr>
                                                            <div v-for="(item,index) of tydata.zxmList" :key="index" style="display:contents;">
                                                                <tr>
                                                                    <th height='22'>{{item.mc}}</th>
                                                                </tr>      
                                                                <tr v-if="item.jflx==5">
                                                                    <td height='22'>{{item.rwList[0].twnr}}</td>
                                                                </tr>                             
                                                                <tr v-else v-for="(rw,rwind) of item.rwList" :key="rwind">
                                                                    <td height='22'>{{rw.mc!=item.mc?rw.mc+':':''}}{{rw.sz}}</td>
                                                                </tr>
                                                            </div>
                                                            <tr v-for="n in (bzrjyheight/22-1-(chartData.length*2))" :key="n">
                                                                <td height='22'> </td>
                                                            </tr>
                                                            <tr>
                                                                <th :height="Math.round((shryheight+22)/2)">{{getKQ()}}</th>
                                                            </tr>
                                                            <tr class="qmtr">
                                                                <th :height="shryheight-Math.round((shryheight+22)/2)+22">
                                                                    <div v-for="(qm,qmind) of qmlist" :key="qmind" class='right'>
                                                                        {{qm.zc}}：<span v-if="qm.qm.indexOf('http')==-1">{{qm.qm}}</span>
                                                                        <img v-else :src="qm.qm" alt="">
                                                                    </div>
                                                                    <div v-if="qmlist.length==0">
                                                                        <p>班主任：</p> 
                                                                        <p>教务主任：</p>
                                                                        <p>校长：</p>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </table> -->
                                                        <!-- /身体状况下面的表格 -->
                                                    <!-- </td>                            
                                                </div>
                                            <tr  class="3" height='22' v-for="(bgdTB,bgdTBInd) in bgd.xmReportList" :key="bgdTBInd" v-if="bgd.lx==0&&bgdTBInd!=0">
                                                <th height='22'>{{bgdTB.mc}}</th>
                                                <td height='22'></td>
                                            </tr>
                                        </div>
                                    </div> -->
                                </table>    
                                <p >{{PartData.fy}}</p> 
                                <div class="bgdfm">
                                    <img class="schoollogo" :src="xxlogo" alt="">
                                    <img class="schoollogosmall" :src="xxlogo" alt=""><img class="schoolimg" :src="xximg" alt="">
                                    <div class="bgdinfo">
                                        <div class="title">{{reportInfo.mc}}<div class="bgdxnxq">({{reportInfo.xn}}学年{{reportInfo.xq=='01'?'第一':'第二'}}学期)</div></div>
                                        <div class="njbj"><span><span style="text-decoration:underline">{{item.njmc[0]}}</span>年级<span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span>班</span></div>
                                        <div class="xm">姓名</div>
                                        <div class="shijian">{{fmyear}} 年 {{fmmonth}} 月</div>
                                    </div>
                                </div>                    
                            </div>             

                            <!-- 长青求知模板-->
                            <div class="cqqztable" v-if="mbinfo.mbdm=='A03'" >
                                <h3 class="tabletitle" style="text-align:center">{{reportInfo.mc}}</h3>
                                <p style="text-align:center"><span><span style="text-decoration:underline">{{item.njmc}}</span>年级<span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span>班</span> <span style="margin-left:10px">姓名<span style="text-decoration:underline">&nbsp;&nbsp;&nbsp;&nbsp;</span></span> </p>
                                <table ref="bgdtb" border="1">
                                    <tr>
                                        <th colspan="2" rowspan="2">
                                            <span style="float:left;margin-top:20px;">课程</span>
                                            <span >成绩</span>
                                            <span style="float:right;">年级</span>
                                        </th>
                                        <th colspan="2">{{reportInfo.xq=='01'?'第一学期':'第二学期'}}</th>
                                    </tr>
                                    <tr>
                                        <th>成绩</th>
                                        <th>评价（情感/态度）</th>
                                    </tr>
                                    <div v-for="(row,rowind) in BgdXmInfoList" :key="rowind" style="display: table-row-group;display:contents">
                                        <div v-for="(bgd,bgdInd) in row" :key="bgdInd" v-if='bgd.lx !="totillx"' style="display: table-row-group;display:contents">                                     
                                            <tr v-if="bgd.xmReportList&&bgd.xmReportList.length>0&&bgd.lx==0"  height='22' class="1">
                                                <div style="display: table-row-group;display:contents" ref="bgdtable">
                                                    <th  height='22' width="12.5%" :rowspan="bgd.xmReportList.length" :colspan="bgd.zkmc==bgd.xmReportList[0].mc?2:1">{{bgd.zkmc}}</th>
                                                    <th  height='22' v-if="bgd.zkmc!=bgd.xmReportList[0].mc">{{bgd.xmReportList[0].mc}}</th>
                                                    <td height='22'>{{bgd.xmReportList[0].lx}}</td>
                                                    <td height='22'></td>
                                                </div>
                                            </tr>
                                            <tr  height='22' v-else-if='bgd.lx!="totillx"' class="2">
                                                <div style="display: table-row-group;display:contents">
                                                    <th  height='22' width="12.5%" colspan="2">{{bgd.zkmc}}</th>
                                                    <td height='22'></td>
                                                    <td height='22'></td>    
                                                </div>
                                            <tr  class="3" height='22' v-for="(bgdTB,bgdTBInd) in bgd.xmReportList" :key="bgdTBInd" v-if="bgd.lx!='totillx'&&bgdTBInd!=0">
                                                <th height='22'>{{bgdTB.mc}}</th>
                                                <td height='22'></td>
                                                <td height='22'></td>
                                            </tr>
                                        </div>
                                    </div> 
                                    <tr>
                                        <th>出勤情况</th>
                                        <td colspan="3">
                                            <p>上课______天；   实到______天；   迟到_______天</p>
                                            <p>事假______天；   旷课______天；   病假_______天</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>信息窗</th>
                                        <td colspan="3"><p >{{PartData.fy}}</p> </td>
                                    </tr>
                                </table>   
                                <div>
                                    <span>校长：</span> <span>教导主任：</span> <span>班主任：</span>    
                                </div>                                                
                            </div>   

                            <!-- 胜利模板 -->
                            <el-row :gutter="20" class='tableBox' v-for="(row,rowind) in BgdXmInfoList" :key="rowind" v-if="mbinfo.mbdm=='A01'&&preVInd == index">
                                <el-col :span="12" v-for="(bgd,bgdInd) in row" :key="bgdInd" class='prevcol'>
                                    <div class='tabtit' v-if='bgdInd==0'>{{reportInfo.mc}}</div>
                                    <el-row :gutter="20"  class='tabinfo' v-if='bgdInd==1'>
                                        <el-col :span="12" class='rol'><span>班级</span><i></i></el-col>
                                        <el-col :span="12" class='rol'><span>姓名</span><i></i></el-col>
                                    </el-row>
                                    <div class='tabcon' v-if='bgd.lx !="totillx"'>
                                        <div class="tit clear">
                                            <div class="kcname">{{bgd.zkmc}}</div>
                                            <div class='code' v-if='bgd.pfbzewm'><img src="../../../../assets/xfxtcode.jpg" alt=""></div>
                                        </div>
                                        <km-Table v-if='bgd.lx==0' :TableData="bgd.kcTableData" :bjzt='bgd.bjzt' width='100%'></km-Table>
                                        <bar-chart v-if='bgd.lx==1' :chartData='chartData' width='100%' height='300px'></bar-chart>
                                        <div v-if='bgd.lx==2' v-for="(rad,radI) in bgd.radarchartData" :key="radI">
                                            <radar-chart :chartData='rad.chartData' :type='rad.type' width='100%' height='250px'></radar-chart>
                                        </div>
                                        <zp-Table v-if='bgd.lx==7' :TableData="bgd.zpTableData" width='100%'></zp-Table>                            
                                    </div>
                                    <div v-if="bgd.lx =='totillx'" class='totilbox'>
                                        <div class='tabcon' v-for="(tot,tInd) in bgd.reportInfo" :key="tInd">
                                            <div class="tit clear">
                                                <div class="kcname">{{tot.zkmc}}</div>
                                            </div>                                        
                                            <rep-Part :PartData='tot' width='100%' :type='tot.lx'></rep-Part>
                                        </div>
                                    </div>
                                    <div v-if="bgd.lastzq">注：此报告单盖学校教导处公章有效。</div>   
                                    <div class='watermark' v-if='checkedlogo'>
                                        <img :src="logofile[0]?logofile[0].url:''" alt="">
                                    </div>
                                </el-col>
                            </el-row>
                        
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import Cookies from 'js-cookie'
import Hamburger from 'components/Hamburger';
import * as mainPapi from 'api/project/mainProject/index'
import * as detailPapi from 'api/project/projectDetail/index'
import * as reportapi from "api/project/report/index"
import {getXxdmInfo} from 'api/admin/school/index'

import kmTable from '../Statistics/kmtable';
import barChart from '../Statistics/barChart';
import radarChart from '../Statistics/radarChart';
import repPart from '../Statistics/repPart';
import zpTable from '../Statistics/zptable';
export default {
    name: "setReport",
    components: {    
        Hamburger,kmTable,barChart,radarChart,repPart,zpTable
    },
    data() {
        return {
            xxmc: window.localStorage.getItem('xxmc'),
            xxlm:'',                //学校类型码   -- 007 职高
            xxdm: window.localStorage.getItem('xxdm'),
            reportInfo:{                //报告基础信息
                xn: window.localStorage.getItem('reportxn'),
                xq: window.localStorage.getItem('reportxq'),
                mbx: window.localStorage.getItem('reportmbx'),                  //报告单内容类型
                bgdid: window.localStorage.getItem('reportid'),                  //报告单内容类型
                mc: window.localStorage.getItem('reportname'),                  //报告单内容类型
            },
            bgdmbxList:[],                  //报告单模板项
            SpecialList:[],                 //根据模板项设定的除课程以外的其他基础设置
            isHasKC:false,                  //根据模板项设定的是否有课程
            isCreate:false,             //判断报告单是否新建 还没有设置

            step: 'step0',            //设置完成的步骤
            //基础设置
            kcList:[],          //课程
            uniftList:[],       //课程
            kcidAll:[],
            njList:[],          //用户年级
            njdmSel:[],         //所选年级代码
            njListSel:[],       //所选年级的详细内容
            btnLimt: false,     //防止重复提交BUG
            //内容设置
            checkedlogo:false,      //是否添加学校水印
            nrsetclassInd:0,        //默认选择第一个class
            curTabkcList:[],        //所tab的班级的课程
            dataIndex: 0,                       //内容设置当前所选科目的index
            isDrag:false,       //是否拖拽
            StepdraggingCard:{},    //当前拖拽的item
            curLeftkcData:{},               //内容设置--当前所选科目info
            logofile:[],            //上传的logo
            dialogPictureVisible:false,
            dialogImageUrl:'',
            
            defaultProps: {
                children: 'TxmList',
                label: 'mc'
            },
            kcspecdata:[                //如果为课程,加上记分类型勾选时存入xmcheck
                {mc:'班级整体',uuid:'bjzt',zxmList:null,jflx:999},
                {mc:'评分标准二维码',uuid:'pfbzerwm',zxmList:null,jflx:999},
            ],
            curxmList:[],           //当前的项目列表
            curtjData:{},           //当前所选基础设置
            listQuery: {
                xxdm: window.localStorage.getItem('xxdm'),
                xn: window.localStorage.getItem('reportxn'),
                xq: window.localStorage.getItem('reportxq'),
                kcIds: null,
                zyIds: null,
                njdms: null,
                fjxmId:null,
                jflx: null,
                xszxmxx:true,          //显示子项目信息
                Xszykcxmxx:false,        //仅根据专业筛选时显示专业下课程项目信息
            },
            repbgdszList:[],        //所获取的报告单设置
            //预览报告单
            preVInd: 0,
            BgdXmNjdm:'',
            BgdXmInfoList:[],       
            winW:'',            //屏幕宽度    
            

            kcTableData:[
                {xm:'态度习惯',jflx:0,pjz:"A",bjzt:[{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'},{pjz:'D',num:10,djW:'25%'}]},
                {xm:'语言能力',fx:'听力',jflx:0,pjz:"A",bjzt:[{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'},{pjz:'D',num:10,djW:'25%'}]},
                {xm:'语言能力',fx:'口语',jflx:0,pjz:"A",bjzt:[{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'},{pjz:'D',num:10,djW:'25%'}]},
                {xm:'语言能力',fx:'阅读',jflx:0,pjz:"A",bjzt:[{pjz:'A',num:10,djW:'25%'},{pjz:'B',num:10,djW:'25%'},{pjz:'C',num:10,djW:'25%'},{pjz:'D',num:10,djW:'25%'}]},
            ],
            spanArr:[],
            pos:'',
            chartData:[
                {xm:'50米',score:[79, 32, 200],color:'#ff9900'},
                {xm:'仰卧起坐',score:[29, 52, 20],color:'#991acc'},
                {xm:'坐位体前屈',score:[39, 152, 100],color:'#666fff'},
                {xm:'跳绳',score:[74, 122, 150],color:'#009933'},
            ],
            radarchartData:[
                {xm:'语文',score:[50,90],max:100},
                {xm:'数学',score:[50,60],max:100},
                {xm:'英语',score:[70,80],max:100},
                {xm:'物理',score:[80,90],max:100},
                {xm:'政治',score:[50,80,],max:100},
                {xm:'历史',score:[60,70],max:100},
            ],
            PartData:{                       //出勤记录\奖惩记录\班主任寄语\附言
                ycq: 10,              //应出勤
                sj:2,                 //事假
                bj:0,                 //病假
                kk:0,                 //旷课
                cdzt:2,               //迟到早退
                jcjl:'小海燕文雅奖',   //奖惩记录
                bzrjy:'你才艺俱佳、全面发展',       //班主任寄语
                bzrname:'王小二',
                fy:'下学期于3月4日开学报告，请于8:30报道，10:30放学，报到时请随带假期作业及中餐缴款证明（保证代扣账号大于1200元）。'
            },
            zqpage : [{
                    zpTableData:[                    //总评     3出勤记录 4奖惩记录 5班主任寄语 6附言 7总评 9体质健康
                        {kc:'语文',xm:'识字与写字',lx:0},
                        {kc:'语文',xm:'阅读',lx:0},
                        {kc:'语文',xm:'习作',lx:0},
                        {kc:'语文',xm:'口语交际',lx:0},
                        {kc:'数学',xm:'识字与写字',lx:0},
                        {kc:'英语',xm:'识字与写字',lx:0},
                        {kc:'科学',xm:'识字与写字',lx:0},
                        {kc:'美术',xm:'识字与写字',lx:0},
                        {kc:'数学',xm:'识字与写字',lx:0},
                        {kc:'英语',xm:'识字与写字',lx:0},
                        {kc:'科学',xm:'识字与写字',lx:0},
                        {kc:'美术',xm:'识字与写字',lx:0},
                    ]
                },{
                    zpTableData:[                    //总评     3出勤记录 4奖惩记录 5班主任寄语 6附言 7总评 9体质健康
                        {kc:'英语',xm:'识字与写字',lx:0},
                        {kc:'科学',xm:'识字与写字',lx:0},
                        {kc:'美术',xm:'识字与写字',lx:0},
                        {lx:3,name:'出勤记录'},
                        {lx:4,name:'奖惩记录'},
                        {lx:5,name:'班主任寄语'},
                        {lx:6,name:'附言'},
                    ]
                },{
                    zpTableData:[
                        {lx:16,name:'签名'},
                    ]
                }
            ],
            zpTableData:[                    //总评     3出勤记录 4奖惩记录 5班主任寄语 6附言 7总评 9体质健康
                {kc:'语文',xm:'识字与写字',pjz:'A',lx:0},
                {kc:'数学',xm:'识字与写字',pjz:'A',lx:0},
                {kc:'英语',xm:'识字与写字',pjz:'A',lx:0},
                {kc:'科学',xm:'识字与写字',pjz:'A',lx:0},
                {kc:'美术',xm:'识字与写字',pjz:'A',lx:0},
                {kc:'音乐',xm:'识字与写字',pjz:'A',lx:0},
                {lx:3},
                {lx:4},
                {lx:5},
                {lx:6},
                {lx:16},
            ],
            datas:[
                { id: 1, value: 'asfsd1' },
                    { id: 2, value: '2fsaf' },
                { id: 3, value: '3sdfds' },
            ] ,
            qx:true,            //全选
            multipleSelection :[],
            bzrjyheight: 0,//班主任寄语高度
            shryheight: 0,//所获荣誉高度
            allrowspan:0,//右边那一块占的行数
            mbinfo:{},//获取到的模板信息
            checkAll: false,//全选框是否打钩
            fmyear: window.localStorage.getItem('edittime').split('-')[0],//报告单封面的年
            fmmonth: window.localStorage.getItem('edittime').split('-')[1],//报告单封面的月
            xxlogo: '',//报告单封面的学校logo
            xximg: '',//报告单封面的学校名称
            tydata: [],//表格右侧身体状态下面的信息
            qmlist: [],//表格中的签名信息
            A02Table: ''
        }
    },
    computed: {
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        },
    },
    created(){
        this.getDicy()
        this.getnjkc()
        this.winW = document.body.clientWidth
        // console.log(this.winW)
    },
    mounted(){
    },
    methods:{
        //获取报告单设置
        getReport(){
            var that = this
            this.njListSel = []
            this.njdmSel = []
            this.logofile = []
            
            reportapi.GetReportSetting({id:this.reportInfo.bgdid}).then(response => {
                var res = response.njSzList
                this.repbgdszList = res                
                if(response.xxsy){
                    this.logofile.push({url:response.xxsy})
                }
                this.checkedlogo = response.zssy
                console.log(res,"aaaaa")
                if(res && res.length>0){
                    res.forEach(a => {
                        that.njdmSel.push(a.njdm)                   
                        if(that.njList && that.njList.length>0){                            //所选年级   
                            that.njList.forEach(b => {
                                if(a.njdm == b.njdm){
                                    console.log(b.selkcListlx,623)
                                    var kcidSelect = a.kcid.split('|')
                                    that.$set(b,'bjidSelect',a.bjid.split(','))     
                                    that.$set(b,'kcidSelect',kcidSelect)   
                                    var kcSelect = []
                                    if(that.uniftList && that.uniftList.length>0){
                                        kcidSelect.forEach( t => {
                                            that.uniftList.forEach(c => {
                                                if(t == c.uuid){
                                                    kcSelect.push(c)
                                                }
                                            })
                                        })                                        
                                    }
                                    that.$set(b,'kcSelect',kcSelect)   
                                    that.$set(b,'bgdszList',a.bgdszList?a.bgdszList:[])  
                                    console.log(b.selkcListlx,638)
                                    that.getAllBj(b)
                                }
                            })                           
                        }
                    })
                }else{
                    this.isCreate = true
                }
            })
            reportapi.GetReportTemplate({id:window.localStorage.getItem('mbid')}).then(response => {
                this.mbinfo = response;
            })              
        },

        //基础信息获取(年级\报告单模板项)
        getDicy(){
            var that = this
            mainPapi.getNj({
                xxdm: this.xxdm, page: 1,limit: 50,
            }).then(response => {
                this.njList = response.data.rows
            })
            reportapi.GetNetcoreDict().then(response => {
                this.bgdmbxList = response.EnumBGDNRLX.Value
                var mbxList = this.reportInfo.mbx.split(",")
                var data = []
                var rep = []
                if(this.bgdmbxList && this.bgdmbxList.length>0){
                    this.bgdmbxList.forEach(a => {
                        data['mb'+a.Value]= {}
                        data['mb'+a.Value].mc = a.Des  
                        data['mb'+a.Value].uuid = a.Name      
                        data['mb'+a.Value].mbx = a.Value  
                        data['mb'+a.Value].isSelect = false 
                    })
                }
                if(mbxList && mbxList.length>0){
                    mbxList.forEach(a => {
                        rep.push(data['mb'+a])
                    })
                    rep.forEach(a => {
                        if(a.uuid == 'KC'){
                            that.isHasKC = true
                        }
                        if(a.uuid != 'KC'){
                            that.SpecialList.push(a)
                        }
                    })
                }
            })
        },
        //加载所在年级的所有班级
        getAllBj (item) {
            detailPapi.getBj({
                page: 1,limit: 500,
                xxdm: this.xxdm,
                njdm: item.njdm,
                jbny: this.reportInfo.xn,
            }).then(response => { 
                var res = response.data.rows?response.data.rows:[];
                var bjidAll = []            //全部的班级id
                if(res&&res.length>0){
                    res.forEach(row => {
                        bjidAll.push(row.uuid)
                    });
                }
                var bjLen = item.bjidSelect?item.bjidSelect.length:0
                var bjLenAll = bjidAll.length
                var kcLen = item.kcidSelect?item.kcidSelect.length:0
                var kcLenAll = this.kcidAll.length

                this.$set(item,'class',res)                         //全部班级
                this.$set(item,'bjidAll',bjidAll)                   //全部班级id
                this.$set(item,'bjidSelect',item.bjidSelect?item.bjidSelect:[])                    //所选班级id
                this.$set(item,'classindeter',(bjLen>0 && bjLen!=bjLenAll)?true:false)                  //-班级-全选
                this.$set(item,'classcheckAll',(bjLen==bjLenAll)?true:false)                  //-班级-全选

                this.$set(item,'kc',this.uniftList)                         //全部课程
                this.$set(item,'kcidAll',this.kcidAll)                   //全部课程id
                this.$set(item,'kcidSelect',item.kcidSelect?item.kcidSelect:[])                    //所选课程id
                this.$set(item,'kcSelect',item.kcSelect?item.kcSelect:[])                    //所选课程
                this.$set(item,'addkcSelect',[])                    //内容设置里的全部（添加特定基础设置）
                this.$set(item,'kcindeter',(kcLen>0 && kcLen!=kcLenAll)?true:false)                  //-课程-全选
                this.$set(item,'kccheckAll',(kcLen==kcLenAll)?true:false)                  //-课程-全选
                this.njListSel.push(item)
                console.log(item.selkcListlx,723)
            })
        }, 
        //加载所有课程、专业
        getnjkc(){
            var that = this
            mainPapi.getXk({                                             
                xxdm: this.xxdm, page: 1, limit: 50,
            }).then(response => {
                this.kcList = response.data.rows
                this.uniftList = []
                this.kcidAll = []            //全部的课程id
                if(this.kcList&&this.kcList.length>0){
                    this.kcList.forEach(row => {
                        that.uniftList.push({mc:row.kcmc,uuid:','+row.uuid})
                        that.kcidAll.push(','+row.uuid)
                    });
                }
            })
            getXxdmInfo({xxdm: this.xxdm,}).then(response => {
                this.xxlogo = response.data.path
                this.xximg = response.data.imagePath
                this.xxlm = response.data.xxbxlxm               //学校类型--判别是专业还是学科
                if(this.xxlm == '007'){   //职高
                    mainPapi.getjcZysjlx({xxdm: this.xxdm}).then(response => {   //专业 
                        var zyresList = response
                        this.uniftList = []
                        if(zyresList && zyresList.length>0){
                            zyresList.forEach(function(item,index){
                                that.uniftList.push({mc:item.zymc,uuid:item.uuid})
                                if(item.kcList && item.kcList.length>0){                           
                                    item.kcList.forEach(function(kc,ind){
                                        if(that.kcList && that.kcList.length>0){        //学科列表
                                            that.kcList.forEach(function(kcall,indall){
                                                if(kc.kcid==kcall.uuid){
                                                    that.uniftList.push({mc:(item.zymc+'/'+kcall.kcmc),uuid:(item.uuid+','+kcall.uuid)})
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        this.kcidAll = []            //全部的课程id
                        if(this.uniftList&&this.uniftList.length>0){
                            this.uniftList.forEach(row => {
                                that.kcidAll.push(row.uuid)
                            });
                        }
                        
                        this.getReport()
                    })
                }else{
                    this.getReport()
                }
            })
        },
        handleTab(){
            console.log(this.step)
        },
        //选择年级
        handleSelNj(val,item){
            if(val){
                this.getAllBj(item)

            }else{
                const index = this.njListSel.indexOf(item);
                this.njListSel.splice(index, 1);
            }
        },
        // 选择班级--全选
        handleCheckAllClass(val,item){
            item.bjidSelect = val ? item.bjidAll : [];
            item.classindeter = false;
        },
        // 选择班级--单个选择
        handleCheckedClass(val,item){
            let checkedCount = val.length;
            item.classcheckAll = checkedCount === item.bjidAll.length;
            item.classindeter = checkedCount > 0 && checkedCount < item.bjidAll.length;
        },
        // 选择课程--全选
        handleCheckAllKC(val,item){
            item.kcidSelect = val ? item.kcidAll : [];
            item.kcSelect = val ? JSON.parse(JSON.stringify(item.kc)) : [];
            item.kcindeter = false;
        },
        // 选择课程--单个选择
        handleCheckedKC(val,item){
            let checkedCount = val.length;
            item.kccheckAll = checkedCount === item.kcidAll.length;
            item.kcindeter = checkedCount > 0 && checkedCount < item.kcidAll.length;
        },
        handleSelKC(val,item,kc){
            if(val){
                item.kcSelect.push(kc);
            }else{
                var index = -1
                item.kcSelect.forEach((a,b) => {
                    if(a.uuid == kc.uuid){
                        index = b
                    }
                })
                item.kcSelect.splice(index, 1);
            }
        },
        //内容设置全选课程
        handleSelectionChange(val){      
            this.$set(this.njListSel[this.nrsetclassInd],'selkcListlx',val)
            this.njListSel[this.nrsetclassInd].addkcSelect.forEach((kcs,ind) => {//全选要修改这个里面的isSelect属性才生效
                this.$set(this.njListSel[this.nrsetclassInd].addkcSelect[ind],'isSelect',false)
                this.handleSelect(val,this.njListSel[this.nrsetclassInd].addkcSelect[ind]);//模拟鼠标点击每个点过去                    
            })
        },
        handleSelect(selection, row){//单个修改的时候自动会调用这个方法，但是全选不会
            var isSelect = false
            selection.forEach(i => {
                if(i.uuid == row.uuid){
                    isSelect = true
                }
            })
            this.$set(row,'isSelect',isSelect)  
        },
        //拖拽
        handleDragStart(ev,kc){
            this.StepdraggingCard = kc
            this.isDrag = true
        },
        handleDragend(){
            this.StepdraggingCard = null
            this.isDrag = false
        },
        handleDropOver(ev){
            ev.preventDefault();
            ev.dataTransfer.dropEffect = 'move'  // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
        },
        handleDrop(ev,item,tkc){
            ev.preventDefault();
            if (this.isDrag) {
                ev.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
                var curdrag = item.indexOf(this.StepdraggingCard)     //当前拖拽的
                var target = item.indexOf(tkc)                        //目标
                this.$set(item,curdrag,tkc)
                this.$set(item,target,this.StepdraggingCard)
                this.dataIndex = target
            }
        },
        toggleSideBar(){},
        //科目列表选中样式切换
        tableRowClassName({row, rowIndex}) {
            if (rowIndex == this.dataIndex) {
                return 'selectedRow';
            }
            return '';
        },
        //科目列表选中
        async selectRowKc(row){
            console.log(row,887)
            this.curLeftkcData = row;
            let kcidArr = [];
            for(let i = 0; i < this.curTabkcList.length; i++) {
                kcidArr.push(this.curTabkcList[i].uuid)
            }
            this.dataIndex = kcidArr.indexOf(row.uuid);
            await this.getXmAllList()
            //检查是否全选
            console.log(this.curxmList,895)
            this.checkAll = true;
            if(this.curLeftkcData.curcheck==null||this.curLeftkcData.curcheck==undefined||this.curLeftkcData.curcheck==[]){
                this.checkAll = false;
                return;
            }
            for(var item of this.curxmList){
                console.log(item,902);
                var find = this.curLeftkcData.curcheck.find(e=>item.uuid==e)
                console.log(find,901)
                if(find==null||find==undefined||find==''){
                    this.checkAll = false;
                    break;
                } 
            }
            //以上↑检查是否全选
            // this.checkAll = this.curLeftkcData.curcheck.length>0&&this.curLeftkcData.curcheck.length==this.curLeftkcData.curxmcheck.length;
            // console.log(this.curLeftkcData.curcheck.length,this.curxmList.length,886)
        },
        //内容设置-- 预览       (科目) 
        ShowPopover(row){
            this.$set(row,'isPopover',true)
        },
        HidePopover(row){
            this.$set(row,'isPopover',false)
        },
        //右侧项目多选
        handleCheckTreeChange(val,data){
            var that = this
            var rwcheck = [] , xmcheck = []
            data.checkedNodes.forEach(a => {
                if(a.jflx != undefined){
                    xmcheck.push(a.uuid)
                }else{
                    rwcheck.push(a.uuid)
                }
            })
            this.$set(this.curLeftkcData,'currwcheck',rwcheck)
            this.$set(this.curLeftkcData,'curxmcheck',xmcheck.concat(data.halfCheckedKeys))
            this.$set(this.curLeftkcData,'curcheck',xmcheck.concat(rwcheck))
            var tempcount = 0;
            for(let item of this.curxmList){
                for(let xm of xmcheck){
                    if(item.uuid == xm){
                        tempcount ++;
                        continue;
                    }
                }
            }
            this.checkAll = tempcount==this.curxmList.length;
        },
        //全选树
        handleCheckAllChange(val) {
            var that = this
            var rwcheck = [] , xmcheck = []
            if(!this.checkAll){//清空
                console.log('qk',865)
                console.log(this.$refs.tree,866)
                for(let i=0;i<this.$refs.tree.length;i++){//清空树
                    this.$refs.tree[i].setCheckedKeys([]);
                }
            } else {//全选
                console.log('qx',868)
                var checkedKeys = this.$refs.tree[0].getCheckedKeys();
                this.curxmList.forEach(a => {
                    if(!checkedKeys.find(e=>a.uuid==e)){
                        checkedKeys.push(a.uuid)
                    }

                })
                this.$refs.tree[0].setCheckedKeys(checkedKeys);
                let checkedNodes = this.$refs.tree[0].getCheckedNodes()
                checkedNodes.forEach(a=>{
                    if(a.jflx != undefined){
                        xmcheck.push(a.uuid)
                    }else{
                        rwcheck.push(a.uuid)
                    }                    
                })

                this.checkAll = true;
            }
            this.$set(this.curLeftkcData,'currwcheck',rwcheck)
            this.$set(this.curLeftkcData,'curxmcheck',xmcheck)
            this.$set(this.curLeftkcData,'curcheck',xmcheck.concat(rwcheck))      
            // this.checkAll = !this.checkAll;
        },

        /*****
         * 
         * 唉，这里看不懂了
         * 
         */

        //保存-
        saveReport(type){
            if(type == 'step0' && (this.njdmSel&&this.njdmSel.length>0)){//第一步 && 选择年级 
                var that = this
                var isNext = true          //是否可以进行下一步
                this.njListSel.forEach((a,ind) => { //循环每个年级不同的讯息
                    var i = a.kcSelect       //备选课程
                    var t = a.bjidSelect    //所选班级
                    var bgd = a.bgdszList
                    if(i && i.length>0){
                        i.forEach(b => {
                            that.$set(b,'mbx',0)
                            that.$set(b,'isSelect',false)
                        })
                    }
                    that.$set(a,'addkcSelect',JSON.parse(JSON.stringify(i.concat(that.SpecialList)))) 
                    if(bgd && bgd.length>0){
                        bgd.forEach( b => {
                            a.addkcSelect.forEach( addL => {
                                if(b.lx == 0){                              //课程          
                                    var kcuuid = b.kcid?( b.zyid +','+b.kcid ): b.zyid              
                                    if(kcuuid == addL.uuid){
                                        that.$nextTick(() => {
                                            if(b.sfzs)  //是否展示
                                                that.$refs.multipleTable[ind].toggleRowSelection(addL);
                                        })                                    
                                        that.$set(addL,'isSelect',b.sfzs)
                                        var curxmcheck = []
                                        curxmcheck = b.xmid?b.xmid.split(','):[]
                                        if(b.bjzt)                          //展示班级整体评分
                                            curxmcheck.push('bjzt');
                                        if(b.pfbzewm)                          //展示评分标准二维码
                                            curxmcheck.push('pfbzerwm');   
                                        that.$set(addL,'curxmcheck',curxmcheck)     
                                        that.$set(addL,'curcheck',curxmcheck)               
                                    }                                    
                                }
                                if(b.lx == addL.mbx && b.lx !=0){
                                    that.$nextTick(() => {
                                        if(b.sfzs)  //是否展示
                                            that.$refs.multipleTable[ind].toggleRowSelection(addL);
                                    })        
                                    that.$set(addL,'isSelect',b.sfzs)
                                    if(b.lx == 1){              //身体素质曲线
                                        that.$set(addL,'stsztp',b.zssz?'1':'2')             //数值 学分 
                                        that.$set(addL,'curcheck',b.rwid?b.rwid.split(','):[])     
                                        that.$set(addL,'currwcheck',b.rwid?b.rwid.split(','):[])     
                                        that.$set(addL,'curxmcheck',b.xmid?b.xmid.split(','):[])     
                                    }
                                    if(b.lx == 2){               //个人发发展
                                        that.$set(addL,'zsjf',b.zsjf)             //积分雷达图
                                        that.$set(addL,'zsdj',b.zsdj)             //得A率雷达图
                                    }
                                    if(b.lx == 6){              //附言
                                        that.$set(addL,'fy',b.fy)         
                                    }         
                                    if(b.lx == 16){              //签名
                                        that.$set(addL,'zsxzqm',b.zsxzqm);//校长签名
                                        that.$set(addL,'zsjwzrqm',b.zsjwzrqm);//教务处签名    
                                        that.$set(addL,'zsbzrqm',b.zsbzrqm);//班主任签名       
                                    }                            
                                }
                            })
                        })
                    }
                    if(that.isCreate){
                        a.addkcSelect.forEach( addL => {
                            that.$nextTick(() => {
                                that.$refs.multipleTable[ind].toggleRowSelection(addL);
                            })                                    
                            that.$set(addL,'isSelect',true)  
                            if(addL.mbx == 1){              //身体素质曲线
                                that.$set(addL,'stsztp','1')             //数值 学分       
                            }  
                            if(addL.mbx == 2){               //个人发发展
                                that.$set(addL,'zsjf',true)             //积分雷达图
                                that.$set(addL,'zsdj',true)             //得A率雷达图
                            } 

                        })
                    }
                    
                    if(!t || t.length<1){
                        isNext = false
                    }
                })
                this.curTabkcList = this.njListSel[0].addkcSelect
                this.curLeftkcData = this.curTabkcList[0]?this.curTabkcList[0]:{}
                this.dataIndex = 0
                this.getXmAllList()
                if(isNext){                    
                    this.step='step1'
                    this.selectRowKc(this.curLeftkcData);
                    // this.checkAll = this.curLeftkcData.curcheck.length>0&&this.curLeftkcData.curcheck.length==this.curLeftkcData.curxmcheck.length;

                }else{
                    this.tipsXX("请选择班级",'error','失败');
                }
            }
            if(type == 'step0' && (!this.njdmSel || this.njdmSel.length==0)){
                var data = {
                    bgdid:this.reportInfo.bgdid,                 //报告单编号
                    xxsy:null,                        //学校水印地址
                    zssy:false,                        //是否展示水印
                    njSzList:[]
                }
                reportapi.SaveReportSetting(data).then(response => {
                    this.$router.push({
                        path: '/zhszReport/setReport', 
                    })
                })
                this.checkAll = this.curLeftkcData.curcheck.length>0&&this.curLeftkcData.curcheck.length==this.curLeftkcData.curxmcheck.length;
            }
            if(type == 'step1'){
                var that = this            
                var njSzList = []  
                var isSave = true;  
                var isStsz = false , isGrfz = false    //身体素质曲线  学业学习表现
                var isNotList = []
                if(this.njListSel && this.njListSel.length>0){
                    this.njListSel.forEach(a => {
                        // console.log(a,1075)
                        var bgdszList = [];
                        var drogkcid = []
                        if(a.addkcSelect && a.addkcSelect.length>0){
                            a.addkcSelect.forEach((b,ind) => {
                                var kcid = null , zyid = null , zsjf = false , zsdj = false , zssz = false , check = [] , rwcheck = [];
                                var bjzt = false,pfbzewm = false;     //展示班级整体评分  展示评分标准二维码
                                var isPush = false;         //是否添加bgdszlist
                                if(b.mbx == 1){                     //如果左边选中-----身体素质曲线
                                    if(!b.stsztp && b.isSelect){                                  //身体素质判断有没有选择是数值还是学分            
                                        isPush = false       
                                        isSave = false  
                                        isStsz = true
                                    }else if(b.stsztp){
                                        isPush = true
                                        zssz = (b.stsztp == '1')? true: false           //数值
                                        zsjf = (b.stsztp == '2')? true: false           //学分
                                    }
                                }
                                if(b.mbx == 2){                     //如果左边选中-----学业学习表现
                                    if((!b.zsdj  && !b.zsjf)&& b.isSelect){
                                        isPush = false     
                                        isSave = false  
                                        isGrfz = true
                                    }else if(b.zsdj || b.zsjf){
                                        isPush = true
                                        zsdj = b.zsdj           //等级
                                        zsjf = b.zsjf           //学分
                                    }
                                }
                                if(b.mbx == 6 && b.fy){                     //附言
                                    isPush = true
                                }

                                if(b.isSelect || (b.curxmcheck && b.curxmcheck.length>0)){            
                                    isPush = true                    
                                    if(b.mbx==0){                   //课程
                                        var uidArry = b.uuid.split(',')
                                        kcid = uidArry.length>1?uidArry[1]:null
                                        zyid = uidArry[0]
                                    }
                                    check = b.curxmcheck?JSON.parse(JSON.stringify(b.curxmcheck)):[]
                                    rwcheck = b.currwcheck?JSON.parse(JSON.stringify(b.currwcheck)):[]
                                    
                                    var bjztInd = check.indexOf('bjzt')
                                    if(bjztInd>-1){
                                        check.splice(bjztInd, 1);
                                        bjzt = true
                                    } 
                                    var pfbzewmInd = check.indexOf('pfbzerwm')
                                    if(pfbzewmInd>-1){
                                        check.splice(pfbzewmInd, 1);
                                        pfbzewm = true
                                    }                                     
                                }

                                if(isPush){
                                    bgdszList.push({
                                        lx:b.mbx,
                                        kcid:kcid, zyid:zyid, xmid:check.join(), rwid:rwcheck.join(),
                                        px:ind,
                                        bjzt:bjzt,                              //展示班级整体评分
                                        pfbzewm:pfbzewm,                        //展示评分标准二维码
                                        sfzs: b.isSelect,                       //是否展示
                                        zsjf:zsjf,                                //展示积分              --学业学习表现 身体素质曲线
                                        zsdj:zsdj,                                //展示等级              --学业学习表现（得A率）
                                        zssz:zssz,                                //展示数值              --身体素质曲线
                                        fy:b.fy,                                 //附言
                                        zsxzqm: b.zsxzqm,                        //校长签名
                                        zsjwzrqm: b.zsjwzrqm,                    //教务处签名
                                        zsbzrqm: b.zsbzrqm,                       //班主任签名
                                    })
                                }
                                if(b.mbx == 0){
                                    drogkcid.push(b.uuid)
                                }
                            })
                            if(bgdszList && bgdszList.length>0 && a.selkcListlx && a.selkcListlx.length>0){
                                njSzList.push({
                                    njdm:a.njdm,
                                    bjid:a.bjidSelect.join(),
                                    kcid:drogkcid.join('|'),
                                    // kcid:a.kcidSelect.join('|'),
                                    bgdszList:bgdszList
                                })
                            }else{
                                isNotList.push(a.njmc)
                            }
                            
                        }
                    })
                }
                if(isStsz){                    
                    this.tipsXX("身体素质曲线没有选择统计类型",'error','失败');
                    return false
                }
                if(isGrfz){                    
                    this.tipsXX("学业学习表现没有选择统计类型",'error','失败');
                    return false
                }
                if(this.checkedlogo && !this.logofile[0]){
                    isSave = false
                    this.tipsXX("没有上传学校logo",'error','失败');
                    return false
                }
                if(isNotList.length>0){
                    isSave = false
                    this.tipsXX(isNotList.join()+'没有进行内容设置','error','失败');
                    return false
                }

                var data = {
                    bgdid:this.reportInfo.bgdid,                 //报告单编号
                    xxsy:this.logofile[0]?this.logofile[0].url:'',                        //学校水印地址
                    zssy:this.checkedlogo,                        //是否展示水印
                    njSzList:njSzList
                }
                if(isSave){
                    reportapi.SaveReportSetting(data).then(response => {
                        this.step='step2'
                        this.handlePreview()
                    })
                }
            }
        },
        //选择班级
        handleTabclass(){
            this.dataIndex = 0
            this.curTabkcList = this.njListSel[this.nrsetclassInd].addkcSelect
            this.curLeftkcData = this.curTabkcList[0]?this.curTabkcList[0]:{}
            this.getXmAllList()
        },
        async getXmAllList(){     
            var curmbx = this.curLeftkcData.mbx
            var that = this
            this.listQuery.Xsrwxx = false               //显示任务
            if(curmbx==2 || curmbx==3 || curmbx==4 || curmbx==5 || curmbx==6 || curmbx==7){                //学业学习表现 出勤记录 奖惩记录 班主任寄语 附言 总评
                this.curxmList = []
                this.curtjData = {}
            }else{                   
                this.listQuery.njdms = this.njListSel[this.nrsetclassInd].njdm
                if(this.curLeftkcData.mbx==0){              //课程
                    var uidArry = this.curLeftkcData.uuid.split(',')
                    this.listQuery.kcIds = uidArry.length>1?uidArry[1]:null
                    this.listQuery.zyIds = uidArry[0]
                }else{
                    this.listQuery.kcIds = null
                    this.listQuery.zyIds = null
                }
                
                if(this.curLeftkcData.mbx==1){              //身体素质曲线
                    this.listQuery.Xsrwxx = true 
                    this.listQuery.jflx = 5 //健康
                }else{        //出勤记录
                    this.listQuery.jflx = null
                }
                await mainPapi.getAllList(this.listQuery).then(response => {
                    this.curxmList = response.xmInfoList
                    if(this.curLeftkcData.mbx==0 && this.curxmList && this.curxmList.length>0&&this.mbinfo.mbdm!='A02'&&this.mbinfo.mbdm!='A03'){
                        this.curxmList = this.curxmList.concat(this.kcspecdata)
                    }
                    var curxmcheck = []
                    if(this.curxmList && this.curxmList.length>0){
                        this.curxmList.forEach(a => {
                            curxmcheck.push(a.uuid)
                        })
                    }
                    if(this.isCreate){
                        this.$set(this.curLeftkcData,'curxmcheck',curxmcheck)
                    }

                    var curcheck = that.curLeftkcData.curcheck;
                    if(this.curxmList && this.curxmList.length>0){
                        this.curxmList.forEach(a => {
                            if(a.ywzx){                     //有子项
                                if(a.zxmList && a.zxmList.length>0){
                                    var allzxmcheck = true;
                                    a.zxmList.forEach(b => {
                                        that.$set(b,'TxmList',b.rwList)
                                        if(_.find(curcheck, function (c){return c==b.uuid;}) == undefined){
                                            allzxmcheck = false;
                                        }
                                    })
                                    
                                    if(_.find(curcheck, function (c){return c==a.uuid;}) != undefined && !allzxmcheck){ //未选择所有子节点，但curcheck存有父级节点
                                        _.remove(curcheck,function (c){return c==a.uuid;})
                                    }
                                }
                                that.$set(a,'TxmList',a.zxmList)
                            }else{
                                that.$set(a,'TxmList',a.rwList)
                            }
                        })
                    }
                })
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
        //附言保存
        clickfysure(){
            console.log(this.curxmList)
        },
        //上传图片的放大
        handlePictureCardPreview(file){ 
            this.dialogImageUrl = file.url;
            this.dialogPictureVisible = true;
        },
        //上传删除的回调
        handlePictureRemove(file,fileList){            
            this.logofile = []
        },
        // 图文录入--上传成功后的回调
        uploadSuccessPic(res, file,fileList) {
            if(res.status=="200"){
                var allImgL = []
                if(fileList&&fileList.length>0){
                    fileList.forEach(function(item,ind){
                        if(item.response){
                            allImgL.push({url:item.response.value[0]})
                        }
                    })
                }
                this.logofile= allImgL
            }else{
                this.tipsXX(response.resultMessage,'error','失败');
            }
        },
        // 图文录入--上传前对文件的大小的判断
        BatchbeforeUploadPicture(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            let isLt2M = file.size / 1024 / 1024 < 1
            if (!isJPG && !isPNG) {
                this.tipsXX('上传模版只支持图片格式','info','提示');
            }else if (!isLt2M) {
                this.tipsXX('上传模板大小不能超过 1MB','info','提示');
            }
            
            return (isJPG || isPNG) && isLt2M
        },  
        //预览报告单
        handleTabPrev(){
            this.handlePreview()
        },
        handlePreview(){
            var bgdXmData ={
                Xxdm :this.xxdm,
                BgdId:this.reportInfo.bgdid,
                Njdm : this.njListSel[this.preVInd].njdm
            } 
            var that = this
            this.BgdXmInfoList = []
            reportapi.GetBgdXmInfo(bgdXmData).then(res => {
                var zsres = []
                // zhdj转化等级 0否 1是   jflx计分类型 0成绩换算 1累积量 2学分 3等级 4图文 5健康 6阅读 7加减分
                // lx报告单内容类型 0课程 1身体素质曲线 2学业学习表现 3出勤记录 4奖惩记录 5班主任寄语 6附言 7总评 9体质健康
                
                if(res && res.length>0){
                    var totil = {
                        lx : 'totillx',
                        reportInfo:[]
                    }
                    var zpindex = -1;   //总评所在index
                    res.forEach((a,index) => {
                        if(a.sfzs){         //是否展示
                            if(a.kcmc&&a.kcmc.indexOf('体育')!=-1&&a.xmReportList){//如果是体育与保健学科
                                let xmind = a.xmReportList.findIndex((xm)=>{
                                   return xm.mc != a.kcmc
                                })//找到学科底下与学科名字不同的项目
                                this.tydata = a.xmReportList[xmind];//保存作为单独一个表格（右侧）显示
                                a.xmReportList.splice(xmind,1);//移除这个项目
                                console.log(this.tydata,1394)
                            }                          
                            if(a.lx == 0){          //课程
                                var kcid = a.kcid?(a.zyid+','+a.kcid):a.zyid
                                that.uniftList.forEach(b => {
                                    if(kcid == b.uuid){
                                        that.$set(a,'zkmc',b.mc)
                                    }
                                })
                                var kcData = []
                                if(a.xmReportList && a.xmReportList.length>0){
                                    a.xmReportList.forEach(xm => {
                                        if(xm.zxmList && xm.zxmList.length>0){                  //有子项
                                            xm.zxmList.forEach( zxm => {
                                                kcData.push({
                                                    xm:xm.mc, fx:zxm.mc,
                                                    pjz: '',
                                                    jflx:zxm.jflx

                                                })
                                                
                                            })
                                        }else{
                                            kcData.push({
                                                xm: xm.mc, fx:null,
                                                pjz: '',
                                                jflx:xm.jflx
                                            })                                        
                                        }
                                        
                                    })
                                }     
                                that.$set(a,'TableData',kcData)
                                zsres.push(a)
                            }
                            if(a.lx == 1){        //身体素质曲线
                                that.$set(a,'zkmc','身体素质曲线')
                                if(a.xmReportList && a.xmReportList.length>0){
                                    a.xmReportList.forEach(xm => {
                                    })
                                }                                
                                that.$set(a,'chartData',[])
                                zsres.push(a)
                            }
                            if(a.lx == 2){        //学业学习表现
                                that.$set(a,'zkmc','学业学习表现')
                                var radarchartData = []
                                if(a.zsdj){                 //展示等级 ------得A率雷达图
                                    radarchartData.push({type:0,chartData:that.radarchartData})
                                } 
                                if(a.zsjf){                 //展示积分 ------积分雷达图
                                    radarchartData.push({type:1,chartData:that.radarchartData})
                                }                      
                                that.$set(a,'radarchartData',radarchartData)
                                zsres.push(a)
                            }
                            if(a.lx == 3 || a.lx == 4 || a.lx == 5 ||  a.lx == 6){
                                var name = ''
                                if(a.lx == 3) name = '出勤记录'
                                if(a.lx == 4) name = '奖惩记录'
                                if(a.lx == 5) name = '班主任寄语'
                                if(a.lx == 6) name = '附言'
                                that.$set(a,'zkmc',name)
                                totil.reportInfo.push(a)
                                if(zpindex<0){
                                    zpindex = index
                                }
                                
                            }  
                            if(a.lx == 7){                  //总评
                                that.$set(a,'zpTableData',that.zqpage[0].zpTableData)
                                zsres.push(a)
                                var fzt = {}
                                fzt = JSON.parse(JSON.stringify(a))      
                                fzt.zpTableData = that.zqpage[1].zpTableData
                                // fzt.lastzq = true
                                zsres.push(fzt)
                            }      
                            if(a.lx == 16&&a.bgdqmModels){                //签名
                                this.qmlist = a.bgdqmModels.sort((qma,qmb)=>{
                                    if(qma.zc==''){
                                        qma.zc='班主任'
                                        return 1;
                                    }
                                    if(qmb.zc==''){
                                        qmb.zc='班主任'
                                        return -1;
                                    }
                                    if(qma.zc=='校长'){
                                        return -1;
                                    } else if (qma.zc=='班主任'){
                                        return 1;
                                    }                                    
                                    if(qmb.zc=='校长'){
                                        return 1;
                                    } else if (qmb.zc=='班主任'){
                                        return -1;
                                    }
                                });
                            }       
           
                        }
                    })
                    if(totil.reportInfo && totil.reportInfo.length>0){
                        if(zpindex>-1){
                            zsres.splice(zpindex,0,totil) 
                        }else{
                            zsres.push(totil)
                        }
                        
                    }
                                        
                    zsres.forEach((a,index) => {
                        if(a.TableData && a.TableData.length>0){
                            var num = -1
                            for(var i=0;i<a.TableData.length;i+=12){
                                var asplic = [];
                                asplic = a.TableData.slice(i,i+12)
                                that.$set(a,'kcTableData',a.TableData.slice(0,12))
                                num++
                                
                                var fzt = {}
                                fzt = JSON.parse(JSON.stringify(a))      
                                fzt.kcTableData = asplic                   
                                if(num>0){
                                    zsres.splice(index+num,0,fzt)
                                }                       
                            } 
                        }
                    })
                    if(zsres.length>0){
                        zsres[zsres.length-1].lastzq = true
                    }
                    zsres.forEach((a,index) => {                                       
                        if(a.kcTableData && a.kcTableData.length<12){           
                            for(var i=a.kcTableData.length;i<12;i++){
                                a.kcTableData.push({})                    
                            } 
                        }
                    })
                    for(var i=0;i<zsres.length;i+=2){
                        that.BgdXmInfoList.push(zsres.slice(i,i+2));                  //一分二
                    }
                }
                // this.tableformate();
                that.countLine();
                that.A02Table = that.calculateA02()
            })
        },

        //获取体育项目的名称
        getKMname(){
            for(let row of this.BgdXmInfoList){
                for(let bgd of row){
                    if(bgd.lx == 1){
                        return bgd.zkmc
                    }
                }
            }
        },
        //获取学期考勤数据
        getKQ(){
            for(let row of this.BgdXmInfoList){
                for(let bgd of row){
                    if(bgd.lx == 'totillx'){
                        for(let tot of bgd.reportInfo){
                            if(tot.lx == 3){
                                return  `本学期授课共${tot.ycq?tot.ycq:0}天，请假${tot.sj?tot.sj:0 + tot.bj?tot.bj:0}天，旷（缺）课${tot.kk?tot.kk:0}天。`
                            }                            
                        }
                    }
                }
            }
            return ''
        },
        //计算表格行数
        countLine(){
            var lineCount = 0;
            for(let row of this.BgdXmInfoList){
                for(let bgd of row){
                    if(bgd.lx == 0){
                        if(bgd.xmReportList&&bgd.xmReportList.length>0){
                            lineCount += bgd.xmReportList.length;
                        } else {
                            lineCount++;
                        }
                    }
                }
            }
            if(lineCount >= this.chartData.length*2+7){
                this.bzrjyheight = Math.round(lineCount*0.6); 
                this.shryheight = lineCount - this.bzrjyheight -1;
            } else {
                this.bzrjyheight = this.chartData.length*2+1
                this.shryheight = 6
            }
            this.allrowspan = lineCount;
            this.bzrjyheight*=22;
            this.shryheight*=22;
            // return Math.round(lineCount*0.6)*21;
        },
        calculateA02(){
            var tabledata = '';
            for(var rowind=0;rowind<this.BgdXmInfoList.length;rowind++){
                var row = this.BgdXmInfoList[rowind];
                for(var bgdInd=0;bgdInd<row.length;bgdInd++){
                    var bgd = row[bgdInd];
                    if(bgd.lx==0){
                        if(bgd.xmReportList&&bgd.xmReportList.length>0){
                            tabledata += `<tr><th width="12.5%" rowspan="${bgd.xmReportList.length}" colspan="${bgd.zkmc==bgd.xmReportList[0].mc?2:1}">${bgd.zkmc}</th>`
                            if(!(bgd.zkmc==bgd.xmReportList[0].mc)){
                                tabledata += `<th>${bgd.xmReportList[0].mc}</th>`
                            }
                            tabledata +=`<td>${bgd.xmReportList[0].lx?bgd.xmReportList[0].lx:''}</td><td rowspan="${bgd.xmReportList.length}"></td>`
                            if(rowind==0&&bgdInd==0){
                                tabledata += `<td rowspan="${this.allrowspan}">`
                                tabledata += `<table border='1' style="border:0;width:100%"><tr></tr>`
                                tabledata += `<tr><td height='${this.bzrjyheight}'>${this.PartData.bzrjy}</td></tr>`
                                tabledata += `<tr><th >所获荣誉</th></tr>`
                                tabledata += `<tr><td  style="border: 0;" height='${this.shryheight}'>${this.PartData.jcjl}</td></tr></table></td>`

                                tabledata += `<td rowspan="${this.allrowspan}">`
                                tabledata += `<table border='1' style="border:0;width:100%"><tr></tr>`
                                tabledata += `<tr><th>${this.getKMname()}</th></tr>`
                                tabledata += `<tr><th>${this.tydata.mc}</th></tr>`
                                if(this.tydata.length>0){
                                    for(var index=0;index<this.tydata.zxmList.length;index++){
                                        var item = this.tydata.zxmList[index];
                                        tabledata += `<tr><th>${item.mc}</th></tr>`
                                        if(item.jflx==4){
                                            tabledata += `<tr><td>${item.rwList[0].twnr}</td></tr>`
                                        } else {
                                            for(var rwind=0;rwind<item.rwList.length;rwind++){
                                                var rw = item.rwList[rwind];
                                                tabledata += `<tr><td>${rw.mc!=item.mc?rw.mc+':':''}${rw.sz}</td></tr>`
                                            }
                                        } 
                                    }                                    
                                }
                                for(var n=0;n<(this.bzrjyheight/22-1-(this.chartData.length*2));n++){
                                    tabledata +=   `<tr><td>${'&nbsp'}</td></tr>`
                                }
                                tabledata += `<tr><th height="${Math.round((this.shryheight+22)/2)}">${this.getKQ()}</th></tr>`
                                tabledata += `<tr class="qmtr"><th height="${this.shryheight-Math.round((this.shryheight+22)/2)+22}">`
                                for(var qmind =0 ;qmind<this.qmlist.length;qmind++){
                                    var qm = this.qmlist[qmind];
                                    tabledata += `${qm.zc}:`
                                    if(qm.qm.indexOf('http')==-1){
                                        tabledata += `<span>${qm.qm}</span>`
                                    } else {
                                        tabledata += `<img src="${qm.qm}" alt="">`
                                    }
                                }
                                if(this.qmlist.length==0){
                                    tabledata += `<p>班主任：</p><p>教务主任：</p><p>校长：</p>`
                                }
                                tabledata += '</tr></table></td>'                  
                            }                            
                        } else {
                            tabledata += `<tr><th width="12.5%" colspan="2">${bgd.zkmc}</th><td></td><td></td>`
                            if(rowind==0&&bgdInd==0){
                                tabledata += `<td rowspan="${this.allrowspan}">`
                                tabledata += `<table border='1' style="border:0;width:100%"><tr></tr>`
                                tabledata += `<tr><td height='${this.bzrjyheight}'>${this.PartData.bzrjy}</td></tr>`
                                tabledata += `<tr><th >所获荣誉</th></tr>`
                                tabledata += `<tr><td  style="border: 0;" height='${this.shryheight}'>${this.PartData.jcjl}</td></tr></table></td>`

                                tabledata += `<td rowspan="${this.allrowspan}">`
                                tabledata += `<table border='1' style="border:0;width:100%"><tr></tr>`
                                tabledata += `<tr><th>${this.getKMname()}</th></tr>`
                                tabledata += `<tr><th>${this.tydata.mc}</th></tr>`
                                if(this.tydata.length>0){
                                    for(var index=0;index<this.tydata.zxmList.length;index++){
                                        var item = this.tydata.zxmList[index];
                                        tabledata += `<tr><th>${item.mc}</th></tr>`
                                        if(item.jflx==4){
                                            tabledata += `<tr><td>${item.rwList[0].twnr}</td></tr>`
                                        } else {
                                            for(var rwind=0;rwind<item.rwList.length;rwind++){
                                                var rw = item.rwList[rwind];
                                                tabledata += `<tr><td>${rw.mc!=item.mc?rw.mc+':':''}${rw.sz}</td></tr>`
                                            }
                                        } 
                                    }                                    
                                }
                                for(var n=0;n<(this.bzrjyheight/22-1-(this.chartData.length*2));n++){
                                    tabledata +=   `<tr><td>${'&nbsp'}</td></tr>`
                                }
                                tabledata += `<tr><th height="${Math.round((this.shryheight+22)/2)}">${this.getKQ()}</th></tr>`
                                tabledata += `<tr class="qmtr"><th height="${this.shryheight-Math.round((this.shryheight+22)/2)+22}">`
                                for(var qmind =0 ;qmind<this.qmlist.length;qmind++){
                                    var qm = this.qmlist[qmind];
                                    tabledata += `${qm.zc}:`
                                    if(qm.qm.indexOf('http')==-1){
                                        tabledata += `<span>${qm.qm}</span>`
                                    } else {
                                        tabledata += `<img src="${qm.qm}" alt="">`
                                    }
                                }
                                if(this.qmlist.length==0){
                                    tabledata += `<p>班主任：</p><p>教务主任：</p><p>校长：</p>`
                                }
                                tabledata += '</tr></table></td>'                  
                            }   
                        }
                        for(var bgdTBInd=0;bgdTBInd<bgd.xmReportList.length;bgdTBInd++){
                            var bgdTB = bgd.xmReportList[bgdTBInd];
                            if(bgdTBInd!=0){
                                tabledata+=`<tr><th>${bgdTB.mc}</th><td></td></tr>`
                            }                            
                        }
                    }
                }
            }
            console.log(tabledata,1678)
            return tabledata;
        }
    },
}
</script>

<style scoped lang="scss">
    .app-container{
        min-width: 920px;
        /deep/ .el-tabs__header{
            margin: 0;
        }
    }
    .njBox{
        width: 250px;
        height: 350px;
        border: 1px solid #ddd;
        background: #fefefe;
        border-radius: 5px;
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .njBox.open{
        background: #ddffd0;
    }
    .mpt{
        margin-bottom: 20px;
    }
    .el-card {
        cursor: default;
        .partbox{
            border-top: 1px solid #ebeef5;
            padding: 10px;
            // .select-item{
            //     margin-top: 10px;
            // }
            .selec-check{
                margin-top: 10px;
                width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .title{
            font-size: 16px; 
            // padding: 10px 0;
            font-weight: bold;
        }
        .pbcon{
            margin-top: 15px;
            margin-bottom: 5px;
        }
        .partbox:first-child{
            border-top: none;
        }
    }
    
    .report-footer{
        margin-top: 30px;
    }
    .step1box{
        min-height: 600px;
    }   
    .step1foot{
        height: 100px; line-height: 100px; width: 420px; margin: 35px auto;
        .uploadlogo{
            float: left; position: relative;
            .tit{
                float: left;
            }
            .uploadpt{
                float: left; margin: 0 10px;
                width: 100px; height: 100px;
            }
        }
    }
    .dragcon{
        float: left; width: 300px; border: 1px solid #ebeef5; margin-right: 10px;
        .allcheck{
            padding:15px 54px;
        }
        .drag{
            float: left; cursor: move; font-size: 26px; fill: #ccc;
        }
        .con{
            float: left;
        } 
        .txthid{
            width: 180px;
            float: left;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
    }
    .tPopBoxTable{
        .blockcol{
            width: 100%; height: 24px; 
            span{ 
                float: left; height: 24px; color: #fff; font-size: 12px;
            }
            .colA{ background:#409EFF; }
            .colB{ background:#ff8c00; }
            .colC{ background:#ccc; }
            .colD{ background:#ffd700; }
        }
    }
    .fybtn{
        text-align: center; margin-top: 20px;
    }
    .ptips{
        margin-bottom: 10px;
    }
    .tableBox{
        border: 1px solid #ccc; height: 750px; overflow: hidden;
        padding: 10px 20px;
        margin-bottom: 10px;
    
        .tabtit{
            text-align: center;  padding: 5px 0; height: 32px; white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold; font-size: 16px;
        }
        .tabinfo{
            height: 32px; padding: 5px 0;
            .rol{
                position: relative;
            }
            span{ width: 40px; line-height: 22px; float: left; position: absolute; background: #fff;}
            i{
                height: 22px; line-height: 22px; border-bottom: 1px solid #333; float: left;
                width: 100%; 
            }
        }
        .totilbox{
            .tabcon{
                margin-bottom: 20px;
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
        .tabcon{
            .tit{
                margin-bottom: 5px;
            }
            .kcname{ 
                float: left; line-height: 40px;
            }
            .code{ 
                float: right; width: 40px; height: 40px; background: red;
                img{
                    width: 100%; height: 100%; display: block;
                }
            }
            
        }
    }
    .zqPage{
        width: 800px;
        .zqpgtable{
            float: left; margin: 0 10px;
        }
    }
    .prevcol{
        position: relative; height: 100%;
        .watermark{
            position: absolute; top: 0; left: 10px; right: 10px; z-index: 100; height: 100%; opacity: .2;
            img{
                width: 100%; height: 100px; 
                position: absolute;  top: 50%; left: 0; margin-top: -50px;
                transform: rotate(-30deg);
            }
        }
    }
</style>
<style scoped>
    #lineTd {
            background: #fff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=) no-repeat 100% center;
    }
    .sltable{
        /* text-align: center; */
    }
    .bgdfm{
        background:#fdeadb;
        /* background: url('../../../../../static/img/bgdfmbg.jpg'); */
        background-size: 100% auto;
        height: 1146px;
        padding: 100px 80px;
        position: relative;
    }
    .bgdfm .schoollogo{
        position: absolute;
        height: 248px;
        width: auto;
        top: 451px;
        left: 373px;
        /* background-color: #000; */
    }
    .bgdfm .schoolimg{
        position: absolute;
        height: 80px;
        width: auto;
        top: 238px;
        right: 153px;
        /* background-color: #fff;     */
    }
    .bgdfm .schoollogosmall{
        position: absolute;
        height: 110px;
        width: auto;
        top: 233px;
        right: 614px;
    }
    .bgdfm .bgdinfo{
        float: right;
        position: relative;
        width: 525px;
    }
    .bgdinfo .title{
        position: absolute;
        /* left: -115px; */
        top: 351px;
        font-size: 30px;
        /* text-indent: -100px; */
        font-family: monospace;
        font-weight: bolder;
        text-align: center;
    }
    .bgdinfo .title .bgdxnxq{
        margin-top: 21px;
        margin-left: 52px;
    }
    .bgdinfo .njbj{
        position: absolute;
        left: 80px;
        top: 550px;
        font-size: 26px;
        font-family: monospace;
        font-weight: bold;
    }
    .bgdinfo .xm{
        position: absolute;
        left: 79px;
        top: 640px;
        font-family: monospace;
        font-size: 26px;
        font-weight: 500;
    }
    .bgdinfo .shijian{
        position: absolute;
        top: 715px;
        left: 105px;
        font-size: 26px;
        font-family: monospace;
        font-weight: 500;
        letter-spacing: 3px;
    }
    .stqktable{
        text-align: center;
    }
    .stqktable th{
        text-align: center
    }
    .stqktable .qmtr div{
        text-align: left;
    }
</style>

<style lang="scss">
    .Tcdreport .el-checkbox{ margin-right: 10px;}
    .Tcdreport .el-checkbox+.el-checkbox{ margin-left: 0;}
    .Tcdreport .el-checkbox.is-bordered+.el-checkbox.is-bordered{ margin-left: 0;}
    .dragcon .el-table_1_column_1{ border-right: 1px solid #ebeef5;}
    .dragcon label{ margin-bottom: 0;}

    .dragcon .selectedRow td,.selectedRow:hover td{
        background-color: #4787f1 !important; color: #fff;
    }
    .dragcon .selectedRow td:nth-child(1) { background: #ecf3fe !important;}
    .uploadpt>div{ height: 100%;}
    .uploadpt .el-upload--picture-card{ width: 100%; height: 100%; line-height: 100px;}
    .uploadpt .el-upload-list{ width: 100px; height: 100px;}
    .uploadpt .el-upload-list--picture-card .el-upload-list__item{ width: 100px; height: 100px;}
    .uploadpt .el-icon-plus{ font-size: 18px;}     
    .uploadpt .el-dialog__header{ padding: 0;}     
    .uploadpt .el-dialog__headerbtn{ line-height:1}
    .dragcon .el-icon-tickets{ cursor: pointer; font-size: 16px; color: #606266;}
    .dragcon .selectedRow .el-icon-tickets{ color: #fff;}
    
    .el-popover{ border:none;}

</style>
