import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
   // url: '/test/kclbwh/kclbpage',
    url: '/api/course/kclbwh/kclbpage',
    method: 'get',
    params: query
  });
}

export function checkUnique(query) {
  return fetch({
   // url: '/test/kclbwh/cxKclbxx',
    url: '/api/course/kclbwh/cxKclbxx',
    method: 'get',
    params: query
  });
}


export function all(query) {
  return fetch({
    //url: '/test/kclbwh/page',
    url: '/api/course/kclbwh/page',
    method: 'get',
    params: query
  });
}

export function get(query) {
  return fetch({
    //url: '/test/kclbwh/' + query,
	url: '/api/course/kclbwh/' + query,
    method: 'get'
  });
}

export function post(query) {
  return fetch({
    //url: '/test/kclbwh',
    url: '/api/course/kclbwh',
    method: 'post',
    data: query
  });
}

export function put(id, query) {
  return fetch({
    //url: '/test/kclbwh/' + id,
    url: '/api/course/kclbwh/' + id,
    method: 'put',
    data: query
  })
}

export function del(query) {
  return fetch({
	//url: '/test/kclbwh/' + query,
    url: '/api/course/kclbwh/' + query,
    method: 'delete'
  });
}
