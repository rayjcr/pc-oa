import fetch from 'utils/fetch'

/**
 * 获取发布列表信息
 * @param {object} query 搜索参数
 */
export function getExamList(query) {
  return fetch({
    url: '/api/course/kswh/getExamList',
    method: 'get',
    params: query
  })
}

/**
 * 获取搜索信息
 * @param {object} query 搜索参数
 */
export function searchClassScore(query) {
  return fetch({
    url: '/api/course/courseScore/searchClassScore',
    method: 'post',
    params: query
  })
}
/**
 * 保存修改成绩
 * @param {object} query 搜索参数
 */
export function saveStudentScore(query) {
  return fetch({
    url: '/api/course/courseScore/saveStudentScore',
    method: 'post',
    data: query
  })
}
/**
 * 根据考试id查询参考年级信息接口
 * @param {object} query 考试id
 */
export function getGradeByExamId(query) {
  return fetch({
    url: '/api/course/kskmxx/getGradeByExamId',
    method: 'GET',
    params: query
  })
}
/**
 * 根据考试id和年级id查询年级考试科目信息接口
 * @param {object} query 考试id 年级id
 */
export function getGradeExamCourseList(query) {
  return fetch({
    url: '/api/course/kskmxx/getGradeExamCourseList',
    method: 'GET',
    params: query
  })
}
/**
 * 根据考试id和年级id查询年级考试科目信息接口
 * @param {object} query 考试id 年级id
 */
export function getGradeExamClassList(query) {
  return fetch({
    url: '/api/course/kskmxx/getGradeExamClassList',
    method: 'GET',
    params: query
  })
}
/**
 * 根据考试id判断考试是否全部录完
 * @param {object} query 考试id
 */
export function checkIsFinish(query) {
  return fetch({
    url: '/api/course/kswh/checkIsFinish',
    method: 'GET',
    params: query
  })
}
/**
 * 根据考试id,年级id,课程id判断考试是否允许统计
 * @param {object} query 考试id,年级id,课程id
 */
export function validationEntryMethod(query) {
  return fetch({
    url: '/api/course/scoreCount/validationEntryMethod',
    method: 'GET',
    params: query
  })
}