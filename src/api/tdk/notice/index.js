import fetch from 'utils/fetch';

// 获取通知单模板数据list
export function getList(query) {
  return fetch({
    url: '/api/course/noticeTemplate/getNoticeTemplate',
    method: 'get',
    params: query
  });
}

// 删除通知单模板
export function delNoticeTemplate(id) {
  return fetch({
    url: '/api/course/noticeTemplate/' + id,
    method: 'delete'
  });
}

// 修改通知单模板
export function modifyNoticeTemplate(obj) {
  return fetch({
    url: '/api/course/noticeTemplate/updateTemplateContent',
    method: 'put',
    params: obj
  });
}

// 修改通知单模板
export function disableTemplateStatus(obj, id) {
  return fetch({
    url: '/api/course/noticeTemplate/' + id,
    method: 'put',
    data: obj
  });
}


// 添加通知单模板
export function addNoticeTemplate(obj) {
  return fetch({
    url: '/api/course/noticeTemplate/addTemplate',
    method: 'post',
    data: obj
  });
}

// 更新模板状态
export function modifyNoticeStatus(obj) {
  return fetch({
    url: '/api/course/noticeTemplate/modifyStatus',
    method: 'put',
    params: obj
  });
}

// 获取系统初始化模板内容数据
export function getInitTemplate(obj) {
  return fetch({
    url: '/api/course/noticeTemplate/getInitTemplate',
    method: 'get',
    params: obj
  });
}

// 获取系统初始化模板内容数据
export function checkTmeplateName(obj) {
  return fetch({
    url: '/api/course/noticeTemplate/checkNameUnique',
    method: 'get',
    params: obj
  });
}


// 获取系统初始化模板内容数据
export function exportNotice(obj) {
  return fetch({
    url: '/api/course/courseNotice/exportCourseNotice',
    method: 'get',
    params: obj
  });
}
