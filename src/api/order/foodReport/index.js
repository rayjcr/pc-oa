import fetch from 'utils/fetch';

/** 菜品统计接口**/
export function getMenuPageCountList(query) {
  return fetch({
    url: '/api/order/foodMenu/getCountPageList',
    method: 'get',
    params: query
  });
}
/** 心愿菜品统计接口**/
export function getWishPageCountList(query) {
  return fetch({
    url: '/api/order/foodWishReport/getCountPageList',
    method: 'get',
    params: query
  });
}
/** 配料统计接口**/
export function getIngredientsPageCountList(query) {
  return fetch({
    url: '/api/order/foodIngredients/getCountPageList',
    method: 'get',
    params: query
  });
}

/** 用户统计接口**/
export function getUserPageCountList(query) {
  return fetch({
    url: '/api/order/foodUserReport/getCountPageList',
    method: 'get',
    params: query
  });
}


