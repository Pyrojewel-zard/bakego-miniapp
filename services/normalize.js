function num(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function normalizeStore(raw = {}) {
  return {
    id: raw.id || raw.shopId || 0,
    name: raw.name || raw.storeName || '卜卜屋烘焙',
    image: raw.image || '',
    distance: raw.dis != null ? `${num(raw.dis).toFixed(2)}km` : (raw.distanceText || '1.20km'),
    distanceKm: num(raw.dis != null ? raw.dis : raw.distance, 0),
    deliveryDistanceKm: num(raw.distance, 0),
    maxDeliveryDistanceKm: num(raw.far, 0),
    deliveryPrice: num(raw.deliveryPrice, 0),
    minPrice: num(raw.min_price, 0),
    status: raw.status == null ? 1 : raw.status,
    notice: raw.notice || '欢迎光临，很高兴为您服务！',
    raw
  }
}

function productSkus(good = {}) {
  const values = good.productValue || {}
  const rows = Object.keys(values).map((key, index) => {
    const v = values[key] || {}
    return {
      id: String(v.id || v.unique || `${good.id || 'p'}-${index}`),
      name: key,
      specKey: key,
      price: num(v.price, num(good.price)),
      stock: num(v.stock, num(good.stock, 999)),
      image: v.image || good.image || ''
    }
  })
  if (rows.length) return rows

  const attrs = good.productAttr || []
  if (!attrs.length) return []
  const first = attrs[0]
  return (first.attrValueArr || []).map((name, index) => ({
    id: `${good.id || 'p'}-${index}`,
    name,
    specKey: name,
    price: num(good.price),
    stock: num(good.stock, 999),
    image: good.image || ''
  }))
}

function normalizeCatalog(raw = []) {
  const categories = []
  const products = []
  ;(Array.isArray(raw) ? raw : []).forEach((cat, catIndex) => {
    const categoryId = String(cat.id != null ? cat.id : `cat-${catIndex}`)
    categories.push({
      id: categoryId,
      name: cat.name || `分类${catIndex + 1}`,
      icon: cat.icon || ''
    })
    ;(cat.goodsList || []).forEach((good, goodIndex) => {
      const skus = productSkus(good)
      products.push({
        id: good.id != null ? good.id : `${categoryId}-${goodIndex}`,
        categoryId,
        name: good.storeName || good.name || `商品${goodIndex + 1}`,
        price: num(good.price),
        image: good.image || '',
        sold: num(good.sales || good.salesCount),
        desc: good.storeInfo || good.info || '',
        stock: num(good.stock, 999),
        hasSku: skus.length > 0,
        skus,
        productAttr: good.productAttr || [],
        raw: good
      })
    })
  })
  return { categories, products }
}

const STATUS_TEXT = {
  0: '未支付',
  1: '待发货',
  2: '待收货',
  3: '待评价',
  4: '已完成',
  5: '退款中',
  6: '已退款',
  7: '退款'
}

function normalizeOrder(raw = {}) {
  const itemsRaw = raw.cartInfo || raw.items || raw.productList || raw.orderInfo || []
  const items = (Array.isArray(itemsRaw) ? itemsRaw : []).map((i, index) => {
    const p = i.productInfo || i.product || i
    return {
      key: String(i.id || p.id || index),
      productId: p.id || i.productId || 0,
      name: p.storeName || p.name || i.name || '商品',
      skuName: i.productAttrUnique || i.suk || i.spec || i.valueStr || '',
      specKey: i.productAttrUnique || i.spec || i.valueStr || '',
      image: p.image || i.image || '',
      price: num(i.truePrice != null ? i.truePrice : (i.price != null ? i.price : p.price)),
      qty: num(i.cartNum != null ? i.cartNum : (i.number != null ? i.number : i.qty), 1)
    }
  })
  const statusValue = raw.status != null ? raw.status : raw._status
  return {
    id: String(raw.id || raw.orderId || raw.order_id || raw.orderSn || raw.orderId || ''),
    no: raw.orderId || raw.orderSn || raw.order_id || raw.id || '',
    status: raw.statusText || raw._status_name || STATUS_TEXT[statusValue] || '处理中',
    createdAt: raw.createTime || raw.addTime || raw.createdAt || '',
    mode: (raw.orderType === 'takein' || raw.order_type === 'takein') ? 'pickup' : 'delivery',
    store: normalizeStore(raw.store || { id: raw.shopId, name: raw.shopName }),
    items,
    total: num(raw.payPrice != null ? raw.payPrice : (raw.totalPrice != null ? raw.totalPrice : raw.total)),
    note: raw.remark || raw.mark || '',
    pickupTime: raw.gettime || raw.pickupTime || '',
    raw
  }
}

function normalizeUser(raw = {}) {
  return {
    id: raw.id || raw.uid || raw.userId || 0,
    username: raw.nickname || raw.nickName || raw.username || raw.mobile || '用户_9051341',
    avatar: raw.avatar || raw.avatarUrl || '/assets/avatar.png',
    mobile: raw.mobile || '',
    score: num(raw.integral != null ? raw.integral : raw.score),
    coupons: num(raw.couponCount != null ? raw.couponCount : raw.coupons),
    balance: num(raw.nowMoney != null ? raw.nowMoney : (raw.balance != null ? raw.balance : raw.money)),
    raw
  }
}

module.exports = {
  normalizeStore,
  normalizeCatalog,
  normalizeOrder,
  normalizeUser
}
