import fetch from 'utils/fetch'

/**
 * 获取成绩录入权限信息
 * @param {object} query 考试id
 */
export function getScorePermissionList(query) {
  return fetch({
    url: '/api/course/scorePermission/getScorePermissionList',
    method: 'get',
    params: query
  })
}

/**
 * 保存录入老师
 * @param {object} query 教师信息
 */
export function saveScorePermission(query) {
  return fetch({
    url: '/api/course/scorePermission/saveScorePermission',
    method: 'post',
    data: query
  })
}
/**
 * 初始化录入老师信息
 * @param {object} query 考试id
 */
export function initExamScorePermission(query) {
  return fetch({
    url: '/api/course/scorePermission/initExamScorePermission',
    method: 'get',
    params: query
  })
}
/**
 * 批量清空指定考试科目录入权限
 * @param {object} query 考试id 考试科目id
 */
export function deleteBatchPermission(query) {
  return fetch({
    url: '/api/course/scorePermission/deleteBatchPermission',
    method: 'get',
    params: query
  })
}