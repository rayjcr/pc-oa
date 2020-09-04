import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/course/xkjg/kcxxList',
    method: 'post',
    data: query
  });
}

export function ckxkjg(query) {
  return fetch({
    url: '/api/course/xkjg/ckxkjg',
    method: 'post',
    data: query
  });
}

export function tzXsxkxx(query) {
  return fetch({
    url: '/api/course/xkjg/tzXsxkxx',
    method: 'post',
    data: query
  });
}

export function cxXsxkjg(query) {
  return fetch({
    url: '/api/course/xkjg/cxXsxkjg',
    method: 'post',
    data: query
  });
}


