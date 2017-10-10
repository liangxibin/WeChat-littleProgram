//app.js
App({
onLaunch:function(){
  this.login()
},
login:function(){
  var that=this;
  var token=that.globalData.token;
  if(token){
    wx.request({
      url: 'https://api.it120.cc/'+that.globalData.subDomain+'/user/check-token',
      data:{
        token:token
      },
      success:function(res){
        if(res.data.code!=0){
          that.globalData.token=null;
          that.login();
        }
      }
    })
    return;
  }
  wx.login({
    success: function(res) {
      wx,wx.request({
        url: 'https://api.it120.cc/' + that.globalData.subDomain+'/user/m/login',
        data: {
          code:res.code
        },
        success: function(res) {
          if(res.data.code==10000){
            that.registerUser();
            return;
          }
          if(res.data.code!=0){
            wx.hideLoading();
            // wx.showModal({
            //   title: '提示',
            //   content: '无法登录，请重试',
            //   showCancel:false
            // })
            return;
          }
          that.globalData.token=res.data.data.token;
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  })
},
registerUser:function(){
  var that=this;
  wx.login({
    success:function(res){
      var iv=res.iv;
      var encryptedData=res.enctrypteData;
      wx.request({
        url: 'https://api.it120.cc/' + that.globalData.subDomain +'/user/m/register',
        data:{
          code:code,
          encryptedData:encryptedData,
          iv:iv
        },
        success:(res)=>{
          wx.hideLoading();
          that.login();
        }
      })
    }
  })
},
globalData:{
  userInfo:null,
  subDomain:"834826fc07aeca8256069e42cd710b72",
  version:"1.0.1"
}
})