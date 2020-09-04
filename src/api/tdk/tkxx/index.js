import fetch from 'utils/fetch';

export function validaByCourse(query) { // 获得课程信息
  return fetch({
    url: '/api/course/pkrw/validaByCourse',
    method: 'get',
    params: query
  });
}

export function queryPageList(query) { // 获取调课信息列表
  return fetch({
    url: '/api/course/tk/queryPageList',
    method: 'post',
    data: query
  });
}

export function deleteInfo(query) { // 删除代课信息
  return fetch({
    url: '/api/course/tk/deleteInfo',
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

export function validaSplc(query) { // 是否有模板
  return fetch({
    url: '/api/course/tk/validateLcmb',
    method: 'get',
    params: query
  });
}

export function getDataInfo(query) { // 调课详情
  return fetch({
    url: '/api/course/tk/' + query,
    method: 'get'
  });
}

export function getRelateData(query) { // 验证是否存在关联数据
  return fetch({
    url: '/api/course/tk/getRelateData',
    method: 'get',
    params: query
  });
}
