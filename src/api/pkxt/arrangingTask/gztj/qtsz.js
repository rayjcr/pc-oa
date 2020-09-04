import fetch from 'utils/fetch';

//查询年级课程班级信息接口
export function getKcSz(query) {
  return fetch({
    /*url: '/api/course/jxjh/getSelectList',*/
    url: '/api/course/jxjh/getSelectList',
    method: 'get',
    params: query
  })
}

/**
 * @program: 课程时段查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getQtszList(query, i) {
  const value = ['kssd/getKcsdList', 'jaqp/getJaqpList', 'jszrk/getZrkszList', 'jstrk/getTrkszList'];
  return fetch({
    url: '/api/course/' + value[i],
    method: 'get',
    params: query
  })
}

//保存课程时段信息接口
export function getQtszSave(query, i) {
  const value = ['kssd/getSaveKcsdInfo', 'jaqp/getSaveJaqpInfo', 'jszrk/getSaveZrkszInfo', 'jstrk/getSaveTrkszInfo'];
  return fetch({
    url: '/api/course/' + value[i],
    method: 'post',
    data: query
  })
}

/**
 * @program: 教案齐平查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getJaqpList(query) {
  return fetch({
    url: '/api/course/jaqp/getJaqpList',
    method: 'get',
    params: query
  })
}

//保存教案齐平信息接口
export function getSaveJaqp(query) {
  return fetch({
    url: '/api/course/jaqp/getSaveJaqpInfo',
    method: 'post',
    data: query
  })
}

/**
 * @program: 周内分布查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getZrkszList(query) {
  return fetch({
    url: '/api/course/jszrk/getZrkszList',
    method: 'get',
    params: query
  })
}

//保存课程时段信息接口
export function getSaveZrkszInfo(query) {
  return fetch({
    url: '/api/course/jszrk/getSaveZrkszInfo',
    method: 'post',
    data: query
  })
}

/**
 * @program: 天内分布查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getTrkszList(query) {
  return fetch({
    url: '/api/course/jstrk/getTrkszList',
    method: 'get',
    params: query
  })
}

//保存课程时段信息接口
export function getSaveTrkszInfo(query) {
  return fetch({
    url: '/api/course/jstrk/getSaveTrkszInfo',
    method: 'post',
    data: query
  })
}



