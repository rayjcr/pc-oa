import fetch from 'utils/fetch';

/** 排课任务分页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/course/pkrw/queryPageList',
    method: 'post',
    data: query
  });
}

/** 保存排课任务信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/course/pkrw/',
    method: 'post',
    data: query
  });
}
/** 修改排课任务信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/course/pkrw/' + id,
    method: 'put',
    data: query
  });
}
/** 复用排课任务信息接口**/
export function getCopy(query) {
  return fetch({
    url: '/api/course/pkrw/copyPkrw',
    method: 'post',
    data: query
  });
}
/** 验证排课任务名称**/
export function getValidaName(query) {
  return fetch({
    url: '/api/course/pkrw/getValidaName',
    method: 'get',
    params: query
  });
}
/** 删除排课任务信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/course/pkrw/' + id,
    method: 'delete'
  });
}


// 获取当前学年学期
export function dqxnxqObj(query) {
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq',
    method: 'get',
    params: query
  });
}
/** 学年列表**/
export function xnPage(query) {
  return fetch({
    url: '/api/base/jcXndm/page',
    method: 'get',
    params: query
  });
}

export function getGradeList(query) {
  return fetch({
    url: '/api/course/pkrw/getGradeClassList',
    method: 'get',
    params: query
  });
}

