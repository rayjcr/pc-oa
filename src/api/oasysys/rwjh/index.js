import fetch from 'utils/fetch';

// 获取计划列表
export function queryPageList(query) {
  return fetch({
    url: '/api/workflow/rcgl/cxXtbgRwjh',
    method: 'get',
    params: query
  });
}

// 增加个人计划
export function add(query) {
  return fetch({
    url: '/api/workflow/rcgl/add',
    method: 'post',
    data: query
  });
}

