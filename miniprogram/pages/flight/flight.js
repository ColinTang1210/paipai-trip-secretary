// pages/flight/flight.js
Page({
  data: {
    fromCity: { name: '北京' },
    toCity: null,
    departDate: '',
    flightList: [],
    searched: false
  },

  onLoad() {
    const tomorrow = new Date(Date.now() + 86400000);
    const date = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    this.setData({ departDate: date });
  },

  selectCity(e) {
    const field = e.currentTarget.dataset.field;
    wx.showModal({
      title: '选择城市',
      content: '请在控制台选择城市，当前为演示数据',
      success: () => {
        if (field === 'to') {
          this.setData({ toCity: { name: '东京' } });
        }
      }
    });
  },

  searchFlights() {
    if (!this.data.fromCity || !this.data.toCity) {
      wx.showToast({ title: '请选择城市', icon: 'none' });
      return;
    }

    this.setData({ searched: true, loading: true });

    // 模拟数据
    const mockFlights = [
      { id: 1, flightNo: 'MU1234', fromAirport: 'BJS', toAirport: 'TYO', departTime: '08:30', arriveTime: '12:45', price: 1299 },
      { id: 2, flightNo: 'CA5678', fromAirport: 'BJS', toAirport: 'TYO', departTime: '14:20', arriveTime: '18:35', price: 1450 },
      { id: 3, flightNo: 'CZ9012', fromAirport: 'BJS', toAirport: 'TYO', departTime: '19:00', arriveTime: '23:15', price: 1088 }
    ];

    this.setData({ flightList: mockFlights, loading: false });
  }
});
