// pages/mine/mine.js
Page({
  data: {
    userInfo: null
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
  },

  goToOrders() {
    wx.showToast({ title: '订单功能开发中', icon: 'none' });
  },

  goToFavorites() {
    wx.showToast({ title: '收藏功能开发中', icon: 'none' });
  },

  goToSettings() {
    wx.showToast({ title: '设置功能开发中', icon: 'none' });
  },

  goToAbout() {
    wx.showModal({
      title: '关于我们',
      content: '派派trip秘书 v1.0.0\n\n智能旅行助手小程序',
      showCancel: false
    });
  }
});
