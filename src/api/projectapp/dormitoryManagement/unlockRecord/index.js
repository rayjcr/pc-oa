import fetch from '@/utils/fetch';
// import '@/mock/dormitoryManagement/index';
const base = '/api/base/' // 基础数据
const domanage = '/api/lock' // 智能锁管理

/** 获取操作日志列表**/
export function unLockGetListPage(obj) {
  return fetch({
    url: `${domanage}/unlockRecord/listPage`,
    method: 'post',
    data: obj
  });
}

/** 导出报表**/
export function unLockExportListPage(obj) {
  return fetch({
    url: `${domanage}/unlockRecord/export`,
    method: 'get',
    params: obj,
    responseType: 'arraybuffer'
  });
}


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