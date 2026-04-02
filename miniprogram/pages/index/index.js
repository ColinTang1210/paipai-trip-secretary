// pages/index/index.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    hotDestinations: [
      { id: 1, name: '东京', price: 1299, image: '/assets/images/tokyo.jpg' },
      { id: 2, name: '首尔', price: 899, image: '/assets/images/seoul.jpg' },
      { id: 3, name: '曼谷', price: 799, image: '/assets/images/bangkok.jpg' },
      { id: 4, name: '新加坡', price: 1099, image: '/assets/images/singapore.jpg' },
      { id: 5, name: '巴厘岛', price: 1599, image: '/assets/images/bali.jpg' },
    ],
    recentSearch: []
  },

  onLoad() {
    this.loadUserInfo();
    this.loadRecentSearch();
  },

  onShow() {
    this.loadRecentSearch();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
      app.globalData.userInfo = userInfo;
    }
  },

  loadRecentSearch() {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({ recentSearch: history.slice(0, 5) });
  },

  // 跳转到搜索页
  onSearchTap() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 快捷功能跳转
  goToFlight() {
    wx.switchTab({
      url: '/pages/flight/flight'
    });
  },

  goToHotel() {
    wx.switchTab({
      url: '/pages/hotel/hotel'
    });
  },

  goToTax() {
    wx.switchTab({
      url: '/pages/tax/tax'
    });
  },

  goToAI() {
    wx.navigateTo({
      url: '/pages/ai-assistant/ai-assistant'
    });
  },

  // 热门目的地点击
  onDestTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/search/search?destination=${item.name}`
    });
  },

  // 更多目的地
  onMoreDestTap() {
    wx.navigateTo({
      url: '/pages/destinations/destinations'
    });
  },

  // 历史搜索点击
  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `/pages/search/search?keyword=${keyword}`
    });
  },

  // 清空历史
  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          this.setData({ recentSearch: [] });
        }
      }
    });
  },

  // AI 推荐卡片点击
  onAICardTap() {
    this.goToAI();
  }
});
