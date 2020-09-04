import fetch from '@/utils/fetch';
// import '@/mock/dormitoryManagement/index';
const base = '/api/base/' // 基础数据
const card = '/api/evaluation/'
/** 获取卡片类型**/
export function atmCategory(obj) {
  return fetch({
    url: `${card}atmCategory/getPage`,
    method: 'post',
    data: obj
  });
}

/** 新增卡片类型**/
export function addOrUpdateInfo(obj) {
  return fetch({
    url: `${card}atmCategory/addOrUpdateInfo`,
    method: 'post',
    data: obj
  });
}

/** 删除卡片类型**/
export function cardDelete(obj) {
  return fetch({
    url: `${card}atmCategory/delete`,
    method: 'post',
    data: obj
  });
}

/** 获取卡片信息**/
export function getCardDetails(obj) {
  return fetch({
    url: `${card}atmCategory/getDetails`,
    method: 'get',
    data: obj
  });
}


/** 添加卡号**/
export function addOrUpdateInfoCardNum(obj) {
  return fetch({
    url: `${card}atmCard/addOrUpdateInfo`,
    method: 'post',
    data: obj
  });
}

/** 获取卡号列表**/
export function pageCardList(obj) {
  return fetch({
    url: `${card}atmCard/pageList`,
    method: 'post',
    data: obj
  });
}

/** 删除卡号**/
export function deleteCardCode(obj) {
  return fetch({
    url: `${card}atmCard/delete`,
    method: 'post',
    data: obj
  });
}


/** 添加兑换记录(供测试使用)**/
export function recordSave(obj) {
  return fetch({
    url: `${card}atmRecord/save`,
    method: 'post',
    data: obj
  });
}

/** 获取兑换记录**/
export function recordPageList(obj) {
  return fetch({
    url: `${card}atmRecord/getPage`,
    method: 'post',
    data: obj
  });
}

