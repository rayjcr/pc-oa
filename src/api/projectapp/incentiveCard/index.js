import fetch from 'utils/fetch';
const prea = '/api/base/' // base拼接
const prejlk = '/api/jlk/' // jlk 拼接


/** 按ckr查询当前学年学期 各类卡片持卡数量 **/
export function glkpcksl(query) {
  return fetch({
    url: `${prejlk}jlkglKpbfqxb/getKpidList`,
    method: 'post',
    data: query
  });
}

/** 验证卡片名称是否重复**/
export function kpcf(query) {
  return fetch({
    url: `${prejlk}jlkglkpxx/getValidaKpmc?kpmc=${query.kpmc}`,
    method: 'get',
    data: query
  });
}


/** 删除分项 **/
export function scfx(query) {
  return fetch({
    url: `${prejlk}jlkglkpxx/deleteJlkFxKpxxb`,
    method: 'post',
    data: query
  });
}

/** 删除评语 **/
export function scfxpy(query) {
  return fetch({
    url: `${prejlk}jlkglkpxx/deleteJlkkppy`,
    method: 'post',
    data: query
  });
}

/** 删除高级卡 **/
export function gjk(query) {
  return fetch({
    url: `${prejlk}jlkglkpxx/deleteJlkGjkszxxb`,
    method: 'post',
    data: query
  });
}

/** 独立设置持卡参数 **/
export function dlszck(query) {
  return fetch({
    url: `${prejlk}jlkglKpbfqxb/dlszck`,
    method: 'post',
    data: query
  });
}

