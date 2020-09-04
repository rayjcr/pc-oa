import Layout from '../../views/layout/Layout';
const _import = require('../_import_' + process.env.NODE_ENV);
const smartOrder = [
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
        name: '菜品类型',
        authority: 'foodType'
      }
    ]
  }
]
export default smartOrder;
