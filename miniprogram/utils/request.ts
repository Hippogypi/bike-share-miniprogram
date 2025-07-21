// 网络请求封装
const baseURL = 'http://localhost:8080'; // 后端服务地址

const request = (options: WechatMiniprogram.RequestOption) => {
  // 添加token到header
  const token = wx.getStorageSync('token');
  if (token) {
    options.header = options.header || {};
    options.header['Authorization'] = `Bearer ${token}`;
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (res) => {
        if (res.statusCode === 401) {
          // token过期或无效
          wx.removeStorageSync('token');
          wx.reLaunch({
            url: '/pages/login/login'
          });
        } else {
          resolve(res.data);
        }
      },
      fail: reject
    });
  });
};


// 测试接口调用函数
export const testConnection = () => {
  return request({
    url: '/api/test',
    method: 'GET'
  });
};
