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

//--------------------------------智能网关API接口--------------------
/** 获取分页列表**/
export function gatewayGetList(obj) {
  return fetch({
    url: `${domanage}/gateway/listPage`,
    method: 'post',
    data: obj
  });
}
/** 设备入网 **/
export function connectGateway(obj) {
  return fetch({
    url: `${domanage}/gateway/connectGateway`,
    method: 'post',
    data: obj
  });
}
/** 添加修改网关 **/
export function addOrUpdateGateway(obj) {
  return fetch({
    url: `${domanage}/gateway/addOrUpdate`,
    method: 'post',
    data: obj
  });
}
//--------------------------------智能锁API接口--------------------
/** 获取分页列表**/
export function lockGetList(obj) {
  return fetch({
    url: `${domanage}/lock/listPage`,
    method: 'post',
    data: obj
  });
}
/** 获取详情**/
export function lockGetDetail(obj) {
  return fetch({
    url: `${domanage}/lock/getDetail`,
    method: 'post',
    data: obj
  });
}
/** 远程开锁**/
export function remoteUnlock(obj) {
  return fetch({
    url: `${domanage}/lock/remoteUnlock`,
    method: 'post',
    params: obj
  });
}
/** 批量远程开锁**/
export function batchUnlock(obj) {
  return fetch({
    url: `${domanage}/lock/batchUnlock`,
    method: 'post',
    data: obj
  });
}
/** 管理员密码开锁**/
export function adminPWDUnlock(obj) {
  return fetch({
    url: `${domanage}/lock/getAdminLockPWD`,
    method: 'post',
    params: obj
  });
}
/** 临时授权码开锁**/
export function tempUnlock(obj) {
  return fetch({
    url: `${domanage}/lock/tempUnlock`,
    method: 'post',
    data: obj
  });
}
//--------------------------------指令下发API接口--------------------
/** 获取分页列表**/
export function directiveGetList(obj) {
  return fetch({
    url: `${domanage}/directiveTask/listPage`,
    method: 'post',
    data: obj
  });
}
/** 指令重发**/
export function directiveResend(obj) {
  return fetch({
    url: `${domanage}/directiveTask/resend`,
    method: 'get',
    params: obj
  });
}
//--------------------------------凭证管理API接口--------------------
/** 获取分页列表**/
export function tokenGetList(obj) {
  return fetch({
    url: `${domanage}/token/listPage`,
    method: 'get',
    params: obj
  });
}
/** 获取部门人员信息**/
export function getJzgjbsj(obj) {
  return fetch({
    url: `${base}/jcJzgjbsj/page`,
    method: 'get',
    params: obj
  });
}
/** 获取班级学生信息**/
export function getXsjbsj(obj) {
  return fetch({
    url: `${base}/jcXsjbsj/page`,
    method: 'get',
    params: obj
  });
}
/** 绑定用户卡号**/
export function setCard(obj) {
  return fetch({
    url: `${domanage}/token/setUserCard`,
    method: 'get',
    params: obj
  });
}
/** 设置用户指纹**/
export function setFingerprint(obj) {
  return fetch({
    url: `${domanage}/token/setUserFingerprint`,
    method: 'post',
    params: obj
  });
}
/** 设置用户密码**/
export function setPassword(obj) {
  return fetch({
    url: `${domanage}/token/setUserPassword`,
    method: 'get',
    params: obj
  });
}
/** 导入数据**/
export function uploadUserTokens(obj,file) {
  return fetch({
    url: `${domanage}/token/uploadUserTokens`,
    method: 'post',
    params: obj,
    data: file
  });
}
/** 下载用户模板**/
export function downLoadTemplate(obj) {
  return fetch({
    url: `${domanage}/token/downLoadTemplate`,
    method: 'get',
    responseType: 'arraybuffer',
    params: obj,
  });
}
/** 获取用户凭证**/
export function getlistTokens(obj) {
  return fetch({
    url: `${domanage}/token/listTokens`,
    method: 'get',
    params: obj
  });
}

/** 打开指纹采集设备 **/
export function openusb(obj) {
  return fetch({
    url: `http://localhost:8918/syno/api/usb`,
    method: 'post',
  });
}
/** 关闭指纹采集设备 **/
export function closeusb(obj) {
  return fetch({
    url: `http://localhost:8918/syno/api/close`,
    method: 'post',
  });
}

/** 采集指纹 **/
export function getfingerprint(obj) {
  return fetch({
    url: `http://localhost:8918/syno/api/template/group/base64encoder`,
    method: 'get',
  });
}