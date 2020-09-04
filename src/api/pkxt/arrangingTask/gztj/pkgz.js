import fetch from 'utils/fetch';

// 根据任务id获取所有规则
export function getGzlb(query) {
  return fetch({
    url: '/api/course/pkgz/queryPkgzlb',
    method: 'get',
    params: query
  });
}
export function scgzBylx(query) {
  return fetch({
    url: '/api/course/pkgz/scgzBygzlx',
    method: 'post',
    data: query
  });
}
// 查询规则类型
export function getGzlx(query) {
  return fetch({
    url: '/api/course/pkgz/queryPkgzlx',
    method: 'get',
    params: query
  });
}

// 保存规则类型
export function saveGzlx(data) {
  return fetch({
    url: '/api/course/pkgz/savePkgzlx',
    method: 'post',
    data
  });
}



