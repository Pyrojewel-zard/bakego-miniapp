const CART_KEY = 'bread_yshop_cart_v1'

function getCart() {
  return wx.getStorageSync(CART_KEY) || []
}

function saveCart(cart) {
  wx.setStorageSync(CART_KEY, cart)
  return cart
}

function addItem(product, sku) {
  const cart = getCart()
  const key = sku ? `${product.id}:${sku.id}` : String(product.id)
  const found = cart.find(i => i.key === key)
  if (found) {
    found.qty += 1
  } else {
    cart.push({
      key,
      productId: product.id,
      name: product.name,
      skuId: sku ? sku.id : '',
      skuName: sku ? sku.name : '',
      specKey: sku ? (sku.specKey || sku.name) : '',
      image: sku && sku.image ? sku.image : product.image,
      price: sku ? sku.price : product.price,
      qty: 1,
      stock: sku ? sku.stock : product.stock
    })
  }
  return saveCart(cart)
}

function clearCart() {
  saveCart([])
}

function summary(cart = getCart()) {
  return cart.reduce((acc, item) => {
    acc.count += item.qty
    acc.total += Number(item.price) * item.qty
    return acc
  }, { count: 0, total: 0 })
}

module.exports = { getCart, saveCart, addItem, clearCart, summary }
