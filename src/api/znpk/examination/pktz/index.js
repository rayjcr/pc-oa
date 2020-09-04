import fetch from 'utils/fetch';

export function getKcxsxxByKskcid(data) {
  return fetch({
    url: '/api/course/kcxsxx/getKcxsxxByKskcid',
    method: 'get',
    params: data
  })
}

export function saveKcxsxx(params) {
  return fetch({
    url: '/api/course/kcxsxx/saveKcxsxx',
    method: 'post',
    data: params
  })
}

export function replaceKcxsxx(data) {
  return fetch({
    url: '/api/course/kcxsxx/replaceKcxsxx',
    method: 'post',
    params: data
  })
}

export function getTemporaryKcxsxx(data) {
  return fetch({
    url: '/api/course/kcxsxx/getTemporaryKcxsxx',
    method: 'get',
    params: data
  })
}

export function getKclsxxByKsid(data) {
  return fetch({
    url: '/api/course/kcjkls/getKclsxxByKsid',
    method: 'get',
    params: data
  })
}
export function saveKclsxx(params) {
  return fetch({
    url: '/api/course/kcjkls/saveKclsxx',
    method: 'post',
    data: params
  })
}
