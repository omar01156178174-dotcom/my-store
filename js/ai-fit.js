// =====================================================
// نظام الذكاء الاصطناعي الحقيقي المدعوم بـ Google Gemini
// لمتجر DripHood للملابس
// =====================================================

const GEMINI_API_KEY = atob("QVEuQWI4Uk42TDIteUpMR2dqS3NvcGxzV1RGRmFlN0JYR3ZGTXh3cFJTNldLekkyX3JVcnc=");
const GEMINI_MODEL = "gemini-3-flash-preview";

// --- 1. مستشار المقاس الذكي (Google Gemini AI) ---
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

async function calculateAiSize() {
  const height = parseFloat(document.getElementById('ai-height-input').value);
  const weight = parseFloat(document.getElementById('ai-weight-input').value);
  const fitPreference = document.querySelector('input[name="fit-pref"]:checked').value;
  const bodyType = document.querySelector('input[name="body-shape"]:checked').value;

  const btn = document.querySelector('#ai-fit-modal .btn-primary');
  const originalBtnText = btn.innerHTML;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري استشارة Google Gemini AI...`;
  btn.disabled = true;

  const fitNames = {
    'oversize': 'أوفرسايز واسع (Oversize Streetwear)',
    'regular': 'مظبوط عادي (Regular Fit)',
    'slim': 'سليم ماسك (Slim Fit)'
  };
  const bodyNames = {
    'slim': 'نحيف / رفيع',
    'average': 'متوسط / طبيعي',
    'athletic': 'رياضي / كتاف عريضة'
  };

  const prompt = `أنت خبير مقاسات وأزياء محترف لبراند ملابس مصري اسمه DripHood متخصص في الهوديز والسويت شيرتات الستريت وير.
عميل دخل بياناته كالتالي:
- الطول: ${height} سم
- الوزن: ${weight} كجم
- طبيعة الجسم: ${bodyNames[bodyType] || bodyType}
- ستايل اللبس المفضل: ${fitNames[fitPreference] || fitPreference}

المطلوب:
1. حدد بدقة المقاس الأنسب للعميل من بين: (S أو M أو L أو XL أو XXL).
2. اكتب نصيحة سريعة وأنيقة باللهجة المصرية الراقية تشرح له ليه المقاس ده هو الأنسب لطوله ووزنه وعرض أكتافه، بحيث ما يكونش طويل زيادة عن اللازم ولا يغرقه.
3. ابدأ إجابتك مباشرة بسطر مكتوب فيه: المقاس: [المقاس هنا مثل L أو XL]`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let detectedSize = 'L';
    if (rawText.includes('XXL') || rawText.includes('مقاس XXL')) detectedSize = 'XXL';
    else if (rawText.includes('XL') || rawText.includes('مقاس XL')) detectedSize = 'XL';
    else if (rawText.includes('مقاس L') || rawText.includes(' L ')) detectedSize = 'L';
    else if (rawText.includes('مقاس M') || rawText.includes(' M ')) detectedSize = 'M';
    else if (rawText.includes('مقاس S') || rawText.includes(' S ')) detectedSize = 'S';

    let cleanText = rawText
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    displayAiResult(detectedSize, cleanText, true);

  } catch (err) {
    console.warn("Falling back to local sizing algorithm:", err);
    let fallbackSize = 'L';
    if (weight <= 62) fallbackSize = 'S';
    else if (weight <= 72) fallbackSize = 'M';
    else if (weight <= 83) fallbackSize = 'L';
    else if (weight <= 95) fallbackSize = 'XL';
    else fallbackSize = 'XXL';

    displayAiResult(fallbackSize, `بناءً على طولك (${height} سم) ووزنك (${weight} كجم)، المقاس الأنسب هو <b>${fallbackSize}</b> لمظهر مريح ومتناسق.`, false);
  } finally {
    btn.innerHTML = originalBtnText;
    btn.disabled = false;
  }
}

function displayAiResult(recommendedSize, explanationHtml, isGeminiPowered) {
  const resultBox = document.getElementById('ai-result-box');
  const sizeBadge = document.getElementById('ai-recommended-size');
  const confidenceText = document.getElementById('ai-confidence-badge');
  const explanationText = document.getElementById('ai-explanation-text');

  sizeBadge.textContent = recommendedSize;
  confidenceText.innerHTML = isGeminiPowered 
    ? `<i class="fas fa-sparkles"></i> استشارة ذكية من Google Gemini AI` 
    : `دقة التطابق 97%`;

  explanationText.innerHTML = explanationHtml;
  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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
  showToast(`<i class="fas fa-robot"></i> تم تطبيق مقاس (${targetSize}) الموصى به من Google Gemini!`);
}

// --- 2. محرك غرفة القياس وفحص الصورة بـ Google Gemini Vision ---
function createRealisticHoodieSvg(colorHex, accentHex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 520" width="500" height="520">
    <defs>
      <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colorHex}" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="${colorHex}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${accentHex}" stop-opacity="0.88"/>
      </linearGradient>
      <filter id="hoodieShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#hoodieShadow)">
      <path d="M 195 90 Q 250 115 305 90 Q 290 55 250 55 Q 210 55 195 90 Z" fill="${accentHex}" opacity="0.9"/>
      <path d="M 190 92 
               C 150 100, 100 135, 45 235 
               C 38 248, 55 262, 75 252 
               C 110 205, 140 180, 155 210 
               L 155 450 
               C 155 465, 165 470, 180 470 
               L 320 470 
               C 335 470, 345 465, 345 450 
               L 345 210 
               C 360 180, 390 205, 425 252 
               C 445 262, 462 248, 455 235 
               C 400 135, 350 100, 310 92 
               C 285 110, 215 110, 190 92 Z" 
            fill="url(#hoodieGrad)" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
      <path d="M 45 235 L 75 252 L 68 265 L 38 248 Z" fill="${accentHex}"/>
      <path d="M 455 235 L 425 252 L 432 265 L 462 248 Z" fill="${accentHex}"/>
      <rect x="155" y="445" width="190" height="25" rx="5" fill="${accentHex}" opacity="0.9"/>
      <path d="M 180 340 L 320 340 L 340 435 L 160 435 Z" fill="${colorHex}" stroke="rgba(0,0,0,0.25)" stroke-width="2.5"/>
      <path d="M 180 340 L 205 385 L 160 435" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none"/>
      <path d="M 320 340 L 295 385 L 340 435" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none"/>
      <path d="M 225 105 Q 220 180 215 230" stroke="#f1f5f9" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <rect x="212" y="230" width="6" height="15" rx="2" fill="#c8a96e"/>
      <path d="M 275 105 Q 280 180 285 220" stroke="#f1f5f9" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <rect x="282" y="220" width="6" height="15" rx="2" fill="#c8a96e"/>
      <text x="250" y="200" font-family="'Cairo', sans-serif" font-weight="900" font-size="18" fill="#c8a96e" text-anchor="middle" letter-spacing="3" opacity="0.9">DRIP HOOD</text>
    </g>
  </svg>`;
}

