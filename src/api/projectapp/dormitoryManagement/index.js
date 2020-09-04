import fetch from '@/utils/fetch';
import qs from 'qs';

const base = '/api/base/'; // 基础数据
const domanage = '/api/lock'; // 寝室管理
const baseadmin = '/api/admin';
/** 获取房源列表**/
export function buildingGetList(obj) {
  return fetch({
    url: `${domanage}/building/getListPage`,
    method: 'get',
    params: obj
  });
}

/** 获取房源列表没分页**/
export function buildingGetListNoPage(obj) {
  return fetch({
    url: `${domanage}/building/getList`,
    method: 'get',
    params: obj
  });
}

/** 获取房源列表**/
export function buildingDel(obj) {
  return fetch({
    url: `${domanage}/building/delete`,
    method: 'get',
    params: obj
  });
}

/** 更新楼层名称**/
export function updateFloorName(obj) {
  return fetch({
    url: `${domanage}/floor/updateFloor`,
    method: 'post',
    data: qs.stringify(obj)
  });
}

/**  删除房间**/
export function deletehome(params) {
  return fetch({
    url: `${domanage}/room/delete`,
    method: 'get',
    params
    // data: qs.stringify(obj)
  });
}

/** 获取房源信息**/
export function buildingGetInformation(obj) {
  return fetch({
    url: `${domanage}/building/getInfo`,
    method: 'get',
    params: obj
  });
}

/** 房间人员列表**/
export function getlistWithallot(obj) {
  return fetch({
    url: `${domanage}/room/getListWithAllot`,
    method: 'get',
    params: obj
  });
}

/** 获取考勤记录统计**/
export function sheetsStatistics(obj) {
  return fetch({
    url: `${domanage}/room/getCount`,
    method: 'get',
    params: obj
  });
}

/** 获取房间信息**/
export function homeItemInfo(params) {
  return fetch({
    url: `${domanage}/room/getRoomDetail`,
    method: 'get',
    params
  });
}

/** 获取房间列表分页**/
export function homeGetInformation(params) {
  return fetch({
    url: `${domanage}/room/getListPage`,
    method: 'get',
    params
  });
}

/** 获取房间列表**/
export function homeGetInformationNoPage(obj) {
  return fetch({
    url: `${domanage}/room/getList`,
    method: 'get',
    data: obj
  });
}

/** 添加或修改房间信息**/
export function addmodihome(obj) {
  return fetch({
    url: `${domanage}/room/addUpdate`,
    method: 'post',
    data: qs.stringify(obj)
  });
}

/** 智能锁-管理员密码**/
export function administratorSec(obj) {
  return fetch({
    url: `${domanage}/lock/getAdminLockPWD`,
    method: 'post',
    data: qs.stringify(obj)
  });
}

/** 开锁记录分页列表**/
export function unlockRecord(data) {
  return fetch({
    url: `${domanage}/unlockRecord/listPage`,
    method: 'post',
    data
  });
}

/** 智能锁-远程开锁**/
export function remoteUnlock(obj) {
  return fetch({
    url: `${domanage}/lock/remoteUnlock`,
    method: 'post',
    data: qs.stringify(obj)
  });
}

/** 智能锁-临时授权码**/
export function tempUnlock(data) {
  return fetch({
    url: `${domanage}/lock/tempUnlock`,
    method: 'post',
    data
  });
}

/** 添加或修改房源信息**/
export function buildingAddUpdate(obj) {
  return fetch({
    url: `${domanage}/building/addUpdate`,
    method: 'post',
    data: obj
  });
}

/** 获取教师列表**/
export function teacherList(query) {
  return fetch({
    url: `${domanage}/building/getTeacherManageList?schoolCode=${
      query.schoolCode
    }`,
    method: 'get',
    data: query
  });
}

// ========================================

/** 查询卡片列表**/
export function findcardlist(obj) {
  return fetch({
    url: 'jlkglkpxx/list',
    method: 'post',
    data: obj
  });
}

