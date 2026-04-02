// pages/tax/tax.js
Page({
  data: {
    category: '',
    price: '',
    taxResult: null
  },

  selectCategory() {
    wx.showActionSheet({
      itemList: ['化妆品', '数码产品', '服饰箱包', '手表', '珠宝首饰', '奶粉'],
      success: (res) => {
        const categories = ['化妆品', '数码产品', '服饰箱包', '手表', '珠宝首饰', '奶粉'];
        this.setData({ category: categories[res.tapIndex] });
      }
    });
  },

  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },

  queryTax() {
    const { category, price } = this.data;

    if (!category) {
      wx.showToast({ title: '请选择商品类型', icon: 'none' });
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      wx.showToast({ title: '请输入商品价格', icon: 'none' });
      return;
    }

    const priceNum = parseFloat(price);
    const allowance = 5000;

    if (priceNum <= allowance) {
      this.setData({
        taxResult: {
          productValue: priceNum.toFixed(2),
          tariff: '0.00',
          vat: '0.00',
          totalTax: '0.00'
        }
      });
      return;
    }

    const taxable = priceNum - allowance;
    const tariff = taxable * 0.1;
    const vat = (priceNum + tariff) * 0.13;

    this.setData({
      taxResult: {
        productValue: priceNum.toFixed(2),
        tariff: tariff.toFixed(2),
        vat: vat.toFixed(2),
        totalTax: (tariff + vat).toFixed(2)
      }
    });
  }
});
