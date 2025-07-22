// app.js
// app.js
const { authAPI } = require('./utils/api');

App({
  globalData: {
    userInfo: null,
    isLoggedIn: false
  },

  onLaunch() {
    this.checkAuthStatus();
  },

  // 检查认证状态
  async checkAuthStatus() {
    try {
      // 1. 获取微信code
      const { code } = await this.getWxCode();
      
      // 2. 检查注册状态
      const res = await authAPI.checkRegistration(code);
      const { openid, isRegistered } = res.data;

      console.log("openid + isRegistered:"+openid+","+isRegistered)
      
      wx.setStorageSync('openid', openid);

      if (isRegistered) {
        // 3. 已注册用户检查token
        await this.checkTokenAndLogin();
      } else {
        // 4. 未注册跳转注册页
        wx.reLaunch({
          url: '/pages/register/register'
        });
      }
    } catch (error) {
      console.error('认证检查失败:', error);
      wx.showToast({
        title: '系统错误，请重试',
        icon: 'none'
      });
    }
  },

  // 获取微信code
  getWxCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: resolve,
        fail: reject
      });
    });
  },

  // 检查token并登录
  async checkTokenAndLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      try {
        const { valid } = (await authAPI.checkToken(token)).data;
        if (valid) {
          this.globalData.isLoggedIn = true;
          wx.reLaunch({
            url: '/pages/index/index'
          });
          return;
        }
      } catch (error) {
        console.log('token验证失败:', error);
      }
    }
    // token无效或不存在，跳转登录页
    wx.reLaunch({
      url: '/pages/login/login'
    });
  }
});
