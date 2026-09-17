document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileClose = document.querySelector('.mobile-menu-close');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      mobileMenu && mobileMenu.classList.add('open');
      mobileOverlay && mobileOverlay.classList.add('open');
      mobileMenu && (mobileMenu.style.display = 'block');
    });
  }
  function closeMenu() {
    mobileMenu && mobileMenu.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
  }
  mobileClose && mobileClose.addEventListener('click', closeMenu);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMenu);

  // Active Nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-menu nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // Countdown Timer
  function updateCountdown() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    const elH = document.getElementById('countdown-h');
    const elM = document.getElementById('countdown-m');
    const elS = document.getElementById('countdown-s');
    if (elH) elH.textContent = fmt(h);
    if (elM) elM.textContent = fmt(m);
    if (elS) elS.textContent = fmt(s);
  }
  if (document.getElementById('countdown-h')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Newsletter
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input && input.value.trim()) {
        showToast('<i class="fas fa-check-circle"></i> شكراً! تم اشتراكك في النشرة البريدية.');
        input.value = '';
      }
    });
  }

  // Coupon
  const couponBtn = document.getElementById('apply-coupon');
  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      const val = document.getElementById('coupon-input').value.trim().toUpperCase();
      if (val === 'SALE20') {
        showToast('<i class="fas fa-tag"></i> تم تطبيق كود الخصم! خصم 20%');
      } else {
        showToast('<i class="fas fa-times-circle"></i> كود الخصم غير صحيح');
      }
    });
  }

  // Payment methods
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
      this.classList.add('selected');
      const radio = this.querySelector('input[type=radio]');
      if (radio) radio.checked = true;
    });
  });

  // Checkout form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const orderNum = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
      const el = document.getElementById('order-number-display');
      if (el) el.textContent = orderNum;
      const modal = document.getElementById('success-modal');
      if (modal) modal.classList.add('active');
      localStorage.removeItem('store-cart');
      cart = [];
      updateCartBadge();
    });
  }

  // Success modal close
  const successBtn = document.getElementById('success-btn');
  if (successBtn) {
    successBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Scroll to top button
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.style.cssText = 'position:fixed;bottom:25px;right:25px;width:45px;height:45px;background:#1a1a2e;color:#c8a96e;border:none;border-radius:50%;cursor:pointer;font-size:1rem;display:none;align-items:center;justify-content:center;z-index:999;box-shadow:0 4px 15px rgba(0,0,0,0.2);transition:all 0.3s;';
  document.body.appendChild(scrollBtn);
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

// Shop page filtering
function initShopFilters() {
  const container = document.getElementById('products-container');
  if (!container) return;
  let filtered = [...products];

  function render() {
    const countEl = document.getElementById('products-count');
    if (countEl) countEl.textContent = filtered.length;
    container.innerHTML = filtered.map(p => createProductCard(p)).join('');
  }

  // Category filter checkboxes
  document.querySelectorAll('.filter-option input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // Sort
  const sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.addEventListener('change', applyFilters);

  // Size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      applyFilters();
    });
  });

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const view = this.dataset.view;
      container.className = view === 'list' ? 'list-view' : '';
      container.id = 'products-container';
    });
  });

  // Filter clear
  const clearBtn = document.querySelector('.filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      if (sortSel) sortSel.value = 'default';
      filtered = [...products];
      render();
    });
  }

  function applyFilters() {
    const checkedCats = [...document.querySelectorAll('.filter-option input[data-cat]:checked')].map(c => c.dataset.cat);
    filtered = checkedCats.length > 0 ? products.filter(p => checkedCats.includes(p.category)) : [...products];
    const sort = sortSel ? sortSel.value : 'default';
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    render();
  }

  render();
}

// Product detail page
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 1;
  const product = getProductById(id);
  if (!product) return;

  document.title = product.name + ' - متجر ستايل مان';

  const mainImg = document.getElementById('main-product-img');
  if (mainImg) mainImg.src = product.image;

  const thumbsContainer = document.getElementById('product-thumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = product.images.map((img, i) =>
      `<img src="${img}" alt="" class="${i === 0 ? 'active' : ''}" onclick="changeMainImg(this, '${img}')">`
    ).join('');
  }

  document.getElementById('product-detail-name') && (document.getElementById('product-detail-name').textContent = product.name);
  document.getElementById('product-detail-category') && (document.getElementById('product-detail-category').textContent = product.categoryName);
  document.getElementById('product-detail-rating-stars') && (document.getElementById('product-detail-rating-stars').innerHTML = generateStars(product.rating));
  document.getElementById('product-detail-rating-count') && (document.getElementById('product-detail-rating-count').textContent = `(${product.reviews} تقييم)`);
  document.getElementById('product-detail-price') && (document.getElementById('product-detail-price').textContent = formatPrice(product.price));
  document.getElementById('product-detail-desc') && (document.getElementById('product-detail-desc').textContent = product.description);

  const oldPriceEl = document.getElementById('product-detail-oldprice');
  const discountEl = document.getElementById('product-detail-discount');
  if (product.oldPrice) {
    if (oldPriceEl) { oldPriceEl.textContent = formatPrice(product.oldPrice); oldPriceEl.style.display = 'inline'; }
    if (discountEl) { const d = Math.round((1 - product.price / product.oldPrice) * 100); discountEl.textContent = 'خصم ' + d + '%'; discountEl.style.display = 'inline'; }
  }

  const sizesContainer = document.getElementById('sizes-container');
  if (sizesContainer) {
    sizesContainer.innerHTML = product.sizes.map((s, i) =>
      `<div class="size-option ${i === 0 ? 'selected' : ''}" onclick="selectOption(this, 'size')">${s}</div>`
    ).join('');
  }

  const colorsContainer = document.getElementById('colors-container');
  if (colorsContainer) {
    colorsContainer.innerHTML = product.colors.map((c, i) =>
      `<div class="color-option ${i === 0 ? 'selected' : ''}" onclick="selectOption(this, 'color')">${c}</div>`
    ).join('');
  }

  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const size = document.querySelector('.size-option.selected') ? document.querySelector('.size-option.selected').textContent : null;
      const color = document.querySelector('.color-option.selected') ? document.querySelector('.color-option.selected').textContent : null;
      const qty = parseInt(document.getElementById('qty-input') ? document.getElementById('qty-input').value : 1);
      addToCart(product.id, qty, size, color);
    });
  }
}

function changeMainImg(el, src) {
  document.getElementById('main-product-img').src = src;
  document.querySelectorAll('#product-thumbs img').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

function selectOption(el, type) {
  el.parentElement.querySelectorAll('.' + (type === 'size' ? 'size-option' : 'color-option')).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function changeQty(delta) {
  const input = document.getElementById('qty-input');
  if (input) {
    const val = Math.max(1, parseInt(input.value) + delta);
    input.value = val;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('products-container')) initShopFilters();
  if (document.getElementById('product-detail-name')) initProductPage();
});
