import fetch from 'utils/fetch';

/** 页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/order/foodMenu/list',
    method: 'get',
    params: query
  });
}
/** 验证名称不能重复**/
export function getValidaName(query) {
  return fetch({
    url: '/api/order/foodMenu/getValidaName',
    method: 'get',
    params: query
  });
}
/** 保存信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/order/foodMenu/add',
    method: 'post',
    data: query
  });
}
/** 修改排课任务信息接口**/
export function getUpdate(query) {
  return fetch({
    url: '/api/order/foodMenu/update',
    method: 'put',
    data: query
  });
}

/** 删除信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/order/foodMenu/' + id,
    method: 'delete'
  });
}

/** 查询分类列表接口**/
export function getTypeList(query) {
  return fetch({
    url: '/api/order/foodType/getTypeList',
    method: 'get',
    params: query
  });
}
/** 查询配料列表接口**/
export function getIngredientsList(query) {
  return fetch({
    url: '/api/order/foodIngredients/getIngredientsList',
    method: 'get',
    params: query
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

/** 验证正整数**/
export function checkNumber(value) {
  const re = /^\d+(\.\d{0,2})?$/;
  if (re.test(value)) {
    return true;
  } else {
    return false;
  }
}


