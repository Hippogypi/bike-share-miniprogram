const { authAPI } = require('../../utils/api');

Page({
  data: {
    loading: false,
    agreed: false
  },

  // 切换协议同意状态
  toggleAgreement() {
    this.setData({
      agreed: !this.data.agreed
    });
  },

  // 用户点击注册按钮
  async onRegisterTap() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });
    try {
      // 1. 获取用户信息
      const userInfo = await this.getUserProfile();
      
      // 2. 获取微信code
      const { code } = await this.getWxCode();
      
      // 3. 调用登录/注册接口
      const res = await authAPI.wechatLogin(
        code,
        userInfo.nickName,
        userInfo.avatarUrl
      );
      
      // 4. 保存登录信息
      wx.setStorageSync('token', res.data.token);
      wx.setStorageSync('userInfo', {
        nickname: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      });
      
      // 5. 跳转首页
      wx.reLaunch({
        url: '/pages/index/index'
      });
      
    } catch (error) {
      console.error('注册失败:', error);
      wx.showToast({
        title: '注册失败，请重试',
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

  // 获取用户信息
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: resolve,
        fail: reject
      });
    });
  }
});
