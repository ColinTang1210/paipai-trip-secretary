// pages/flight/flight.js
const app = getApp();
const flyai = require('../../utils/flyai');

Page({
  data: {
    tripType: 'round',
    fromCity: { name: '北京', code: 'BJS', airport: '首都国际机场' },
    toCity: null,
    departDate: '',
    returnDate: '',
    passengerCount: 1,
    cabinClass: 'economy',
    flightList: [],
    searched: false,
    loading: false,
    pluginAvailable: false
  },

  onLoad(options) {
    // 设置默认日期为明天
    const tomorrow = this.formatDate(new Date(Date.now() + 86400000));
    this.setData({ departDate: tomorrow });
    
    // 检查飞猪插件是否可用
    const pluginAvailable = flyai.isPluginAvailable();
    this.setData({ pluginAvailable });

    // 如果有传入目的地参数
    if (options.destination) {
      this.setData({ toCity: { name: options.destination } });
    }
  },

  // 设置行程类型
  setTripType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ tripType: type });
  },

  // 设置舱位
  setCabin(e) {
    const cabin = e.currentTarget.dataset.cabin;
    this.setData({ cabinClass: cabin });
  },

  // 交换城市
  swapCity() {
    const { fromCity, toCity } = this.data;
    if (fromCity && toCity) {
      this.setData({
        fromCity: toCity,
        toCity: fromCity
      });
    }
  },

  // 选择城市
  selectCity(e) {
    const field = e.currentTarget.dataset.field;
    wx.navigateTo({
      url: `/pages/city-select/city-select?field=${field}`
    });
  },

  // 选择日期
  selectDate(e) {
    const field = e.currentTarget.dataset.field;
    // 实际项目中应使用日期选择器组件
    wx.showToast({ title: '请使用日期选择器', icon: 'none' });
  },

  // 选择乘客数量
  selectPassenger() {
    wx.showActionSheet({
      itemList: ['1位成人', '2位成人', '3位成人', '4位成人'],
      success: (res) => {
        this.setData({ passengerCount: res.tapIndex + 1 });
      }
    });
  },

  // 搜索机票
  async searchFlights() {
    const { fromCity, toCity, departDate, passengerCount, cabinClass } = this.data;
    
    if (!fromCity || !toCity) {
      wx.showToast({ title: '请选择出发和到达城市', icon: 'none' });
      return;
    }
    
    if (!departDate) {
      wx.showToast({ title: '请选择出发日期', icon: 'none' });
      return;
    }

    this.setData({ loading: true, searched: true });

    try {
      // 调用飞猪 AI Fly 搜索机票
      const result = await flyai.searchFlights({
        fromCity: fromCity.code || fromCity.name,
        toCity: toCity.code || toCity.name,
        departDate,
        returnDate: this.data.tripType === 'round' ? this.data.returnDate : null,
        passengers: passengerCount,
        cabinClass
      });

      this.setData({
        flightList: result.data || [],
        loading: false
      });

      if (result.data && result.data.length === 0) {
        wx.showToast({ title: '未找到符合条件的航班', icon: 'none' });
      }
    } catch (err) {
      console.error('搜索机票失败:', err);
      wx.showToast({ title: '搜索失败，请重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  // 打开飞猪 AI Fly 插件
  openFlyPigAI() {
    // 直接打开插件机票页面
    flyai.openFlightPage();
  },

  // 使用 AI 推荐航班
  async getAIRecommendation() {
    const { fromCity, toCity, departDate } = this.data;
    
    if (!fromCity || !toCity || !departDate) {
      wx.showToast({ title: '请先填写搜索条件', icon: 'none' });
      return;
    }

    wx.showLoading({ title: 'AI 分析中...' });

    try {
      const result = await flyai.getAIRecommendation({
        destination: toCity.name,
        budget: 2000,
        duration: 5
      });

      wx.hideLoading();

      if (result.success) {
        wx.showModal({
          title: 'AI 推荐',
          content: result.data.recommendation || '暂无推荐',
          showCancel: false
        });
      } else {
        wx.showToast({ title: result.message, icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: 'AI 推荐暂时不可用', icon: 'none' });
    }
  },

  // 选择航班
  selectFlight(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/flight-detail/flight-detail?flightNo=${item.flightNo}&price=${item.price}`
    });
  },

  // 显示筛选
  showFilter() {
    wx.showActionSheet({
      itemList: ['价格从低到高', '价格从高到低', '出发时间早→晚', '飞行时间短→长'],
      success: (res) => {
        const sorted = this.sortFlights(res.tapIndex);
        this.setData({ flightList: sorted });
      }
    });
  },

  // 排序航班
  sortFlights(sortType) {
    const flights = [...this.data.flightList];
    
    switch (sortType) {
      case 0: // 价格从低到高
        return flights.sort((a, b) => a.price - b.price);
      case 1: // 价格从高到低
        return flights.sort((a, b) => b.price - a.price);
      case 2: // 出发时间早→晚
        return flights.sort((a, b) => a.departTime.localeCompare(b.departTime));
      case 3: // 飞行时间短→长（简化处理）
        return flights.sort((a, b) => a.stops - b.stops);
      default:
        return flights;
    }
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
