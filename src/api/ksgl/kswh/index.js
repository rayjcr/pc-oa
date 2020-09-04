import fetch from 'utils/fetch';

/** 考试维护分页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/course/kswh/queryPageList',
    method: 'post',
    data: query
  });
}

/** 保存排课任务信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/course/kswh/',
    method: 'post',
    data: query
  });
}
/** 修改排课任务信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/course/kswh/' + id,
    method: 'put',
    data: query
  });
}
/** 删除排课任务信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/course/kswh/' + id,
    method: 'delete'
  });
}


// 获取当前学年学期
export function dqxnxqObj(query) {
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq',
    method: 'get',
    params: query
  });
}
/** 学年列表**/
export function xnList(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList',
    method: 'get',
    params: query
  });
}
/** 学期列表**/
export function xqList(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}

/** 考试类型列表**/
export function getKslxList(query) {
  return fetch({
    url: '/api/course/kslx/queryKslxList',
    method: 'get',
    params: query
  });
}

/** 修改考试维护状态列表**/
export function getUpdateState(query) {
  return fetch({
    url: '/api/course/kswh/getUpdateState',
    method: 'post',
    data: query
  });
}

/** 查询参考年级列表 **/
export function getCknj(query) {
  return fetch({
    url: '/api/course/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}
/** 查询参考学生列表 **/
export function getCkxsxxList(params) {
  return fetch({
    url: '/api/course/ckxsxx/getCkxsxxList',
    method: 'get',
    params
  })
}
/** 免考设置 **/
export function saveMkszXx(data) {
  return fetch({
    url: '/api/course/ckxsxx/saveMkszXx',
    method: 'post',
    data
  })
}
/** 验证名字是否重复 **/
export function getValidaName(query) {
  return fetch({
    url: '/api/course/kswh/getValidaName',
    method: 'get',
    params: query
  })
}

// 导入成绩excle文件

export function importScoreExcel(query,config = {}) {
  return fetch({
    url: '/api/course/scoreImport/importScoreExcel',
    method: 'post',
    data: query,
    ...config
  })
}

// 清除临时表数据
export function clearTempData(query) {
  return fetch({
    url: '/api/course/scoreImport/clearTempData',
    method: 'post',
    data: query
  })
}
// 获取上传进度
export function importScoreProgress(query) {
  return fetch({
    url: '/api/course/scoreImport/importScoreProgress',
    method: 'post',
    data: query
  })
}

//获取临时表数据
export function getTempData(query) {
  return fetch({
    url: '/api/course/scoreImport/getTempData',
    method: 'post',
    data: query
  })
}

//导出异常数据
export function exportErrorScore(query) {
  return fetch({
    url: '/api/course/scoreImport/exportErrorScore',
    method: 'post',
    data: query,
    responseType: 'blob',
  })
}

// 获取列表中的学科数据
export function getCouseInfoFromTemp(query) {
  return fetch({
    url: '/api/course/scoreImport/getCouseInfoFromTemp',
    method: 'post',
    data: query
  })
}
// 获取列表中的年级数据
export function getGradeInfoFromTemp(query) {
  return fetch({
    url: '/api/course/scoreImport/getGradeInfoFromTemp',
    method: 'post',
    data: query
  })
}
// 获取列表中的班级数据
export function getSchoolClassInfoFromTemp(query) {
  return fetch({
    url: '/api/course/scoreImport/getSchoolClassInfoFromTemp',
    method: 'post',
    data: query
  })
}
// 提交批量成绩导入
export function submitBatchScore(query) {
  return fetch({
    url: '/api/course/scoreImport/submitBatchScore',
    method: 'post',
    data: query
  })
}
// 检验单条记录是否有效
export function updateSingleTemp(query) {
  return fetch({
    url: '/api/course/scoreImport/updateSingleTemp',
    method: 'post',
    data: query
  })
}
// 获取提交进度
export function submitScoreProgress(query,config = {}) {
  return fetch({
    url: '/api/course/scoreImport/submitScoreProgress',
    method: 'post',
    data: query,
     ...config
  })
}
// 判断是否有批量导入的权限

export function doesUserHasRight(query) {
  return fetch({
    url: '/api/course/scoreImport/doesUserHasRight',
    method: 'post',
    data: query
  })
}
// 获取科目

export function getValidCourseByExam(query) {
  return fetch({
    url: '/api/course/scoreImport/getValidCourseByExam',
    method: 'post',
    data: query
  })
}

// 根据examId获取学年
export function getExamXn(query) {
  return fetch({
    url: '/api/course/scoreImport/getExamXn',
    method: 'post',
    data: query
  })
}