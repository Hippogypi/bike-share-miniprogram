// app.ts
App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    // 检查是否有token
    const token = wx.getStorageSync('token');
    if (!token) {
      // 没有token则跳转到登录页
      wx.reLaunch({
        url: '/pages/login/login'
      });
    } else {
      // 有token则验证token
      this.validateToken(token);
    }
  },

  // 验证token有效性
  validateToken(token: string) {
    wx.request({
      url: 'https://your-api-domain.com/api/auth/check-token',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data && res.data.valid) {
          this.globalData.userInfo = res.data.userInfo;
        } else {
          // token无效，跳转到登录页
          wx.removeStorageSync('token');
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      },
      fail: () => {
        // 网络错误，跳转到登录页
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    });
  }
})