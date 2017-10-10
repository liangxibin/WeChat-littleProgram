//index.js
//获取应用实例
var app = getApp();
var QQMapWX=require('../../libs/qqmap-wx-jssdk.js');
Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    recommend:'',
    formatted_addresses:{},
    address:''
  },
  // 页面加载
  onLoad: function (options) {
    var that=this
    var qqmapsdk=new QQMapWX({
      key:'DBVBZ-P26C6-ZFBSN-M3A7D-MUHB7-FCFC3'
    })
    // 获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",//参数类型
      success: (res) => {
        this.setData({
          longitude: res.longitude,//维度
          latitude: res.latitude,//经度
          markers:[{//标记点
            longitude: res.longitude,
            latitude: res.latitude,
            iconPath:'../images/marker.png',
            width: 20,
            height: 30
          }]
        }),
        qqmapsdk.reverseGeocoder({
          location:{
            longitude: res.longitude,
            latitude: res.latitude
          },
          success: function (data){
            console.log(data)
            that.setData({
              address: data.result.address, 
            })
          }
        })
      }
    });
    //3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '../images/location.png',
            position: {
              left: res.windowWidth  - 45,
              bottom: res.windowHeight - 200,
              width: 40,
              height: 40
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '../images/saoma.png',
            position: {
              left: res.windowWidth / 2 - 45,
              top: res.windowHeight - 130,
              width: 70,
              height: 70
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '../images/my-off.png',
            selectedIconPath:"../images/my-on.png",
            position: {
              left: res.windowWidth  - 75,
              top: res.windowHeight - 110,
              width: 50,
              height: 50
            },
            clickable: true
          }
          ]
        })
      }
    })
  },
  // 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("map");
    this.movetoPosition()
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      case 2: 
        //扫码
        wx.scanCode({
          success: (res) => {
            console.log(res)
            this.setData({
              result: res.result
            })
            wx.redirectTo({
              url: '../product/product?result='+res.result
            })
          }
        })
        break;
      case 3: wx.redirectTo({
        url: "../my/index"
      })
      break;
      default: break;
    }
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  }
})
