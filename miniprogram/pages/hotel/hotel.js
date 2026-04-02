// pages/hotel/hotel.js
Page({
  data: {
    destination: '东京',
    checkInDate: '',
    checkOutDate: '',
    hotelList: []
  },

  onLoad() {
    const tomorrow = new Date(Date.now() + 86400000);
    const dayAfter = new Date(Date.now() + 172800000);
    
    this.setData({
      checkInDate: this.formatDate(tomorrow),
      checkOutDate: this.formatDate(dayAfter)
    });
  },

  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },

  searchHotels() {
    const mockHotels = [
      { id: 1, name: '东京新宿希尔顿酒店', rating: 4.8, location: '新宿区', price: 1288 },
      { id: 2, name: '东京银座三井花园酒店', rating: 4.6, location: '银座区', price: 998 },
      { id: 3, name: '东京浅草都市酒店', rating: 4.5, location: '浅草区', price: 668 }
    ];

    this.setData({ hotelList: mockHotels });
  }
});
