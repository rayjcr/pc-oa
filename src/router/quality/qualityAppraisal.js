import Layout from '../../views/layout/Layout';
import AppMain from '../../views/layout/AppMain';
const _import = require('../_import_' + process.env.NODE_ENV);
const quality = [
  {
    name: '综合素质评价',
    path: '/qualityAppraisal',
    component: Layout,
    icon: 'setting',
    children: [
      {
        path: 'situation',
        component: _import(
            'projectapp/qualityAppraisal/situation/index'
          ),
        name: '概况',
      },{
        path: 'weekset',
        component: _import(
            'projectapp/qualityAppraisal/weekset/index'
          ),
        name: '值周维护',
      },{
        path: 'dimension',
        component: _import(
            'projectapp/qualityAppraisal/dimension/index'
          ),
        name: '评价维度设置',
      },{
        path: 'levelSetting',
        component: _import(
            'projectapp/qualityAppraisal/levelSetting/index'
          ),
        name: '勋章等级设置',
      },{
        path: 'appraisalSetting',
        component: _import(
            'projectapp/qualityAppraisal/appraisalSetting/index'
          ),
        name: '评价项设置',
      },{
        path: 'collectSetting',
        component: _import(
            'projectapp/qualityAppraisal/collectSetting/index'
          ),
        name: '采集规则设置',
      },{
        path: 'teacherAppraisal',
        component: _import(
            'projectapp/qualityAppraisal/teacherAppraisal/index'
          ),
        name: '评价记录',
      },{
        path: 'mallManagement',
        component: _import(
            'projectapp/qualityAppraisal/mallManagement/index'
          ),
        name: '商场管理',
      },{
        path: 'appraisalReview',
        component: _import(
            'projectapp/qualityAppraisal/appraisalReview/index'
          ),
        name: '评价审核',
      },{
        path: 'statistics',
        name: '统计',
        component: AppMain,
        children:[{
          path: 'statisticsIndex',
          component: _import(
            'projectapp/qualityAppraisal/statistics/index'
          ),
          name: '统计信息',
        },{
          path: 'setting',
          component: _import(
            'projectapp/qualityAppraisal/statistics/setting'
          ),
          name: '统计设置',
        },{
          path: 'classDetail',
          component: _import(
            'projectapp/qualityAppraisal/statistics/classDetail'
          ),
          name: '班级统计详情',
        }
        ],
        
      },{
        path: 'qrcodeExchange',
        component: _import(
            'projectapp/qualityAppraisal/QRcodeExchange/index'
          ),
        name: '二维码兑换分数/勋章',
      },{
        path: 'eventRegistration',
        component: _import(
            'projectapp/qualityAppraisal/signUp/index'
          ),
        name: '活动报名',
      },{
        path: 'configure',
        component: _import(
            'projectapp/qualityAppraisal/configure/index'
          ),
        name: '全局配置',
      },{
        path: 'teamMaintenance',
        component: _import(
            'projectapp/qualityAppraisal/team/index'
          ),
        name: '团体设置',
      },{
        path: 'typeMaintenance',
        component: _import(
            'projectapp/qualityAppraisal/typeMaintenance/index'
          ),
        name: '类型维护',
      },{
        path: 'customRoles',
        component: _import(
            'projectapp/qualityAppraisal/customRoles/index'
          ),
        name: '自定义角色',
      },
      {
        path: 'operationLog',
        component: _import(
          'projectapp/qualityAppraisal/operationLog/index'
        ),
        name: '操作日志',
      },
      {
        path: 'reportImport',
        component: _import(
          'projectapp/qualityAppraisal/reportImport/index'
        ),
        name: '报告单导入',
      },{
        path: 'subtask',
        name: '评价项设置',   
        component:  _import(
          'projectapp/qualityAppraisal/appraisalSetting/model'
        ),
        children: [{
          path: 'management',
          component: _import(
              'projectapp/qualityAppraisal/appraisalSetting/subtaskManagement'
            ),
          alias: '/qualityAppraisal/appraisalSetting/subtaskManagement', 
          name: '子任务列表' 
        },{
          path: 'statistics',
          component: _import(
              'projectapp/qualityAppraisal/appraisalSetting/statistics'
            ),
          alias: '/qualityAppraisal/appraisalSetting/statistics', 
          name: '悬赏任务统计' 
        }]        
      }
    ]
  }, 
  // {
  //   path: '/statistics',
  //   name: '统计',
  //   component: Layout,
  //   children:[{
  //     path: 'index',
  //     component: _import(
  //       'projectapp/qualityAppraisal/statistics/index'
  //     ),
  //     name: '统计信息',
  //   },{
  //     path: 'setting',
  //     component: _import(
  //       'projectapp/qualityAppraisal/statistics/setting'
  //     ),
  //     name: '统计设置',
  //   }
  //   ],
    
  // },
]
export default quality;


