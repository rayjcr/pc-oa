import fetch from 'utils/fetch';

export function fetchTree(query) {
  return fetch({
    url: '/api/admin/menu/tree',
    method: 'get',
    params: query
  });
}

export function fetchddTree(query) {
  return fetch({
    url: '/api/admin/mobilemenu/mobileddtree',
    method: 'get',
    params: query
  });
}

export function fetchwxTree(query) {
  return fetch({
    url: '/api/admin/mobilemenu/mobilewxtree',
    method: 'get',
    params: query
  });
}

export function fetchxxtTree(query) {
  return fetch({
    url: '/api/admin/mobilemenu/mobilexxttree',
    method: 'get',
    params: query
  });
}

export function saveXxtTree(query) {
  return fetch({
    url: '/api/admin/mobilemenu/saveMobileMenu',
    method: 'post',
    data: query
  });
}



// authority/xxtAuthorityMobileMenu 

export function fetchAll() {
  return fetch({
    url: '/api/admin/menu/all',
    method: 'get'
  });
}
export function addObj(obj) {
  return fetch({
    url: '/api/admin/menu',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/menu/' + id,
    method: 'put',
    data: obj
  })
}


