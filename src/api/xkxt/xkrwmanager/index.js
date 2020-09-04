import fetch from 'utils/fetch';

//获取学年列表
export function getxnList(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList',
    method: 'get',
    params: query
  });
}
//获取学期列表
export function getxqList(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}
export function page(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/list',
    method: 'post',
    data: query
  });
}

export function checkUnique(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/cxKclbxx',
    method: 'get',
    params: query
  });
}


export function all(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/page',
    method: 'get',
    params: query
  });
}

export function get(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/' + query,
    method: 'get'
  });
}

export function post(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/saveXkrw',
    method: 'post',
    data: query
  });
}

export function put(id, query) {
  return fetch({
    url: '/api/course/xkxtxkrw/' + id,
    method: 'put',
    data: query
  })
}

export function del(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/' + query,
    method: 'delete'
  });
}

export function getKclx(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getKclx',
    method: 'get',
    params: query
  });
}

export function getKcxx(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getKcxx',
    method: 'get',
    params: query
  });
}

export function addKcxx(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/addKcxx',
    method: 'post',
    data: query
  });
}

export function deleteKcxx(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/deleteKcxx',
    method: 'post',
    data: query
  });
}

export function getGzszXkkc(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getGzszXkkc',
    method: 'get',
    params: query
  });
}

export function addGzszHckc(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/addGzszHckc',
    method: 'post',
    data: query
  });
}

export function getHckcList(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getHckcList',
    method: 'get',
    params: query
  });
}

export function deleteHckc(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/deleteHckc',
    method: 'get',
    params: query
  });
}

export function getGzszXklb(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getGzszXklb',
    method: 'get',
    params: query
  });
}


export function addGzszBxkc(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/addGzszBxkc',
    method: 'post',
    data: query
  });
}

export function getBxkcList(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getBxkcList',
    method: 'get',
    params: query
  });
}

export function saveGzsz(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/saveGzsz',
    method: 'post',
    data: query
  });
}


export function deleteBxkc(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/deleteBxkc',
    method: 'get',
    params: query
  });
}

export function getXktjzdks(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getXktjzdks',
    method: 'get',
    params: query
  });
}

export function sendXktz(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/sendXktz',
    //url: '/test/xkxtxkrw/sendXktz',
    method: 'post',
    data: query
  });
}
export function getCurrentXkrw(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getCurrentXkrw',
    method: 'get',
    params: query
  });
}
export function getKclxKcxx(query) {
  return fetch({
    url: '/api/course/xkxtxkrw/getKclxKcxx',
    method: 'get',
    params: query
  });
}
