// 基础配置
const BASE_URL = 'http://localhost:8080/api';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

// 基础请求方法
const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    // 自动携带token
    const token = wx.getStorageSync('token');
    const headers = token ? 
      {...DEFAULT_HEADERS, 'Authorization': `Bearer ${token}`} : 
      DEFAULT_HEADERS;

    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: headers,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  });
};

// 认证相关API
const authAPI = {
  checkRegistration: (code) => request('/auth/check-registration', 'POST', { data: { code } }),
  wechatLogin: (code, nickname, avatarUrl) => 
    request('/auth/wechat-login', 'POST', { 
      data: { 
        code, 
        nickname, 
        avatarUrl 
      } 
    }),
  checkToken: (token) => request('/auth/check-token', 'POST', { data: { token } })
};

module.exports = {
  authAPI
};
