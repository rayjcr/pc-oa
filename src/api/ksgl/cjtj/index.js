import fetch from 'utils/fetch';

/**
 * 获取有录入权限的考试信息
 */
export function getScoreCountList(query) {
  return fetch({
    url: '/api/course/scoreCount/getScoreCountList',
    method: 'post',
    data: query
  })
}