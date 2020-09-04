import fetch from  'utils/fetch';
// import { Form } from 'element-ui';
// 列表展示
export function pagelist(query) {
  return fetch ({
    url:'/api/course/aqsb/pagelist',
    method:'post',
    data: query
  })
}

//人员书目数据弹层
export function getXcry (query){
  return fetch ({
    url:'/api/course/aqsb/getXcry',
    method:'get',
    params : query
  })
}


// 添加页面
export function getTea(query){
  return fetch({
    url:'/api/course/aqsb/getTea',
    method:'get',
    params:query
  })
}
//添加保存
export function saveAqsb (query){
  return fetch ({
    url:'/api/course/aqsb/saveAqsb',
    method:'post',
    data:query
  })
}
//编辑页面数据
export function getUpdateAll (query){
  return fetch ({
    url:'/api/course/aqsb/getUpdateAll',
    method:'get',
    params:query
  })
}
//保存编辑
export function  bcxg (query){
  return fetch({
    url:'/api/course/aqsb/bcxg',
    method:'post',
    data:query
  })
}
//删除
export function delAqsb (query){
  return fetch ({
    url : '/api/course/aqsb/delAqsb',
    method:'post',
    data:query
  })
}
