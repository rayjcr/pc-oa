import * as gzyz from './gzyz.js'

// 获取可交换课程内容列表
export function getSwapCourseList(enableCellDataSet, tableCellDataSet) {
  enableCellDataSet.forEach(item => {
    item.forEach(element => {
      const col = element.col;
      const row = element.row;
      const enable = element.enable;
      if (!enable) {
        tableCellDataSet[row][col].state = 1;
        tableCellDataSet[row][col].enable = true;
      }
    });
  });
  return tableCellDataSet;
}

// 特殊课程不能调课
function tskcbpk(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet, ruleDataSet,ignore_role) {
  enableCellDataSet.forEach(item => {
    item.forEach(element => {
      const col = element.col;
      const row = element.row;
      const pkzs = element.pkzs;
      const pkjs = element.pkjs;
      const enable = element.enable;
      if (!enable) {
        // 验证是否特殊课程
        const data = mainTableDataSet[row][col];
        // 获取目标节次所有的班级 教师
        const targetBjkczg = gzyz.getBj_js_kc_arr(data,coursePlanDataSet);
        // 获取当前节次 班级 老师 课程
        const curBjkczg = gzyz.getBj_js_kc_arr(curActive,coursePlanDataSet);
        if (data.jlid !== null && data.jlid !== '') {
          // 验证当前选中课程教师是否同一时间点上多个课程
          if (curActive.zgh && curActive.zgh !== null && curActive.zgh !== '') {
            const from_to_flag = gzyz.hqjsgdsjkc(coursePlanDataSet, curBjkczg,targetBjkczg.pkzs,targetBjkczg.pkjs);
            if (from_to_flag) {
              console.log('cur教师时间冲突!' + curActive.zgh + ', zs: ' + pkzs + ', js: ' + pkjs);
              element.enable = true;
              return;
            }
          }
          if(!ignore_role){
            if (curActive.ctype === '0') {
              const flag = gzyz.gdsjsfkpk(curActive.pkzs,curActive.pkjs, targetBjkczg, ruleDataSet);
              if (!flag) {
                element.enable = true;
                return;
              }
            } else { // 固定排课程不能调、不能放到暂存区
              //const bjkcgdpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 1 }), { bjdm: data.bjdm, kcdm: data.kcdm, pkzs: data.pkzs, pkjs: data.pkjs });
              const bjkcgdpArr = _.filter(ruleDataSet.bjgdpk,item=>
                item.sfpk == 1
                &&item.pkzs==targetBjkczg.pkzs
                &&item.pkjs==targetBjkczg.pkjs
                &&targetBjkczg.bjdmArr.has(item.bjdm)
                &&targetBjkczg.kcdmArr.has(item.kcdm)
              );
              if (bjkcgdpArr.length > 0) {
                console.log('===班级课程固定排===')
                return false;
              }
            }
          }
          if (curActive.ctype === '0') {
            const to_from_flag = gzyz.hqjsgdsjkc(coursePlanDataSet, targetBjkczg, curBjkczg.pkzs,curBjkczg.pkjs);
            if (to_from_flag) { // 可安排
              console.log('swap教师时间冲突!' + data.zgh + ', zs: ' + curActive.pkzs + ', js: ' + curActive.pkjs);
              element.enable = true;
            }
          }
        }
      }
    });
  });
}

// 根据规则计算可交换课程坐标列表
export function computEnableCell(mainTableDataSet, initContent, ruleDataSet, curActive, timeTable, coursePlanDataSet,ignore_role) {
  // 单双周 合班 课程规则判断
  if (curActive === null) {
    return [];
  }
  // 当前选中课程教师如果有固定排规则，则该课程不能和其他任何课程对调
  const enableCellDataSet = initContent;
  if (curActive.ctype === '0') {
    enableCellDataSet[curActive.row][curActive.col].enable = true; // 排除当前选中表格坐标
  }
  if(!ignore_role){
    if (gzyz.kcjsgdp(curActive, ruleDataSet,coursePlanDataSet)) {
      console.log('固定排课程不可对调!');
      return [];
    }
    const curbjkczg = gzyz.getBj_js_kc_arr(curActive,coursePlanDataSet);
    gzyz.bjbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除班级不排课表格坐标
    gzyz.bjkcgdbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除班级课程固定不排课表格坐标
    gzyz.jsgdbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除教师固定不排课表格坐标
  }
  // 排除特殊课程表格坐标
  tskcbpk(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet, ruleDataSet,ignore_role);
  return enableCellDataSet;
}

export function computZcqEnableCell(mainTableDataSet, initContent, ruleDataSet, curActive, timeTable, coursePlanDataSet,ignore_role) {
  // xxxxxx
  if (curActive === null) {
    return [];
  }
  if(!ignore_role){
    if (gzyz.kcjsgdp(curActive, ruleDataSet,coursePlanDataSet)) {
      console.log('固定排课程不可对调!');
      return [];
    }
  }
  const enableCellDataSet = initContent;
  if (curActive.ctype === '0') {
    enableCellDataSet.forEach(item => {
      item.forEach(element => {
        const col = element.col;
        const row = element.row;
        const enable = element.enable;
        if (!enable) {
          const data = mainTableDataSet[row][col];
          if (data.jlid !== null && data.jlid !== '') {
            const targetBjkczg = gzyz.getBj_js_kc_arr(data,coursePlanDataSet);
            if(!ignore_role){
              const flag = gzyz.gdsjsfkpk(curActive, targetBjkczg, ruleDataSet);
              if (!flag) {
                element.enable = true;
                return;
              }
            }
            const to_from_flag = gzyz.hqjsgdsjkc(coursePlanDataSet, targetBjkczg, curActive.pkzs,curActive.pkjs);
            if (to_from_flag) {
              element.enable = true;
            }
          }
        }
      });
    });
  }
  return enableCellDataSet;
}
