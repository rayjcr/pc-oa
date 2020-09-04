import Layout from '../../views/layout/Layout';
const _import = require('../_import_' + process.env.NODE_ENV);
const testRouter = [
  {
    name: '报告单测试',
    path: '/test',
    component: Layout,
    icon: 'setting',
    children: [
      {
        path: 'edit',
        component: _import(
            'projectapp/testNewBgd/edit'
          ),
        name: '测试报告单编辑器',
      }
    ]
  }
]
export default testRouter;


