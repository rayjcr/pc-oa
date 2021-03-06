import fetch from 'utils/fetch';

/**
 * 获得课表结构
 * @param query
 */
export function getClassStructure(query) {
  return fetch({
    url: '/api/course/dk/getClassStructure',
    method: 'get',
    params: query
  });
}

/**
 * 获取代课时间段
 * @param query
 */
export function getSubstituteWeek(query) {
  return fetch({
    url: '/api/course/dk/getSubstituteWeek',
    method: 'get',
    params: query
  });
}

/**
 * 根据时间获取代课课表
 * @param query
 */
export function getTeacherSchedule(query) {
  return fetch({
    url: '/api/course/dk/ExportTeacherSchedule',
    method: 'get',
    params: query
  });
}

/**
 * 获取教师课表
 * @param query
 */
export function queryJsList(query) {
  return fetch({
    url: '/api/course/tk/getByJsList',
    method: 'get',
    params: query
  });
}

