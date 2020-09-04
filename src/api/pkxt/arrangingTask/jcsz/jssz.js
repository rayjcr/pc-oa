import fetch from 'utils/fetch';

// 查询课程年级关系信息接口
export function getKcNjgx(query) {
  return fetch({
    url: '/api/course/jxjh/njkcList',
    method: 'post',
    data: query
  });
}
// 查询年级课程班级信息接口
export function getKcSz(query) {
  return fetch({
    url: '/api/course/jxjh/kcszList',
    method: 'post',
    data: query
  })
}
// 保存教师信息接口
export function getSaveJsSz(query) {
  return fetch({
    url: '/api/course/jxjh/getUpdateKcsz',
    method: 'post',
    data: query
  })
}
/** 教师组关系数据**/
export function getJszjsgxList(query) {
  return fetch({
    url: '/api/base/jcJszgx/getJszjsgxList',
    method: 'get',
    params: query
  })
}

// 检测规则条件是否已经设置
export function checkGzsz(query) {
  return fetch({
    url: '/api/course/jxjh/checkGzsz',
    method: 'post',
    data: query
  });
}

// 检测规则条件是否已经设置
export function initGzsz(query) {
  return fetch({
    url: '/api/course/jxjh/initGzsz',
    method: 'post',
    data: query
  });
}
