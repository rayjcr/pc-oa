import fetch from '@/utils/fetch';
// import '@/mock/dormitoryManagement/index';
const base = '/api/base/' // 基础数据
const domanage = '/api/lock' // 智能锁管理

/** 获取操作日志列表**/
export function logGetListPage(obj) {
  return fetch({
    url: `${domanage}/log/listPage`,
    method: 'post',
    data: obj
  });
}
/** 获取学校全局配置 **/
export function getConfig(obj) {
  return fetch({
    url: `${domanage}/configuration/getConfig`,
    method: 'get',
    data: obj
  });
}
/** 保存学校全局配置 **/
export function saveConfig(obj) {
  return fetch({
    url: `${domanage}/configuration/saveConfig`,
    method: 'post',
    data: obj
  });
}