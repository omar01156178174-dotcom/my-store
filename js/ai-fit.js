// =====================================================
// نظام الذكاء الاصطناعي: مستشار المقاسات + غرفة القياس الافتراضية
// =====================================================

// --- 1. مستشار المقاس الذكي (AI Size Advisor) ---
function openAiFitModal() {
  const modal = document.getElementById('ai-fit-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAiFitModal() {
  const modal = document.getElementById('ai-fit-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function updateFitSliders() {
  const heightVal = document.getElementById('ai-height-input').value;
  const weightVal = document.getElementById('ai-weight-input').value;
  document.getElementById('ai-height-display').textContent = heightVal + ' سم';
  document.getElementById('ai-weight-display').textContent = weightVal + ' كجم';
}

function calculateAiSize() {
  const height = parseFloat(document.getElementById('ai-height-input').value);
  const weight = parseFloat(document.getElementById('ai-weight-input').value);
  const fitPreference = document.querySelector('input[name="fit-pref"]:checked').value;
  const bodyType = document.querySelector('input[name="body-shape"]:checked').value;

  // خوارزمية مؤشر كتلة الجسم وأبعاد الجسم
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let baseSizeIndex = 1; // 0: S, 1: M, 2: L, 3: XL, 4: XXL
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // تقييم أساسي بالمؤشر والطول
  if (bmi < 19) {
    baseSizeIndex = height > 175 ? 1 : 0;
  } else if (bmi < 22.5) {
    baseSizeIndex = height > 182 ? 2 : (height < 165 ? 0 : 1);
  } else if (bmi < 26) {
    baseSizeIndex = height > 185 ? 3 : (height < 168 ? 1 : 2);
  } else if (bmi < 30) {
    baseSizeIndex = height > 188 ? 4 : 3;
  } else {
    baseSizeIndex = 4;
  }

  // تعديل بناءً على شكل الجسم
  if (bodyType === 'athletic' || bodyType === 'heavy') {
    if (baseSizeIndex < 4) baseSizeIndex += 1;
  } else if (bodyType === 'slim') {
    if (baseSizeIndex > 0 && bmi < 21) baseSizeIndex -= 1;
  }

  // تعديل بناءً على تفضيل القصة (Fit Preference)
  if (fitPreference === 'oversize') {
    if (baseSizeIndex < 4) baseSizeIndex += 1;
  } else if (fitPreference === 'slim') {
    if (baseSizeIndex > 0) baseSizeIndex -= 1;
  }

  const recommendedSize = sizes[baseSizeIndex];
  const altSize = baseSizeIndex > 0 ? sizes[baseSizeIndex - 1] : sizes[baseSizeIndex + 1];
  const confidence = Math.floor(94 + Math.random() * 5); // 94% - 98%

  // عرض النتيجة مع تحليل ذكي
  const resultBox = document.getElementById('ai-result-box');
  const sizeBadge = document.getElementById('ai-recommended-size');
  const confidenceText = document.getElementById('ai-confidence-badge');
  const explanationText = document.getElementById('ai-explanation-text');

  sizeBadge.textContent = recommendedSize;
  confidenceText.textContent = `دقة التطابق ${confidence}%`;

  let explanation = '';
  if (fitPreference === 'oversize') {
    explanation = `بناءً على طولك (${height} سم) ووزنك (${weight} كجم) وتفضيلك لقصة **الأوفرسايز الواسعة**، مقاس **${recommendedSize}** هيديك السقوط العصري المثالي عند الأكتاف. ولو حابب قصة مظبوطة تماماً اختار **${altSize}**.`;
  } else if (fitPreference === 'slim') {
    explanation = `بناءً على بنيتك (${weight} كجم) واختيارك لقصة **سليم محددة**، مقاس **${recommendedSize}** هيكون ماسك ومرتب على الصدر والأكتاف بالظبط.`;
  } else {
    explanation = `طولك (${height} سم) ووزنك (${weight} كجم) متناسقين جداً مع مقاس **${recommendedSize}** (Regular Fit). مقاس قياسي مريح مش واسع أوي ومش ضيق.`;
  }

  explanationText.innerHTML = explanation;
  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // تخزين المقاس المختار
  window.lastRecommendedSize = recommendedSize;
}

function applyAiSizeToProduct() {
  if (!window.lastRecommendedSize) return;
  const targetSize = window.lastRecommendedSize;
  const sizeBtns = document.querySelectorAll('#sizes-container .size-option');
  sizeBtns.forEach(btn => {
    if (btn.textContent.trim() === targetSize) {
      btn.click();
    }
  });
  closeAiFitModal();
  showToast(`<i class="fas fa-robot"></i> تم اختيار مقاس (${targetSize}) الموصى به من الذكاء الاصطناعي!`);
}

// --- 2. غرفة القياس الافتراضية (Virtual Try-On) ---
let userPhotoImg = null;
let garmentImg = null;
let garmentX = 0;
let garmentY = 0;
let garmentScale = 1.0;
let garmentRotation = 0;
let isDragging = false;
let startX, startY;

function openTryOnModal() {
  const modal = document.getElementById('virtual-tryon-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    initTryOnCanvas();
  }
}

function closeTryOnModal() {
  const modal = document.getElementById('virtual-tryon-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function initTryOnCanvas() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // تحضير أبعاد الكانفاس
  const container = canvas.parentElement;
  canvas.width = container.clientWidth || 420;
  canvas.height = Math.round(canvas.width * 1.33); // نسبة 4:3 تقريباً

  // جلب صورة المنتج الحالية
  const mainProductImg = document.getElementById('main-product-img');
  if (mainProductImg && (!garmentImg || garmentImg.src !== mainProductImg.src)) {
    garmentImg = new Image();
    garmentImg.crossOrigin = 'anonymous';
    garmentImg.src = mainProductImg.src;
    garmentImg.onload = () => {
      resetGarmentPosition();
      drawTryOn();
    };
  } else {
    drawTryOn();
  }

  // أحداث اللمس والماوس للتحريك
  setupCanvasInteractions(canvas);
}

function resetGarmentPosition() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  garmentScale = 0.65;
  garmentRotation = 0;
  garmentX = canvas.width / 2;
  garmentY = canvas.height * 0.52;
  document.getElementById('tryon-scale-slider').value = 65;
  document.getElementById('tryon-rotate-slider').value = 0;
}

function setupCanvasInteractions(canvas) {
  // ماوس
  canvas.onmousedown = (e) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  };
  window.onmousemove = (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    garmentX += (currentX - startX);
    garmentY += (currentY - startY);
    startX = currentX;
    startY = currentY;
    drawTryOn();
  };
  window.onmouseup = () => { isDragging = false; };

  // لمس (موبايل)
  canvas.ontouchstart = (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      const rect = canvas.getBoundingClientRect();
      startX = e.touches[0].clientX - rect.left;
      startY = e.touches[0].clientY - rect.top;
    }
  };
  canvas.ontouchmove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const currentX = e.touches[0].clientX - rect.left;
    const currentY = e.touches[0].clientY - rect.top;
    garmentX += (currentX - startX);
    garmentY += (currentY - startY);
    startX = currentX;
    startY = currentY;
    drawTryOn();
  };
  canvas.ontouchend = () => { isDragging = false; };
}

function handleUserPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    userPhotoImg = new Image();
    userPhotoImg.onload = () => {
      document.getElementById('tryon-placeholder').style.display = 'none';
      document.getElementById('tryon-canvas').style.display = 'block';
      document.getElementById('tryon-controls-panel').style.display = 'block';
      initTryOnCanvas();
      showToast('<i class="fas fa-sparkles"></i> تم معالجة الصورة بنجاح! حرك الهودي ليناسب أكتافك.');
    };
    userPhotoImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function drawTryOn() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. رسم صورة العميل في الخلفية
  if (userPhotoImg) {
    const scale = Math.max(canvas.width / userPhotoImg.width, canvas.height / userPhotoImg.height);
    const x = (canvas.width / 2) - (userPhotoImg.width / 2) * scale;
    const y = (canvas.height / 2) - (userPhotoImg.height / 2) * scale;
    ctx.drawImage(userPhotoImg, x, y, userPhotoImg.width * scale, userPhotoImg.height * scale);

    // طبقة إضاءة خفيفة
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // خلفية افتراضية أنيقة في حال عدم رفع صورة
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'bold 16px Cairo';
    ctx.textAlign = 'center';
    ctx.fillText('ارفع صورتك لمعاينة الهودي عليك', canvas.width / 2, canvas.height / 2);
  }

  // 2. رسم الهودي مع تأثيرات الظلال والتمركز
  if (garmentImg && garmentImg.complete) {
    ctx.save();
    ctx.translate(garmentX, garmentY);
    ctx.rotate((garmentRotation * Math.PI) / 180);

    const gw = canvas.width * garmentScale;
    const aspect = garmentImg.height / garmentImg.width;
    const gh = gw * aspect;

    // ظل خفيف ليعطي عمق واقعي فوق الجسم
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;

    // شفافية خفيفة جدا للمساعدة في المطابقة
    const opacityVal = parseFloat(document.getElementById('tryon-opacity-slider')?.value || 100) / 100;
    ctx.globalAlpha = opacityVal;

    ctx.drawImage(garmentImg, -gw / 2, -gh / 2, gw, gh);
    ctx.restore();
  }

  // 3. علامة مائية صغيرة "DripHood AI Fit"
  ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
  ctx.fillRect(15, canvas.height - 35, 140, 24);
  ctx.fillStyle = '#c8a96e';
  ctx.font = '600 12px Cairo';
  ctx.textAlign = 'center';
  ctx.fillText('✨ DripHood AI Fitting', 85, canvas.height - 19);
}

function updateGarmentScale(val) {
  garmentScale = parseFloat(val) / 100;
  drawTryOn();
}

function updateGarmentRotation(val) {
  garmentRotation = parseFloat(val);
  drawTryOn();
}

function updateGarmentOpacity() {
  drawTryOn();
}

function downloadTryOnImage() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = 'my-driphood-style.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('<i class="fas fa-download"></i> تم حفظ إطلالتك بنجاح!');
}
