# 派派trip秘书

智能旅行助手小程序 - 机票酒店查询、跨境税率查询

## 功能特性

- ✈️ **机票查询** - 接入飞猪 AI Fly 插件，智能搜索最优机票
- 🏨 **酒店预订** - 全球酒店搜索，AI 智能推荐
- 💰 **税率查询** - 接入海关跨境通插件，实时查询跨境商品税率
- 🤖 **AI 助手** - 智能旅行建议和行程规划

## 技术栈

- **前端**: 微信小程序原生开发
- **后端**: 微信云开发
- **插件**: 
  - 飞猪 AI Fly 插件
  - 海关跨境通插件

## 项目结构

```
paipai-trip-secretary/
├── miniprogram/               # 小程序前端
│   ├── pages/
│   │   ├── index/             # 首页
│   │   ├── flight/            # 机票查询
│   │   ├── hotel/             # 酒店查询
│   │   ├── tax/               # 税率查询
│   │   └── mine/              # 个人中心
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── cloudfunctions/            # 云函数
│   ├── flightSearch/          # 机票搜索
│   ├── hotelSearch/           # 酒店搜索
│   └── taxQuery/              # 税率查询
└── project.config.json
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ColinTang1210/paipai-trip-secretary.git
```

### 2. 导入微信开发者工具

1. 打开微信开发者工具
2. 导入项目，选择项目目录
3. 填入你的 AppID

### 3. 配置云开发环境

1. 在微信开发者工具中开通云开发
2. 修改 `miniprogram/app.js` 中的云环境 ID
3. 上传并部署云函数

### 4. 配置插件

在 `app.json` 中配置插件：

```json
{
  "plugins": {
    "flyPigAI": {
      "version": "1.0.0",
      "provider": "飞猪AI插件的AppID"
    },
    "crossBorder": {
      "version": "1.0.0",
      "provider": "海关跨境通插件的AppID"
    }
  }
}
```

## 开发说明

### 云函数部署

```bash
# 在微信开发者工具中右键点击 cloudfunctions 目录下的每个云函数
# 选择「上传并部署：云端安装依赖」
```

### 添加图标资源

项目中的图标资源需要自行添加到 `miniprogram/assets/icons/` 目录：

- `home.png` / `home-active.png` - 首页图标
- `flight.png` / `flight-active.png` - 机票图标
- `hotel.png` / `hotel-active.png` - 酒店图标
- `tax.png` / `tax-active.png` - 税率图标
- `mine.png` / `mine-active.png` - 我的图标

## License

MIT License

## 作者

派派trip秘书团队
