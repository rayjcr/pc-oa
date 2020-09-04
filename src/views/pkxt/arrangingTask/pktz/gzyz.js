// 班级不排课
export function bjbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet) {
  /*const bjbpkArr = _.filter(ruleDataSet.bjbpk, { bjdm: curActive.bjdm });*/
  const bjbpkArr = _.filter(ruleDataSet.bjbpk,item=>
    curbjkczg.bjdmArr.has(item.bjdm)
  );
  bjbpkArr.forEach(item => {
    const pkzs = parseInt(item.bpkzs, 10);
    const pkjs = parseInt(item.bpkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    console.log('班级不排课: pkzs-' + pkzs + ',pkjs-' + pkjs );
    try {
      enableCellDataSet[row][col].enable = true;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
}

// 班级课程固定不排课
export function bjkcgdbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet) {
  //const bjkcgdbpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 2 }), { bjdm: curActive.bjdm, kcdm: curActive.kcdm });
  const bjkcgdbpArr = _.filter(ruleDataSet.bjgdpk,item=>
    item.sfpk==2
    &&curbjkczg.bjdmArr.has(item.bjdm)
    &&curbjkczg.kcdmArr.has(item.kcdm)
  );
  bjkcgdbpArr.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    console.log('班级课程固定不排课: pkzs-' + pkzs + ',pkjs-' + pkjs+'固定不排'+item.kcdm);
    try {
      enableCellDataSet[row][col].enable = true;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
}

// 班级课程固定排课
export function bjkcgdpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet) {
  //const bjkcgdpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 1 }), { bjdm: curActive.bjdm });
  const bjkcgdpArr = _.filter(ruleDataSet.bjgdpk,item=>
    item.sfpk==1
    &&curbjkczg.bjdmArr.has(item.bjdm)
  );
  bjkcgdpArr.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    const kcdm = item.kcdm;
    if (!curbjkczg.kcdmArr.has(kcdm)) {
      console.log('班级课程固定排课:pkzs-' + pkzs + ',pkjs-' + pkjs+ '固定排'+kcdm );
      try {
        enableCellDataSet[row][col].enable = true;
      } catch (e) {
        console.log('error: row: ' + row + ' col: ' + col);
      }
    }
  });
}

// 教师固定不排课
export function jsgdbpk(ruleDataSet, curbjkczg, timeTable, enableCellDataSet) {
  //const jsgdbpkArr = _.filter(ruleDataSet.jsgdpk, item => item.sfpk === 2 && item.zgh === curActive.zgh && item.kcdm === curActive.kcdm);
  const jsgdbpkArr = _.filter(ruleDataSet.jsgdpk, item =>
    item.sfpk === 2
    && curbjkczg.zghArr.has(item.zgh)
    && curbjkczg.kcdmArr.has(item.kcdm)
  );
  jsgdbpkArr.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    console.log('教师' + item.zgh + '固定不排课: pkzs-' + pkzs + ',pkjs-' + pkjs+ '固定不排'+item.kcdm);
    try {
      enableCellDataSet[row][col].enable = true;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
}


// 判断教师在指定节次上课时间是否有冲突
export function hqjsgdsjkc(coursePlanDataSet, fromBjkczg, topkzs,topkjs) {
  //return _.filter(coursePlanDataSet, value => value.zgh === zgh && value.pkzs === pkzs && value.pkjs === pkjs
  // && value.ctype === '0' && value.bjdm !== bj);
  const result = _.filter(coursePlanDataSet, value =>
    fromBjkczg.zghArr.has(value.zgh)
    && value.pkzs === topkzs
    && value.pkjs === topkjs
    && value.ctype === '0'
    && !fromBjkczg.bjdmArr.has(value.pkjs)
  );
  if (result.length>0) {
    return true;
  }
  return false;
}


// 指定位置教师固定排
export function zdwzjsgdp(curbjkczg, ruleDataSet) {
  if (curbjkczg.zgh && curbjkczg.zgh !== null && curbjkczg.zgh !== '') {

/*    const jsgdpkArr = _.filter(ruleDataSet.jsgdpk, item => item.sfpk === 1 && item.zgh === curActive.zgh
      && item.pkzs === curActive.pkzs && item.pkjs === curActive.pkjs && item.kcdm === curActive.kcdm);*/
    const jsgdpkArr = _.filter(ruleDataSet.jsgdpk, o =>
      o.sfpk==1
      &&o.pkzs === curbjkczg.pkzs
      &&o.pkjs === curbjkczg.pkjs
      &&curbjkczg.kcdmArr.has(o.kcdm)
      &&curbjkczg.zghArr.has(o.zgh)
    );
    if (jsgdpkArr.length > 0) {
      console.log(curbjkczg.zgh + '教师' + curbjkczg.kcdm + '课程固定排, pkzs-' + curbjkczg.pkzs + ',pkjs-' + curbjkczg.pkjs + '===')
      return true;
    }
  }
  return false;
}

// 固定时间是否可排某门课程
export function gdsjsfkpk(curpkzs,curpkjs, bjkczg, gzlb) {
  //const bjbpkArr = _.filter(gzlb.bjbpk, { bjdm: enableItem.bjdm, bpkzs: curActive.pkzs, bpkjs: curActive.pkjs });
  const bjbpkArr = _.filter(gzlb.bjbpk,item=>
    bjkczg.bjdmArr.has(item.bjdm)
    &&item.bpkzs==curpkzs
    &&item.bpkjs==curpkjs
  );
  if (bjbpkArr.length > 0) {
    console.log('===班级不排===')
    return false;
  }
  //const bjkcgdbpArr = _.filter(_.filter(gzlb.bjgdpk, { sfpk: 2 }), { bjdm: enableItem.bjdm, kcdm: enableItem.kcdm, pkzs: curpkzs, pkjs: curpkjs });
  const bjkcgdbpArr = _.filter(gzlb.bjgdpk,item=>
    item.sfpk==2
    &&item.pkzs==curpkzs
    &&item.pkjs==curpkjs
    &&bjkczg.bjdmArr.has(item.bjdm)
    &&bjkczg.kcdmArr.has(item.kcdm)
  );
  if (bjkcgdbpArr.length > 0) {
    console.log('===班级课程固定不排===')
    return false;
  }
  //const bjkcgdpArr = _.filter(_.filter(gzlb.bjgdpk, { sfpk: 1 }), { bjdm: enableItem.bjdm, kcdm: enableItem.kcdm, pkzs: enableItem.pkzs, pkjs: enableItem.pkjs });
  const bjkcgdpArr = _.filter(gzlb.bjgdpk,item=>
    item.sfpk==1
    &&item.pkzs==bjkczg.pkzs
    &&item.pkjs==bjkczg.pkjs
    &&bjkczg.bjdmArr.has(item.bjdm)
    &&bjkczg.kcdmArr.has(item.kcdm)
  )
  if (bjkcgdpArr.length > 0) {
    console.log('===班级课程固定排===')
    return false;
  }
  if (zdwzjsgdp(bjkczg, gzlb)) {
    console.log('===教师固定排===')
    return false;
  }
  if (bjkczg.zgh && bjkczg.zgh !== null && bjkczg.zgh !== '') {
/*    const jsgdbpArr = _.filter(gzlb.jsgdpk, item => item.sfpk === 2 && item.zgh === enableItem.zgh && item.kcdm === enableItem.kcdm
      && item.pkzs === curpkzs && item.pkjs === curpkjs);*/
    const jsgdbpArr = _.filter(gzlb.jsgdpk, item =>
      item.sfpk === 2
      && bjkczg.zghArr.has(item.zgh)
      && bjkczg.kcdmArr.has(item.kcdm)
      && item.pkzs === curpkzs
      && item.pkjs === curpkjs);
    if (jsgdbpArr.length > 0) {
      console.log('===教师固定不排===')
      return false;
    }
  }
  return true;
}

// 指定位置课程/教师是否固定排
export function kcjsgdp(curActive, ruleDataSet,coursePlanDataSet) {
  // 暂存课程
  if (curActive.ctype === '1') {
    return false;
  }
  const curbjkczg = getBj_js_kc_arr(curActive,coursePlanDataSet);

  // 判断班级课程固定排
  //const bjkcgdpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 1 }), { bjdm: curActive.bjdm, kcdm: curActive.kcdm, pkzs: curActive.pkzs, pkjs: curActive.pkjs });
  const bjkcgdpArr = _.filter(ruleDataSet.bjgdpk,function(o) {
    return o.sfpk==1&&o.pkzs === curbjkczg.pkzs&&o.pkjs === curbjkczg.pkjs&&curbjkczg.bjdmArr.has(o.bjdm)&&curbjkczg.kcdmArr.has(o.kcdm)
  });
  if (bjkcgdpArr.length > 0) {
    console.log('===' + curActive.bjdm + '班级' + curActive.kcdm + '课程固定排, pkzs-' + curActive.pkzs + ',pkjs-' + curActive.pkjs + '===')
    return true;
  }
  // 该教师当前位置是否有固定排课规则
  return zdwzjsgdp(curbjkczg, ruleDataSet);
}

// 根据当前选中的坐标课程，获取所有 班级 教师，课程
export function getBj_js_kc_arr(curActive,coursePlanDataSet) {
  const pkzs = parseInt(curActive.pkzs, 10);
  const pkjs = parseInt(curActive.pkjs, 10);
  const res = Object.assign({},curActive);
  res.bjdmArr= new Set();
  res.zghArr= new Set();
  res.kcdmArr= new Set();
  curActive.children.forEach(item => {
    if(item.bjdm) {res.bjdmArr.add(item.bjdm)};
    if(item.zgh) {res.zghArr.add(item.zgh)};
    if(item.kcdm) {res.kcdmArr.add(item.kcdm)};
    if(item.ishb === '1'){
      try {
        const hbbj = item.hbbj.split(',');
        hbbj.forEach(bj=>{res.bjdmArr.add(bj)});

        // 当出现合班时,要判断合班的各个班级的老师
        res.bjdmArr.forEach(bj=>{
          if(bj!==curActive.bidm){
            const hbkc= _.filter(coursePlanDataSet, plan =>
              plan.bjdm === bj
              && plan.pkzs === pkzs
              && plan.pkjs === pkjs
              && plan.ctype === curActive.ctype
            );
            hbkc.forEach(hb=>{
              res.zghArr.add(hb.zgh)
            })
          }
        })
      } catch (e) {
        console.error('error: pkzs: ' + pkzs + ' pkjs: ' + pkjs+'合班班级为空');
      }

    }
    if(item.isdjs === '1'){
      try {
        const dzgh = item.dzgh.split(',');
        dzgh.forEach(zgh=>{res.zghArr.add(zgh)});
      } catch (e) {
        console.error('error: pkzs: ' + pkzs + ' pkjs: ' + pkjs+'多教师为空');
      }
    }
  })
  return res;
}

