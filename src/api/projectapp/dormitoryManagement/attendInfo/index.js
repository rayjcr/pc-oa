import fetch from '@/utils/fetch';
// import '@/mock/dormitoryManagement/index';
const base = '/api/base/' // 基础数据
const domanage = '/api/lock' // 智能锁管理

/** 获取建筑**/
export function getBuildings(obj) {
  return fetch({
    url: `${domanage}/building/getList`,
    method: 'get',
    data: obj
  });
}
/** 获取楼层**/
export function getFloors(obj) {
  return fetch({
    url: `${domanage}/building/getInfo`,
    method: 'get',
    params: obj
  });
}
/** 获取房间**/
export function getRooms(obj) {
  return fetch({
    url: `${domanage}/room/getList`,
    method: 'get',
    params: obj
  });
}
/** 获取房源列表**/
export function getBuildinginfo(obj) {
  return fetch({
    url: `${domanage}/building/getList`,
    method: 'get',
    params: obj
  });
}
/** 获取楼层房间信息**/
export function getRoominfo(obj) {
  var param = {
    schoolCode: obj.schoolCode,
    buildingId: obj.buildingId,
    withFloor: 'true',
    widthRoom: 'true'
  }
  return fetch({
    url: `${domanage}/building/getInfo`,
    method: 'get',
    params: param
  });
}
/** 获取房间和室友信息**/
export function getRoomDetail(obj) {
  return fetch({
    url: `${domanage}/room/getListWithAllot`,
    method: 'get',
    params: obj
  });
}

/** 分页获取考勤记录列表**/
export function attendGetListVOByPage(obj) {
  return fetch({
    url: `${domanage}/attendInfo/getListVOByPage`,
    method: 'get',
    params: obj
  });
}
/** 获取考勤记录列表用来放到图表里 **/
export function attendGetListVo(obj) {
  return fetch({
    url: `${domanage}/attendInfo/getListVO`,
    method: 'get',
    params: obj
  });
}
/** 根据查询获取考勤记录列表**/
export function attendGetListPage(obj) {
  return fetch({
    url: `${domanage}/attendInfo/getList`,
    method: 'get',
    params: obj
  });
}
/** 根据查询获取考勤记录列表**/
export function attendGetCount(obj) {
  return fetch({
    url: `${domanage}/attendInfo/getCount`,
    method: 'get',
    params: obj
  });
}
/** 根据查询获取考勤记录列表**/
export function attendGetMessage(obj) {
  return fetch({
    url: `${domanage}/attendInfo/getAttendMessage`,
    method: 'get',
    params: obj
  });
}
/** 考勤规则列表 **/
export function attendGetListRules(obj) {
  return fetch({
    url: `${domanage}/attendPeriod/listRules`,
    method: 'get',
  });
}
/** 考勤规则添加或修改 **/
export function attendupdateListRules(obj) {
  return fetch({
    url: `${domanage}/attendPeriod/addOrUpdate`,
    method: 'post',
    data: obj
  });
}
export function attendaddListRules(obj) {
  return fetch({
    url: `${domanage}/attendPeriod/addOrUpdate`,
    method: 'post',
    data: obj
  });
}
/** 考勤规则删除 **/
export function attenddeleteListRules(obj) {
  return fetch({
    url: `${domanage}/attendPeriod/delete`,
    method: 'get',
    params: obj
  });
}
/** 考勤规则列表 **/
export function attendExport(obj) {
  return fetch({
    url: `${domanage}/attendInfo/export`,
    method: 'get',
    responseType: 'arraybuffer',
    params: obj,
  });
}
