import fetch from 'utils/fetch';

/** 页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/order/foodType/list',
    method: 'get',
    params: query
  });
}
/** 验证名称不能重复**/
export function getValidaName(query) {
  return fetch({
    url: '/api/order/foodType/getValidaName',
    method: 'get',
    params: query
  });
}
/** 保存信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/order/foodType/add',
    method: 'post',
    data: query
  });
}
/** 修改排课任务信息接口**/
export function getUpdate(query) {
  return fetch({
    url: '/api/order/foodType/update',
    method: 'put',
    data: query
  });
}

/** 删除信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/order/foodType/' + id,
    method: 'delete'
  });
}

/** 设置点餐总次数**/
export function getUpdateCount(query) {
  return fetch({
    url: '/api/order/foodType/getUpdateCount',
    method: 'get',
    params: query
  });
}

/** 验证特殊字符**/
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
  const re = /^(0|\+?[1-9][0-9]*)$/;
  if (value.length > 0 && !re.test(value)) {
    return false;
  }
  return true;
}