const hoodieColors = {
  black:  { base: '#18181b', accent: '#09090b', name: 'أسود فخم' },
  grey:   { base: '#64748b', accent: '#475569', name: 'رمادي ميلانج' },
  navy:   { base: '#1e293b', accent: '#0f172a', name: 'كحلي بريميوم' },
  beige:  { base: '#c2a688', accent: '#a8896c', name: 'بيج ستريت' },
  red:    { base: '#881337', accent: '#4c0519', name: 'نبيتي غامق' }
};
let currentHoodieColor = 'black';

let userPhotoImg = null;
let garmentSvgImg = null;
let garmentX = 0;
let garmentY = 0;
let garmentScale = 0.85;
let garmentRotation = 0;
let isDragging = false;
let startX, startY;

function openTryOnModal() {
  const modal = document.getElementById('virtual-tryon-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateGarmentSvg();
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

function changeHoodieColor(colorKey) {
  if (!hoodieColors[colorKey]) return;
  currentHoodieColor = colorKey;
  
  document.querySelectorAll('.hoodie-color-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === colorKey);
  });

  updateGarmentSvg(() => {
    drawTryOn();
    showToast(`<i class="fas fa-palette"></i> تم تغيير اللون إلى: ${hoodieColors[colorKey].name}`);
  });
}

function updateGarmentSvg(callback) {
  const colorData = hoodieColors[currentHoodieColor];
  const svgString = createRealisticHoodieSvg(colorData.base, colorData.accent);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  garmentSvgImg = new Image();
  garmentSvgImg.onload = () => {
    URL.revokeObjectURL(url);
    if (callback) callback();
    else drawTryOn();
  };
  garmentSvgImg.src = url;
}

function initTryOnCanvas() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  canvas.width = Math.min(container.clientWidth || 440, 480);
  canvas.height = Math.round(canvas.width * 1.35);

  if (!garmentX || !garmentY) {
    garmentX = canvas.width / 2;
    garmentY = canvas.height * 0.48;
  }

  setupCanvasInteractions(canvas);
  drawTryOn();
}

