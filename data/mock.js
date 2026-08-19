const store = {
  id: 1,
  name: '卜卜屋烘焙',
  distance: '1.20km',
  distanceKm: 1.2,
  deliveryDistanceKm: 5,
  maxDeliveryDistanceKm: 5,
  deliveryPrice: 3,
  minPrice: 20,
  status: 1,
  notice: '欢迎光临，很高兴为您服务！'
}

const user = {
  id: 9051341,
  username: '用户_9051341',
  avatar: '/assets/avatar.png',
  mobile: '138****3141',
  score: 0,
  coupons: 0,
  balance: 0
}

const categories = [
  { id: 'bancake', name: '班戟' },
  { id: 'snow', name: '雪媚娘' },
  { id: 'cake', name: '盒子蛋糕' },
  { id: 'bowl', name: '抱抱碗' },
  { id: 'sweet', name: '甜品系列' },
  { id: 'roll', name: '毛巾卷/千层盒子' },
  { id: 'fresh', name: '现烤系列' }
]

const products = [
  { id: 101, categoryId: 'fresh', name: '芋泥烤奶', price: 28, image: '/assets/product-1.png', sold: 86, desc: '芋泥与烤奶，现烤出炉', stock: 99, hasSku: false, skus: [] },
  { id: 102, categoryId: 'fresh', name: '芝士焗榴莲', price: 35, image: '/assets/product-2.png', sold: 128, desc: '浓郁芝士搭配榴莲果肉', stock: 99, hasSku: false, skus: [] },
  { id: 103, categoryId: 'fresh', name: '厚芝士7寸现烤披萨 🍕', price: 35, image: '/assets/product-3.png', sold: 210, desc: '现点现烤，约需20分钟', stock: 60, hasSku: true, skus: [
    { id: '103-1', name: '芝士培根', specKey: '芝士培根', price: 35, stock: 30 },
    { id: '103-2', name: '榴莲芝士', specKey: '榴莲芝士', price: 42, stock: 30 }
  ]},
  { id: 104, categoryId: 'fresh', name: '厚芝士榴莲披萨 🍕', price: 55, image: '/assets/product-3.png', sold: 176, desc: '双倍榴莲果肉', stock: 88, hasSku: false, skus: [] },
  { id: 105, categoryId: 'fresh', name: '6寸巴斯克芝士蛋糕', price: 98, image: '/assets/product-4.png', sold: 63, desc: '冷藏口感更佳', stock: 20, hasSku: false, skus: [] },
  { id: 106, categoryId: 'bancake', name: '芒果班戟', price: 18, image: '/assets/product-5.png', sold: 59, desc: '新鲜芒果与淡奶油', stock: 66, hasSku: false, skus: [] },
  { id: 107, categoryId: 'snow', name: '草莓雪媚娘', price: 16, image: '/assets/product-1.png', sold: 73, desc: '软糯外皮，酸甜草莓', stock: 77, hasSku: false, skus: [] },
  { id: 108, categoryId: 'cake', name: '海盐奥利奥盒子', price: 32, image: '/assets/product-4.png', sold: 42, desc: '海盐奶油与奥利奥碎', stock: 25, hasSku: false, skus: [] },
  { id: 109, categoryId: 'bowl', name: '莓果抱抱碗', price: 29, image: '/assets/product-5.png', sold: 38, desc: '莓果、酸奶、蛋糕胚', stock: 31, hasSku: false, skus: [] },
  { id: 110, categoryId: 'sweet', name: '焦糖布丁', price: 12, image: '/assets/product-2.png', sold: 96, desc: '低温烘烤顺滑布丁', stock: 88, hasSku: false, skus: [] },
  { id: 111, categoryId: 'roll', name: '抹茶毛巾卷', price: 26, image: '/assets/product-1.png', sold: 52, desc: '抹茶奶油千层卷', stock: 42, hasSku: false, skus: [] }
]

module.exports = { store, user, categories, products }
