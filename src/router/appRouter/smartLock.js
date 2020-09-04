import Layout from '../../views/layout/Layout';
const _import = require('../_import_' + process.env.NODE_ENV);
const smartLock = [

    
    {
        name: '成绩单查询',
        path: '/cjdcx',
        component: Layout,
        icon: 'setting',
        children: [
            {
                path: 'cjdcx1',
                component: _import(
                  'projectapp/cjdcx/cjdcx1/index'
                ),
                name: '成绩单查询',
                authority: 'cjdcx1'
            }
        ]
    },

    {
        name: '房源管理',
        path: '/buildingManage',
        component: Layout,
        icon: 'setting',
        //authority: 'housingManagement',
        children: [
            {
                path: 'buildingList',
                component: _import(
                  'projectapp/dormitoryManagement/housingManagement/housingList/index'
                ),
                name: '房源列表',
                authority: 'buildingList'
            },
            {
                path: 'accommodationdetails',
                component: _import(
                  'projectapp/dormitoryManagement/housingManagement/accommodationdetails/index'
                ),
                name: '入住详情',
                authority: 'buildingList'
            },
            {
                path: 'addhome',
                component: _import(
                  'projectapp/dormitoryManagement/housingManagement/housingList/addhome'
                ),
                name: '添加房间',
                authority: 'buildingList'
            },
        ]
    },

    {
        name: '房间管理',
        path: '/dormitoryManagement',
        component: Layout,
        icon: 'setting',
        //authority: 'housingManagement',
        children: [
            {
                path: 'homeManagementman',
                component: _import(
                  'projectapp/dormitoryManagement/homeManagement/index'
                ),
                name: '房间管理',
                authority: 'homeManagementman'
            },
            {
                path: 'homeManagementDetail',
                component: _import(
                  'projectapp/dormitoryManagement/homeManagement/detail'
                ),
                name: '房间详情',
                authority: 'homeManagementman'
            },
        ]
    },

    {
        name: '智能设备',
        path: '/smartDevice',
        component: Layout,
        icon: 'setting',
        //authority: 'housingManagement',
        children: [
            {
                path: 'smartGateway',
                component: _import(
                'projectapp/dormitoryManagement/deviceManagement/smartGateway'
                ),
                name: '智能网关',
                authority: 'smartGateway'
            },
            {
                path: 'smartLock',
                component: _import(
                'projectapp/dormitoryManagement/deviceManagement/smartLock'
                ),
                name: '智能锁',
                authority: 'smartLock'
            },
            {
                path: 'voucherManagement',
                component: _import(
                'projectapp/dormitoryManagement/deviceManagement/voucherManagement'
                ),
                name: '凭证管理',
                authority: 'voucherManagement'
            },
            {
                path: 'stateInstruction',
                component: _import(
                'projectapp/dormitoryManagement/deviceManagement/stateInstruction'
                ),
                name: '指令下发状态',
                authority: 'stateInstruction'
            },
        ]
    },

    // {
    //     name: '智能设备',
    //     path: '/smartDevice',
    //     component: Layout,
    //     icon: 'setting',
    //     //authority: 'housingManagement',
    //     children: [
    //         {
    //             path: 'smartGateway',
    //             component: _import(
    //             'projectapp/dormitoryManagement/deviceManagement/smartGateway'
    //             ),
    //             name: '智能网关',
    //             authority: 'smartGateway'
    //         },
    //         {
    //             path: 'smartLock',
    //             component: _import(
    //             'projectapp/dormitoryManagement/deviceManagement/smartLock'
    //             ),
    //             name: '智能锁',
    //             authority: 'smartLock'
    //         },
    //         {
    //             path: 'voucherManagement',
    //             component: _import(
    //             'projectapp/dormitoryManagement/deviceManagement/voucherManagement'
    //             ),
    //             name: '凭证管理',
    //             authority: 'voucherManagement'
    //         },
    //         {
    //             path: 'stateInstruction',
    //             component: _import(
    //             'projectapp/dormitoryManagement/deviceManagement/stateInstruction'
    //             ),
    //             name: '指令下发状态',
    //             authority: 'stateInstruction'
    //         },
    //     ]
    // },
    {
        name: '考勤管理',
        path: '/attendanceManagement',
        component: Layout,
        icon: 'setting',
        //authority: 'housingManagement',
        children: [
            {
                path: 'attendanceMonitoring',
                component: _import(
                'projectapp/dormitoryManagement/attendanceManagement/attendanceMonitoring/index'
                ),
                name: '考勤监控',
                authority: 'attendanceMonitoring'
            },
            {
                path: 'attendanceRecord',
                component: _import(
                'projectapp/dormitoryManagement/attendanceManagement/attendanceRecord/index'
                ),
                name: '考勤记录',
                authority: 'attendanceRecord'
            },
            {
                path: 'attendanceSettings',
                component: _import(
                'projectapp/dormitoryManagement/attendanceManagement/attendanceSettings/index'
                ),
                name: '考勤设置',
                authority: 'attendanceSettings'
            }
        ]
    },


    {
        name: '人员管理',
        path: '/attendanceManagement',
        component: Layout,
        icon: 'setting',
        authority: 'attendanceManagement',
            children: [
                {
                    path: 'memberManagementLidst',
                    component: _import('projectapp/dormitoryManagement/memberManagementLidst/index'),
                    name: '人员信息',
                    authority: 'attendanceManagement'
                },
                {
                    path: 'assignmentList',
                    component: _import('projectapp/dormitoryManagement/memberManagementLidst/assignmentList/index'),
                    name: '分配列表',
                    authority: 'attendanceManagement'
                },
                {
                    path: 'assigningPersonnel',
                    component: _import('projectapp/dormitoryManagement/memberManagementLidst/assigningPersonnel/index'),
                    name: '分配人员',
                    authority: 'attendanceManagement',
                }
            ]
    },

    {
        name: '设备状态监控',
        path: '/equipmentMonitoring',
        component: Layout,
        icon: 'setting',
        authority: 'equipmentMonitoring',
        children: [
            {
            path: 'securityMonitori',
            component: _import(
                'projectapp/dormitoryManagement/equipmentMonitoring/securityMonitori/index'
            ),
            name: '异常监控',
            authority: 'securityMonitori'
            },
            {
            path: 'unlockRecord',
            component: _import(
                'projectapp/dormitoryManagement/equipmentMonitoring/unlockRecord/index'
            ),
            name: '开锁记录',
            authority: 'unlockRecord'
            }
        ]
    },

    {
        name: '日志记录',
        path: '/logRecord',
        component: Layout,
        icon: 'setting',
        authority: 'logRecord',
        children: [
          {
            path: 'operationLog',
            component: _import(
              'projectapp/dormitoryManagement/logRecord/index'
            ),
            name: '操作日志',
            authority: 'operationLog'
          },
          
        ]
    },
    {
        name: '系统配置',
        path: '/systemConfiguration',
        component: Layout,
        icon: 'setting',
        authority: 'systemConfiguration',
        children: [
          {
            path: 'switchConfiguration',
            component: _import(
              'projectapp/dormitoryManagement/systemConfiguration/index'
            ),
            name: '开关配置',
            authority: 'switchConfiguration'
          }
        ]
    },





    // {
    //     name: '房源管理',
    //     path: '/housingManagement',
    //     component: Layout,
    //     icon: 'setting',
    //     //authority: 'housingManagement',
    //     children: [
    //       {
    //         path: 'assigningPersonnel',
    //         icon: 'category',
    //         component: _import('projectapp/dormitoryManagement/housingManagement/assigningPersonnel/index'),
    //         name: '分配人员',
    //         // authority: 'assigningPersonnel',
    //       }
    //     ]
    //   },



    //   {
    //     name: '智能锁管理',
    //     path: '/dormitoryManagement',
    //     component: Layout,
    //     icon: 'setting',
    //     authority: 'dormitoryManagement',
    //     children: [
    //     //   {
    //     //         path: 'buildingManage',
    //     //         component: _import(
    //     //           'projectapp/dormitoryManagement/housingManagement/housingList/index'
    //     //         ),
    //     //         name: '房源列表',
    //     //         authority: 'housingList'
    //     //   },
    //     //   {
    //     //     path: 'addhome',
    //     //     component: _import(
    //     //       'projectapp/dormitoryManagement/housingManagement/housingList/addhome'
    //     //     ),
    //     //     name: '添加房间',
    //     //     authority: 'housingList'
    //     //   },





    //     //   {
    //     //     path: 'housingList',
    //     //     component: _import(
    //     //       'projectapp/dormitoryManagement/housingManagement/housingList/index'
    //     //     ),
    //     //     name: '房源列表',
    //     //     authority: 'housingList'
    //     //   },


    //     //   {
    //     //     path: 'homeManagement',
    //     //     component: _import(
    //     //       'projectapp/dormitoryManagement/homeManagement/index'
    //     //     ),
    //     //     name: '房间管理',
    //     //     authority: 'housingList'
    //     //   },
    //     //   {
    //     //     path: 'homeManagementDetail',
    //     //     component: _import(
    //     //       'projectapp/dormitoryManagement/homeManagement/detail'
    //     //     ),
    //     //     name: '房间详情',
    //     //     authority: 'housingList'
    //     //   },
    //       {
    //         path: 'memberManagementLidst',
    //         component: _import(
    //           'projectapp/dormitoryManagement/memberManagementLidst/index'
    //         ),
    //         name: '人员管理',
    //         authority: 'memberManagementLidst'
    //       }
    //     ]
    //   },
      // {
      //   name: '智能设备',
      //   path: '/smartDevice',
      //   component: Layout,
      //   icon: 'setting',
      //   authority: 'smartDevice',
      //   children: [

      //     {
      //       path: 'smartLock',
      //       component: _import(
      //         'projectapp/dormitoryManagement/deviceManagement/smartLock'
      //       ),
      //       name: '智能锁',
      //       authority: 'smartLock'
      //     },
      //     {
      //       path: 'smartGateway',
      //       component: _import(
      //         'projectapp/dormitoryManagement/deviceManagement/smartGateway'
      //       ),
      //       name: '智能网关',
      //       authority: 'smartGateway'
      //     },
      //     {
      //       path: 'voucherManagement',
      //       component: _import(
      //         'projectapp/dormitoryManagement/deviceManagement/voucherManagement'
      //       ),
      //       name: '凭证管理',
      //       authority: 'voucherManagement'
      //     },
      //     {
      //       path: 'stateInstruction',
      //       component: _import(
      //         'projectapp/dormitoryManagement/deviceManagement/stateInstruction'
      //       ),
      //       name: '指令下发状态',
      //       authority: 'stateInstruction'
      //     }
      //   ]
      // },
      // {
      //   name: '考勤管理',
      //   path: '/attendanceManagement',
      //   component: Layout,
      //   icon: 'setting',
      //   authority: 'attendanceManagement',
      //   children: [
      //     {
      //       path: 'attendanceMonitoring',
      //       component: _import(
      //         'projectapp/dormitoryManagement/attendanceManagement/attendanceMonitoring/index'
      //       ),
      //       name: '考勤监控',
      //       authority: 'attendanceMonitoring'
      //     },
      //     {
      //       path: 'attendanceRecord',
      //       component: _import(
      //         'projectapp/dormitoryManagement/attendanceManagement/attendanceRecord/index'
      //       ),
      //       name: '考勤记录',
      //       authority: 'attendanceRecord'
      //     },
      //     {
      //       path: 'attendanceSettings',
      //       component: _import(
      //         'projectapp/dormitoryManagement/attendanceManagement/attendanceSettings/index'
      //       ),
      //       name: '考勤设置',
      //       authority: 'attendanceSettings'
      //     }
      //   ]
      // },
      // {
      //   name: '设备状态监控',
      //   path: '/equipmentMonitoring',
      //   component: Layout,
      //   icon: 'setting',
      //   authority: 'equipmentMonitoring',
      //   children: [
      //     {
      //       path: 'securityMonitori',
      //       component: _import(
      //         'projectapp/dormitoryManagement/equipmentMonitoring/securityMonitori/index'
      //       ),
      //       name: '异常监控',
      //       authority: 'securityMonitori'
      //     },
      //     {
      //       path: 'unlockRecord',
      //       component: _import(
      //         'projectapp/dormitoryManagement/equipmentMonitoring/unlockRecord/index'
      //       ),
      //       name: '开锁记录',
      //       authority: 'unlockRecord'
      //     }
      //   ]
      // },
      // {
      //   name: '日志记录',
      //   path: '/logRecord',
      //   component: Layout,
      //   icon: 'setting',
      //   authority: 'logRecord',
      //   children: [
      //     {
      //       path: 'operationLog',
      //       component: _import(
      //         'projectapp/dormitoryManagement/logRecord/index'
      //       ),
      //       name: '操作日志',
      //       authority: 'operationLog'
      //     }
      //   ]
      // }
      // {
      //   name: '智能锁管理',
      //   path: '/dormitoryManagement',
      //   component: Layout,
      //   icon: 'setting',
      //   authority: 'dormitoryManagement',
      //   children: [
      //     {
      //       path: 'housingList',
      //       component: _import(
      //         'projectapp/dormitoryManagement/housingManagement/housingList/index'
      //       ),
      //       name: '房源列表',
      //       authority: 'housingList'
      //     },
      //     {
      //       path: 'accommodationdetails',
      //       component: _import(
      //         'projectapp/dormitoryManagement/housingManagement/accommodationdetails/index'
      //       ),
      //       name: '入住详情',
      //       authority: 'housingList'
      //     },
      //     {
      //       path: 'addhome',
      //       component: _import(
      //         'projectapp/dormitoryManagement/housingManagement/housingList/addhome'
      //       ),
      //       name: '添加房间',
      //       authority: 'housingList'
      //     }
      //   ]
      // }

]

export default smartLock;