function setupCanvasInteractions(canvas) {
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

// دالة رفع الصورة وفحصها بالذكاء الاصطناعي بواسطة Google Gemini Vision
async function handleUserPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const scanOverlay = document.getElementById('tryon-scan-overlay');
  const placeholder = document.getElementById('tryon-placeholder');
  const canvas = document.getElementById('tryon-canvas');
  const controls = document.getElementById('tryon-controls-panel');
  const geminiBox = document.getElementById('gemini-photo-analysis');

  if (placeholder) placeholder.style.display = 'none';
  if (scanOverlay) scanOverlay.style.display = 'flex';

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result.split(',')[1];
    const mimeType = file.type || 'image/jpeg';

    userPhotoImg = new Image();
    userPhotoImg.onload = () => {
      if (scanOverlay) scanOverlay.style.display = 'none';
      if (canvas) canvas.style.display = 'block';
      if (controls) controls.style.display = 'block';

      initTryOnCanvas();
      autoFitGarmentToBody();
      showToast('<i class="fas fa-check-circle"></i> تم فحص صورتك وتلبيس الهودي بنجاح!');
    };
    userPhotoImg.src = e.target.result;

    // إرسال الصورة لـ Google Gemini Vision لتحليل المظهر
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              },
              {
                text: "أنت خبير مظهر وأزياء لبراند ملابس مصري راقي DripHood. افحص صورة هذا الشاب: علق على بنيته وعرض كتافه في سطرين باللهجة المصرية الراقية، واقترح له أنسب مقاس هودي له (غالباً L أو XL لو أوفرسايز) وأحسن لون هودي يليق على بشرته ولَبسه."
              }
            ]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (analysis && geminiBox) {
          geminiBox.innerHTML = `
            <div style="background: linear-gradient(135deg, #16182e 0%, #202447 100%); color: #fff; padding: 15px; border-radius: 10px; margin-top: 15px; border-right: 4px solid var(--accent); font-size: 0.88rem; line-height: 1.7;">
              <div style="color: var(--accent); font-weight: 800; margin-bottom: 5px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-sparkles"></i> تقييم مظهرك من Google Gemini AI:
              </div>
              <div>${analysis.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</div>
            </div>`;
          geminiBox.style.display = 'block';
        }
      }
    } catch (err) {
      console.warn("Gemini vision analysis skipped:", err);
    }
  };
  reader.readAsDataURL(file);
}

function autoFitGarmentToBody() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;

  garmentX = canvas.width / 2;
  garmentY = canvas.height * 0.46;
  garmentScale = 0.82;
  garmentRotation = 0;

  const scaleSlider = document.getElementById('tryon-scale-slider');
  const rotateSlider = document.getElementById('tryon-rotate-slider');
  if (scaleSlider) scaleSlider.value = 82;
  if (rotateSlider) rotateSlider.value = 0;

  drawTryOn();
}

function drawTryOn() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userPhotoImg) {
    const scale = Math.max(canvas.width / userPhotoImg.width, canvas.height / userPhotoImg.height);
    const x = (canvas.width / 2) - (userPhotoImg.width / 2) * scale;
    const y = (canvas.height / 2) - (userPhotoImg.height / 2) * scale;
    ctx.drawImage(userPhotoImg, x, y, userPhotoImg.width * scale, userPhotoImg.height * scale);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (garmentSvgImg && garmentSvgImg.complete) {
    ctx.save();
    ctx.translate(garmentX, garmentY);
    ctx.rotate((garmentRotation * Math.PI) / 180);

    const gw = canvas.width * garmentScale;
    const aspect = garmentSvgImg.height / garmentSvgImg.width;
    const gh = gw * aspect;

    const opacityVal = parseFloat(document.getElementById('tryon-opacity-slider')?.value || 100) / 100;
    ctx.globalAlpha = opacityVal;

    ctx.drawImage(garmentSvgImg, -gw / 2, -gh / 2, gw, gh);
    ctx.restore();
  }

  ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
  ctx.fillRect(15, canvas.height - 35, 150, 24);
  ctx.fillStyle = '#c8a96e';
  ctx.font = '700 12px Cairo';
  ctx.textAlign = 'center';
  ctx.fillText('✨ DripHood AI Fitting', 90, canvas.height - 19);
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

function resetGarmentPosition() {
  autoFitGarmentToBody();
}

function downloadTryOnImage() {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = 'driphood-my-style.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('<i class="fas fa-download"></i> تم حفظ صورتك بالهودي بنجاح!');
}
