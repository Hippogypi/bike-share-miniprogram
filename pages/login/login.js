Page({
  // 用户点击登录按钮
  onLoginTap() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      lang: 'zh_CN',
      success: async (res) => {
        const userInfo = res.userInfo;
        
        // 获取登录凭证
        try {
          const loginRes = await new Promise((resolve, reject) => {
            wx.login({
              success: resolve,
              fail: reject
            });
          });
          
          if (!loginRes.code) {
            throw new Error('获取code失败');
          }
          
          // 发送数据到后端
          this.sendUserData(loginRes.code, userInfo);
          
          // 存储用户信息
          wx.setStorageSync('userInfo', userInfo);
          
          // 跳转到首页
          wx.switchTab({ url: '/pages/index/index' });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } catch (error) {
          console.error('登录过程出错', error);
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '您拒绝了授权，无法使用完整功能',
          icon: 'none',
          duration: 3000
        });
      }
    });
  },

  // 发送用户数据到后端
  sendUserData(code, userInfo) {
    wx.request({
      url: 'https://your-api-domain.com/auth/login',
      method: 'POST',
      data: {
        code,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender
      },
      success: (res) => {
        if (res.data && res.data.token) {
          // 存储登录状态
          wx.setStorageSync('token', res.data.token);
        }
      },
      fail: (err) => {
        console.error('登录请求失败', err);
      }
    });
  }
});