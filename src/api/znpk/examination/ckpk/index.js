import fetch from 'utils/fetch';

export function getKsxx(jlid) {
  return fetch({
    url: '/api/course/kswh/' + jlid + '/getKsxx',
    method: 'get',
    params: null
  });
}

export function getCknj(query) {
  return fetch({
    url: '/api/course/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}

export function getKskc(query) {
  return fetch({
    url: '/api/course/kskcxx/getKskc',
    method: 'get',
    params: query
  })
}

export function getKcxsxx(query) {
  return fetch({
    url: '/api/course/kcxsxx/getKcxsxx',
    method: 'get',
    params: query
  })
}

export function getKsrq(query) {
  return fetch({
    url: '/api/course/kskmxx/getKsrq',
    method: 'get',
    params: query
  })
}

export function getKskmsj(query) {
  return fetch({
    url: '/api/course/kskmxx/cxKskmmxkssj',
    method: 'get',
    params: query
  })
}

export function getXklsxxByKsid(query) {
  return fetch({
    url: '/api/course/kcjkls/cxXklsxxByKsid',
    method: 'get',
    params: query
  })
}
