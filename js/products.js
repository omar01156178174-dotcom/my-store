const products = [
  {
    id: 1, name: 'تيشيرت كلاسيك بريميوم', category: 'tshirts', categoryName: 'تيشيرتات',
    price: 299, oldPrice: 399,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], colors: ['أبيض','أسود','رمادي'],
    description: 'تيشيرت كلاسيك بريميوم مصنوع من أجود أنواع القطن المصري 100٪. تصميم بسيط وأنيق مناسب لكل المناسبات اليومية والكاجوال.',
    rating: 4.5, reviews: 128, badge: 'خصم 25%', badgeType: 'sale', featured: true, isNew: false
  },
  {
    id: 2, name: 'تيشيرت أسود مطبوع', category: 'tshirts', categoryName: 'تيشيرتات',
    price: 349, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80'],
    sizes: ['S','M','L','XL'], colors: ['أسود'],
    description: 'تيشيرت أسود بطبعة عصرية حصرية. مصنوع من قماش ناعم ومريح للاستخدام اليومي.',
    rating: 4.8, reviews: 95, badge: 'جديد', badgeType: 'new', featured: true, isNew: true
  },
  {
    id: 3, name: 'بنطلون جينز سليم فيت', category: 'pants', categoryName: 'بناطيل',
    price: 499, oldPrice: 650,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80'],
    sizes: ['28','30','32','34','36'], colors: ['أزرق داكن','أسود','رمادي'],
    description: 'بنطلون جينز سليم فيت من أجود أنواع الجينز. تصميم عصري يناسب جميع الاستخدامات اليومية.',
    rating: 4.6, reviews: 200, badge: 'الأكثر مبيعاً', badgeType: 'best', featured: true, isNew: false
  },
  {
    id: 4, name: 'بنطلون كاجوال بيج', category: 'pants', categoryName: 'بناطيل',
    price: 449, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80'],
    sizes: ['28','30','32','34','36'], colors: ['بيج','كاكي','رمادي فاتح'],
    description: 'بنطلون كاجوال أنيق مثالي للإطلالات العصرية المريحة. مصنوع من قماش خفيف الوزن.',
    rating: 4.3, reviews: 67, badge: 'جديد', badgeType: 'new', featured: false, isNew: true
  },
  {
    id: 5, name: 'جاكيت جلد أسود', category: 'jackets', categoryName: 'جاكيتات',
    price: 899, oldPrice: 1200,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80'],
    sizes: ['S','M','L','XL'], colors: ['أسود','بني'],
    description: 'جاكيت جلد أصلي بتصميم كلاسيك. مثالي للمناسبات الرسمية وغير الرسمية على حد سواء.',
    rating: 4.9, reviews: 45, badge: 'خصم 25%', badgeType: 'sale', featured: true, isNew: false
  },
  {
    id: 6, name: 'قميص أزرق رسمي', category: 'shirts', categoryName: 'قمصان',
    price: 399, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], colors: ['أزرق فاتح','أبيض','أزرق داكن'],
    description: 'قميص رسمي بقماش قطن عالي الجودة. مثالي للعمل والمناسبات الرسمية.',
    rating: 4.7, reviews: 152, badge: 'جديد', badgeType: 'new', featured: true, isNew: true
  },
  {
    id: 7, name: 'هودي رمادي بريميوم', category: 'tshirts', categoryName: 'تيشيرتات',
    price: 549, oldPrice: 699,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], colors: ['رمادي','أسود','كحلي'],
    description: 'هودي بريميوم دافئ ومريح. مصنوع من قماش فليس عالي الجودة مع هود وجيب كنغر.',
    rating: 4.6, reviews: 89, badge: 'خصم 21%', badgeType: 'sale', featured: false, isNew: false
  },
  {
    id: 8, name: 'بنطلون رياضي سويت', category: 'pants', categoryName: 'بناطيل',
    price: 299, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80'],
    sizes: ['S','M','L','XL'], colors: ['رمادي','أسود','كحلي'],
    description: 'بنطلون رياضي فاخر من قماش سويتشيرت ناعم. مثالي للرياضة والجلسات المريحة.',
    rating: 4.4, reviews: 113, badge: null, badgeType: null, featured: false, isNew: true
  },
  {
    id: 9, name: 'جاكيت شتوي بافر', category: 'jackets', categoryName: 'جاكيتات',
    price: 799, oldPrice: 999,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80'],
    sizes: ['S','M','L','XL','XXL'], colors: ['أسود','كحلي','زيتي'],
    description: 'جاكيت شتوي بافر دافئ ومقاوم للرياح. مثالي للطقس البارد مع تصميم عصري.',
    rating: 4.8, reviews: 76, badge: 'خصم 20%', badgeType: 'sale', featured: true, isNew: false
  },
  {
    id: 10, name: 'قميص كاروهات كاجوال', category: 'shirts', categoryName: 'قمصان',
    price: 449, oldPrice: null,
    image: 'https://images.unsplash.com/photo-1587552532688-d0b2a5c3a61f?w=500&q=80',
    images: ['https://images.unsplash.com/photo-1587552532688-d0b2a5c3a61f?w=500&q=80'],
    sizes: ['S','M','L','XL'], colors: ['أحمر/أسود','أزرق/أبيض','أخضر/أسود'],
    description: 'قميص كاروهات كاجوال بتصميم عصري. مصنوع من قماش فلانيل دافئ ومريح.',
    rating: 4.5, reviews: 58, badge: 'جديد', badgeType: 'new', featured: false, isNew: true
  }
];

function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

function getProductsByCategory(cat) {
  if (!cat || cat === 'all') return products;
  return products.filter(p => p.category === cat);
}

function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars += 'star';
    else if (i - rating < 1) stars += 'star-half-alt';
    else stars += 'star';
  }
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
  return html;
}

function formatPrice(price) {
  return price.toLocaleString('ar-EG') + ' ج.م';
}

function createProductCard(product) {
  const badgeHtml = product.badge
    ? `<span class="product-badge ${product.badgeType === 'new' ? 'new' : product.badgeType === 'best' ? 'best' : ''}">${product.badge}</span>`
    : '';
  const oldPriceHtml = product.oldPrice
    ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>`
    : '';
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-img-wrap">
        ${badgeHtml}
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i> أضف للسلة</button>
          <button class="product-wishlist" title="أضف للمفضلة"><i class="far fa-heart"></i></button>
          <a href="product.html?id=${product.id}" class="product-wishlist" title="عرض المنتج"><i class="fas fa-eye"></i></a>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryName}</span>
        <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${oldPriceHtml}
        </div>
      </div>
    </div>
  `;
}
