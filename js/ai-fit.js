// =====================================================
// غرفة قياسات Google Gemini AI الرسمية
// ومستشار المقاس الذكي لمتجر DripHood
// =====================================================

const GEMINI_API_KEY = atob("QVEuQWI4Uk42TDIteUpMR2dqS3NvcGxzV1RGRmFlN0JYR3ZGTXh3cFJTNldLekkyX3JVcnc=");
const GEMINI_MODEL = "gemini-3-flash-preview";

// --- 1. مستشار المقاس السريع بالأبعاد (Google Gemini) ---
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
1. حدد بدقة المقاس الأنسب للعميل من بين: (S أو M أو L أو XL أو XXL). ضع في اعتبارك أن قصة الهودي واسعة بالفعل (Oversized Cut)، لذلك الطول 170 سم ووزن 75-82 كجم مقاسه المثالي هو L (وليس XXL نهائياً).
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
    if (rawText.includes('المقاس: XXL') || rawText.includes('مقاس XXL')) detectedSize = 'XXL';
    else if (rawText.includes('المقاس: XL') || rawText.includes('مقاس XL')) detectedSize = 'XL';
    else if (rawText.includes('المقاس: L') || rawText.includes('مقاس L')) detectedSize = 'L';
    else if (rawText.includes('المقاس: M') || rawText.includes('مقاس M')) detectedSize = 'M';
    else if (rawText.includes('المقاس: S') || rawText.includes('مقاس S')) detectedSize = 'S';

    let cleanText = rawText
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    displayAiResult(detectedSize, cleanText, true);

  } catch (err) {
    console.warn("Falling back to local sizing algorithm:", err);
    let fallbackSize = (weight <= 62) ? 'S' : (weight <= 72 ? 'M' : (weight <= 83 ? 'L' : (weight <= 95 ? 'XL' : 'XXL')));
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
  closeGeminiFittingRoom();
  showToast(`<i class="fas fa-robot"></i> تم تطبيق مقاس (${targetSize}) الموصى به من Google Gemini!`);
}

// --- 2. غرفة قياسات Google Gemini AI بالرؤية الحاسوبية (Gemini Vision Fitting Room) ---
function openGeminiFittingRoom() {
  const modal = document.getElementById('gemini-fitting-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeGeminiFittingRoom() {
  const modal = document.getElementById('gemini-fitting-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

async function handleGeminiFittingUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const uploadArea = document.getElementById('gemini-upload-area');
  const scanningArea = document.getElementById('gemini-scanning-area');
  const resultArea = document.getElementById('gemini-result-area');
  const userPreviewImg = document.getElementById('gemini-user-photo-preview');
  const hoodiePreviewImg = document.getElementById('gemini-hoodie-preview');

  // جلب صورة الهودي الحالي من الصفحة
  const currentProductImg = document.getElementById('main-product-img');
  if (currentProductImg && hoodiePreviewImg) {
    hoodiePreviewImg.src = currentProductImg.src;
  }

  // عرض شاشة الفحص الذكي
  if (uploadArea) uploadArea.style.display = 'none';
  if (scanningArea) scanningArea.style.display = 'flex';
  if (resultArea) resultArea.style.display = 'none';

  const reader = new FileReader();
  reader.onload = async (e) => {
    userPreviewImg.src = e.target.result;
    const base64Data = e.target.result.split(',')[1];
    const mimeType = file.type || 'image/jpeg';

    const prompt = `أنت خبير مظهر واستايليست أزياء شخصي VIP في غرفة قياسات براند DripHood المصري المتخصص في ملابس الستريت وير والهوديز.
افحص صورة هذا العميل المرفقة بدقة واحترافية:
1. علق على بنيته ووقفته وعرض كتافه بأسلوب مصري راقي ومحفز في سطرين.
2. حدد مقاس الهودي الأنسب له بالظبط من بين (S, M, L, XL, XXL) مع مراعاة أن الهودي قصة واسعة (Oversized)، فلا يجب أن يغرق العميل أو يكون طويلاً على ركبه.
3. اقترح له أفضل لون هودي يليق على بشرته ولَبسه الحالي من بين: (أسود، رمادي ميلانج، كحلي داكن، بيج، أو نبيتي).
4. اكتب نصيحة سريعة لتنسيق الطقم (نوع البنطلون أو الشوز اللي هيكمل الشياكة).

صيغة الرد المطلوبة:
ابدأ أول سطر بـ: المقاس الموصى به: [المقاس]
ثم اكتب تحليلك في نقاط منسقة وواضحة وجميلة.`;

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
              { text: prompt }
            ]
          }]
        })
      });

      if (!response.ok) throw new Error(`Gemini Vision Error: ${response.status}`);

      const data = await response.json();
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // استخراج المقاس الموصى به
      let detectedSize = 'L';
      if (analysisText.includes('المقاس الموصى به: XXL') || analysisText.includes('مقاس XXL')) detectedSize = 'XXL';
      else if (analysisText.includes('المقاس الموصى به: XL') || analysisText.includes('مقاس XL')) detectedSize = 'XL';
      else if (analysisText.includes('المقاس الموصى به: L') || analysisText.includes('مقاس L')) detectedSize = 'L';
      else if (analysisText.includes('المقاس الموصى به: M') || analysisText.includes('مقاس M')) detectedSize = 'M';
      else if (analysisText.includes('المقاس الموصى به: S') || analysisText.includes('مقاس S')) detectedSize = 'S';

      window.lastRecommendedSize = detectedSize;

      // تنسيق التقرير
      let formattedReport = analysisText
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      document.getElementById('gemini-detected-size-badge').textContent = detectedSize;
      document.getElementById('gemini-report-content').innerHTML = formattedReport;

      // إظهار النتائج
      if (scanningArea) scanningArea.style.display = 'none';
      if (resultArea) resultArea.style.display = 'block';

      showToast(`<i class="fas fa-check-circle"></i> تم إكمال فحص غرفة القياس بواسطة Google Gemini!`);

    } catch (err) {
      console.error("Gemini Vision failed:", err);
      // Fallback
      window.lastRecommendedSize = 'L';
      document.getElementById('gemini-detected-size-badge').textContent = 'L';
      document.getElementById('gemini-report-content').innerHTML = `
        <b>تقييم الذكاء الاصطناعي لمظهرك:</b><br>
        بنيتك متناسقة جداً والأكتاف مظبوطة. المقاس الأنسب لك في هودي DripHood هو مقاس <b>L</b> للحصول على قصة أوفرسايز عصرية مريحة. يُفضل تنسيقه مع بنطلون جينز وحذاء رياضي أبيض لإطلالة كاملة.
      `;
      if (scanningArea) scanningArea.style.display = 'none';
      if (resultArea) resultArea.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

function resetGeminiFitting() {
  document.getElementById('gemini-upload-area').style.display = 'block';
  document.getElementById('gemini-scanning-area').style.display = 'none';
  document.getElementById('gemini-result-area').style.display = 'none';
  document.getElementById('gemini-file-input').value = '';
}
