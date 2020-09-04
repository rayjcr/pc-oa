
import fetch from 'utils/fetch'

/**
 * 获取发布列表信息
 * @param {object} query 搜索参数
 */
export function getRankingCountList(query) {
  return fetch({
    url: '/api/course/scoreCount/getRankingCountList',
    method: 'post',
    data: query
  })
}