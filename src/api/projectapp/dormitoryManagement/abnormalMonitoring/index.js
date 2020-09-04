import fetch from '@/utils/fetch';
// import '@/mock/dormitoryManagement/index';
const base = '/api/base/' // 基础数据
const domanage = '/api/lock' // 智能锁管理
/** 获取房源信息列表**/
export function deviceGetBuildings(obj) {
  return fetch({
    url: `${domanage}/building/getList`,
    method: 'get',
    params: obj
  });
}
/** 获取记录信息列表**/
export function deviceGetListPage(obj) {
  return fetch({
    url: `${domanage}/deviceMonitor/list`,
    method: 'get',
  });
}
/** 获取建筑详情信息**/
export function deviceGetDetail(obj) {
  return fetch({
    url: `${domanage}/deviceMonitor/detail`,
    method: 'get',
    params: obj
  });
}
/** 获取建筑电量信息**/
export function deviceGetCount(obj) {
  return fetch({
    url: `${domanage}/deviceMonitor/getCount`,
    method: 'get',
    params: obj
  });
}