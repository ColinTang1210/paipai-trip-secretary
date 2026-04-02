<!-- 图标资源说明 -->

本项目需要的图标文件（放入 assets/icons/ 目录）：

## TabBar 图标（必须）

| 文件名 | 用途 | 尺寸 |
|--------|------|------|
| home.png | 首页图标 | 81x81 |
| home-active.png | 首页选中 | 81x81 |
| flight.png | 机票图标 | 81x81 |
| flight-active.png | 机票选中 | 81x81 |
| hotel.png | 酒店图标 | 81x81 |
| hotel-active.png | 酒店选中 | 81x81 |
| tax.png | 税率图标 | 81x81 |
| tax-active.png | 税率选中 | 81x81 |
| mine.png | 我的图标 | 81x81 |
| mine-active.png | 我的选中 | 81x81 |

## 功能图标（可选）

| 文件名 | 用途 |
|--------|------|
| search.png | 搜索 |
| search-white.png | 搜索（白色） |
| arrow-right.png | 右箭头 |
| arrow-down.png | 下箭头 |
| location.png | 定位 |
| swap.png | 交换 |
| filter.png | 筛选 |
| default-avatar.png | 默认头像 |

## 获取图标

1. 阿里巴巴矢量图标库：https://www.iconfont.cn/
2. 搜索对应关键词下载 PNG 格式
3. 注意：TabBar 图标建议使用 81x81 像素

## 临时方案

如果暂时没有图标，可以在 app.json 中注释掉 tabBar 配置中的 iconPath：
```json
"list": [
  {
    "pagePath": "pages/index/index",
    "text": "首页"
    // "iconPath": "assets/icons/home.png",
    // "selectedIconPath": "assets/icons/home-active.png"
  }
]
```

这样小程序仍然可以运行，只是 TabBar 没有图标。
