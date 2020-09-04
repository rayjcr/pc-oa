import Layout from '../../views/layout/Layout';
const _import = require('../_import_' + process.env.NODE_ENV);
const smartWage = [
  {
    name: '工资管理',
    path: '/salaryManager',
    component: Layout,
    icon: 'setting',
    authority: 'salaryManager',
    children: [
      {
        path: 'template',
        component: _import(
            'smart-wage/salary/template/index'
          ),
        name: '工资模板',
        authority: 'template'
      }, {
        path: 'import',
        component: _import(
            'smart-wage/salary/import/index'
          ),
        name: '工资导入',
        authority: 'import'
      },
      {
        path: 'allSerch',
        component: _import(
            'smart-wage/salary/allSerch/index'
          ),
        name: '工资查询',
        authority: 'allSerch'
      }, {
        path: 'ownSerch',
        component: _import(
            'smart-wage/salary/ownSerch/index'
          ),
        name: '工资查询(个人)',
        authority: 'ownSerch'
      }, {
        path: 'statistics',
        component: _import(
            'smart-wage/salary/statistics/index'
          ),
        name: '工资统计',
        authority: 'statistics'
      }
    ]
  }
]
export default smartWage;


