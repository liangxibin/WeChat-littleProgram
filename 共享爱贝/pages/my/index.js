const app = getApp()

Page({
  data: {
    userInfo: {
      avatarUrl: "",
      nickName: "未登录"
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false //登录状态按钮,false表示未登录
  },
  onLoad(){
    wx.setNavigationBarTitle({
      title: '我的信息'
    })
    // this.getUserInfo();
    this.setData({
      version: app.globalData.version
    });
    this.getUserApiInfo();
    wx.getStorage({
      key: 'userInfo',
      // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
      success: (res) => {
        wx.hideLoading();
        this.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true
        })
      }
    })
  },

bindAction:function(){
   this.data.lock=!this.data.lock
   if(this.data.lock){
     wx.showLoading({
       title:"正在登录"
     });
     wx.login({
       success:(res)=>{
         wx.hideLoading();
         wx.getUserInfo({
           withCredentials:false,
           success:(res)=>{
             this.setData({
               userInfo:{
                 avatarUrl:res.userInfo.avatarUrl,
                 nickName:res.userInfo.nickName
               },
               bType:"warn",
               actionText:"退出登录"
             });
             //存储用户信息到本地
             wx.setStorage({
               key:"userInfo",
               data:{
                 userInfo:{
                   avatarUrl:res.userInfo.avatarUrl,
                   nickName:res.userInfo.nickName
                 },
                 bType:"warn",
                 actionText:"退出登录"
               },
               success:function(res){
                 console.log("存储成功")
               }
             })
           }
         })
       }
     })
   }else{
     wx.showModal({
       title:"确认退出？",
       content:"退出后将不能继续使用",
       success:(res)=>{
         if(res.confirm){
           console.log("确定")
           wx.removeStorageSync("userInfo")
           this.setData({
             userInfo:{
               avatarUrl:"",
               nickName:"未登录"
             },
             bType:"primary",
             actionText:"登录"
           })
         }else{
           console.log("cancel")
           this.setData({
             lock:true
           })
         }
       }
     })
   }
},

  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统由桐庐盛通电子商务有限公司开发，祝大家使用愉快！',
      showCancel: false
    })
  },

  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: app.globalData.token,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            userMobile: res.data.data.base.mobile
          });
        }
      }
    })
  },

  movetoWallet:function(){
    wx.navigateTo({
      url:"../wallet/index"
    })
  }
})