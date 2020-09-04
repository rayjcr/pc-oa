import Vue from 'vue';
import Router from 'vue-router';
import smartLock from './appRouter/smartLock' // 模块路由
import smartWage from './appRouter/smartWage'
import quality from './quality/qualityAppraisal'
import classCard from './classCard/classCard'
import testRouter from './testRouter/testRouter'
import Layout from '../views/layout/Layout';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */

// console.log(testRouter,14)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/

export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: _import('main/index')
      },
      {
        path: 'example',
        component: _import('staticpages/index')
      },
      {
        path: 'searchdemo',
        component: _import('staticpages/searchdemo')
      },
      {
        path: '/userDynamic',
        name: '用户动态',
        component: _import('main/userDynamic'),
        hidden: true
      }
    ]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'form',
    noDropdown: true,
    children: [
      {
        path: 'index',
        component: _import('introduction/index'),
        name: '简述'
      }
    ]
  },
  {
    path: '/audit',
    component: Layout,
    name: '审批管理',
    icon: 'setting',
    children: [
      {
        path: 'auditTemplate',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/audittemplate'),
        name: '创建新审批'
      },
      {
        path: 'selectForm',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/selectform'),
        name: '选择表单'
      },
      {
        path: 'szspbz',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/szspbz'),
        name: '设置流程步骤'
      }
    ]
  },
  {
    path: '/process',
    component: Layout,
    name: '审批申请',
    icon: 'setting',
    children: [
      {
        path: 'index',
        icon: 'fa-user',
        component: _import('audit/mobile/spindex'),
        name: '审批首页'
      },
      {
        path: 'apply',
        icon: 'fa-user',
        component: _import('audit/mobile/spsq'),
        name: '创建新审批'
      },
      {
        path: 'info',
        icon: 'fa-user',
        component: _import('audit/mobile/spslmx'),
        name: '审批详情'
      }
    ]
  },
  {
    path: '/auditAqsb', // ===============安全上报
    component: Layout,
    name: '安全上报',
    icon: 'setting',
    children: [
      {
        path: 'ckJgManager',
        icon: 'category',
        component: _import('xxaf/jgcx/ckjg'),
        name: '结果详情',
        authority: 'ckJgManager'
      },
      {
        path: 'jgcxManager',
        component: _import('xxaf/jgcx/index'),
        name: '结果查询',
        authority: 'jgcxManager'
      }
    ]
  },
  {
    path: '/auditKcxx',
    component: Layout,
    name: '选课系统',
    icon: 'setting',
    children: [
      {
        path: 'kcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/index'),
        name: '课程开设',
        authority: 'kcxxManager'
      },
      {
        path: 'addkcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/addkcxx'), //  addkcxx upload
        name: '课程增加',
        authority: 'addkcxxManager'
      },
      {
        path: 'ckkcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/ckkcxx'),
        name: '课程查看',
        authority: 'ckkcxxManager'
      },
      {
        path: 'updatekcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/updatekcxx'),
        name: '课程修改',
        authority: 'updatekcxxManager'
      }
    ]
  },
  {
    path: '/pkxt', // 排课管理跳转页面设置
    component: Layout,
    name: '排课管理',
    icon: 'setting',
    children: [
      {
        path: 'pksz',
        icon: 'fa-user',
        component: _import('pkxt/arrangingTask/pksz'),
        name: '排课设置'
      }
    ]
  },
  {
    path: '/znpk', // 智能排考跳转页面设置
    component: Layout,
    name: '排考设置',
    icon: 'setting',
    children: [
      {
        path: 'top',
        icon: 'fa-user',
        component: _import('znpk/examination/top'),
        name: '排考设置'
      },
      {
        path: 'mksz',
        icon: 'fa-user',
        component: _import('znpk/examination/mksz/index'),
        name: '免考设置'
      }
    ]
  },
  {
    path: '/ksgl', // 考试管理跳转页面设置
    component: Layout,
    name: '考试设置',
    icon: 'setting',
    children: [
      {
        path: 'top',
        icon: 'fa-user',
        component: _import('ksgl/kswh/top'),
        name: '考试设置'
      }
    ]
  },
  {
    path: '/cjgl', // 考试管理跳转页面设置
    component: Layout,
    name: '成绩管理',
    icon: 'setting',
    children: [
      {
        path: 'cjlr',
        icon: 'fa-user',
        component: _import('ksgl/cjlr/index'),
        name: '成绩录入'
      }
    ]
  },
  {
    path: '/cjfs', // 考试管理跳转页面设置
    component: Layout,
    name: '成绩复审',
    icon: 'setting',
    children: [
      {
        path: 'fslr',
        icon: 'fa-user',
        component: _import('ksgl/fslr/index'),
        name: '复审录入'
      }
    ]
  },
  {
    path: '/oaSysYs', // 这里是演示版的路由
    component: Layout,
    name: 'OA系统',
    icon: 'setting',
    authority: 'oaSysYs',
    children: [
      {
        path: 'znx',
        component: _import('oasysys/znx/index'),
        name: '站内信',
        authority: 'znx'
      },
      {
        path: 'tzsq',
        component: _import('oasysys/tzsq/index'),
        name: '通知申请',
        authority: 'tzsq'
      },
      {
        path: 'rwfb',
        component: _import('oasysys/rwfb/index'),
        name: '任务发布',
        authority: 'rwfb'
      },
      {
        path: 'gwfb',
        component: _import('oasysys/gwfb/index'),
        name: '公文发布',
        authority: 'gwfb'
      },
      {
        path: 'qjsq',
        component: _import('oasysys/qjsq/index'),
        name: '请假申请',
        authority: 'qjsq'
      },
      {
        path: 'dkwh',
        component: _import('oasysys/dkwh/index'),
        name: '代课管理',
        authority: 'dkwh'
      },
      {
        path: 'tkwh',
        component: _import('oasysys/tkwh/index'),
        name: '调课管理',
        authority: 'tkwh'
      },
      {
        path: 'txgl',
        component: _import('oasysys/txgl/index'),
        name: '调休单管理',
        authority: 'txgl'
      },
      {
        path: 'xcxx',
        component: _import('oasysys/xcxx/index'),
        name: '校车信息',
        authority: 'xcxx'
      },
      {
        path: 'wpbx',
        component: _import('oasysys/wpbx/index'),
        name: '物品报修',
        authority: 'wpbx'
      },
      {
        path: 'cgjk',
        component: _import('oasysys/cgjk/index'),
        name: '采购监控',
        authority: 'cgjk'
      },
      {
        path: 'rwjh',
        component: _import('oasysys/rwjh/index'),
        name: '任务计划',
        authority: 'rwjh'
      },
      {
        path: 'wpgl',
        component: _import('oasysys/wpgl/index'),
        name: '网盘管理',
        authority: 'wpgl'
      },
      {
        path: 'qgx',
        component: _import('oasysys/qgx/index'),
        name: '群共享',
        authority: 'qgx'
      }
    ]
  },
  {
    path: '/incentiveCard',
    component: Layout,
    name: '卡片维护',
    icon: 'setting',
    authority: 'incentiveCard',
    children: [
      {
        path: 'cardMaintenanceDetail',
        component: _import('projectapp/incentiveCard/cardMaintenance/detail'),
        name: '查看',
        authority: 'cardMaintenance'
      }
    ]
  },

    /**
   * 2020-03-13 卡片管理 新功能
   */
  {
    path:'/qualityAppraisal/cardManage',
    component:Layout,
    name:'卡片管理',
    authority:'cardManage',
    children: [
      {
        path: '/',
        redirect:'/qualityAppraisal/cardManage/homepage'
      },
      {
        path: 'homepage',
        component: _import('projectapp/cardManage/index'),
        name: '卡片管理',
        authority: 'homepage'
      },
      {
        path: 'cardnum',
        component: _import('projectapp/cardManage/cardNum'),
        name: '卡号管理',
        authority: 'cardnum'
      },
    ]
  },




];

