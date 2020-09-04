import fetch from 'utils/fetch'

/**
 * 获取发布列表信息
 * @param {object} query 搜索参数
 */
export function getExamReleasePageList(query) {
  return fetch({
    url: '/api/course/kswh/getExamReleasePageList',
    method: 'get',
    params: query
  })
}
/**
 * 短信通知
 * @param {object} query 搜索参数
 */
export function smsNoticeNotRecordedTeacher(query) {
  return fetch({
    url: '/api/course/kswh/smsNoticeNotRecordedTeacher',
    method: 'get',
    params: query
  })
}
/**
 * 发布
 * @param {object} query 搜索参数
 */
export function publishExamScore(query) {
  return fetch({
    url: '/api/course/kswh/publishExamScore',
    method: 'post',
    data: query
  })
}
/**
 * 查询发布展示项
 * @param {object} query 搜索参数
 */
export function getPublishItem(query) {
  return fetch({
    url: '/api/course/kswh/getPublishItem',
    method: 'get',
    params: query
  })
}

/**
 * 获取成绩录入情况信息
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
 * 打回考试科目
 * @param {object} query 考试id
 */
export function rejectSubject(query) {
  return fetch({
    url: '/api/course/kskmxx/rejectExamSubject',
    method: 'get',
    params: query
  })
}
