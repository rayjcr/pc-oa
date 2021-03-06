

const getters = {
  sidebar: state => state.app.sidebar,
  sidebarcurMenuId: state => state.app.sidebarcurMenuId,
  sidebarcurMenu: state => state.app.sidebarcurMenu,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  infoxxmc: state => state.user.xxmc,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  elements: state => state.user.elements,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  permissionMenus: state => state.user.permissionMenus,
  dict: state => state.user.dict,
  dict_jg: state => state.user.dict['JY/T 1001－2012'],            // 籍贯
  dict_mz: state => state.user.dict['GB/T_3304'],                  // 民族
  dict_zjmc: state => state.user.dict['JY/T_1001_SFZJLX'],         // 证件名称
  dict_zzmm: state => state.user.dict['GB/T_4762'],                // 政治面貌
  dict_hyzk: state => state.user.dict['GB/T_2261.2'],              // 婚姻状况
  dict_gwzw: state => state.user.dict['JY/T_1001_GWZY'],           // 岗位职业
  dict_jkzk: state => state.user.dict['GB/T_2261.3'],              // 健康状况
  dict_gj: state => state.user.dict['GB/T_2659'],                  // 国籍
  dict_gatqw: state => state.user.dict['JY/T_1001_GATQW'],         // 港澳台侨外
  dict_zjxy: state => state.user.dict['GA_214.12'],                // 宗教信仰
  dict_xuexing: state => state.user.dict['JY/T_1001_XX'],          // 血型
  dict_xslb: state => state.user.dict['GB/T_8563.2'],              // 学生类别
  dict_rxfs: state => state.user.dict['JY/T_1001_RXFS'],           // 入学方式
  dict_jhrgx: state => state.user.dict.qingshuguanxi,           // 监护人关系
  dict_cdyt: state => state.user.dict.CDLX,                     // 场地用途
  dict_xzlx: state => state.user.dict.XZLX,                     // 学制类型

  get_dynamicTagschange:  state => state.user.dynamicTagschange,
  get_qdKcArr:  state => state.project.qdsearchKcArr,
  get_qdNjArr:  state => state.project.qdsearchNjArr,
  set_ranklist: state => state.division.ranklist,
  set_copyranklist: state => state.division.copyranklist,
  set_batch: state => state.division.batch,
  set_schoolCode: state => state.division.schoolCode,


  get_IsInspireCard: state => state.qualityStore.isInspireCard,   //返回是否是激励卡






};
export default getters
