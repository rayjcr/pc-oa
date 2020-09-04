import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/course/kcxx/pagelist',
    method: 'post',
    data: query
  });
}


export function delObj(query) {
  return fetch({
    url: '/api/course/kcxx/delKcxx',
    method: 'post',
    data: query
  });
}


export function getXnlist(query) {
  return fetch({
    url: '/api/course/kcxx/getXnlist',
    method: 'get',
    params: query
  });
}

export function getKcxxhistory(query) {
  return fetch({
    url: '/api/course/kcxx/getKcxxhistory',
    method: 'get',
    params: query
  });
}



export function getAll(query) {
  return fetch({
    url: '/api/course/kcxx/getAddAll',
    method: 'get',
    params: query
  });
}


export function copykc(query) {
  return fetch({
    url: '/api/course/kcxx/fzkc',
    method: 'post',
    data: query
  });
}

export function ck(query) {
  return fetch({
    url: '/api/course/kcxx/ckkcxx',
    method: 'get',
    params: query
  });
}


export function savexg(query) {
  return fetch({
    url: '/api/course/kcxx/bcxg',
    method: 'post',
    data: query
  });
}


export function newPicture(datas) {
  return fetch({
    url: '/api/course/kcxx/sctpS',
    method: 'post',
    data: datas
  });
}



export function saveaddkcxx(query) {
  return fetch({
    url: '/api/course/kcxx/savekcxx',
    method: 'post',
    data: query
  });
}
export function checkCdxx(query) {
  return fetch({
    url: '/api/course/kcxx/checkCdxx',
    method: 'post',
    data: query
  });
}

