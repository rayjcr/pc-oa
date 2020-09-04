import fetch from 'utils/fetch';

/** 页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/order/foodIngredients/list',
    method: 'get',
    params: query
  });
}
/** 验证名称不能重复**/
export function getValidaName(query) {
  return fetch({
    url: '/api/order/foodIngredients/getValidaName',
    method: 'get',
    params: query
  });
}
/** 保存信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/order/foodIngredients/add',
    method: 'post',
    data: query
  });
}
/** 修改排课任务信息接口**/
export function getUpdate(query) {
  return fetch({
    url: '/api/order/foodIngredients/update',
    method: 'put',
    data: query
  });
}

/** 删除信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/order/foodIngredients/' + id,
    method: 'delete'
  });
}

export function checkSpecificKey(str) {
  const specialKey = '[`~!#$^&*()=|{}\':;\',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]‘\'';
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
      return false;
    }
  }
  return true;
}

