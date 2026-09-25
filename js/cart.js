let cart = JSON.parse(localStorage.getItem('store-cart')) || [];

function saveCart() {
  localStorage.setItem('store-cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function addToCart(productId, qty = 1, size = null, color = null) {
  const product = getProductById(productId);
  if (!product) return;
  const selectedSize = size || (product.sizes && product.sizes[0]) || '';
  const selectedColor = color || (product.colors && product.colors[0]) || '';
  const key = `${productId}-${selectedSize}-${selectedColor}`;
  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key, id: product.id, name: product.name, price: product.price,
      image: product.image, size: selectedSize, color: selectedColor, qty
    });
  }
  saveCart();
  showToast(`<i class="fas fa-check-circle"></i> تم إضافة "${product.name}" للسلة!`);
}

function removeFromCart(key) {
  cart = cart.filter(item => item.key !== key);
  saveCart();
  renderCart();
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const container = document.getElementById('cart-items-list');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>سلتك فارغة!</h3>
        <p>لم تضف أي منتجات بعد. ابدأ التسوق الآن!</p>
        <a href="shop.html" class="btn btn-primary"><i class="fas fa-store"></i> تسوق الآن</a>
      </div>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">
            <span>المقاس: ${item.size}</span>
            <span>اللون: ${item.color}</span>
          </div>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" onclick="updateQty('${item.key}', -1)">-</button>
            <span class="cart-item-quantity">${item.qty}</span>
            <button class="cart-qty-btn" onclick="updateQty('${item.key}', 1)">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <strong>${formatPrice(item.price * item.qty)}</strong>
          <span>${formatPrice(item.price)} / قطعة</span>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.key}')" title="حذف"><i class="fas fa-times"></i></button>
      </div>`).join('');
  }
  updateSummary();
}

function updateSummary() {
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 50) : 0;
  const total = subtotal + shipping;
  const el = id => document.getElementById(id);
  if (el('summary-subtotal')) el('summary-subtotal').textContent = formatPrice(subtotal);
  if (el('summary-shipping')) el('summary-shipping').textContent = shipping === 0 ? 'مجاني' : formatPrice(shipping);
  if (el('summary-total')) el('summary-total').textContent = formatPrice(total);
  if (el('checkout-total')) el('checkout-total').textContent = formatPrice(total);
  if (el('cart-count-text')) el('cart-count-text').textContent = getCartCount() + ' منتجات';
}

function showToast(message, duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCart();
  updateSummary();
});
