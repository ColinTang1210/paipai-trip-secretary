// 云函数：机票搜索
// cloudfunctions/flightSearch/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { from, to, date, passengers, cabin } = event;

  try {
    // 这里应该调用飞猪 API 或其他机票搜索接口
    // 示例返回模拟数据
    const mockFlights = [
      {
        id: 'MU1234',
        flightNo: 'MU1234',
        airline: '东方航空',
        airlineLogo: '/assets/icons/airlines/mu.png',
        fromAirport: from,
        toAirport: to,
        departTime: '08:30',
        arriveTime: '12:45',
        duration: '4小时15分',
        stops: 0,
        price: 1299,
        cabin: cabin
      },
      {
        id: 'CA5678',
        flightNo: 'CA5678',
        airline: '中国国际航空',
        airlineLogo: '/assets/icons/airlines/ca.png',
        fromAirport: from,
        toAirport: to,
        departTime: '14:20',
        arriveTime: '18:35',
        duration: '4小时15分',
        stops: 0,
        price: 1450,
        cabin: cabin
      },
      {
        id: 'CZ9012',
        flightNo: 'CZ9012',
        airline: '南方航空',
        airlineLogo: '/assets/icons/airlines/cz.png',
        fromAirport: from,
        toAirport: to,
        departTime: '19:00',
        arriveTime: '23:30',
        duration: '4小时30分',
        stops: 1,
        price: 1088,
        cabin: cabin
      }
    ];

    return {
      success: true,
      data: mockFlights,
      message: '查询成功'
    };
  } catch (err) {
    console.error('机票搜索失败:', err);
    return {
      success: false,
      data: [],
      message: '搜索失败，请重试'
    };
  }
};
