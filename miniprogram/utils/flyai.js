// miniprogram/utils/flyai.js
// 飞猪 AI Fly 插件工具类

let flyPigPlugin = null;

/**
 * 初始化飞猪 AI Fly 插件
 */
function initPlugin() {
  if (!flyPigPlugin) {
    try {
      flyPigPlugin = requirePlugin('flyPigAI');
      console.log('飞猪 AI Fly 插件初始化成功');
    } catch (err) {
      console.error('飞猪 AI Fly 插件初始化失败:', err);
    }
  }
  return flyPigPlugin;
}

/**
 * 搜索机票
 * @param {Object} params 搜索参数
 * @param {string} params.fromCity 出发城市代码
 * @param {string} params.toCity 到达城市代码
 * @param {string} params.departDate 出发日期 YYYY-MM-DD
 * @param {string} params.returnDate 返程日期（可选）
 * @param {number} params.passengers 乘客数量
 * @param {string} params.cabinClass 舱位等级 economy/business/first
 * @returns {Promise<Object>} 搜索结果
 */
async function searchFlights(params) {
  const plugin = initPlugin();
  
  if (!plugin) {
    // 插件未安装，使用云函数
    return await callCloudFunction('flightSearch', params);
  }

  try {
    const result = await plugin.searchFlights({
      fromCity: params.fromCity,
      toCity: params.toCity,
      departDate: params.departDate,
      returnDate: params.returnDate,
      passengers: params.passengers || 1,
      cabinClass: params.cabinClass || 'economy'
    });
    
    return {
      success: true,
      data: result.data || result,
      message: '查询成功'
    };
  } catch (err) {
    console.error('飞猪机票搜索失败:', err);
    
    // 降级到云函数
    return await callCloudFunction('flightSearch', params);
  }
}

/**
 * 搜索酒店
 * @param {Object} params 搜索参数
 * @param {string} params.destination 目的地
 * @param {string} params.checkIn 入住日期
 * @param {string} params.checkOut 退房日期
 * @param {number} params.rooms 房间数
 * @param {number} params.guests 客人数
 * @param {string} params.keyword 关键词（可选）
 * @returns {Promise<Object>} 搜索结果
 */
async function searchHotels(params) {
  const plugin = initPlugin();
  
  if (!plugin) {
    return await callCloudFunction('hotelSearch', params);
  }

  try {
    const result = await plugin.searchHotels({
      destination: params.destination,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      rooms: params.rooms || 1,
      guests: params.guests || 2,
      keyword: params.keyword
    });
    
    return {
      success: true,
      data: result.data || result,
      message: '查询成功'
    };
  } catch (err) {
    console.error('飞猪酒店搜索失败:', err);
    return await callCloudFunction('hotelSearch', params);
  }
}

/**
 * AI 智能推荐
 * @param {Object} params 推荐参数
 * @param {string} params.destination 目的地
 * @param {number} params.budget 预算
 * @param {number} params.duration 天数
 * @param {Array} params.preferences 偏好标签
 * @returns {Promise<Object>} 推荐结果
 */
async function getAIRecommendation(params) {
  const plugin = initPlugin();
  
  if (!plugin) {
    return {
      success: false,
      data: null,
      message: 'AI 推荐功能需要安装飞猪 AI Fly 插件'
    };
  }

  try {
    const result = await plugin.getAIRecommendation({
      destination: params.destination,
      budget: params.budget,
      duration: params.duration,
      preferences: params.preferences || []
    });
    
    return {
      success: true,
      data: result,
      message: '推荐成功'
    };
  } catch (err) {
    console.error('AI 推荐失败:', err);
    return {
      success: false,
      data: null,
      message: err.message
    };
  }
}

/**
 * 打开插件机票页面
 */
function openFlightPage() {
  wx.navigateTo({
    url: 'plugin://flyPigAI/pages/flight/index',
    fail: (err) => {
      console.error('打开插件页面失败:', err);
      wx.showToast({
        title: '请先安装飞猪 AI Fly 插件',
        icon: 'none'
      });
    }
  });
}

/**
 * 打开插件酒店页面
 */
function openHotelPage() {
  wx.navigateTo({
    url: 'plugin://flyPigAI/pages/hotel/index',
    fail: (err) => {
      console.error('打开插件页面失败:', err);
      wx.showToast({
        title: '请先安装飞猪 AI Fly 插件',
        icon: 'none'
      });
    }
  });
}

/**
 * 打开 AI 助手页面
 */
function openAIAssistantPage() {
  wx.navigateTo({
    url: 'plugin://flyPigAI/pages/ai-assistant/index',
    fail: (err) => {
      console.error('打开插件页面失败:', err);
      wx.showToast({
        title: '请先安装飞猪 AI Fly 插件',
        icon: 'none'
      });
    }
  });
}

/**
 * 调用云函数（降级方案）
 */
async function callCloudFunction(name, data) {
  try {
    const result = await wx.cloud.callFunction({
      name,
      data
    });
    
    return result.result;
  } catch (err) {
    console.error(`云函数 ${name} 调用失败:`, err);
    return {
      success: false,
      data: null,
      message: '服务暂时不可用，请稍后重试'
    };
  }
}

/**
 * 检查插件是否可用
 */
function isPluginAvailable() {
  try {
    requirePlugin('flyPigAI');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  initPlugin,
  searchFlights,
  searchHotels,
  getAIRecommendation,
  openFlightPage,
  openHotelPage,
  openAIAssistantPage,
  isPluginAvailable
};
