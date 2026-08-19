# Bread × yshop-drink 合并适配版 v1

这是一个**可直接导入微信开发者工具**的原生微信小程序工程，用于把两类开源项目的优势合并到一套面包/烘焙点单产品中：

- `gooking/bread`：参考其“面包店小程序”的页面信息架构，例如首页、门店、点单、订单、会员卡、结算、自提时间等。
- `guchengwuyue/yshop-drink`：适配其 Spring Boot 3 点餐后端的数据模型与公开移动端 API，包括门店、商品分类/商品、SKU、订单、会员、微信登录等。
- 本工程 UI：按当前目标截图重新实现，不直接搬运两边的 UI 资产，方便后续继续做 1:1 视觉迭代。

> 当前默认 `mock` 模式，所以没有 Java/MySQL/Redis 也能编译和演示。切换到 `yshop` 模式即可接真实后端。

## 1. 当前完成范围

### 首页
- 外卖配送
- 到店自提
- 我的订单
- Banner
- 会员中心
- 充值入口占位

### 点单
- 门店信息
- 外卖 / 自取切换
- 左侧分类
- 商品列表
- 库存/售罄
- 多规格 SKU
- 购物车
- 去结算

### 订单
- 本地 mock 订单闭环
- yshop `/order/list`
- yshop `/order/detail/{id}`
- yshop `/order/create`

### 个人中心
- 积分 / 优惠券 / 余额
- 微信登录入口
- 我的订单
- 地址 / 客服 / 联系我们 / 协议政策占位
- 会员码入口

### 会员码
- 与目标 UI 一致的条码 + QR 视觉层
- 每 60 秒刷新
- 会员资产展示

> 会员码当前是前端视觉 token，并不等价于后端可核销二维码。正式上线需要新增后端 `member-code`/核销接口。

## 2. 目录

```text
bakego-miniapp/
├── app.js
├── app.json
├── app.wxss
├── assets/
├── config/
│   └── env.js                 # mock / yshop 切换与后端地址
├── services/
│   ├── api.js                 # 页面只依赖这一层
│   ├── request.js             # wx.request + Bearer token
│   ├── normalize.js           # yshop -> UI 统一数据模型
│   └── adapters/
│       ├── mock.js
│       └── yshop.js
├── data/
│   └── mock.js
├── utils/
│   ├── cart.js
│   └── orders.js
├── custom-tab-bar/
├── pages/
│   ├── home/
│   ├── menu/
│   ├── member/
│   ├── orders/
│   ├── order-detail/
│   ├── profile/
│   └── checkout/
└── docs/
    ├── MERGE_MAP.md
    └── YSHOP_ADAPTER.md
```

## 3. 直接运行

1. 安装微信开发者工具。
2. 导入整个 `bakego-miniapp` 文件夹。
3. 当前 `appid` 是 `touristappid`，用于本地 UI 编译体验。
4. 点击“编译”。

默认配置：

```js
// config/env.js
API_MODE: 'mock'
```

所以无需后端即可运行。

## 4. 切换到 yshop-drink

修改：

```js
// config/env.js
module.exports = {
  API_MODE: 'yshop',
  YSHOP_BASE_URL: 'https://你的域名/app-api',
  DEFAULT_STORE_ID: 0,
  // ...
}
```

`yshop-drink` 开源前端当前开发环境基准地址为：

```text
http://localhost:48081/app-api
```

微信真机必须使用 HTTPS，并在微信公众平台配置合法 `request` 域名。

## 5. 已适配的 yshop API

```text
GET  /store/nearby
GET  /product/products
GET  /order/list
GET  /order/detail/{id}
POST /order/create
POST /order/pay
GET  /member/user/get-info
POST /member/auth/auth-session
POST /member/auth/auth-miniapp-login
```

具体字段映射见 `docs/YSHOP_ADAPTER.md`。

## 6. 重要：微信手机号登录

当前 yshop-drink 开源移动端代码使用：

```text
encryptedData + iv + openid
```

调用：

```text
/member/auth/auth-miniapp-login
```

而较新的微信手机号授权能力可能只返回一次性 `code`。因此：

- 工程已经保留原 yshop 登录兼容路径；
- 若你的微信基础库只返回手机号 `code`，Spring Boot 端需要补一个新版 `getPhoneNumber` code 换手机号的适配接口；
- 这不会影响 `mock` 模式编译和 UI 开发。

## 7. 为什么不是把两个仓库直接拼目录

直接拼源码会同时保留：

- `bread` 原生 WXML/WXSS 页面体系；
- `yshop-drink` UniApp/Vue3 页面体系；
- 两套路由、组件、状态管理、购物车和请求层。

这样会形成双前端，后续很难维护。

本版采用更清晰的合并方式：

```text
目标 UI + bread 页面信息架构
             │
             ▼
     原生微信小程序页面
             │
             ▼
       services/api.js
             │
       ┌─────┴─────┐
       ▼           ▼
     mock        yshop
                   │
                   ▼
          Spring Boot 3 /app-api
```

也就是**UI 保持面包店产品形态，业务能力直接吃 yshop 后端**。

## 8. 下一阶段建议

v2 直接继续做：

- 目标截图 1:1 细节（字体、间距、图标、Banner、吉祥物）
- 门店选择页
- 地址管理
- 优惠券
- 储值充值
- 微信支付
- 订单状态实时刷新
- 后台可核销的动态会员码
- 小票打印联动

## 9. 上游项目

- https://github.com/gooking/bread
- https://github.com/guchengwuyue/yshop-drink

请在二次分发或商用前自行确认并遵守上游许可证及第三方组件许可证。