/** 所有学年**/
export function allxn(query) {
  return fetch({
    url: `${prea}jcXndm/queryXnList?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 根据学年学期，查询卡片信息 **/
export function fkkpxx(query) {
  return fetch({
    url: `${prea}jcBjsj/getNjBjList?xxdm=${query.xxdm}&xndm=${query.xndm}`,
    method: 'get',
    data: query
  });
}

/** 获取班级信息 **/
export function getbjxx(query) {
  return fetch({
    url: `${prea}jlkglkpxx/getKpxxByXnxq?xxdm=${query.xxdm}&xqdn=${query.xqdm}&xndm=${query.xndm}`,
    method: 'get',
    data: query
  });
}

/** 设置权限接口**/
export function szqxjk(obj) {
  return fetch({
    url: `${prejlk}fkqx/add`,
    method: 'post',
    data: obj
  });
}


/** 查询卡片设置列表**/
export function cxkpsz(obj) {
  return fetch({
    url: `${prejlk}fkjl/pagelist`,
    method: 'post',
    data: obj
  });
}

/** 上榜统计**/
export function sbtjlist(obj) {
  return fetch({
    url: `${prejlk}jlkyftj/sbtj`,
    method: 'post',
    data: obj
  });
}

/** 统计排名**/
export function tjpm(obj) {
  return fetch({
    url: `${prejlk}jlkyftj/pmtj?xxdm=${obj.xxdm}&xqdm=${obj.xqdm}&xndm=${obj.xndm}`,
    method: 'put',
    data: obj
  });
}

/** 根据建班学年查询班级列表**/
export function xnnjlist(query) {
  return fetch({
    url: `${prea}jcNjsjlx/selectNjList?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 根据建班学年查询班级列表**/
export function xnbjlist(query) {
  return fetch({
    url: `${prea}jcBjsj/selectBjList?xxdm=${query.xxdm}&dqxn=${query.dqxn}`,
    method: 'get',
    data: query
  });
}

/** 查询短信**/
export function cxdx(query) {
  return fetch({
    url: `${prejlk}fkqrdxtz/getSetUpParameters`,
    method: 'post',
    data: query
  });
}


/** 学生获卡 详情列表**/
export function hkxq(query) {
  return fetch({
    url: `${prejlk}jlkhkcx/detail`,
    method: 'post',
    data: query
  });
}

/** 获取已设置权限数据列表**/
export function yszqxsjlb(query) {
  return fetch({
    url: `${prejlk}yddxq/list?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 获卡查询内容列表**/
export function gethklist(obj) {
  return fetch({
    url: `${prejlk}jlkhkcx/list`,
    method: 'post',
    data: obj
  });
}


/** 保存激励卡片信息**/
export function savejlk(obj) {
  return fetch({
    url: `${prejlk}jlkglkpxx/saveJlkglKpxxb`,
    method: 'post',
    data: obj
  });
}

/** 修改激励卡片信息**/
export function modifyjlk(obj) {
  return fetch({
    url: `${prejlk}jlkglkpxx/modifyJlkglKpxxb`,
    method: 'post',
    data: obj
  });
}

/** 激励卡琅琊榜展示规则保存**/
export function lybsave(obj) {
  return fetch({
    url: `${prejlk}jlkyftj/jlklybgzsz?zspm=${obj.zspm}&xxdm=${obj.xxdm}`,
    method: 'put',
    data: obj
  });
}

/** 移动端权限设置 **/
export function yddqxsz(obj) {
  return fetch({
    url: `${prejlk}yddxq/add`,
    method: 'post',
    data: obj
  });
}

/** 查询激励卡琅琊榜展示规则 **/
export function lybzsgz(obj) {
  return fetch({
    url: `${prejlk}jlkyftj/cxLybzsgz?xxdm=${obj.xxdm}`,
    method: 'post',
    data: obj
  });
}


// jcBjsj/getNjBjList

/** 导出获卡查询列表**/
export function exporthklist(obj) {
  return fetch({
    url: `${prejlk}jlkhkcx/export`,
    method: 'post',
    data: obj,
    responseType: 'arraybuffer'
  });
}

/**
 * 上榜统计导出
 *
 **/
export function exportsbtj(obj) {
  return fetch({
    url: `${prejlk}jlkyftj/export`,
    method: 'post',
    data: obj,
    responseType: 'arraybuffer'
  });
}

/** 发卡权限列表接口**/
export function fkqxlb(obj) {
  return fetch({
    url: `${prejlk}fkqx/list`,
    method: 'post',
    data: obj
  });
}

/** 查看卡片信息**/
export function itemcard(obj) {
  return fetch({
    url: `${prejlk}jlkglkpxx/getJlkglKpxxb`,
    method: 'post',
    data: obj
  });
}

/** 复制卡片信息**/
export function copycard(obj) {
  return fetch({
    url: `${prejlk}jlkglkpxx/copyJlkglKpxxb`,
    method: 'post',
    data: obj
  });
}

/** 设置短信发送通知 保存**/
export function bcduanxin(obj) {
  return fetch({
    url: `${prejlk}fkqrdxtz/szdxtz`,
    method: 'post',
    data: obj
  });
}

/** 按xxdm,xndm,xqdm,ckrlx查询各类卡片持卡数量**/
export function kpcks(obj) {
  return fetch({
    url: `${prejlk}jlkglPlszckjlb/getKpidList`,
    method: 'post',
    data: obj
  });
}

/** 批量设置持卡  保存**/
export function plszcksave(obj) {
  return fetch({
    url: `${prejlk}jlkglPlszckjlb/plszck`,
    method: 'post',
    data: obj
  });
}

/** 删除卡片信息**/
export function delcard(obj) {
  return fetch({
    url: `${prejlk}jlkglkpxx/deleteJlkglKpxxb`,
    method: 'post',
    data: obj
  });
}

/** 发卡记录（按钮）**/
export function fkjl(obj) {
  return fetch({
    url: `${prejlk}fkjl/xspagelist`,
    method: 'post',
    data: obj
  });
}
/** 根据学年学期和学校代码获取查询卡片信息**/
export function xnxqcardinformations(query) {
  return fetch({
    url: `${prejlk}jlkglkpxx/getKpxxByXnxq?xxdm=${query.xxdm}&xndm=${query.xndm}&xqdm=${query.xqdm}`,
    method: 'get',
    data: query
  });
}

/** 发卡根据学年学期和学校代码获取查询卡片信息**/
export function fkxnxqcardinformations(query) {
  return fetch({
    url: `${prejlk}jlkglkpxx/getKplxList?xxdm=${query.xxdm}&dqxn=${query.dqxn}&dqxq=${query.dqxq}`,
    method: 'get',
    data: query
  });
}

/** 查询卡片列表**/
export function findcardlist(obj) {
  return fetch({
    url: `${prejlk}jlkglkpxx/list`,
    method: 'post',
    data: obj
  });
}

/** 所有学期**/
export function allxq(query) {
  return fetch({
    url: `${prea}jcXqdm/queryXqList?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 获取分项评语**/
export function hqpfx(query) {
  return fetch({
    url: `${prejlk}kppy/selectKppyList?id=${query.id}&xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 获取当前学年学期**/
export function dqxnxq(query) {
  return fetch({
    url: `${prea}jcXndm/getCurrentXnxq?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

/** 获取所有年级**/
export function allnj(query) {
  return fetch({
    url: `${prea}jcNjsjlx/selectNjList?xxdm=${query.xxdm}`,
    method: 'get',
    data: query
  });
}

// ==================================================

/** 修改排课任务信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/course/kswh/' + id,
    method: 'put',
    data: query
  });
}

/** 删除排课任务信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/course/kswh/' + id,
    method: 'delete'
  });
}