export default new Router({
  mode: 'hash', // 后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/baseManager',
    component: Layout,
    name: '基础配置管理',
    icon: 'setting',
    authority: 'baseManager',
    children: [
      {
        path: 'xxdmManager',
        icon: 'category',
        component: _import('admin/school/index'),
        name: '学校维护',
        authority: 'xxdmManager'
      },
      {
        path: 'adminUser',
        icon: 'fa-user',
        component: _import('admin/user/adminindex'),
        name: '校管理员管理',
        authority: 'adminUser'
      },
      {
        path: 'userManager',
        icon: 'fa-user',
        component: _import('admin/user/index'),
        name: '用户管理',
        authority: 'userManager'
      },
      {
        path: 'menuManager',
        icon: 'category',
        component: _import('admin/menu/index'),
        name: '菜单管理',
        authority: 'menuManager'
      },
      {
        path: 'groupManager',
        icon: 'group_fill',
        component: _import('admin/group/index'),
        name: '角色权限管理',
        authority: 'groupManager'
      },
      {
        path: 'groupTypeManager',
        icon: 'fa-users',
        component: _import('admin/groupType/index'),
        name: '角色类型管理',
        authority: 'groupTypeManager'
      },
      {
        path: 'gateLogManager',
        icon: 'viewlist',
        component: _import('admin/gateLog/index'),
        name: '操作日志管理',
        authority: 'gateLogManager'
      },
      {
        path: 'campus',
        icon: 'viewlist',
        component: _import('admin/campus/index'),
        name: '校区管理',
        authority: 'campus'
      },
      {
        path: 'teachManager',
        icon: 'category',
        component: _import('admin/teach/index'),
        name: '教师管理',
        authority: 'teachManager'
      },
      {
        path: 'stuManager',
        icon: 'category',
        component: _import('admin/student/index'),
        name: '学生维护',
        authority: 'stuManager'
      },
      {
        path: 'termManager',
        icon: 'category',
        component: _import('admin/term/index'),
        name: '学期维护',
        authority: 'termManager'
      },
      {
        path: 'acadyearManager',
        icon: 'category',
        component: _import('admin/acadyear/index'),
        name: '学年维护',
        authority: 'acadyearManager'
      },
      {
        path: 'indexManager',
        icon: 'category',
        component: _import('main/index'),
        name: '首页',
        authority: 'indexManager'
      },
      {
        path: 'gradeManager',
        icon: 'category',
        component: _import('admin/grade/index'),
        name: '年级维护',
        authority: 'gradeManager'
      },
      {
        path: 'placeManager',
        icon: 'category',
        component: _import('admin/place/index'),
        name: '场地维护',
        authority: 'placeManager'
      },
      {
        path: 'courseManager',
        icon: 'category',
        component: _import('admin/course/index'),
        name: '课程维护',
        authority: 'courseManager'
      },
      {
        path: 'teachclassManager',
        icon: 'category',
        component: _import('admin/teachclass/index'),
        name: '教师任课设置',
        authority: 'teachclassManager'
      },
      {
        path: 'teacherGroupManager',
        icon: 'category',
        component: _import('admin/teachergroup/index'),
        name: '教师组维护',
        authority: 'teacherGroupManager'
      },
      {
        path: 'classManager',
        icon: 'category',
        component: _import('admin/class/index'),
        name: '班级维护',
        authority: 'classManager'
      },
      {
        path: 'specialTypeManager',
        icon: 'category',
        component: _import('admin/specialType/index'),
        name: '特长生类型',
        authority: 'specialTypeManager'
      },
      {
        path: 'specialRaw',
        icon: 'category',
        component: _import('xkxt/specialRaw/index'),
        name: '特长生维护',
        authority: 'specialRaw'
      },
      {
        path: 'courseTypeManager',
        icon: 'category',
        component: _import('xkxt/courseTypeManager/index'),
        name: '课程类别维护',
        authority: 'courseTypeManager'
      },
      {
        path: 'majorManager',
        icon: 'category',
        component: _import('admin/major/index'),
        name: '专业维护',
        authority: 'majorManager'
      },
      {
        path: 'gateaccLogManager',
        icon: 'category',
        component: _import('admin/gateaccLog/index'),
        name: '操作日志',
        authority: 'gateaccLogManager'
      },{
        path: 'loginLog',
        component: _import(
          'projectapp/qualityAppraisal/loginLog/index'
        ),
        name: '登录日志',
      },
    ]
  },
  {
    path: '/authManager',
    component: Layout,
    name: '服务管理',
    icon: 'setting',
    authority: 'authManager',
    children: [
      {
        path: 'serviceManager',
        component: _import('auth/service/index'),
        name: '服务权限管理',
        authority: 'serviceManager'
      }
    ]
  },
  {
    path: '/monitorManager',
    component: Layout,
    name: '监控模块管理',
    icon: 'setting',
    authority: 'monitorManager',
    children: [
      {
        path: 'serviceEurekaManager',
        component: _import('monitor/eureka/index'),
        name: 'Eureka注册中心',
        authority: 'serviceEurekaManager'
      },
      {
        path: 'serviceMonitorManager',
        component: _import('monitor/service/index'),
        name: '服务状态监控',
        authority: 'serviceMonitorManager'
      },
      {
        path: 'serviceZipkinManager',
        component: _import('monitor/zipkin/index'),
        name: '服务链路监控',
        authority: 'serviceZipkinManager'
      }
    ]
  },
  {
    path: '/classCard',
    component: Layout,
    name: '电子班牌管理',
    icon: 'setting',
    authority: 'classCard',
    children: [
      {
        path: 'openClassCard',
        component: _import('admin/classCard/openClassCard/index'),
        name: '开通电子班牌',
        authority: 'openClassCard'
      },
      {
        path: 'hardwareManager',
        component: _import('admin/classCard/hardwareManager/index'),
        name: '硬件信息入库',
        authority: 'hardwareManager'
      },
      {
        path: 'editionManager',
        component: _import('admin/classCard/editionManager/index'),
        name: '版本管理',
        authority: 'editionManager'
      },
      {
        path: 'functionManager',
        component: _import('admin/classCard/functionManager/index'),
        name: '功能管理',
        authority: 'functionManager'
      },
      {
        path: 'layoutManager',
        component: _import('admin/classCard/layoutManager/index'),
        name: '布局管理',
        authority: 'layoutManager'
      },
      {
        path: 'applicationManager',
        component: _import('admin/classCard/applicationManager/index'),
        name: '应用管理',
        authority: 'applicationManager'
      }
    ]
  },
  {
    path: '/projectManager',
    component: Layout,
    name: '学分管理',
    icon: 'setting',
    authority: 'projectManager',
    children: [
      {
        path: 'mainProject',
        component: _import('project/mainProject/index'),
        name: '主项目',
        authority: 'mainProject'
      },
      {
        path: 'sonProject',
        component: _import('project/sonProject/index'),
        name: '子项目',
        authority: 'mainProject'
      },
      {
        path: 'projectDetail',
        component: _import('project/projectDetail/index'),
        name: '项目详情',
        authority: 'mainProject'
      },
      {
        path: 'scoreTable',
        component: _import('project/scoretable/index'),
        name: '在线导入',
        authority: 'mainProject' // 假数据-----该删除
      },
      {
        path: 'creatSearch',
        component: _import('project/creditSearch/index'),
        name: '学分查询',
        authority: 'creatSearch'
      }
    ]
  },
  {
    path: '/thematicactivities',
    component: Layout,
    name: '主题活动报告单',
    authority: 'thematicactivities',
    children: [
      {
        path: 'SetActiveReport',
        component: _import('project/thematicactivities/SetActiveReport/index'),
        name: '报告单设置',
        authority: 'SetActiveReport'
      },
      {
        path: 'reportSet',
        component: _import(
          'project/thematicactivities/SetActiveReport/reportSet'
        ),
        name: '报告单设置',
        authority: 'SetActiveReport'
      },
      {
        path: 'InputAndExport',
        component: _import('project/thematicactivities/InputAndExport/index'),
        name: '报告单录入导出',
        authority: 'InputAndExport'
      },
      {
        path: 'informationEntry',
        component: _import(
          'project/thematicactivities/InputAndExport/InformationEntry'
        ),
        name: '报告单录入',
        authority: 'InputAndExport'
      },
      {
        path: 'informationExport',
        component: _import(
          'project/thematicactivities/InputAndExport/InformationExport'
        ),
        name: '报告单导出',
        authority: 'InputAndExport'
      },
      {
        path: 'StudentGrouping',
        component: _import('project/thematicactivities/StudentGrouping/index'),
        name: '学生分组',
        authority: 'StudentGrouping'
      }
    ]
  },
  {
    path: '/zhszReport',
    component: Layout,
    name: '综合素质报告单',
    authority: 'zhszReport',
    children: [
      {
        path: 'setReport',
        component: _import('project/zhszReport/setReport/index'),
        name: '报告单设置',
        authority: 'setReport'
      },
      {
        path: 'setReportEdit',
        component: _import('project/zhszReport/setReport/setReport'),
        name: '报告单设置',
        authority: 'setReport'
      },
      // {
      //   path: 'controlLibrary',
      //   component: _import('project/zhszReport/setReport/ControlLibrary'),
      //   name: '报告单设计',
      //   authority: 'setReport'
      // },
      {
        path: 'inoutReport',
        component: _import('project/zhszReport/inoutReport/index'),
        name: '报告单录入导出',
        authority: 'inoutReport'
      },
      {
        path: 'InformationEntry',
        component: _import('project/zhszReport/inoutReport/InformationEntry'),
        name: '报告单录入',
        authority: 'inoutReport'
      },
      {
        path: 'InformationExport',
        component: _import('project/zhszReport/inoutReport/InformationExport'),
        name: '报告单导出',
        authority: 'inoutReport'
      },
      {
        path: 'commonReport',
        component: _import('project/zhszReport/commonReport/reportIndex'),
        name: '报告单设置',
        authority: 'zhszReport'
      },
    ]
  },
  {
    path: '/auditManager',
    component: Layout,
    name: '审批管理',
    icon: 'setting',
    authority: 'auditManager',
    children: [
      {
        path: 'holidayManager',
        icon: 'fa-user',
        component: _import('audit/holidaymanager/index'),
        name: '假期管理',
        authority: 'holidayManager'
      },
      {
        path: 'approvalProcess',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/index'),
        name: '审批流程',
        authority: 'approvalProcess'
      },
      {
        path: 'auditTemplate',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/audittemplate'),
        name: '创建新审批',
        authority: 'approvalProcess'
      },
      {
        path: 'selectForm',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/selectform'),
        name: '选择表单',
        authority: 'approvalProcess'
      },
      {
        path: 'splscx',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/spcx'),
        name: '审批历史',
        authority: 'splscx'
      }
    ]
  },
  {
    path: '/xkxtManager',
    component: Layout,
    name: '选课系统',
    icon: 'setting',
    authority: 'xkxtManager',
    children: [
      {
        path: 'xkrw',
        icon: 'fa-user',
        component: _import('xkxt/xkrwmanager/index'),
        name: '选课任务',
        authority: 'xkxtManager'
      },
      {
        path: 'specialRaw',
        icon: 'category',
        component: _import('xkxt/specialRaw/index'),
        name: '特长生维护',
        authority: 'specialRaw'
      },
      {
        path: 'xkgzsz',
        icon: 'fa-user',
        component: _import('xkxt/xkrwmanager/xkgzsz'),
        name: '选课规则设置',
        authority: 'xkxtManager'
      },
      {
        path: 'ckxkrw',
        icon: 'fa-user',
        component: _import('xkxt/xkrwmanager/ckxkrw'),
        name: '查看选课任务',
        authority: 'xkxtManager'
      },
      {
        path: 'ckgzsz',
        icon: 'fa-user',
        component: _import('xkxt/xkrwmanager/ckgzsz'),
        name: '查看规则设置',
        authority: 'xkxtManager'
      },
      {
        path: 'xkjgmanager',
        icon: 'fa-user',
        component: _import('xkxt/xkjgmanager/index'),
        name: '选课结果查询',
        authority: 'xkjgmanager'
      },
      {
        path: 'xkjgtzmanager',
        icon: 'fa-user',
        component: _import('xkxt/xkjgtzmanager/index'),
        name: '选课结果调整',
        authority: 'xkjgtzmanager'
      },
      {
        path: 'gcpywh',
        icon: 'fa-user',
        component: _import('xkxt/pjManager/gcpywh'),
        name: '过程评语维护',
        authority: 'gcpywh'
      },
      {
        path: 'gcpywh_detail',
        icon: 'fa-user',
        component: _import('xkxt/pjManager/gcpywh_detail'),
        name: '过程评语维护详情'
      },
      {
        path: 'gcpywh_input',
        icon: 'fa-user',
        component: _import('xkxt/pjManager/gcpywh_input'),
        name: '过程评语录入'
      },
      {
        path: 'qmpywh',
        icon: 'fa-user',
        component: _import('xkxt/pjManager/qmpywh'),
        name: '期末评语维护',
        authority: 'qmpywh'
      },
      {
        path: 'pjsz',
        icon: 'fa-user',
        component: _import('xkxt/pjManager/pjsz'),
        name: '评价设置',
        authority: 'pjsz'
      },
      {
        path: 'pjkccx',
        icon: 'fa-user',
        component: _import('xkxt/pjManager/pjkccx'),
        name: '查询统计',
        authority: 'pjkccx'
      },
      {
        path: 'xkjgmanager',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/index'),
        name: '审批流程',
        authority: 'xkjgmanager'
      },
      {
        path: 'auditTemplate',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/audittemplate'),
        name: '创建新审批',
        authority: 'approvalProcess'
      },
      {
        path: 'kcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/index'),
        name: '课程开设',
        authority: 'kcxxManager'
      },
      {
        path: 'addkcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/addkcxx'), //  addkcxx upload
        name: '课程增加',
        authority: 'addkcxxManager'
      },
      {
        path: 'ckkcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/ckkcxx'),
        name: '课程查看',
        authority: 'ckkcxxManager'
      },
      {
        path: 'updatekcxxManager',
        icon: 'category',
        component: _import('xkxt/kcxxManager/updatekcxx'),
        name: '课程修改',
        authority: 'updatekcxxManager'
      },
      {
        path: 'stuPreallocationManager',
        icon: 'category',
        component: _import('xkxt/stuPreallocation/index'),
        name: '学生预分配',
        authority: 'stuPreallocationManager'
      },
      {
        path: 'selectForm',
        icon: 'fa-user',
        component: _import('audit/approvalprocess/selectform'),
        name: '选择表单',
        authority: 'approvalProcess'
      }
    ]
  },
  {
    path: '/xyafManager', // ------------校园安防 安全上报---------------
    component: Layout,
    name: '校园安防',
    icon: 'setting',
    authority: 'xyafManager',
    children: [
      {
        path: 'aqsbManager',
        component: _import('xxaf/aqsb/index'),
        name: '上报设置',
        authority: 'aqsbManager'
      },
      {
        path: 'jgcxManager',
        component: _import('xxaf/jgcx/index'),
        name: '结果查询',
        authority: 'jgcxManager'
      }
    ]
  },
  {
    path: '/scoreMonitor', // --------------- 学分监控 ------------------
    component: Layout,
    name: '学分监控',
    icon: 'setting',
    authority: 'scoreMonitor',
    children: [
      {
        path: 'schoolScore',
        component: _import('project/scoreMonitor/schoolScore/index'),
        name: '全校学分监控',
        authority: 'scoreMonitor'
      },
      {
        path: 'njScore',
        component: _import('project/scoreMonitor/njScore/index'),
        name: '年级学分监控',
        authority: 'scoreMonitor'
      },
      {
        path: 'bjScore',
        component: _import('project/scoreMonitor/bjScore/index'),
        name: '班级学分监控',
        authority: 'scoreMonitor'
      },
      {
        path: 'xsScore',
        component: _import('project/scoreMonitor/xsScore/index'),
        name: '学生学分监控',
        authority: 'scoreMonitor'
      }
    ]
  },
  {
    path: '/examManager', // ---------------智能排考 ------------------
    component: Layout,
    name: '智能排考',
    icon: 'setting',
    authority: 'examManager',
    children: [
      {
        path: 'examination',
        icon: 'category',
        component: _import('znpk/examination/index'),
        name: '智能排考',
        authority: 'examination'
      }
    ]
  },
  {
    path: '/arrangingManager', // ---------------排课管理 ------------------
    component: Layout,
    name: '排课管理',
    icon: 'setting',
    authority: 'arrangingManager',
    children: [
      {
        path: 'arrangingTask',
        icon: 'category',
        component: _import('pkxt/arrangingTask/index'),
        name: '排课任务',
        authority: 'arrangingTask'
      }
    ]
  },
  {
    path: '/orderManager', // ---------------智能点餐 ------------------
    component: Layout,
    name: '智能点餐',
    icon: 'setting',
    authority: 'orderManager',
    children: [
      {
        path: 'foodType',
        icon: 'category',
        component: _import('order/foodType/index'),
        name: '菜单类型',
        authority: 'foodType'
      },
      {
        path: 'foodIngredients',
        icon: 'category',
        component: _import('order/foodIngredients/index'),
        name: '配料信息',
        authority: 'foodIngredients'
      },
      {
        path: 'foodMenu',
        icon: 'category',
        component: _import('order/foodMenu/index'),
        name: '菜品信息',
        authority: 'foodMenu'
      },
      {
        path: 'foodDaily',
        icon: 'category',
        component: _import('order/foodDaily/index'),
        name: '菜单信息',
        authority: 'foodDaily'
      },
      {
        path: 'foodMenuReport',
        icon: 'category',
        component: _import('order/foodReport/foodMenu'),
        name: '菜品统计',
        authority: 'foodMenuReport'
      },
      {
        path: 'foodUserReport',
        icon: 'category',
        component: _import('order/foodReport/foodUser'),
        name: '人员统计',
        authority: 'foodUserReport'
      },
      {
        path: 'foodIngredientsReport',
        icon: 'category',
        component: _import('order/foodReport/foodIngredients'),
        name: '配料统计',
        authority: 'foodIngredientsReport'
      },
      {
        path: 'foodWishReport',
        icon: 'category',
        component: _import('order/foodReport/foodWish'),
        name: '心愿菜品统计',
        authority: 'foodWishReport'
      },
      {
        path: 'foodEquipment',
        icon: 'category',
        component: _import('order/foodType/foodEquipment'),
        name: '设备管理',
        authority: 'foodEquipment'
      }
    ]
  },
  {
    path: '/ksglManager', //  ---------------考试管理 ------------------
    component: Layout,
    name: '考试管理',
    icon: 'setting',
    authority: 'ksglManager',
    children: [
      {
        path: 'kswh',
        icon: 'setting',
        component: _import('ksgl/kswh/index'),
        name: '考试维护',
        authority: 'kswh'
      },
      {
        path: 'courseItem',
        icon: 'setting',
        component: _import('ksgl/courseItem/index'),
        name: '分项维护',
        authority: 'courseItem'
      },
      {
        path: 'djsz',
        icon: 'setting',
        component: _import('ksgl/djsz/index'),
        name: '等级设置',
        authority: 'djsz'
      },
      {
        path: 'kslx',
        icon: 'setting',
        component: _import('ksgl/kslx/index'),
        name: '考试类型',
        authority: 'kslx'
      },
      {
        path: 'cjgl',
        icon: 'category',
        component: _import('ksgl/cjgl/index'),
        name: '成绩管理',
        authority: 'cjgl'
      },
      {
        path: 'cjfs',
        icon: 'category',
        component: _import('ksgl/cjfs/index'),
        name: '成绩复审',
        authority: 'cjfs'
      },
      {
        path: 'cjcx',
        icon: 'category',
        component: _import('ksgl/cjcx/index'),
        name: '成绩查询',
        authority: 'cjcx'
      },
      {
        path: 'cjxgrz',
        icon: 'category',
        component: _import('ksgl/cjxgrz/index'),
        name: '成绩修改日志',
        authority: 'cjxgrz'
      },
      {
        path: 'cjfb',
        icon: 'category',
        component: _import('ksgl/cjfb/index'),
        name: '成绩发布',
        authority: 'cjfb'
      },
      {
        path: 'cjtj',
        icon: 'category',
        component: _import('ksgl/cjtj/index'),
        name: '成绩统计',
        authority: 'cjtj'
      },
      {
        path: 'mcdtj',
        icon: 'category',
        component: _import('ksgl/mcdtj/index'),
        name: '名次段统计',
        authority: 'mcdtj'
      }
    ]
  },
  {
    path: '/tdkManager', // ---------------考试管理 ------------------
    component: Layout,
    name: '调代课管理',
    icon: 'setting',
    authority: 'tdkManager',
    children: [
      {
        path: 'dkwh',
        icon: 'category',
        component: _import('tdk/dkwh/index'),
        name: '代课管理',
        authority: 'dkwh'
      },
      {
        path: 'dktj',
        icon: 'category',
        component: _import('tdk/dktj/index'),
        name: '代课统计',
        authority: 'dktj'
      },
      {
        path: 'notice',
        icon: 'category',
        component: _import('tdk/notice/index'),
        name: '通知单维护',
        authority: 'notice'
      },
      {
        path: 'dkkb',
        icon: 'category',
        component: _import('tdk/dkkb/index'),
        name: '我的课表',
        authority: 'dkkb'
      },
      {
        path: 'tkwh',
        icon: 'category',
        component: _import('tdk/tkwh/index'),
        name: '调课管理',
        authority: 'tkwh'
      },
      {
        path: '/dkdetail',
        icon: 'category',
        component: _import('tdk/dkwh/dkdetail'),
        name: '代课维护'
      },
      {
        path: '/addJs',
        icon: 'category',
        component: _import('tdk/tkwh/addJs'),
        name: '调课申请'
      },
      {
        path: '/addJw',
        icon: 'category',
        component: _import('tdk/tkwh/addJw'),
        name: '调课申请'
      }
    ]
  },
  {
    path: '/testManager', // ------------阅读考级 考试管理---------------
    component: Layout,
    icon: 'setting',
    name: '考试管理',
    authority: 'testManager',
    children: [
      {
        path: 'bookManager',
        component: _import('readgrade/testManager/bookManager/index'),
        name: '书目管理',
        authority: 'testManager'
      },
      {
        path: 'intoBook',
        component: _import('readgrade/testManager/bookManager/intoBook/index'),
        name: '书目导入',
        authority: 'testManager'
      },
      {
        path: 'textBook',
        component: _import(
          'readgrade/testManager/bookManager/intoBook/textBook/index'
        ),
        name: '查看题目',
        authority: 'testManager'
      },
      {
        path: 'questionManager',
        component: _import('readgrade/testManager/questionManager/index'),
        name: '题库管理',
        authority: 'testManager'
      },
      {
        path: 'paperSetting',
        component: _import('readgrade/testManager/paperSetting/index'),
        name: '试卷规范设置',
        redirect: 'paperSetting/paperTable',
        authority: 'testManager',
        children: [
          {
            path: 'echart',
            component: _import(
              'readgrade/testManager/paperSetting/echart/index'
            ),
            name: '试卷规范设置-图表管理',
            authority: 'testManager'
          },
          {
            path: 'paperTable',
            component: _import(
              'readgrade/testManager/paperSetting/paperTable/index'
            ),
            name: '试卷规范设置-表格管理',
            authority: 'testManager'
          }
        ]
      }
    ]
  },
  {
    path: '/readCount', // ------------阅读考级 阅读成果统计---------------
    component: Layout,
    icon: 'setting',
    name: '阅读成果统计',
    authority: 'readCount',
    children: [
      {
        path: 'nj',
        component: _import('readgrade/readCount/nj/index'),
        name: '年级',
        authority: 'readCount'
      },
      {
        path: 'bj',
        component: _import('readgrade/readCount/bj/index'),
        name: '班级',
        authority: 'readCount'
      },
      {
        path: 'student',
        component: _import('readgrade/readCount/student/index'),
        name: '学生',
        authority: 'readCount'
      }
    ]
  },
  {
    name: '阅卷管理',
    path: '/markManagement',
    component: Layout,
    icon: 'setting',
    children: [
      {
        path: 'reading',
        component: _import(
          'projectapp/markManagement/reading/index'
        ),
        name: '阅卷管理',
        authority: 'reading'
      }
    ]
  },
  {
    path: '/examCount', // ------------阅读考级 考试统计---------------
    component: Layout,
    icon: 'setting',
    name: '考试统计',
    authority: 'examCount',
    children: [
      {
        path: 'nj',
        component: _import('readgrade/examCount/nj/index'),
        name: '年级',
        authority: 'examCount'
      },
      {
        path: 'bj',
        component: _import('readgrade/examCount/bj/index'),
        name: '班级',
        authority: 'examCount'
      },
      {
        path: 'student',
        component: _import('readgrade/examCount/student/index'),
        name: '学生',
        authority: 'examCount'
      }
    ]
  },
  {
    path: '/webSetting', // ------------阅读考级 网站设置---------------
    component: Layout,
    icon: 'setting',
    name: '网站设置',
    authority: 'webSetting',
    children: [
      {
        path: 'systemSet',
        component: _import('readgrade/webSetting/systemSet/index'),
        name: '系统设置',
        authority: 'webSetting'
      },
      {
        path: 'growthValueSet',
        component: _import('readgrade/webSetting/growthValueSet/index'),
        name: '成长值系统设置',
        authority: 'webSetting'
      }
    ]
  },

  {
    path: '/publicLibManager', // ------------阅读考级 公共库管理---------------
    component: Layout,
    icon: 'setting',
    name: '公共库管理',
    authority: 'publicLibManager',
    children: [
      {
        path: 'bookTitleCheck',
        component: _import('readgrade/publicLibManager/bookTitleCheck/index'),
        name: '书目题目审核',
        authority: 'publicLibManager'
      },
      {
        path: 'bookTitleManager',
        component: _import('readgrade/publicLibManager/bookTitleManager/index'),
        name: '书目题目管理',
        authority: 'publicLibManager'
      },
      {
        path: 'questionCheck',
        component: _import('readgrade/publicLibManager/questionCheck/index'),
        name: '题目审核',
        authority: 'publicLibManager'
      },
      {
        path: 'questionManagement',
        component: _import(
          'readgrade/publicLibManager/questionManagement/index'
        ),
        name: '题目管理',
        authority: 'publicLibManager'
      }
    ]
  },
  {
    path: '/newStudent',
    component: Layout,
    name: '新生管理',
    icon: 'setting',
    authority: 'newStudent',
    children: [
      {
        path: 'innewstudent',
        component: _import('newstudent/innewstudent/index'),
        name: '分班系统',
        authority: 'innewstudent'
      },
      {
        path: 'groupresult',
        component: _import('newstudent/groupresult/index'),
        name: '分班结果',
        authority: 'autogroup'
      },
      {
        path: 'groupconfirm',
        component: _import('newstudent/groupconfirm/index'),
        name: '分班确认',
        authority: 'autogroup'
      },
      {
        path: 'autogroup',
        component: _import('newstudent/autogroup/index'),
        name: '自动分班',
        authority: 'autogroup'
      },
      {
        path: 'grouphistory',
        component: _import('newstudent/grouphistory/index'),
        name: '分班记录',
        authority: 'autogroup'
      }
    ]
  },

  {
    path: '/maintenance',
    component: Layout,
    name: '学籍管理',
    icon: 'setting',
    authority: 'maintenance',
    children: [
      {
        path: 'graduateEnquiries',
        component: _import('maintenance/graduateEnquiries/index'),
        name: '毕业生查询',
        authority: 'graduateEnquiries'
      }
    ]
  },

  {
    name: '激励卡',
    path: '/incentiveCard',
    component: Layout,
    icon: 'setting',
    authority: 'incentiveCard',
    children: [
      {
        path: 'cardMaintenance',
        component: _import('projectapp/incentiveCard/cardMaintenance/index'),
        name: '卡片维护',
        authority: 'cardMaintenance'
      },
      {
        path: 'cardMaintenanceDetail',
        component: _import('projectapp/incentiveCard/cardMaintenance/detail'),
        name: '卡片详情',
        authority: 'cardMaintenance'
      },
      {
        path: 'cardMaintenanceAdd',
        component: _import('projectapp/incentiveCard/cardMaintenance/add'),
        name: '卡片新增',
        authority: 'cardMaintenance'
      },
      {
        path: 'sendCard',
        component: _import('projectapp/incentiveCard/sendCard/index'),
        name: '发卡设置',
        authority: 'sendCard'
      },
      {
        path: 'sendCardxq',
        component: _import('projectapp/incentiveCard/sendCard/xq'),
        name: '发卡详情',
        authority: 'sendCard'
      },
      {
        path: 'getcard',
        component: _import('projectapp/incentiveCard/getcard/index'),
        name: '获卡查询',
        authority: 'getcard'
      },
      {
        path: 'getCardxq',
        component: _import('projectapp/incentiveCard/getcard/xq'),
        name: '获卡详情',
        authority: 'sendCard'
      },
      {
        path: 'sbtj',
        component: _import('projectapp/incentiveCard/ranking/index'),
        name: '上榜统计',
        authority: 'sbtj'
      },
      // {
      //   path: 'test',
      //   component: _import('projectapp/incentiveCard/test/index'),
      //   name: '测试',
      //   authority: 'sendCard'
      // },
      {
        path: 'qxsz',
        component: _import('projectapp/incentiveCard/qxsz/index'),
        name: '权限设置',
        authority: 'qxsz'
      }
    ]
  },
  


  /**
   * 2019-06-03 绿城亲亲报告单 新需求
   */
  {
    path: '/greentownReport',
    component: Layout,
    name: '绿城亲亲报告单',
    authority: 'greentownReport',
    children: [
      {
        path: 'setReport',
        component: _import('project/greentownReport/setReport/index'),
        name: '报告单设置',
        authority: 'setReport'
      },
      {
        path: 'summary',
        component: _import('project/greentownReport/setReport/inputSummary'),
        name: '报告单设置',
        authority: 'setReport'
      },
      {
        path: 'report',
        component: _import('project/greentownReport/setReport/reportIndex'),
        name: '报告单详情',
        authority: 'setReport'
      }
      // {
      //   path: 'export',
      //   component: _import('project/greentownReport/setReport/InformationExport'),
      //   name: '导出报告单',
      //   authority: 'setReport'
      // },
      // {
      //   path: 'testpage',
      //   component: _import('project/greentownReport/setReport/testpage'),
      //   name: '查看页面组件',
      //   authority: 'setReport'
      // },
    ]
  },

  /**
   * 2020-03-13 卡片管理 新功能
   */
  // {
  //   path:'/cardManage',
  //   component:Layout,
  //   name:'卡片管理',
  //   authority:'cardManage',
  //   children: [
  //     // {
  //     //   path: '/',
  //     //   redirect:'/cardManage/homepage'
  //     // },
  //     {
  //       path: 'homepage',
  //       component: _import('projectapp/cardManage/index'),
  //       name: '卡片管理',
  //       authority: 'homepage'
  //     },
  //     {
  //       path: 'cardnum',
  //       component: _import('projectapp/cardManage/cardNum'),
  //       name: '卡号管理',
  //       authority: 'cardnum'
  //     },
  //   ]
  // },


  ...smartLock, ...smartWage, ...testRouter, ...quality, ...classCard

];
