import fetch from 'utils/fetch';

/**
 * 获取有录入权限的考试信息
 */
export function getPermissionExamSubject(query) {
  return fetch({
    url: '/api/course/scorePermission/getPermissionExamSubject',
    method: 'post',
    data: query
  })
}
/**
 * 获取有录入权限的复审考试信息
 */
export function getPermissionConfirmExamSubject(query) {
  return fetch({
    url: '/api/course/scorePermission/getPermissionConfirmExamSubject',
    method: 'post',
    data: query
  })
}