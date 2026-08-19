# yshop-drink API 适配说明

## Base URL

上游移动端开发配置使用：

```text
http://localhost:48081/app-api
```

生产演示配置使用 `/app-api` 前缀。

## 门店

```http
GET /store/nearby
```

请求：

```js
{
  lat,
  lng,
  shop_id,
  kw: ''
}
```

## 商品

```http
GET /product/products?shopId=<id>
```

上游返回的核心结构：

```text
category[]
  id
  name
  goodsList[]
    id
    storeName
    storeInfo
    image
    price
    stock
    productAttr
    productValue
```

本项目在 `services/normalize.js` 转为统一分类/商品/SKU。

## 创建订单

```http
POST /order/create
```

本项目按上游开源 pay 页的字段构造：

```js
{
  orderType,  // takein / takeout
  addressId,
  shopId,
  mobile,
  gettime,
  payType,
  remark,
  productId: [],
  spec: [],
  number: [],
  couponId
}
```

其中规格字符串会把逗号替换为 `|`，与上游移动端提交方式保持一致。

## 订单

```http
GET /order/list
GET /order/detail/{id}
POST /order/pay
```

## 用户

```http
GET /member/user/get-info
```

请求头：

```text
Authorization: Bearer <accessToken>
```

## 微信登录

第一步：

```http
POST /member/auth/auth-session
{ code: wx.login() 返回的 code }
```

得到 `openId`。

第二步：

```http
POST /member/auth/auth-miniapp-login
{
  encryptedData,
  iv,
  openid
}
```

成功后保存 `accessToken`。

### 新版微信注意事项

如果 `getPhoneNumber` 事件只返回一次性 `code`，需要后端增加新版手机号 code 换取逻辑。本项目没有伪造该接口，避免把不确定的后端协议硬编码进去。
