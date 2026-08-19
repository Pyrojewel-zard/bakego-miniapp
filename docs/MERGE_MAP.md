# 合并设计图

## UI/业务职责

| 能力 | 本项目采用方案 | 来源思路 |
|---|---|---|
| 首页信息架构 | 面包店首页 + 外卖/自提/订单 | bread + 目标截图 |
| 点单页双栏 | 分类 + 商品 + SKU | 目标截图 + yshop 商品模型 |
| 购物车 | 统一 `utils/cart.js` | 重写，兼容 yshop SKU |
| 门店 | `services/adapters/yshop.js` | yshop `/store/nearby` |
| 商品 | 统一 normalize | yshop `/product/products` |
| 订单 | API adapter | yshop `/order/*` |
| 用户 | API adapter | yshop `/member/user/get-info` |
| 微信登录 | session + 手机号授权 | yshop auth API |
| 会员码 | 当前仅 UI token | 目标截图；正式版需新增后端核销 |

## 页面不直接依赖 yshop 字段

页面只读取统一模型：

```js
store = {
  id, name, distance, notice,
  deliveryPrice, minPrice
}

product = {
  id, categoryId, name, price,
  image, desc, stock, hasSku, skus
}

order = {
  id, no, status, createdAt,
  mode, store, items, total, note
}

user = {
  id, username, avatar,
  mobile, score, coupons, balance
}
```

因此后续即使换后端，也只需要新增一个 adapter。
