import fetch from 'utils/fetch';


export function znpk(query) {
  return fetch({
    url: '/api/course/pkjg/zdpk',
    method: 'get',
    params: query
  });
}

export function checkSfypk(query) {
  return fetch({
    url: '/api/course/pkjg/checkSfypk',
    method: 'post',
    data: query
  });
}

export function checkNoSuccessPkData(query) {
  return fetch({
    url: '/api/course/pkjg/checkNoSuccessPkData',
    method: 'post',
    data: query
  });
}

export function getPkNjList(query) {
  return fetch({
    url: '/api/course/pkjg/getPkGradeList',
    method: 'get',
    params: query
  });
}


