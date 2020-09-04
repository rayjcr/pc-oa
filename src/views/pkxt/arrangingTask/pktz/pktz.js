// 计算课表上午下午晚上分割行Index列表
import {getBj_js_kc_arr, hqjsgdsjkc} from "./gzyz";

export function computTableRowDivider(timeTable) {
  const result = [];
  if (timeTable.amLessonCount > 0 && timeTable.pmLessonCount > 0) {
    result.push(timeTable.amLessonCount);
  }
  if (timeTable.pmLessonCount > 0 && timeTable.eveLessonCount > 0) {
    result.push(timeTable.amLessonCount + timeTable.pmLessonCount);
  }
  return result;
}

// 初始化表格结构DataModel
export function initTableStructure(timeTable) {
  const result = [];
  for (let i = 0; i < timeTable.totalLessonCount; i++) {
    const rowData = [];
    for (let j = 0; j < timeTable.daysPerWeek; j++) {
      const cell = {};
      cell.jlid = '';
      cell.state = '0';
      cell.index = j + (i * timeTable.daysPerWeek);
      cell.row = i;
      cell.col = j;
      cell.pkjs = i + 1;
      cell.pkzs = timeTable.weekdayList[j];
      cell.courseName = '';
      cell.active = false;
      cell.enable = false;
      cell.children = [];
      cell.muiltiple = false;
      cell.ctype = '0';
      rowData.push(cell);
    }
    result.push(rowData);
  }
  return result;
}

export function initZcqStructure(timeTable) {
  const result = [];
  const startIndex = timeTable.totalLessonCount * timeTable.daysPerWeek;
  for (let i = 0; i < 2; i++) {
    const rowData = [];
    for (let j = 0; j < timeTable.daysPerWeek; j++) {
      const cell = {};
      cell.jlid = '';
      cell.state = '0';
      cell.index = j + (i * timeTable.daysPerWeek) + startIndex;
      cell.row = i;
      cell.col = j;
      cell.pkjs = i + 1;
      cell.pkzs = timeTable.weekdayList[j];
      cell.courseName = '';
      cell.active = false;
      cell.enable = false;
      cell.muiltiple = false;
      cell.children = [];
      cell.ctype = '1';
      rowData.push(cell);
    }
    result.push(rowData);
  }
  return result;
}

function getItem(data) {
  const result = Object.assign({},data[0]);
  let teacherName = '';
  if(data[0].isdjs === '1'){
    data.forEach(item=>{
      if(teacherName.indexOf(item.jsmc)==-1){
        teacherName+=item.jsmc
      }
      });
  }else{
    teacherName = result.jsmc && result.jsmc !== null && result.jsmc !== '' ? result.jsmc : '';
  }
  const kcName = result.kcmc && result.kcmc !== null && result.kcmc !== '' ? result.kcmc : '';
  result.children = [];
  data.forEach((item, index) => {
    result.children.push(item);
  });
  if (data.length === 1) {
    let courseName = teacherName + ' ' + kcName;
    if (result.isdsz === '1') {
      courseName = teacherName + ' 单:' + kcName;
    }
    if (result.isdsz === '2') {
      courseName = teacherName + ' 双:' + kcName;
    }
    if (result.ishb === '1') {
      courseName += '(合)';
    }
    result.courseName = courseName;
    result.muiltiple = false;
    return result;
  }
  const dzlb = [], szlb = [], hblb = [], dzhb = [], szhb = [];
  data.forEach((item, index) => {
    if (item.isdsz === '1') {
      dzlb.push(item);
      if (item.ishb === '1') {
        dzhb.push(item);
      }
    }
    if (item.isdsz === '2') {
      szlb.push(item);
      if (item.ishb === '1') {
        szhb.push(item);
      }
    }
    if (item.ishb === '1') {
      hblb.push(item);
    }
  });
  let courseName = teacherName + ' ' + kcName, singleName = teacherName + kcName, doubleName = teacherName + kcName;
  if (dzlb.length > 0) {
    let singleTeacher ='';
    if(dzlb[0].isdjs === '1'){
      dzlb.forEach(item=>{
        if(singleTeacher.indexOf(item.jsmc)==-1){
          singleTeacher+=item.jsmc
        }
      });
    }else{
      singleTeacher = dzlb[0].jsmc && dzlb[0].jsmc !== null && dzlb[0].jsmc !== '' ? dzlb[0].jsmc : '';
    }
    const singlekcName = dzlb[0].kcmc && dzlb[0].kcmc !== null && dzlb[0].kcmc !== '' ? dzlb[0].kcmc : '';
    singleName = singleTeacher + ' 单:' + singlekcName;
    if (dzhb.length > 0) {
      dzhb.forEach(item=> {
        if(singleName.indexOf(item.bjmc)==-1){
          singleName+=item.bjmc
        }
      });
      singleName += '(合)';
    }
  }
  if (szlb.length > 0) {
    let doubleTeacher ='';
    if(szlb[0].isdjs === '1'){
      szlb.forEach(item=> {
        if(doubleTeacher.indexOf(item.jsmc)==-1){
          doubleTeacher+=item.jsmc
        }
      });
    }else{
      doubleTeacher = szlb[0].jsmc && szlb[0].jsmc !== null && szlb[0].jsmc !== '' ? szlb[0].jsmc : '';
    }
    const doublekcName = szlb[0].kcmc && szlb[0].kcmc !== null && szlb[0].kcmc !== '' ? szlb[0].kcmc : '';
    doubleName = doubleTeacher + ' 双:' + doublekcName;
    if (szhb.length > 0) {
      szhb.forEach(item=> {
        if(doubleName.indexOf(item.bjmc)==-1){
          doubleName+=item.bjmc
        }
      });
      doubleName += '(合)';
    }
  }
  if (hblb.length > 0) {
    hblb.forEach(item=> {
      if(courseName.indexOf(item.bjmc)==-1){
        courseName+=item.bjmc
      }
    });
    courseName += '(合)';
  }
  result.courseName = courseName;
  result.singleName = singleName;
  result.doubleName = doubleName;
  if (dzlb.length > 0 && szlb.length > 0) {
    result.muiltiple = true;
    result.courseName = singleName+'/'+doubleName;
  } else {
    result.muiltiple = false;
    if (dzlb.length > 0) {
      result.courseName = singleName;
    }
    if (szlb.length > 0) {
      result.courseName = doubleName;
    }
  }
  return result;
}