/** 获取所有年级**/
export function allnj(query) {
  return fetch({
    url: `jcNjsjlx/selectNjList?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 修改排课任务信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/course/kswh/' + id,
    method: 'put',
    data: query
  });
}

/** 删除排课任务信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/course/kswh/' + id,
    method: 'delete'
  });
}



/**
 * 2019-04-24 RayJ 新增接口
 */

  /** 根据学号查询学生基础信息 */
  export function getStudentById(obj) {
    return fetch({
      url: `${base}jcXsjbsj/getXsinfoByXhs`,
      method: 'post',
      params: obj
    });
  }

/** 批量导入学生 **/
// export function importPersonnel(obj) {
//   return fetch({
//     url: `${domanage}/allotInfo/import`,
//     method: 'post',
//     data: obj
//   });
// }



/** 下载批量导入学生模版 **/
export function downLoadTemplate() {
  return fetch({
    url: `${domanage}/allotInfo/downLoadTemplate`,
    method: 'get',
    responseType: 'arraybuffer'
  });
}

/** 智能锁-房间远程开锁 **/
export function roomRemoteUnlock(params) {
  return fetch({
    url: `${domanage}/room/remoteUnlock`,
    method: 'post',
    params
  });
}

/** 获取所有All分配方案List **/
export function getAllPlanList() {
  return fetch({
    url: `${domanage}/allotPlan/list`,
    method: 'post'
  });
}

/** 下载批量房间模版 **/
export function downLoadhomesTemplate(buildingId) {
  return fetch({
    url: `${domanage}/room/downLoadModel?buildingId=${buildingId}`,
    // url: `${domanage}/room/downLoadTemplate`,
    method: 'get',
    responseType: 'arraybuffer'
  });
}
/** 上报房源 **/
export function reportthehousing() {
  return fetch({
    url: `${domanage}/building/uploadToCustom`,
    method: 'get'
  });
}
/** 下载批房间人员 **/
export function downLoadmemberhome() {
  return fetch({
    url: `${domanage}/room/export`,
    method: 'get',
    responseType: 'arraybuffer'
  });
}
/** 获取分配方案List **/
export function getPlanList(obj) {
  return fetch({
    url: `${domanage}/allotPlan/listPage`,
    method: 'post',
    data: obj
  });
}

/** 保存新建分配方案 **/
export function savePlan(obj) {
  return fetch({
    url: `${domanage}/allotPlan/savePlan`,
    method: 'post',
    data: obj
  });
}

/** 更新分配方案 **/
export function updatePlan(obj) {
  return fetch({
    url: `${domanage}/allotPlan/updatePlan`,
    method: 'post',
    data: obj
  });
}

/** 删除分配方案 **/
export function deletePlan(obj) {
  return fetch({
    url: `${domanage}/allotPlan/deletePlan`,
    method: 'get',
    params: obj
  });
}

/** 启用人员分配方案 **/
export function enablePlan(obj) {
  return fetch({
    url: `${domanage}/allotPlan/enablePlan`,
    method: 'get',
    params: obj
  });
}

/** 获取房源列表**/
export function buildingGetListAll(obj) {
  return fetch({
    url: `${domanage}/building/getList`,
    method: 'get',
    params: obj
  });
}

/** 获取房源具体信息**/
export function getBuildingInfo(obj) {
  return fetch({
    url: `${domanage}/building/getInfo`,
    method: 'get',
    params: obj
  });
}

/** 绑定用户卡号**/
export function getUsercard(obj) {
  return fetch({
    url: `${domanage}/token/setUserCard`,
    method: 'get',
    params: obj
  });
}

/** 批量设置用户密码**/
export function gettheusersec(obj) {
  return fetch({
    url: `${domanage}/token/setSamePWD`,
    method: 'get',
    params: obj
  });
}

/** 设置用户密码**/
export function getUsersecrit(obj) {
  return fetch({
    url: `${domanage}/token/setUserPassword`,
    method: 'get',
    params: obj
  });
}

/** 获取房间列表**/
export function getRoomList(obj) {
  return fetch({
    url: `${domanage}/room/getList`,
    method: 'post',
    params: obj
  });
}

/** 获取房间列表(含人员)**/
export function getRoomListWithAllot(obj) {
  return fetch({
    url: `${domanage}/room/getListWithAllot`,
    method: 'get',
    params: obj
  });
}

/** 查询年级下的所有人员**/
export function getStudentListByGrade(obj) {
  return fetch({
    url: `${domanage}/allotInfo/getNoAllotStudent`,
    method: 'post',
    params: obj
  });
}

/** 获取部门下的所有教师**/
export function getTeacherListByGroup(obj) {
  return fetch({
    url: `${baseadmin}/group/` + obj + '/user',
    method: 'get'
  });
}

/** 获取当前学年学期**/
export function getCurrentXnxq(obj) {
  return fetch({
    url: `${base}/jcXndm/getCurrentXnxq`,
    method: 'get',
    params: obj
  });
}

/** 保存新增寝室人员信息**/
export function saveAllotInfo(obj) {
  return fetch({
    url: `${domanage}/allotInfo/saveAllotInfo`,
    method: 'post',
    data: obj
  });
}

/** 调换增寝室人员信息**/
export function saveAllot(obj) {
  console.log(obj);
  return fetch({
    url: `${domanage}/allotInfo/saveAllot`,
    method: 'post',
    data: obj
  });
}
