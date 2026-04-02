// pages/tax/tax.js
const app = getApp();

Page({
  data: {
    category: '',
    productName: '',
    price: '',
    currency: 'CNY',
    currencyName: '人民币',
    country: '',
    taxResult: null,
    commonCategories: [
      { id: 1, name: '化妆品', icon: '/assets/icons/cosmetics.png', rate: 30 },
      { id: 2, name: '数码产品', icon: '/assets/icons/digital.png', rate: 13 },
      { id: 3, name: '服饰箱包', icon: '/assets/icons/bag.png', rate: 20 },
      { id: 4, name: '手表', icon: '/assets/icons/watch.png', rate: 20 },
      { id: 5, name: '珠宝首饰', icon: '/assets/icons/jewelry.png', rate: 30 },
      { id: 6, name: '奶粉', icon: '/assets/icons/milk.png', rate: 5 }
    ]
  },

  onLoad() {},

  // 打开海关跨境通插件
  openCrossBorderPlugin() {
    wx.showToast({ title: '正在打开海关跨境通...', icon: 'loading' });
    
    // 调用海关跨境通插件
    // const plugin = requirePlugin('crossBorder');
    // 根据插件文档调用相应接口
    
    // 示例：跳转到插件页面
    // wx.navigateTo({
    //   url: 'plugin://crossBorder/index'
    // });
  },

  // 选择商品类型
  selectCategory() {
    const categories = this.data.commonCategories.map(c => c.name);
    wx.showActionSheet({
      itemList: [...categories, '其他'],
      success: (res) => {
        if (res.tapIndex < categories.length) {
          this.setData({
            category: categories[res.tapIndex]
          });
        } else {
          this.setData({ category: '其他' });
        }
      }
    });
  },

  // 商品名称输入
  onProductInput(e) {
    this.setData({ productName: e.detail.value });
  },

  // 价格输入
  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },

  // 选择币种
  selectCurrency() {
    wx.showActionSheet({
      itemList: ['人民币 (CNY)', '美元 (USD)', '日元 (JPY)', '欧元 (EUR)', '韩元 (KRW)', '港币 (HKD)'],
      success: (res) => {
        const currencies = [
          { code: 'CNY', name: '人民币' },
          { code: 'USD', name: '美元' },
          { code: 'JPY', name: '日元' },
          { code: 'EUR', name: '欧元' },
          { code: 'KRW', name: '韩元' },
          { code: 'HKD', name: '港币' }
        ];
        this.setData({
          currency: currencies[res.tapIndex].code,
          currencyName: currencies[res.tapIndex].name
        });
      }
    });
  },

  // 选择购买国家
  selectCountry() {
    wx.navigateTo({
      url: '/pages/country-select/country-select'
    });
  },

  // 查询税率
  async queryTax() {
    const { category, price, currency } = this.data;

    if (!category) {
      wx.showToast({ title: '请选择商品类型', icon: 'none' });
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      wx.showToast({ title: '请输入商品价格', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '查询中...' });

    try {
      // 调用云函数查询税率
      const res = await wx.cloud.callFunction({
        name: 'taxQuery',
        data: {
          category,
          price: parseFloat(price),
          currency
        }
      });

      wx.hideLoading();
      this.setData({ taxResult: res.result });
    } catch (err) {
      console.error('查询税率失败:', err);
      wx.hideLoading();
      
      // 使用模拟数据演示
      this.setData({
        taxResult: this.calculateMockTax(parseFloat(price))
      });
    }
  },

  // 快速查询
  quickQuery(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      category: item.name
    });
  },

  // 模拟税费计算
  calculateMockTax(price) {
    // 假设汇率为1（实际应调用汇率API）
    const cnyValue = price;
    
    // 免税额度 5000 元
    const allowance = 5000;
    
    if (cnyValue <= allowance) {
      return {
        productValue: cnyValue.toFixed(2),
        tariff: '0.00',
        vat: '0.00',
        consumptionTax: '0.00',
        totalTax: '0.00',
        tariffRate: 0,
        vatRate: 0,
        consumptionRate: 0,
        note: '商品价值在免税额度内，无需缴纳税费。'
      };
    }

    const taxableValue = cnyValue - allowance;
    
    // 假设税率
    const tariffRate = 10;
    const vatRate = 13;
    const consumptionRate = 0;

    const tariff = (taxableValue * tariffRate / 100).toFixed(2);
    const vat = ((taxableValue + parseFloat(tariff)) * vatRate / 100).toFixed(2);

    return {
      productValue: cnyValue.toFixed(2),
      tariff,
      vat,
      consumptionTax: '0.00',
      totalTax: (parseFloat(tariff) + parseFloat(vat)).toFixed(2),
      tariffRate,
      vatRate,
      consumptionRate,
      note: '此为预估税费，实际税费以海关核定为准。'
    };
  }
});
