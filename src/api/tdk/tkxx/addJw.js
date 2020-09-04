import fetch from 'utils/fetch';

export function add(query) { // 保存调课课信息
  return fetch({
    url: '/api/course/tk/',
    method: 'post',
    data: query
  });
}

// 获取班级课表
export function Getbjlist(query) {
  return fetch({
    url: '/api/course/tk/getClassTimetable',
    method: 'get',
    params: query
  })
}

// 获取教师课表
export function GetTeachertable(query) {
  return fetch({
    url: '/api/course/tk/getByJsList',
    method: 'get',
    params: query
  });
}

/**
 * 获得课表结构
 */
export function getClassStructure(query) {
  return fetch({
    url: '/api/course/dk/getClassStructure',
    method: 'get',
    params: query
  });
}

// /tk/getClassTeachers
// 获取班级教师（根据学校代码，时间，班级代码）
export function getTeacherlist(query) {
  return fetch({
    url: '/api/course/tk/getClassTeachers',
    method: 'get',
    params: query
  });
}

// 获取教师审批中数据
export function getApprovaltable(query) {
  return fetch({
    url: '/api/course/tk/getTeachProcessData',
    method: 'get',
    params: query
  });
}

// 获取班级中正在申请调课的信息
export function getTkProcess(query) {
  return fetch({
    url: '/api/course/tk/getClassProcessData',
    method: 'get',
    params: query
  });
}


// 提交调代课申请
export function submitTdkInfo(query) {
  return fetch({
    url: '/api/course/tk',
    method: 'post',
    data: query
  });
}

export function validaSplc(query) { // 是否有模板
  return fetch({
    url: '/api/course/tk/validateLcmb',
    method: 'get',
    params: query
  });
}
