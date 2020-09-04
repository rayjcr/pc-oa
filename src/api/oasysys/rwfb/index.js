import fetch from 'utils/fetch';

export function queryPageList(query) { // 获取教学任务信息列表
  return fetch({
    url: '/api/course/jxrw/queryPageList',
    method: 'get',
    params: query
  });
}
export function save(query) { // 保存教学任务信息
  return fetch({
    url: '/api/course/jxrw',
    method: 'post',
    data: query
  });
}
export function getInfo(query) { // 查询任务信息
  return fetch({
    url: '/api/course/jxrw/' + query,
    method: 'get',
    params: query
  });
}
export function updateSate(query) { // 获取流程模板id
  return fetch({
    url: '/api/course/jxrw/updateJxrwmx',
    method: 'post',
    data: query
  });
}
export function getDelete(query) { // 获取流程模板id
  return fetch({
    url: '/api/course/jxrw/' + query,
    method: 'delete'
  });
}
// 获取学校所有教师
export function Getallteacher(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  })
}
