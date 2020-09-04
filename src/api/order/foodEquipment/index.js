import fetch from 'utils/fetch';

/** 查询设备维护列表**/
export function getEquipmentList(query) {
  return fetch({
    url: '/api/order/foodEquipment/getEquipmentList',
    method: 'get',
    params: query
  });
}
/** 保存信息接口**/
export function saveEquipment(query) {
  return fetch({
    url: '/api/order/foodEquipment/saveEquipment',
    method: 'post',
    data: query
  });
}
/** 验证是否寻在**/
export function checkEquipmentCode(query) {
  return fetch({
    url: '/api/order/foodEquipment/checkEquipmentCode',
    method: 'get',
    params: query
  });
}
/** 验证是否寻在**/
export function updateBase(query) {
  return fetch({
    url: '/api/order/foodEquipment/updateBaseData',
    method: 'get',
    params: query
  });
}

/** 删除信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/order/foodEquipment/' + id,
    method: 'delete'
  });
}

export function checkSpecificKey(str) {
/*  const specialKey = '[`~!#$^&*()=|{}\':;\',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]‘\'';
  for (let i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
      return false;
    }
  }*/
  return /^[\d\w]+$/.test(str);
}

