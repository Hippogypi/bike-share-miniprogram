Page({
  // 用户点击登录按钮
  onLoginTap() {
    // OpenId
    wx.login({
      success: (res) => {
        console.log("loginRes.code:"+ res.code)
        if (res.code) {
          // 2. 发送code到后端
          wx.request({
            url: 'http://localhost:8080/api/auth/check-registration',
            method: 'POST',
            data: { code: res.code },
            success: (res) => {
              const { openid, isRegistered } = res.data;
              console.log("openid:"+openid)
              wx.setStorageSync('openid', openid); // 存储openid，注册时会用到

              if (isRegistered) {
                // 已注册：检查本地token
                this.checkToken();
              } else {
                // 未注册：跳转到注册页面
                wx.reLaunch({
                  url: '/pages/register/register'
                });
              }
            },
            fail: (err) => {
              console.error('检查注册状态失败', err);
              wx.showToast({ title: '网络错误，请重试', icon: 'none' });
            }
          });
        } else {
          console.error('获取code失败', res.errMsg);
        }
      }  
    });
  },
});