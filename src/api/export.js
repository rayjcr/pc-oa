// 导出文件
export default {
  // 导出
  dc: function (res,filename) {
      var blob = new Blob([res], {type:res.type}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  　　var downloadElement = document.createElement('a');
  　　var href = window.URL.createObjectURL(blob); //创建下载的链接
  　　downloadElement.href = href;
  　　downloadElement.download = filename; //下载后文件名
  　　document.body.appendChild(downloadElement);
  　　downloadElement.click(); //点击下载
  　　document.body.removeChild(downloadElement); //下载完成移除元素
  　　window.URL.revokeObjectURL(href); //释放掉blob对
  },
}

