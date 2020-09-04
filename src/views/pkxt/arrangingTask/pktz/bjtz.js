import * as gzyz from './gzyz.js'

export function getTeacherTableContent(initContent, dataSet, timeTable) {
  dataSet.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    const index = col + (row * timeTable.daysPerWeek);
    const cell = {};
    cell.bjdm = item.bjdm;
    cell.bjmc = item.bjmc;
    cell.njdm = item.njdm;
    cell.njmc = item.njmc;
    cell.kcmc = item.kcmc;
    cell.kcdm = item.kcdm;
    cell.children = item.children;
    cell.state = '0';
    cell.index = index;
    cell.row = row;
    cell.col = col;
    cell.pkzs = pkzs;
    cell.pkjs = pkjs;
    cell.active = false;
    try {
      initContent[row][col] = cell;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
  return initContent;
}

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
      } else {
        if (element.active) {
          tableCellDataSet[row][col].state = 2;
          tableCellDataSet[row][col].enable = true;
        }
      }
    });
  });
  return tableCellDataSet;
}

// 被调课程是否可排
function btkcsfkp(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet, ruleDataSet,ignore_role) {
  enableCellDataSet.forEach(item => {
    item.forEach(element => {
      const col = element.col;
      const row = element.row;
      const enable = element.enable;
      if (!enable) {
        // 目标节次课程
        const data = mainTableDataSet[row][col];
        // 获取目标节次所有的班级 教师
        const targetBjkczg = gzyz.getBj_js_kc_arr(data,coursePlanDataSet);
        // 获取当前节次 班级 老师 课程
        const curBjkczg = gzyz.getBj_js_kc_arr(curActive,coursePlanDataSet);

        // 目标节次课程有课时，判断 当前>>目标 无冲突  目标>>当前 无冲突
        // 验证当前 到目标  是否冲突
        const from_to_flag = gzyz.hqjsgdsjkc(coursePlanDataSet, curBjkczg, targetBjkczg.pkzs,targetBjkczg.pkjs);
        if (from_to_flag) {
          element.enable = true;
          return;
        }
        // 如果需要验证固定规则
        if(!ignore_role){
          if (curActive.ctype === '0') {
            const flag = gzyz.gdsjsfkpk(curActive.pkzs,curActive.pkjs, targetBjkczg, ruleDataSet);
            if (!flag) {
              element.enable = true;
              return;
            }
          } else { // 固定排课程不能不能放到暂存区调、
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
        // 走到这里 说明 当前 >> 目标 是无冲突的
        // 如果目标节次  >>  当前节次 是否冲突
        if (curActive.ctype === '0') {
          const to_from_flag = gzyz.hqjsgdsjkc(coursePlanDataSet, targetBjkczg, curBjkczg.pkzs,curBjkczg.pkjs);
          if (to_from_flag) {
            console.log('可安排!');
            element.enable = true;
            element.active = true;
          }
        }




/*        if (data.jlid !== null && data.jlid !== '') {
/!*          if (data.isdjs && data.isdjs === '1') {
            element.enable = true;
            return;
          }
          if (data.isdsz && data.isdsz !== '0') {
            element.enable = true;
            return;
          }
          if (data.ishb && data.ishb === '1') {
            element.enable = true;
            return;
          }*!/
          if (curActive.ctype === '0') {
            const flag = gzyz.gdsjsfkpk(curActive.pkzs,curActive.pkjs, data, ruleDataSet);
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
          // 走到这里 说明 当前 >> 目标 是无冲突的
          // 如果目标节次  >>  当前节次 是否冲突
          if (curActive.ctype === '0') {
            const to_from_flag = gzyz.hqjsgdsjkc(coursePlanDataSet, targetBjkczg, curBjkczg);
            if (!to_from_flag) {
              console.log('可安排!');
              element.enable = true;
              element.active = true;
            }
          }
        }*/
      }
    });
  });
}

// 根据规则计算可交换课程坐标列表
export function computEnableCell(mainTableDataSet, initContent, ruleDataSet, curActive, timeTable, coursePlanDataSet,ignore_role) {
  if (curActive === null) {
    return [];
  }
  // 当前选中课程教师如果有固定排规则，则该课程不能和其他任何课程对调
  const enableCellDataSet = initContent;
  if (curActive.ctype === '0') {
    enableCellDataSet[curActive.row][curActive.col].enable = true; // 排除当前选中表格坐标
  }
  // 不跳过固定规则时 需要验证
  if(!ignore_role){
    if (gzyz.kcjsgdp(curActive, ruleDataSet,coursePlanDataSet)) {
      console.log('当前选中课程为固定排课程不可对调!');
      return [];
    }
    const curbjkczg = gzyz.getBj_js_kc_arr(curActive,coursePlanDataSet);
    gzyz.bjbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除班级不排课表格坐标
    gzyz.bjkcgdbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除班级课程固定不排课表格坐标
    gzyz.bjkcgdpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除班级课程固定排课表格坐标
    gzyz.jsgdbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet); // 排除教师固定不排课表格坐标
  }
  // 被调课程是否可排
  btkcsfkp(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet, ruleDataSet,ignore_role);
  return enableCellDataSet;
}

export function computZcqEnableCell(mainTableDataSet, initContent, ruleDataSet, curActive, timeTable, coursePlanDataSet,ignore_role) {
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
              const flag = gzyz.gdsjsfkpk(curActive.pkzs,curActive.pkjs, targetBjkczg, ruleDataSet);
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
