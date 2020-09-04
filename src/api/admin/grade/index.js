import fetch from 'utils/fetch';

export function gradepage(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcNjsjlx',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcNjsjlx/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcNjsjlx/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcNjsjlx/' + id,
    method: 'put',
    data: obj
  })
}

/**
 * 获得学年列表
 */
export function getxnlb(obj) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList?xxdm=' + obj.xxdm,
    method: 'get'
  })
}

/**
 * 获得当前学年
 */
export function getdqxn(obj) {
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq?xxdm=' + obj.xxdm,
    method: 'get'
  })
}

/**
 * 获取年级列表信息
 */
export function getnjlb(obj) {
  return fetch({
    url: '/api/base/jcNjsjlx/selectNjList?xxdm=' + obj.xxdm,
    method: 'get'
  })
}
/**
 * 年级升级
 */
export function njLevelUp(obj) {
  return fetch({
    url: '/api/base/jcNjsjlx/njsjcz',
    method: 'post',
    data: obj
  })
}

/**
 * 保存年级主任
 */
export function savaGradeLeader(obj) {
  return fetch({
    url: '/api/base/jcNjsjlx/addGradeLeaderList',
    method: 'post',
    data: obj
  })
}

/**
 * 获取年级主任
 */
export function getGradeLeader(data) {
  return fetch({
    url: '/api/base/jcNjsjlx/getGradeLeaderList',
    method: 'get',
    params:data
  })
}

/**
 * 清空年级主任
 */
export function clearGradeLeader(data) {
  return fetch({
    url: '/api/base/jcNjsjlx/deleteGradeLeader',
    method: 'get',
    params:data
  })
}

