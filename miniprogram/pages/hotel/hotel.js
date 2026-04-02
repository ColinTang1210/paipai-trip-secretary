// pages/hotel/hotel.js
const app = getApp();

Page({
  data: {
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    nights: 1,
    rooms: 1,
    guests: 2,
    keyword: '',
    hotelList: [],
    searched: false,
    loading: false,
    activeFilter: ''
  },

  onLoad(options) {
    // 设置默认日期（明天入住，后天退房）
    const tomorrow = this.formatDate(new Date(Date.now() + 86400000));
    const dayAfter = this.formatDate(new Date(Date.now() + 172800000));
    
    this.setData({
      checkInDate: tomorrow,
      checkOutDate: dayAfter
    });

    // 如果有传入目的地
    if (options.destination) {
      this.setData({ destination: options.destination });
    }
  },

  // 选择目的地
  selectDestination() {
    wx.navigateTo({
      url: '/pages/city-select/city-select?type=hotel'
    });
  },

  // 选择入住日期
  selectCheckIn() {
    // 实际项目中使用日期选择器组件
    wx.showToast({ title: '请使用日期选择器', icon: 'none' });
  },

  // 选择退房日期
  selectCheckOut() {
    wx.showToast({ title: '请使用日期选择器', icon: 'none' });
  },

  // 选择房间人数
  selectRooms() {
    wx.showActionSheet({
      itemList: ['1间房 · 1位成人', '1间房 · 2位成人', '2间房 · 4位成人', '3间房 · 6位成人'],
      success: (res) => {
        const options = [
          { rooms: 1, guests: 1 },
          { rooms: 1, guests: 2 },
          { rooms: 2, guests: 4 },
          { rooms: 3, guests: 6 }
        ];
        const selected = options[res.tapIndex];
        this.setData({
          rooms: selected.rooms,
          guests: selected.guests
        });
      }
    });
  },

  // 关键词输入
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 搜索酒店
  async searchHotels() {
    const { destination, checkInDate, checkOutDate } = this.data;

    if (!destination) {
      wx.showToast({ title: '请选择目的地', icon: 'none' });
      return;
    }

    this.setData({ loading: true, searched: true });

    try {
      // 调用云函数搜索酒店
      const res = await wx.cloud.callFunction({
        name: 'hotelSearch',
        data: {
          destination,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          rooms: this.data.rooms,
          guests: this.data.guests,
          keyword: this.data.keyword
        }
      });

      this.setData({
        hotelList: res.result.data || [],
        loading: false
      });
    } catch (err) {
      console.error('搜索酒店失败:', err);
      // 使用模拟数据演示
      this.setData({
        hotelList: this.getMockHotels(),
        loading: false
      });
    }
  },

  // 打开飞猪 AI 酒店助手
  openFlyPigAIHotel() {
    wx.showToast({ title: '正在打开飞猪 AI 酒店助手...', icon: 'loading' });
    // const plugin = requirePlugin('flyPigAI');
    // 根据插件文档调用酒店搜索接口
  },

  // 筛选 - 价格
  filterByPrice() {
    this.setData({ activeFilter: 'price' });
    // 显示价格筛选面板
    wx.showToast({ title: '价格筛选开发中', icon: 'none' });
  },

  // 筛选 - 评分
  filterByRating() {
    this.setData({ activeFilter: 'rating' });
    wx.showToast({ title: '评分筛选开发中', icon: 'none' });
  },

  // 筛选 - 星级
  filterByStar() {
    this.setData({ activeFilter: 'star' });
    wx.showActionSheet({
      itemList: ['五星/豪华', '四星/高档', '三星/舒适', '二星及以下'],
      success: (res) => {
        // 根据星级筛选
      }
    });
  },

  // 显示全部筛选
  showAllFilters() {
    wx.navigateTo({
      url: '/pages/hotel-filter/hotel-filter'
    });
  },

  // 选择酒店
  selectHotel(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/hotel-detail/hotel-detail?id=${item.id}`
    });
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 模拟数据
  getMockHotels() {
    return [
      {
        id: 1,
        name: '东京新宿希尔顿酒店',
        image: '/assets/images/hotel1.jpg',
        rating: '4.8',
        ratingText: '很好',
        reviewCount: 2356,
        location: '新宿区 · 距地铁站200米',
        tags: ['含早餐', '免费取消', '高星精选'],
        price: 1288
      },
      {
        id: 2,
        name: '东京银座三井花园酒店',
        image: '/assets/images/hotel2.jpg',
        rating: '4.6',
        ratingText: '很好',
        reviewCount: 1823,
        location: '银座区 · 距地铁站100米',
        tags: ['含早餐', '网红打卡'],
        price: 998
      },
      {
        id: 3,
        name: '东京浅草都市酒店',
        image: '/assets/images/hotel3.jpg',
        rating: '4.5',
        ratingText: '很好',
        reviewCount: 987,
        location: '浅草区 · 距浅草寺500米',
        tags: ['性价比高', '免费取消'],
        price: 668
      }
    ];
  }
});
