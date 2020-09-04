import fetch from 'utils/fetch';

export function getPageList(data) {
  return fetch({
    url: '/api/course/ckxsxx/queryPageList',
    method: 'post',
    data
  })
}

export function getCkxsxxList(params) {
  return fetch({
    url: '/api/course/ckxsxx/getCkxsxxList',
    method: 'get',
    params
  })
}

export function saveCkxsxx(data) {
  return fetch({
    url: '/api/course/ckxsxx/saveCkxsxx',
    method: 'post',
    data
  })
}
/** 修改学生考号 **/
export function getEditXskh(params) {
  return fetch({
    url: '/api/course/ckxsxx/getEditXskh',
    method: 'get',
    params
  })
}

/** 查询参考年级列表 **/
export function getCknj(query) {
  return fetch({
    url: '/api/course/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}

/** 默认生成考号方式**/
export function getNumberRule(query) {
  return fetch({
    url: '/api/course/khgzsz/getNumberRule',
    method: 'get',
    params: query
  })
}


/** 保存考号生成规则**/
export function saveRule(data) {
  return fetch({
    url: '/api/course/khgzsz/saveRule',
    method: 'post',
    data
  })
}


