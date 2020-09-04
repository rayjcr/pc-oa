import fetch from 'utils/fetch';

// 获取考试科目信息
export function getKskmxx(params) {
  return fetch({
    url: '/api/course/kskmxx/cxKskmmx',
    method: 'post',
    data: params
  });
}

// 获取考试年级
export function getKsnj(query) {
  return fetch({
    url: '/api/course/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}

// 维护考试科目时间
export function updateKskmxx(params) {
  return fetch({
    url: '/api/course/kskmxx/updateKskmsj',
    method: 'post',
    data: params
  });
}

// 检查数据
export function checkDataByKsid(data) {
  return fetch({
    url: '/api/course/kskmxx/checkData',
    method: 'get',
    params: data
  });
}

// 清空数据
export function clearDataByKsid(data) {
  return fetch({
    url: '/api/course/kskmxx/clearData',
    method: 'get',
    params: data
  });
}


