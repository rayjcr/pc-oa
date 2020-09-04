import Layout from '../../views/layout/Layout';
const _import = require('../_import_' + process.env.NODE_ENV);

const classCard = [
    {
      name: '基础信息设置',
      path: '/classCardBaseSet',
      component: Layout,
      icon: 'setting',
      children: [
        {
          path: 'areaSet',
          component: _import(
              'projectapp/classCard/classCardBaseSet/areaSetting'
            ),
          name: '场地维护',
        },
      ]
    },
    {
        name: '电子班牌设置',
        path: '/classCardSetting',
        component: Layout,
        icon: 'setting',
        children: [
            {
                path: 'timeSet',
                component: _import(
                    'projectapp/classCard/classCardSetting/timeSet'
                ),
                name: '时间设置',
            },
            {
                path: 'appSet',
                component: _import(
                    'projectapp/classCard/classCardSetting/appSet'
                ),
                name: '应用设置',
            },
            {
                path: 'modeSet',
                component: _import(
                    'projectapp/classCard/classCardSetting/modeSet'
                ),
                name: '模式设置',
            },
            {
              path: 'scheduleSet',
              component: _import(
                  'projectapp/classCard/classCardSetting/schedule'
              ),
              name: '课表设置',
          },
        ]
    },
    {
        name: '电子班牌管理',
        path: '/classCard',
        component: Layout,
        icon: 'setting',
        children: [
          {
            path: 'classCardManage',
            component: _import(
                'projectapp/classCard/classCardManage/classCardManage'
              ),
            name: '电子班牌管理',
          },
        ]
      },
  ]
  export default classCard;



























