import fetch from 'utils/fetch';

// 获取课程年级关系数据
export function getNjgxList(query) {
  return fetch({
    url: '/api/base/kcnjGx/selectAll',
    method: 'post',
    data: query
  });
}

// 保存考试科目信息
export function saveKsKmxx(query) {
  return fetch({
    url: '/api/course/kskmxx/saveKsKmxx',
    method: 'post',
    data: query
  });
}

// 删除考试科目信息数据
export function deleteExamSubject(query) {
  return fetch({
    url: '/api/course/kskmxx/deleteExamSubject',
    method: 'get',
    params: query
  });
}

// 获取考试科目信息数据
export function getKskmxxList(query) {
  return fetch({
    url: '/api/course/kskmxx/getKskmxxList',
    method: 'get',
    params: query
  });
}

/**
 * 添加课程分项信息
 * @param {Object} query 参数
 */
export function addCourseItem(query) {
  return fetch({
    url: '/api/course/courseItem/addCourseItem',
    method: 'post',
    data: query
  })
}



