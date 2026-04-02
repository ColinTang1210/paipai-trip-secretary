// cloudfunctions/hotelSearch/index.js
// 酒店搜索云函数 - 接入飞猪 AI Fly

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

/**
 * 调用飞猪 API 搜索酒店
 */
async function searchHotelsFromFlyPig(params) {
  const { destination, checkIn, checkOut, rooms, guests, keyword } = params;

  if (!FLPIG_CONFIG.appId) {
    console.log('未配置飞猪 API，返回模拟数据');
    return getMockHotels(destination, keyword);
  }

  try {
    const response = await fetch(`${FLPIG_CONFIG.apiUrl}/hotel/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLPIG_CONFIG.appId}:${FLPIG_CONFIG.appSecret}`
      },
      body: JSON.stringify({
        city: destination,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomCount: rooms,
        guestCount: guests,
        keywords: keyword
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || '搜索失败');
    }
  } catch (err) {
    console.error('飞猪酒店 API 调用失败:', err);
    return getMockHotels(destination, keyword);
  }
}

/**
 * 模拟酒店数据
 */
function getMockHotels(destination, keyword) {
  const hotels = [
    {
      id: 'H001',
      name: `${destination}新宿希尔顿酒店`,
      image: '/assets/images/hotel1.jpg',
      rating: '4.8',
      ratingText: '很好',
      reviewCount: 2356,
      location: '新宿区 · 距地铁站200米',
      tags: ['含早餐', '免费取消', '高星精选'],
      price: 1288,
      starLevel: 5,
      amenities: ['WiFi', '健身房', '泳池', '停车场'],
      distance: 0.2
    },
    {
      id: 'H002',
      name: `${destination}银座三井花园酒店`,
      image: '/assets/images/hotel2.jpg',
      rating: '4.6',
      ratingText: '很好',
      reviewCount: 1823,
      location: '银座区 · 距地铁站100米',
      tags: ['含早餐', '网红打卡', '日式风格'],
      price: 998,
      starLevel: 4,
      amenities: ['WiFi', '温泉', '餐厅'],
      distance: 0.1
    },
    {
      id: 'H003',
      name: `${destination}浅草都市酒店`,
      image: '/assets/images/hotel3.jpg',
      rating: '4.5',
      ratingText: '很好',
      reviewCount: 987,
      location: '浅草区 · 距浅草寺500米',
      tags: ['性价比高', '免费取消', '交通便捷'],
      price: 668,
      starLevel: 3,
      amenities: ['WiFi', '餐厅', '行李寄存'],
      distance: 0.5
    },
    {
      id: 'H004',
      name: `${destination}六本木豪华精选酒店`,
      image: '/assets/images/hotel4.jpg',
      rating: '4.9',
      ratingText: '极佳',
      reviewCount: 3562,
      location: '六本木区 · 距地铁站150米',
      tags: ['豪华', '顶层酒吧', '城市景观'],
      price: 2588,
      starLevel: 5,
      amenities: ['WiFi', 'SPA', '米其林餐厅', '行政酒廊'],
      distance: 0.15
    },
    {
      id: 'H005',
      name: `${destination}池袋商务酒店`,
      image: '/assets/images/hotel5.jpg',
      rating: '4.3',
      ratingText: '很好',
      reviewCount: 756,
      location: '池袋区 · 距地铁站50米',
      tags: ['商务优选', '免费WiFi'],
      price: 398,
      starLevel: 3,
      amenities: ['WiFi', '商务中心', '自助洗衣'],
      distance: 0.05
    }
  ];

  // 如果有关键词，过滤结果
  if (keyword) {
    return hotels.filter(h => 
      h.name.includes(keyword) || 
      h.location.includes(keyword) ||
      h.tags.some(t => t.includes(keyword))
    );
  }

  return hotels;
}

/**
 * 云函数入口
 */
exports.main = async (event, context) => {
  const { destination, checkIn, checkOut, rooms, guests, keyword } = event;

  // 参数校验
  if (!destination) {
    return {
      success: false,
      data: [],
      message: '请提供目的地'
    };
  }

  try {
    const hotels = await searchHotelsFromFlyPig({
      destination,
      checkIn,
      checkOut,
      rooms: rooms || 1,
      guests: guests || 2,
      keyword
    });

    return {
      success: true,
      data: hotels,
      message: '查询成功',
      query: { destination, checkIn, checkOut }
    };
  } catch (err) {
    console.error('酒店搜索失败:', err);
    return {
      success: false,
      data: [],
      message: err.message || '搜索失败，请稍后重试'
    };
  }
};
