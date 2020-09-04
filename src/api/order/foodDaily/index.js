import fetch from 'utils/fetch';

/** 页列表查询维护接口**/
export function getDailyList(query) {
  return fetch({
    url: '/api/order/foodDaily/getDailyList',
    method: 'get',
    params: query
  });
}

/** 查询分类列表接口**/
export function getMenuList(query) {
  return fetch({
    url: '/api/order/foodMenu/getDailyMenuList',
    method: 'get',
    params: query
  });
}

/** 保存信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/order/foodDaily/saveDaily',
    method: 'post',
    data: query
  });
}
/** 复制菜单信息接口**/
export function getCopyPrevWeekDaily(query) {
  return fetch({
    url: '/api/order/foodDaily/copyPrevWeekDaily',
    method: 'post',
    data: query
  });
}

/** 复制菜单信息接口**/
export function getRemovePrevWeekDaily(query) {
  return fetch({
    url: '/api/order/foodDaily/removePrevWeekDaily',
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

/** 获取进餐时段列表接口**/
export function getFoodTimeList(query) {
  return fetch({
    url: '/api/order/foodTime/getFoodTimeList',
    method: 'get',
    params: query
  });
}
/** 保存进餐时段数据接口**/
export function getSaveFoodTime(query) {
  return fetch({
    url: '/api/order/foodTime/getSaveFoodTime',
    method: 'post',
    data: query
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

export function parseTime(date = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss') {
  date = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
  const curreDate = new Date();
  const o = {
    'M+': curreDate.getMonth() + 1, // 月份
    'd+': curreDate.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468' : '') + week[date.getDay() + '']);
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return fmt;
}

/** 验证正整数**/
export function checkNumber(value) {
  const re = /^(0|\+?[1-9][0-9]*)$/;
  if (value.length > 0 && !re.test(value)) {
    return false;
  }
  return true;
}
