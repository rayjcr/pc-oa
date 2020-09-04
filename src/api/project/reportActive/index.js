import fetch from 'utils/fetch';

// 删除报告单内容项
//删除报告单
export function delBgdSz(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgd/BgdSz/' + query.xxdm + '/' + query.id + '/false',
      method: 'delete'
      // params: query
  });
}

// 获取预览报告单

//获取报告单项目信息（无成绩信息及班级成绩信息）
export function Getylbgd(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v2/Bgd/GetBgdXmInfo',
      method: 'post',
      params: query
  });
}

// 保存学生报告单扩展信息（即保存学生活动报告单）
export function SaveActiveRep(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgd/SaveBgdExtendInfo',
      method: 'post',
      data: query
  });
}

// 获取年级下全部班级
export function getBj(params) {
  // console.log(params)
  return fetch({
    url: '/api/base/jcBjsj/getBjListByNjdm',
    method: 'get',
    params
  });
}

/**
 * @description: 获取报告单活动分析分组
 * @param {xxdm, bgdid, bgdszid, bjdm} 学校代码 报告单编号 报告单设置编号 班级代码
 * @return: 活动分组列表
 */
export function GetActiveGroup(params) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgdfz/List',
    method: 'get',
    params
  });
}

/**
 * @description: 添加活动分组
 * @param {mc, xxdm, xn, xq, njdm, bjid, bgdid, bgdszid} 组名称,学校代码,学年,学期,年级代码,班级代码,报告单编号,报告单设置编号
 * @return: 成功与否布尔值
 */
export function SaveActiveGroup(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgdfz/Insert',
      method: 'post',
      data: query
  });
}

/**
 * @description: 删除报告单分组
 * @param {type} /smartcredit/v1/Bgdfz/Delete
 * @return: 
 */
export function delgroup(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgdfz/Delete/?id=' + query.id,
      method: 'post'
      // data: query
  });
}
/**
 * @description: 清空报告单分组
 * @param {type} /smartcredit/v1/Bgdfz/ClearBgdFZ
 * @return: 
 */
export function cleargroup(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgdfz/ClearBgdFZ',
      method: 'get',
      params: query
  });
}
/**
 * @description: 复制活动分组
 * @param {type} /smartcredit/v1/Bgdfz/CopyBgdFz
 * @return: 
 */
export function copyGroup(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgdfz/CopyBgdFz',
      method: 'get',
      params: query
  });
}

// 删除文件 /smartcredit/v1/Upload/DeleteFile
export function delwj(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Upload/DeleteFile/' + query.id,
      method: 'delete'
  });
}



// 根据bjdm获取班级所有学生
// bjid, xn, xxdm
export function Getallbjxslist(params) {
  return fetch({
    url: '/api/base/jcXsbjgx/studentsBybjid',
    method: 'get',
    params: params
  })
}


/**
 * @description: 保存/修改报告单分组成员 /smartcredit/v1/Bgdfz/UpdateBgdFzCy
 * @param {xxdm, xn, xq, bgdfzid, list:[], isenter:num} isenter 1入组  2退出
 * @return: 
 */
export function SaveGroupNumber(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgdfz/UpdateBgdFzCy',
      method: 'post',
      data: query
  });
}


/**
 * @description: 获取报告单分组成员
 * @param {bgdfzid xxdm xn xq} 
 * @return: 
 */
export function getgroupNum(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgdfz/GetBgdFzCy',
      method: 'get',
      params: query
  });
}


// 下载模板
export function ImportTemplateDownload (query) {
  return fetch({
    url: '/api/netcore/smartcredit/v2/Bgd/DownloadExcelTemplateBgdxx',
    method: 'post',
    responseType: 'arraybuffer',
    data: query
  })
}

// 报告单设置单项保存 /smartcredit/v1/Bgd/SaveReportOneSetting
export function SavereportsetOne(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgd/SaveReportOneSetting',
      method: 'post',
      data: query
  });
}

// 报告单设置排序 /smartcredit/v1/Bgd/ReportSettingSort
export function SortreportSet(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgd/ReportSettingSort',
      method: 'post',
      data: query
  });
}

// 搜索
// 获取当前人有权限的班级
export function Getjurisdiction(params) {
  return fetch({
    url: '/api/base/jcBjsj/getChargeClass',
    method: 'get',
    params: params
  })
}

// 获取当前学年学期 jcXndm/getCurrentXnxq

// export function Getxnxq(params) {
//   return fetch({
//     url: '/api/base/jcXndm/getCurrentXnxq',
//     method: 'get',
//     params: params
//   })
// }


// 删除活动分析项 /smartcredit/v1/Bgd/DeleteReportActivityProject

export function delhdfxx(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgd/DeleteReportActivityProject/?SchoolCode=' + query.SchoolCode + '&Id=' + query.Id,
    method: 'delete'
    // params: query
  });
}

// 删除评价项 /smartcredit/v1/Bgd/DeleteReportActivityAppraise

export function delhdpj(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgd/DeleteReportActivityAppraise/?SchoolCode=' + query.SchoolCode + '&Id=' + query.Id,
    method: 'delete'
  });
}

//删除报告单
export function delBgds(query) {
  return fetch({
      url: '/api/netcore/smartcredit/v1/Bgd/' + query.id + '/false',
      method: 'delete'
      // params: query
  });
}