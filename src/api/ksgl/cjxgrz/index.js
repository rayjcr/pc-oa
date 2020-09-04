import fetch from 'utils/fetch';

/**
 * 获取有录入权限的考试信息
 */
export function getScoreLog(query) {
  return fetch({
    url: '/api/course/courseLog/getScoreLog',
    method: 'post',
    params: query
  })
}