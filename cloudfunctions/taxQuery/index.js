// 云函数：税率查询
// cloudfunctions/taxQuery/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 商品税率表（简化版，实际应从数据库或海关API获取）
const TAX_RATES = {
  '化妆品': { tariff: 10, vat: 13, consumption: 30 },
  '数码产品': { tariff: 10, vat: 13, consumption: 0 },
  '服饰箱包': { tariff: 10, vat: 13, consumption: 0 },
  '手表': { tariff: 20, vat: 13, consumption: 20 },
  '珠宝首饰': { tariff: 20, vat: 13, consumption: 10 },
  '奶粉': { tariff: 5, vat: 13, consumption: 0 },
  '其他': { tariff: 10, vat: 13, consumption: 0 }
};

// 汇率表（示例，实际应从汇率API获取）
const EXCHANGE_RATES = {
  'CNY': 1,
  'USD': 7.2,
  'JPY': 0.048,
  'EUR': 7.8,
  'KRW': 0.0054,
  'HKD': 0.92
};

exports.main = async (event, context) => {
  const { category, price, currency, country } = event;

  try {
    // 获取税率
    const rates = TAX_RATES[category] || TAX_RATES['其他'];
    
    // 转换为人民币
    const exchangeRate = EXCHANGE_RATES[currency] || 1;
    const cnyValue = price * exchangeRate;
    
    // 免税额度
    const allowance = 5000;
    
    // 计算税费
    let tariff = 0;
    let vat = 0;
    let consumptionTax = 0;
    let totalTax = 0;
    let note = '';

    if (cnyValue <= allowance) {
      note = '商品价值在免税额度内，无需缴纳税费。';
    } else {
      const taxableValue = cnyValue - allowance;
      
      // 关税
      tariff = taxableValue * rates.tariff / 100;
      
      // 消费税
      consumptionTax = cnyValue * rates.consumption / 100;
      
      // 增值税（基于完税价格+关税+消费税）
      const vatBase = cnyValue + tariff + consumptionTax;
      vat = vatBase * rates.vat / 100;
      
      totalTax = tariff + vat + consumptionTax;
      note = '此为预估税费，实际税费以海关核定为准。';
    }

    return {
      success: true,
      data: {
        productValue: cnyValue.toFixed(2),
        tariff: tariff.toFixed(2),
        vat: vat.toFixed(2),
        consumptionTax: consumptionTax.toFixed(2),
        totalTax: totalTax.toFixed(2),
        tariffRate: rates.tariff,
        vatRate: rates.vat,
        consumptionRate: rates.consumption,
        note
      },
      message: '查询成功'
    };
  } catch (err) {
    console.error('税率查询失败:', err);
    return {
      success: false,
      data: null,
      message: '查询失败，请重试'
    };
  }
};
