import fetch from 'utils/fetch';

/*
* 获取评语内容列表
* */
export function pynrList(query) {
  return fetch({
    url: '/api/course/xkpjgcpynr/pynrList',
    method: 'post',
    data: query
  });
}

/*
* 获取评语详情
* */
export function pylr(query) {
  return fetch({
    url: '/api/course/xkpjgcpynr/pylr',
    method: 'post',
    data: query
  });
}

/*
* 录入课程内容
* */
export function saveGcpynr(query) {
  return fetch({
    url: '/api/course/xkpjgcpynr/saveGcpynr',
    method: 'post',
    data: query
  });
}

/*
* 删除课程内容
* */
export function deleteGcpynr(query) {
  return fetch({
    url: '/api/course/xkpjgcpynr/deleteGcpynr',
    method: 'post',
    data: query
  });
}


/*
* 删除课程目标
* */
export function deleteGcpymb(query) {
  return fetch({
    url: '/api/course/xkpjgcpynr/deleteGcpymb',
    method: 'post',
    data: query
  });
}

/*
* 获取课程列表
* */
export function changeKcxx(query) {
  return fetch({
    url: '/api/course/xkpjgcpynr/changeKcxx',
    method: 'post',
    data: query
  });
}

/*
* 获取期末评语列表
* */
export function qmpyList(query) {
  return fetch({
    url: '/api/course/xkpjqmpywh/qmpyList',
    method: 'post',
    data: query
  });
}

/*
* 增加期末评语
* */
export function saveQmpywh(query) {
  return fetch({
    url: '/api/course/xkpjqmpywh/saveQmpywh',
    method: 'post',
    data: query
  });
}

/*
* 编辑期末评语
* */
export function editQmpywh(query) {
  return fetch({
    url: '/api/course/xkpjqmpywh/editQmpywh',
    method: 'post',
    data: query
  });
}

/*
* 删除期末评语
* */
export function deleteQmpywh(query) {
  return fetch({
    url: '/api/course/xkpjqmpywh/deleteQmpywh',
    method: 'post',
    data: query
  });
}

/*
*期末评语上移下移
* */
export function saveXssx(query) {
  return fetch({
    url: '/api/course/xkpjqmpywh/saveXssx',
    method: 'post',
    data: query
  });
}


/*
* 获取评价设置配置信息
* */
export function getPjszInfo(query) {
  return fetch({
    url: '/api/course/xkpjszb/getPjszInfo',
    method: 'post',
    data: query
  });
}

/*
* 保存评价设置
* */
export function savePjsz(query) {
  return fetch({
    url: '/api/course/xkpjszb/savePjsz',
    method: 'post',
    data: query
  });
}


/*
* 查询统计列表--按课程
* */
export function kccxPjList(query) {
  return fetch({
    url: '/api/course/xkpjktpj/kccxPjList',
    method: 'post',
    data: query
  });
}


/*
* 查询统计列表--按学生
* */
export function xscxPjList(query) {
  return fetch({
    url: '/api/course/xkpjktpj/xscxPjList',
    method: 'post',
    data: query
  });
}

/*
* 查询统计---按学生查看详情
* */
export function xspjqktj (query) {
  return fetch({
    url: '/api/course/xkpjktpj/xspjqktj ',
    method: 'post',
    data: query
  });
}

/*
* 查询统计---按课程查看详情
* */
export function kcpjqktj (query) {
  return fetch({
    url: '/api/course/xkpjktpj/kcpjqktj ',
    method: 'post',
    data: query
  });
}

/*
* 查询统计---按课程查看详情
* */
export function exportKccxPjList (query) {
  return fetch({
    url: '/api/course/xkpjktpj/static/exportKccxPjList',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  });
}