import fetch from 'utils/fetch';

/**
 * 获取课程分项信息
 * @param {Object} query 参数
 */
export function getCourseItemList(query) {
  return fetch({
    url: '/api/course/courseItem/getCourseItemList',
    method: 'get',
    params: query
  })
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
/**
 * 删除科目分项信息
 * @param {Object} query 参数
 */
export function deleteCourseItem(query) {
  return fetch({
    url: '/api/course/courseItem/deleteCourseItem',
    method: 'post',
    params: query
  })
}

