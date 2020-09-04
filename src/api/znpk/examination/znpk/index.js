import fetch from 'utils/fetch';

export function kczdpk(data) {
  return fetch({
    url: '/api/course/kskcpk/' + data,
    method: 'get'
  })
}

/** 默认生成考号方式**/
export function getStudenNumberByAuto(query) {
  return fetch({
    url: '/api/course/khgzsz/getStudenNumberByAuto',
    method: 'get',
    params: query
  })
}
