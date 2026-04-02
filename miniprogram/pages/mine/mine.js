// pages/mine/mine.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    memberInfo: {
      levelName: '黄金会员',
      points: 2680,
      benefits: ['机票折扣', '优先登机', '免费改签']
    },
    orderCounts: {
      pending: 2,
      paid: 1,
      completed: 0,
      refund: 0
    }
  },

  onShow() {
    this.loadUserInfo();
    this.loadOrderCounts();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
      app.globalData.userInfo = userInfo;
    }
  },

  loadOrderCounts() {
    // 从本地存储或云端加载订单数量
    // 这里使用模拟数据
  },

  // 用户点击
  onUserTap() {
    if (this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/profile/profile'
      });
    } else {
      this.login();
    }
  },

  // 登录
  async login() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'login'
      });
      
      // 获取用户信息
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      });

      const userData = {
        ...userInfo,
        openId: result.openid
      };

      this.setData({ userInfo: userData });
      wx.setStorageSync('userInfo', userData);
      app.globalData.userInfo = userData;

      wx.showToast({ title: '登录成功', icon: 'success' });
    } catch (err) {
      console.error('登录失败:', err);
    }
  },

  // 会员中心
  onMemberTap() {
    wx.navigateTo({
      url: '/pages/member/member'
    });
  },

  // 跳转订单
  goToOrders(e) {
    const type = e.currentTarget.dataset.type || 'all';
    wx.navigateTo({
      url: `/pages/orders/orders?type=${type}`
    });
  },

  // 跳转页面
  goToPage(e) {
    const page = e.currentTarget.dataset.page;
    const pageMap = {
      favorites: '/pages/favorites/favorites',
      history: '/pages/history/history',
      passengers: '/pages/passengers/passengers',
      address: '/pages/address/address',
      settings: '/pages/settings/settings',
      help: '/pages/help/help',
      about: '/pages/about/about'
    };

    const url = pageMap[page];
    if (url) {
      wx.navigateTo({ url });
    }
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服热线：400-888-8888\n服务时间：9:00-21:00',
      confirmText: '立即拨打',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4008888888'
          });
        }
      }
    });
  }
});
