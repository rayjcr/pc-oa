import fetch from 'utils/fetch';

/**
 * 查询班级考试科目成绩
 * @param {Object} query 参数
 */
export function getExamSubjectScore(query) {
  return fetch({
    url: 'api/course/courseScore/getClassScore',
    method: 'get',
    params: query
  })
}
/**
 * 查询班级考试复审成绩
 * @param {Object} query 参数
 */
export function getClassConfirmScore(query) {
  return fetch({
    url: 'api/course/courseScore/getClassConfirmScore',
    method: 'get',
    params: query
  })
}

/**
 * 保存录入成绩
 * @param {Object} query 参数
 */
export function saveExamSubjectScore(query) {
  return fetch({
    url: 'api/course/courseScore/saveClassScore',
    method: 'post',
    data: query
  })
}
/**
 * 复审成绩保存
 * @param {Object} query 参数
 */
export function saveClassConfirmScore(query) {
  return fetch({
    url: 'api/course/courseScore/saveClassConfirmScore',
    method: 'post',
    data: query
  })
}
/**
 * 录入成绩提交
 * @param {Object} query 参数
 */
export function submitClassScore(query) {
  return fetch({
    url: 'api/course/courseScore/submitClassScore',
    method: 'post',
    data: query
  })
}
/**
 * 复审成绩提交
 * @param {Object} query 参数
 */
export function submitClassConfirmScore(query) {
  return fetch({
    url: 'api/course/courseScore/submitClassConfirmScore',
    method: 'post',
    data: query
  })
}

