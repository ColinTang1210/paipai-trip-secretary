// 云函数：酒店搜索
// cloudfunctions/hotelSearch/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { destination, checkIn, checkOut, rooms, guests, keyword } = event;

  try {
    // 这里应该调用飞猪酒店 API 或其他酒店搜索接口
    // 示例返回模拟数据
    const mockHotels = [
      {
        id: 'H001',
        name: keyword ? `${keyword}附近酒店` : `${destination}豪华酒店`,
        image: '/assets/images/hotel1.jpg',
        rating: '4.8',
        ratingText: '很好',
        reviewCount: 2356,
        location: `${destination}中心区域`,
        tags: ['含早餐', '免费取消', '高星精选'],
        price: 1288
      },
      {
        id: 'H002',
        name: `${destination}商务酒店`,
        image: '/assets/images/hotel2.jpg',
        rating: '4.6',
        ratingText: '很好',
        reviewCount: 1823,
        location: `${destination}商业区`,
        tags: ['含早餐', '健身房'],
        price: 868
      },
      {
        id: 'H003',
        name: `${destination}经济型酒店`,
        image: '/assets/images/hotel3.jpg',
        rating: '4.5',
        ratingText: '很好',
        reviewCount: 987,
        location: `${destination}交通枢纽`,
        tags: ['性价比高', '免费WiFi'],
        price: 398
      }
    ];

    return {
      success: true,
      data: mockHotels,
      message: '查询成功'
    };
  } catch (err) {
    console.error('酒店搜索失败:', err);
    return {
      success: false,
      data: [],
      message: '搜索失败，请重试'
    };
  }
};
