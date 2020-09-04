import fetch from 'utils/fetch';

/** 保存节数**/
export function saveSection(query) {
  return fetch({
    url: '/api/course/jssz',
    method: 'post',
    data: query
  });
}

/** 删除节数**/
export function deleteSection(query) {
  return fetch({
    url: '/api/course/jssz/remove',
    method: 'delete',
    params: query
  });
}

/** 查询节数**/
export function querySection(query) {
  return fetch({
    url: '/api/course/jssz/selectJsszByRwidXxdm',
    method: 'post',
    params: query
  });
}

/** =========================================================**/

/** 保存节次时间**/
export function saveSectionTiming(query) {
  return fetch({
    url: '/api/course/jcsj/branchadd',
    method: 'post',
    data: query
  });
}

/** 更新节次时间**/
export function updateSectionTiming(query) {
  return fetch({
    url: '/api/course/jcsj/updateJcsj',
    method: 'put',
    data: query
  });
}

/** 保存单个公共节次时间**/
export function saveOneSectionTiming(query) {
  return fetch({
    url: '/api/course/jcsj',
    method: 'post',
    data: query
  });
}

/** 删除节次时间**/
export function deleteSectionTiming(query) {
  return fetch({
    url: '/api/course/jcsj/remove',
    method: 'delete',
    data: query
  });
}

/** 根据节次位置删除节次时间**/
export function deleteSectionTimingByPosition(query) {
  return fetch({
    url: '/api/course/jcsj/removebyjcwz',
    method: 'post',
    data: query
  });
}


/** 查询节次时间**/
export function querySectionTiming(query) {
  return fetch({
    url: '/api/course/jcsj/selectJcsjByRwidXxdm',
    method: 'post',
    params: query
  });
}

/** 查询节次时间设置信息接口**/
export function cxjcsj(query) {
  return fetch({
    url: '/api/course/jcsj/queryJcsjByRwid',
    method: 'get',
    params: query
  });
}
/** =========================================================**/

/** 保存班级不排课**/
export function saveNoClass(query) {
  return fetch({
    url: '/api/course/bjbpk/branchadd',
    method: 'post',
    data: query
  });
}

/** 删除班级不排课**/
export function deleteNoClass(query) {
  return fetch({
    url: '/api/course/bjbpk/remove',
    method: 'delete',
    data: query
  });
}

/** 查询班级不排课**/
export function queryNoClass(query) {
  return fetch({
    url: '/api/course/bjbpk/selectBjbpkszByRwidXxdm',
    method: 'post',
    data: query
  });
}

/** 检测**/
export function checkJxjh(query) {
  return fetch({
    url: '/api/course/jssz/checkJxjh',
    method: 'post',
    data: query
  });
}

export function initJxjh(query) {
  return fetch({
    url: '/api/course/jssz/initJxjh',
    method: 'post',
    data: query
  });
}

export function updateJcsjInfo(query) {
  return fetch({
    url: '/api/course/jssz/updateJssjXsInfo',
    method: 'post',
    data: query
  });
}


/** 检测是否设置过规则**/
export function whetherSetUpRules(query) {
  return fetch({
    url: '/api/course/jcsj/whetherSetUpRules',
    method: 'get',
    params: query
  });

}

