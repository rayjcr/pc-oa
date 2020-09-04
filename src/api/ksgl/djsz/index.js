import fetch from 'utils/fetch'

/**
 * 获取等级设置信息
 * @param {Object} query 参数
 */
export function getScoreLevelList(query) {
  return fetch({
    url: '/api/course/scoreLevel/getScoreLevelList',
    method: 'get',
    params: query
  })
}

/**
 * 添加等级设置
 * @param {object} query {
 * scoreLevelList:[
    {
      "examSubjectId": "string",
      "id": "string",
      "levelGroupId": "string",
      "levelGroupName": "string",
      "levelName": "string",
      "limitScore": "string",
      "xxdm": "string"
    }
  ]}
 */
export function saveOrUpdateScoreLevel(query) {
  return fetch({
    url: '/api/course/scoreLevel/saveOrUpdateScoreLevel',
    method: 'post',
    data: query
  })
}

/**
 * 验证等级名称是否重复
 * @param {object} query 名称
 */
export function validaLevelName(query) {
  return fetch({
    url: '/api/course/scoreLevel/validaLevelName',
    method: 'get',
    params: query
  })
}

/**
 * 删除等级
 * @param {object} query 名称
 */
export function deleteLevelGroup(query) {
  return fetch({
    url: '/api/course/scoreLevel/' + query,
    method: 'delete'
  })
}

/**
 * 通过Id删除信息
 * @param {string} query 等级组的id
 */
export function scoreLevel(query) {
  return fetch({
    url: '/api/course/scoreLevel/' + query,
    method: 'delete'
  })
}