export function getDataGroupByIndex(dataSet) {
  const result = [];
  // 按排课节数周数分组, 处理多教师及单双周情况(单双周多教师会有多条记录分配在同一个周数和节数上)
  dataSet.forEach(item => {
    const arr = _.find(result, o => o.pkzs === item.pkzs && o.pkjs === item.pkjs);
    if (arr) {
      arr.children.push(item);
    } else {
      const obj = {};
      obj.pkzs = item.pkzs;
      obj.pkjs = item.pkjs;
      obj.children = [];
      obj.children.push(item);
      result.push(obj);
    }
  });
  return result;
}

export function getTableContent(initContent, dataSet, timeTable) {
  dataSet.forEach(data => {
    const list = data.children;
    const item = getItem(list);
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    const index = col + (row * timeTable.daysPerWeek);
    const ctype = item.ctype;
    const cell = {};
    cell.zgh = item.zgh;
    cell.jsmc = item.jsmc;
    cell.kcdm = item.kcdm;
    cell.kcmc = item.kcmc;
    cell.courseName = item.courseName;
    cell.singleName = item.singleName;
    cell.doubleName = item.doubleName;
    cell.muiltiple = item.muiltiple;
    cell.bjdm = item.bjdm;
    cell.bjmc = item.bjmc;
    cell.njdm = item.njdm;
    cell.njmc = item.njmc;
    cell.ishb = item.ishb;
    cell.hbbj = item.hbbj;
    cell.isdjs = item.isdjs;
    cell.dzgh = item.dzgh;
    cell.isdsz = item.isdsz;
    cell.jlid = item.jlid;
    cell.pkid = item.pkid;
    cell.children = item.children;
    cell.state = '0';
    cell.index = index;
    cell.row = row;
    cell.col = col;
    cell.pkzs = pkzs;
    cell.pkjs = pkjs;
    cell.ctype = ctype;
    cell.active = false;
    cell.enable = true;
    try {
      initContent[row][col] = cell;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
  return initContent;
}

// 获取调整课程记录列表
export function swapCourse(from, to, coursePlanDataSet,timeTable) {
  // 将 from 的数据 放入 to 的位置
  const from_to_result= getMoveRecords(coursePlanDataSet,from,to,timeTable);

  // 将 to 的数据 放入 from 的位置
  const to_from_result= getMoveRecords(coursePlanDataSet,to,from,timeTable);

  return from_to_result.concat(to_from_result);
}
// 拼装展示所有的移动课表数据
export function showMoveDetail(that,records) {
  // 去重
  if(records.length>0){
    let showHtml = '';
    let fromHtml= '';
    let toHtml= '';
    let kcmc = '';
    const uniqList = _.uniqWith(records, _.isEqual);
    uniqList.forEach(re=>{
      kcmc = re.kcmc && re.kcmc !== null && re.kcmc !== '' ? re.kcmc : '';
      if(re.old_ctype==='1'){
        fromHtml = re.bjmc+'暂存区课程'+kcmc+'调整至';
      }else{
        fromHtml = re.bjmc+'周'+re.old_pkzs+'第'+re.old_pkjs+'节课程'+kcmc+'调整至';
      }
      if(re.ctype==='1'){
        toHtml = '暂存区';
      }else{
        toHtml = '周'+re.pkzs+'第'+re.pkjs+'节';
      }
      showHtml +='<tr><td>'+fromHtml+toHtml+'</td></tr>';
    })
    that.$notify({
      title: '操作明细',
      dangerouslyUseHTMLString: true,
      message: '<table>'+showHtml+'</table>'
    });
  }
}

function getZcqEmptyTableByBjdm(coursePlanDataSet,bjdm,timeTable) {
  const dataSet = coursePlanDataSet.filter(item => item.bjdm === bjdm && item.ctype === '1');
  const groupDataSet = getDataGroupByIndex(dataSet);
  const initContent = initZcqStructure(timeTable);
  const data = getTableContent(initContent, groupDataSet, timeTable);
  for (let i = 0, rows = data.length; i < rows; i++) {
    for (let j = 0, cols = data[i].length; j < cols; j++) {
      if (!data[i][j].enable) {
        return data[i][j];
      }
    }
  }
  return null;
}
// 获取所有的的课程调整记录，合班等特殊情况
function getMoveRecords(coursePlanDataSet,from, to,timeTable){
  //获取单次移动 课表明细
  const to_pkzs = parseInt(to.pkzs, 10);
  const to_pkjs = parseInt(to.pkjs, 10);
  const from_pkzs = parseInt(from.pkzs, 10);
  const from_pkjs = parseInt(from.pkjs, 10);
  let toBjkczg = getBj_js_kc_arr(to,coursePlanDataSet);
  let fromBjkczg = getBj_js_kc_arr(from,coursePlanDataSet);
  let records = getSingleMoveRecords(coursePlanDataSet,fromBjkczg,toBjkczg,timeTable);
  const currBjdm = toBjkczg.bjdm;
  // 普通课程 >> 合班
  if(toBjkczg.bjdmArr.size>1){
    // 目标为  合班情况下需要将 各个班级的课程判断后放入
    let flag = false;
    const from_to_waitForMove = [];
    // 获取因为目的班次为合班  需要将其他班级也调换
    toBjkczg.bjdmArr.forEach(bj=>{
      if(bj!==currBjdm){
        const fromjsxx= _.filter(coursePlanDataSet, plan =>
          plan.bjdm === bj
          && plan.pkzs === from_pkzs
          && plan.pkjs === from_pkjs
          && plan.ctype === fromBjkczg.ctype
        );
        const from_bjkczg_item = getBj_js_kc_arr(formatData(fromjsxx),coursePlanDataSet);
        // 判断是否可放入目标
        flag = hqjsgdsjkc(coursePlanDataSet,from_bjkczg_item,to_pkzs,to_pkjs);
        from_to_waitForMove.push(from_bjkczg_item);
      }
    });
    // 如果其他班级需要移动的课程 又是合班，需循环判断
    if(!flag){
      let other_waitForMove = [];
      from_to_waitForMove.forEach(item=>{
        //如果又是合班 且 之前的课程调换无冲突
        item.bjdmArr.delete(currBjdm);
        while(!flag&&item.bjdmArr>1){
          const otherItem= cycleCheck(item,from_pkzs,from_pkzs,from_pkjs,to_pkzs,to_pkjs,coursePlanDataSet);
          if(otherItem.length>0){
            other_waitForMove = other_waitForMove.concat(otherItem);
          }else{
            //当循环判断中有冲突时 跳出
            other_waitForMove = [];
            return;
          }

        }
        if(other_waitForMove.length===0){
          return;
        }
      })
      other_waitForMove.forEach(item=>{
        records = records.concat(getSingleMoveRecords(coursePlanDataSet,item,from,timeTable));
      })
    }
    // 当不通过时，需要放入暂存区
    from_to_waitForMove.forEach(item=>{
      if(flag){
        item.state = 2;
      }
      records = records.concat(getSingleMoveRecords(coursePlanDataSet,item,to,timeTable));
    })

  }else if(toBjkczg.bjdmArr.size>1&&fromBjkczg.bjdmArr.size>1){
    // 合班 >> 合班

  }else{
    // 合班>> 普通课程

  }
  return records;
}
// 循环判断 合班的队形课程 是否又是合班
function cycleCheck(item,from_pkzs,from_pkjs,to_pkzs,to_pkjs,coursePlanDataSet){
  let other_waitForMove = [];
  let flag = false;
  item.bjdmArr.forEach(bj=>{
    if(bj!==item.bjdm){
      const fromjsxx= _.filter(coursePlanDataSet, plan =>
        plan.bjdm === bj
        && plan.pkzs === from_pkzs
        && plan.pkjs === from_pkjs
        && plan.ctype === item.ctype
      );
      const from_bjkczg_item = getBj_js_kc_arr(formatData(fromjsxx),coursePlanDataSet);
      // 判断是否可放入目标
      flag = hqjsgdsjkc(coursePlanDataSet,from_bjkczg_item,to_pkzs,to_pkjs);
      if(flag){
        return [];
      }
      // 获取关联班级的替换节次
      const tojsxx= _.filter(coursePlanDataSet, plan =>
        plan.bjdm === bj
        && plan.pkzs === to_pkzs
        && plan.pkjs === to_pkjs
        && plan.ctype === item.ctype
      );
      const to_bjkczg_item = getBj_js_kc_arr(formatData(tojsxx),coursePlanDataSet);
      flag = hqjsgdsjkc(coursePlanDataSet,to_bjkczg_item,from_pkzs,from_pkjs);
      if(flag){
        return [];
      }
      other_waitForMove.push(to_bjkczg_item);
      other_waitForMove.push(from_bjkczg_item);

      from_bjkczg_item.bjdmArr.delete(item.bjdm);

      while(!flag&&from_bjkczg_item.bjdmArr>1){
        other_waitForMove = other_waitForMove.concat(cycleCheck(from_bjkczg_item,from_pkzs,from_pkzs,from_pkjs,to_pkzs,to_pkjs,coursePlanDataSet));
      }

    }
  })
  return other_waitForMove;
}
// 获取班级的暂存区位置
function getTmpIndex(coursePlanDataSet,bjdm,timeTable){
  const temp= getZcqEmptyTableByBjdm(coursePlanDataSet,bjdm,timeTable);
  // 暂存区满了
  if (temp === null) {
    console.log('暂存区满了');
    return null;
  }
  const tmpIndex = {pkzs:temp.pkzs,pkjs:temp.pkjs,ctype:temp.ctype};
  return tmpIndex;
}
// 获取单次移动的课表明细
function getSingleMoveRecords(coursePlanDataSet,from,to,timeTable){
  let to_pkzs = to.pkzs;
  let to_pkjs = to.pkjs;
  let to_ctype = to.ctype;
  // 可以安排 需要将to 放入暂存区
  if(from.state === 2){
    const tmp = getTmpIndex(coursePlanDataSet,from.bjdm,timeTable);
    if (tmp === null) {
      console.log("暂存区满了")
      return [];
    }
    to_pkzs = tmp.pkzs;
    to_pkjs = tmp.pkjs;
    to_ctype = tmp.ctype;
  }
  const records = [];
  // 当为合班时 ，同时将所有合班班级的课程放入目标节次。不开拆分
  from.bjdmArr.forEach(bj=>{
    const fromjsxx= _.filter(coursePlanDataSet, plan =>
      plan.bjdm === bj
        && plan.pkzs === from.pkzs
        && plan.pkjs === from.pkjs
        && plan.ctype === from.ctype
    );
    fromjsxx.forEach(item => {
      if (item.jlid !== null && item.jlid !== '') {
        const reco = {jlid:item.jlid,bjmc:item.bjmc,kcmc:item.kcmc,old_pkzs:item.pkzs,old_pkjs:item.pkjs,old_ctype:item.ctype,pkzs:to_pkzs,pkjs:to_pkjs,ctype:to_ctype};
        records.push(reco);
      }
    });
  })
  return records;
}
function formatData(data) {
  const result = Object.assign({},data[0]);
  result.children = [];
  data.forEach((item, index) => {
    result.children.push(item);
  });
  return result;
}
