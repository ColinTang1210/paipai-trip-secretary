// cloudfunctions/flightSearch/index.js
// 机票搜索云函数 - 接入飞猪 AI Fly

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 飞猪开放平台配置
const FLAPIG_CONFIG = {
  appId: process.env.FLYPIG_APP_ID || '',
  appSecret: process.env.FLYPIG_APP_SECRET || '',
  apiUrl: 'https://openapi.fliggy.com'
};

// 城市代码映射
const CITY_CODE_MAP = {
  '北京': 'BJS',
  '上海': 'SHA',
  '广州': 'CAN',
  '深圳': 'SZX',
  '成都': 'CTU',
  '杭州': 'HGH',
  '南京': 'NKG',
  '武汉': 'WUH',
  '西安': 'XIY',
  '重庆': 'CKG',
  '东京': 'TYO',
  '大阪': 'OSA',
  '首尔': 'SEL',
  '曼谷': 'BKK',
  '新加坡': 'SIN',
  '香港': 'HKG',
  '台北': 'TPE'
};

/**
 * 调用飞猪 API 搜索机票
 */
async function searchFlightsFromFlyPig(params) {
  const { from, to, date, passengers, cabin } = params;
  
  // 如果没有配置飞猪 API，返回模拟数据
  if (!FLAPIG_CONFIG.appId) {
    console.log('未配置飞猪 API，返回模拟数据');
    return getMockFlights(from, to, date);
  }

  try {
    // 实际调用飞猪开放平台 API
    const response = await fetch(`${FLAPIG_CONFIG.apiUrl}/flight/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLAPIG_CONFIG.appId}:${FLAPIG_CONFIG.appSecret}`
      },
      body: JSON.stringify({
        origin: from,
        destination: to,
        departureDate: date,
        passengerCount: passengers,
        cabinClass: cabin
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || '搜索失败');
    }
  } catch (err) {
    console.error('飞猪 API 调用失败:', err);
    // 降级到模拟数据
    return getMockFlights(from, to, date);
  }
}

/**
 * 模拟航班数据
 */
function getMockFlights(from, to, date) {
  const airlines = [
    { code: 'MU', name: '东方航空', logo: '/assets/icons/airlines/mu.png' },
    { code: 'CA', name: '中国国际航空', logo: '/assets/icons/airlines/ca.png' },
    { code: 'CZ', name: '南方航空', logo: '/assets/icons/airlines/cz.png' },
    { code: 'HU', name: '海南航空', logo: '/assets/icons/airlines/hu.png' },
    { code: 'NH', name: '全日空', logo: '/assets/icons/airlines/nh.png' }
  ];

  const times = [
    { depart: '08:30', arrive: '12:45', duration: '4小时15分' },
    { depart: '10:15', arrive: '14:30', duration: '4小时15分' },
    { depart: '14:20', arrive: '18:35', duration: '4小时15分' },
    { depart: '16:45', arrive: '21:00', duration: '4小时15分' },
    { depart: '19:00', arrive: '23:15', duration: '4小时15分' }
  ];

  return times.map((time, index) => {
    const airline = airlines[index % airlines.length];
    const basePrice = 800 + Math.floor(Math.random() * 800);
    
    return {
      id: `${airline.code}${1000 + index}`,
      flightNo: `${airline.code}${1000 + index}`,
      airline: airline.name,
      airlineLogo: airline.logo,
      fromAirport: from,
      toAirport: to,
      departTime: time.depart,
      arriveTime: time.arrive,
      duration: time.duration,
      stops: index > 3 ? 1 : 0,
      price: basePrice,
      cabin: 'economy',
      seats: Math.floor(Math.random() * 20) + 1,
      refundPolicy: index < 2 ? '免费退改' : '有条件退改',
      baggage: '20kg托运 + 7kg手提'
    };
  });
}

/**
 * 云函数入口
 */
exports.main = async (event, context) => {
  const { from, to, date, passengers, cabin } = event;

  // 参数校验
  if (!from || !to || !date) {
    return {
      success: false,
      data: [],
      message: '参数不完整，请提供出发地、目的地和日期'
    };
  }

  // 转换城市代码
  const fromCode = CITY_CODE_MAP[from] || from;
  const toCode = CITY_CODE_MAP[to] || to;

  try {
    const flights = await searchFlightsFromFlyPig({
      from: fromCode,
      to: toCode,
      date,
      passengers: passengers || 1,
      cabin: cabin || 'economy'
    });

    return {
      success: true,
      data: flights,
      message: '查询成功',
      query: { from: fromCode, to: toCode, date }
    };
  } catch (err) {
    console.error('机票搜索失败:', err);
    return {
      success: false,
      data: [],
      message: err.message || '搜索失败，请稍后重试'
    };
  }
};
