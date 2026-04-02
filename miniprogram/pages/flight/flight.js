// pages/flight/flight.js
const app = getApp();

Page({
  data: {
    tripType: 'round', // round: 往返, one: 单程
    fromCity: { name: '北京', code: 'BJS', airport: '首都国际机场' },
    toCity: null,
    departDate: '',
    returnDate: '',
    passengerCount: 1,
    cabinClass: 'economy', // economy: 经济舱, business: 商务舱, first: 头等舱
    flightList: [],
    searched: false,
    loading: false
  },

  onLoad(options) {
    // 设置默认日期为明天
    const tomorrow = this.formatDate(new Date(Date.now() + 86400000));
    this.setData({ departDate: tomorrow });
    
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
    const currentDate = this.data[field];
    
    wx.showDatePicker && wx.showDatePicker({
      format: 'YYYY-MM-DD',
      currentDate: currentDate,
      success: (res) => {
        this.setData({ [field]: res.dateString });
      }
    });
    
    // 如果系统不支持 showDatePicker，使用选择器组件
    // 这里简化处理，实际项目需要引入日期选择器组件
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
    const { fromCity, toCity, departDate } = this.data;
    
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
      // 调用云函数搜索机票
      const res = await wx.cloud.callFunction({
        name: 'flightSearch',
        data: {
          from: fromCity.code,
          to: toCity.code,
          date: departDate,
          passengers: this.data.passengerCount,
          cabin: this.data.cabinClass
        }
      });

      this.setData({
        flightList: res.result.data || [],
        loading: false
      });
    } catch (err) {
      console.error('搜索机票失败:', err);
      wx.showToast({ title: '搜索失败，请重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  // 打开飞猪 AI Fly 插件
  openFlyPigAI() {
    // 调用飞猪 AI Fly 插件
    const plugin = requirePlugin('flyPigAI');
    // 根据插件文档调用相应接口
    wx.showToast({ title: '正在打开飞猪 AI Fly...', icon: 'loading' });
    
    // 示例：打开插件页面
    // wx.navigateTo({
    //   url: 'plugin://flyPigAI/index'
    // });
  },

  // 选择航班
  selectFlight(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/flight-detail/flight-detail?flightNo=${item.flightNo}`
    });
  },

  // 显示筛选
  showFilter() {
    wx.showToast({ title: '筛选功能开发中', icon: 'none' });
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
