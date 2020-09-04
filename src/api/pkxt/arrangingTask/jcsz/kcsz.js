import fetch from 'utils/fetch';

/** 获取课程设置信息**/
export function getKcsz(query) {
  return fetch({
    url: '/api/course/jxjh/kcszList',
    method: 'post',
    data: query
  });
}

/** 获取年级课程数据**/
export function getNjkc(query) {
  return fetch({
    url: '/api/course/jxjh/njkcList',
    method: 'post',
    data: query
});
}

/** 保存课程设置接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/course/jxjh',
    method: 'post',
    data: query
  });
}

/** 修改课程设置信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/course/jxjh/' + id,
    method: 'put',
    data: query
  });

}
/** 删除课程设置信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/course/pkrw/' + id,
    method: 'delete'
  });
}

// 获取年级接口
export function getNj(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}

// 获取总上课节数
export function getTotalZxs(query) {
  return fetch({
    url: '/api/course/jxjh/getTotalZxs',
    method: 'post',
    data: query
  });
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

//获取班级不上课数
export function getBsks(query) {
  return fetch({
    url: '/api/course/bjbpk/getMaxBjbpksz',
    method: 'post',
    data: query
  });
}


//修改每周上课数
export function deletableRulesByCourseList(query) {
  return fetch({
    url: '/api/course/jxjh/deletableRulesByCourseList',
    method: 'post',
    data: query
  });
}

//修改每周上课数
export function deletRulesByCourseList(query) {
  return fetch({
    url: '/api/course/jxjh/deletRulesByCourseList',
    method: 'post',
    data: query
  });
}
