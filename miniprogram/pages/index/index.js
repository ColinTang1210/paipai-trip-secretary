// pages/index/index.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    hotDestinations: [
      { id: 1, name: '东京', emoji: '🗼', price: 1299 },
      { id: 2, name: '首尔', emoji: '🏛️', price: 899 },
      { id: 3, name: '曼谷', emoji: '🛕', price: 799 },
      { id: 4, name: '新加坡', emoji: '🌆', price: 1099 },
    ],
    recentSearch: []
  },

  onLoad() {
    this.loadRecentSearch();
  },

  loadRecentSearch() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ recentSearch: history.slice(0, 5) });
  },

  onSearchTap() {
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  },

  goToFlight() {
    wx.switchTab({ url: '/pages/flight/flight' });
  },

  goToHotel() {
    wx.switchTab({ url: '/pages/hotel/hotel' });
  },

  goToTax() {
    wx.switchTab({ url: '/pages/tax/tax' });
  },

  goToAI() {
    wx.showToast({ title: 'AI助手功能开发中', icon: 'none' });
  },

  onDestTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.showToast({ title: `查看${item.name}机票`, icon: 'none' });
  },

  onClearHistory() {
    wx.removeStorageSync('searchHistory');
    this.setData({ recentSearch: [] });
  },

  onAICardTap() {
    this.goToAI();
  }
});
