import fetch from 'utils/fetch';

export function queryPageList(query) { // 获取调课信息列表
  return fetch({
    url: '/api/course/tk/queryPageList',
    method: 'post',
    data: query
  });
}

export function deleteDk(query) { // 删除代课信息
  return fetch({
    url: '/api/course/tk/deleteDk',
    method: 'post',
    data: query
  });
}

export function getSfJw(query) { // 是否是教务
  return fetch({
    url: '/api/course/tk/getSfJw',
    method: 'get',
    params: query
  });
}


export function getClassStructure(query) { // 获得课表结构
  return fetch({
    url: '/api/course/dk/getClassStructure',
    method: 'get',
    params: query
  });
}

export function getRecommendedTeacher(query) { // 获得课表结构
  return fetch({
    url: '/api/course/dk/getRecommendedTeacher',
    method: 'post',
    data: query
  });
}


export function validaSplc(query) { // 是否有模板
  return fetch({
    url: '/api/course/dk/validaSplc',
    method: 'get',
    params: query
  });
}

export function checkConflict(query) { // 是否有模板
  return fetch({
    url: '/api/course/dk/checkConflict',
    method: 'post',
    data: query
  });
}

export function save(query) { // 是否有模板
  return fetch({
    url: '/api/course/dk/save',
    method: 'post',
    data: query
  });
}

// 查询审批实例
export function cxspsl(slid) {
  return fetch({
    url: '/api/workflow/spLcsl/cxspsl/' + slid,
    method: 'put'
  });
}

// 查询审批流程信息
export function cxspslxx(slid) {
  return fetch({
    url: '/api/workflow/spLcsl/spslxx/' + slid,
    method: 'get'
  });
}

// 处理实例步骤
export function clslbz(query) {
  return fetch({
    url: '/api/workflow/spSlbz/clspbz',
    method: 'post',
    data: query
  });
}
