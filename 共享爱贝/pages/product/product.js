//index.js
//获取应用实例
var app = getApp();
Page({
  data:{
latitude:0,
longitude:0,
result:''
  },
onLoad:function(option){
  this.setData({
    result:option.result
  })

}
})
