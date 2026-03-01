/* Helper to safely get element */
const getEl = (id) => document.getElementById(id);

// Storage Key
const STORAGE_KEY = 'fitlife_progress';

// Default Data
const defaultData = {
    streak: {}, // Format: "YYYY-MM-DD": true
    totalCalories: 0,
    totalWorkouts: 0,
    totalMinutes: 0
};

// Load Data
let userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
if (userData.totalWorkouts === undefined) userData.totalWorkouts = 0;
if (userData.totalMinutes === undefined) userData.totalMinutes = 0;

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    updateDashboardUI();
}

// 1. Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(15, 23, 42, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.zIndex = '999';
        }
    });
}

// 2. Calorie Calculator (WITH MACROS)
const calorieForm = getEl('calorie-form');
if (calorieForm) {
    calorieForm.addEventListener('submit', (e) => {
        try {
            e.preventDefault();
            const genderEl = document.querySelector('input[name="gender"]:checked');
            if (!genderEl) return;
            const gender = genderEl.value;
            const age = parseFloat(getEl('age').value) || 0;
            const weight = parseFloat(getEl('weight').value) || 0;
            const height = parseFloat(getEl('height').value) || 0;
            const activity = parseFloat(getEl('activity').value) || 1.2;

            if (!age || !weight || !height) return;

            let bmr = (gender === 'male')
                ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
                : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

            const tdee = Math.round(bmr * activity);

            // Macros
            const proteinGrams = Math.round((tdee * 0.30) / 4);
            const carbGrams = Math.round((tdee * 0.35) / 4);
            const fatGrams = Math.round((tdee * 0.35) / 9);

            const tdeeValue = getEl('tdee-value');
            const calorieResult = getEl('calorie-result');

            if (tdeeValue) tdeeValue.textContent = tdee;

            const macrosHtml = `
                <div class="macros-container">
                    <div class="macro-item macro-protein">
                        <div class="macro-label"><i class="fa-solid fa-drumstick-bite" style="color: #3498db;"></i> بروتين (30%)</div>
                        <div class="macro-value">${proteinGrams}g</div>
                    </div>
                    <div class="macro-item macro-carbs">
                        <div class="macro-label"><i class="fa-solid fa-bread-slice" style="color: #2ecc71;"></i> كارب (35%)</div>
                        <div class="macro-value">${carbGrams}g</div>
                    </div>
                    <div class="macro-item macro-fats">
                        <div class="macro-label"><i class="fa-solid fa-oil-can" style="color: #e67e22;"></i> دهون (35%)</div>
                        <div class="macro-value">${fatGrams}g</div>
                    </div>
                </div>
            `;

            let macrosDiv = calorieResult.querySelector('.macros-container');
            if (!macrosDiv) {
                calorieResult.innerHTML += macrosHtml;
            } else {
                macrosDiv.innerHTML = macrosHtml;
            }

            if (calorieResult) {
                calorieResult.classList.remove('hidden');
                calorieResult.style.display = 'block';
            }
        } catch (err) { console.error(err); }
    });
}

// 3. BMI
const bmiForm = getEl('bmi-form');
if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
        try {
            e.preventDefault();
            const weight = parseFloat(getEl('bmi-weight').value) || 0;
            const heightCm = parseFloat(getEl('bmi-height').value) || 0;
            if (!weight || !heightCm) return;
            const heightM = heightCm / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(1);

            const bmiValueEl = getEl('bmi-value');
            if (bmiValueEl) bmiValueEl.textContent = bmi;

            let status = '', color = '';
            if (bmi < 18.5) { status = 'نحافة (Underweight)'; color = '#3498db'; }
            else if (bmi < 24.9) { status = 'وزن طبيعي (Normal)'; color = '#2ecc71'; }
            else if (bmi < 29.9) { status = 'وزن زائد (Overweight)'; color = '#f1c40f'; }
            else { status = 'سمنة (Obese)'; color = '#e74c3c'; }

            const bmiStatusEl = getEl('bmi-status');
            if (bmiStatusEl) {
                bmiStatusEl.textContent = status;
                bmiStatusEl.style.color = color;
            }
            const bmiResult = getEl('bmi-result');
            if (bmiResult) {
                bmiResult.classList.remove('hidden');
                bmiResult.style.display = 'block';
            }
        } catch (err) { console.error(err); }
    });
}

// ==========================================
// 4. WORKOUT TRACKER (Leap Fitness System)
// ==========================================

const workoutData = {
    // ---- BEGINNER ----
    'abs-beginner': {
        title: 'عضلات البطن - مبتدئ',
        duration: 15,
        exercises: [
            { name: 'قفز الرافعات', duration: '20 ثانية', calories: 15, desc: 'قف مستقيماً مع ضم القدمين واليدين، ثم اقفز مع مباعدة قدميك ورفع يديك فوق رأسك، ثم عد بقفزة أخرى لوضع البداية بسرعة وانتظام.' },
            { name: 'تمرين المعدة', duration: '16 تكرار', calories: 20, desc: 'استلقِ على ظهرك مع ثني الركبتين، ضع يديك خلف أذنيك وارفع الجزء العلوي من ظهرك ببطء نحو ركبتيك مع شد عضلات البطن بقوة.' },
            { name: 'الدوران الروسي', duration: '20 تكرار', calories: 18, desc: 'اجلس مع ثني الركبتين ورفع القدمين قليلاً، أمل جذعك للخلف وقم بتدوير خصرك للمس الأرض بجانبك بكلتا يديك، بالتناوب بين الجانبين.' },
            { name: 'تسلق الجبل', duration: '16 تكرار', calories: 22, desc: 'اتخذ وضعية الضغط مع استقامة الظهر، قم بتبديل جلب الركبتين نحو الصدر بسرعة كأنك تجري، مع الحفاظ على ثبات الحوض والتركيز على شد البطن.' },
            { name: 'تمرين البلانك', duration: '20 ثانية', calories: 10, desc: 'استند على ساعديك وأطراف أصابع قدميك، حافظ على جسمك في خط مستقيم تماماً من الرأس إلى الكعبين دون رفع أو خفض الحوض، وتنفس بعمق.' },
            { name: 'لمس الكعبين', duration: '20 تكرار', calories: 15, desc: 'استلقِ على ظهرك مع ثني الركبتين، ارفع كتفيك قليلاً واستخدم يديك للمس كعب قدمك اليمنى ثم اليسرى بالتناوب لتركيز الضغط على عضلات الخصر.' },
            { name: 'رفع الساقين', duration: '14 تكرار', calories: 20, desc: 'استلقِ تماماً وضع يديك أسفل أسفل ظهرك للدعم، ارفع ساقيك معاً وهما مستقيمتان حتى زاوية 90 درجة، ثم انزلهما ببطء دون لمس الأرض.' },
            { name: 'إطالة الكوبرا', duration: '30 ثانية', calories: 5, desc: 'استلقِ على بطنك، ضع كفيك بجانب صدرك وادفع للأعلى برفق لرفع الجزء العلوي من الجسم مع إبقاء الحوض ملامساً للأرض لإطالة عضلات البطن.' }
        ]
    },
    'chest-beginner': {
        title: 'الصدر - مبتدئ',
        duration: 12,
        exercises: [
            { name: 'إحماء الأكتاف', duration: '30 ثانية', calories: 20, desc: 'قف بشكل مستقيم وقم بتدير كتفيك في حركة دائرية واسعة للخلف ثم للأمام، يساعد هذا التمرين على زيادة تدفق الدم وتليين مفاصل الكتف قبل البدء.' },
            { name: 'الضغط على الركبة', duration: '12 تكرار', calories: 25, desc: 'اتخذ وضعية الضغط ولكن مع وضع الركبتين على الأرض، انزل بصدرك نحو الأرض مع الحفاظ على استقامة الظهر، ثم ادفع للأعلى بقوة عضلات الصدر.' },
            { name: 'الضغط العريض', duration: '10 تكرار', calories: 25, desc: 'ضع يديك على الأرض بمسافة أوسع من عرض الكتفين، يساعد هذا الوضع على استهداف الأجزاء الخارجية من عضلة الصدر بشكل أكبر وزيادة قوة الدفع.' },
            { name: 'الضغط على الحائط', duration: '15 تكرار', calories: 15, desc: 'قف أمام الحائط بمسافة ذراع، ضع يديك عليه وقم بالميل بجسمك نحو الحائط ثم ادفع للعودة، وهو تمرين ممتاز للمبتدئين لتقوية الصدر دون إجهاد.' },
            { name: 'دوران الذراعين', duration: '30 ثانية', calories: 10, desc: 'افرد ذراعيك للجانبين وباشر بعمل دوائر صغيرة وسريعة في الهواء، يعمل هذا التمرين على تقوية عضلات الكتف الجانبية وتحسين القدرة على التحمل.' },
            { name: 'بلانك الصدر', duration: '20 ثانية', calories: 15, desc: 'حافظ على وضعية الجزء العلوي من تمرين الضغط (الذراعين مفرودتان)، شد عضلات الصدر والذراعين مع تثبيت الجسم بالكامل كقطعة واحدة صلبة.' },
            { name: 'إطالة الصدر', duration: '30 ثانية', calories: 5, desc: 'افتح ذراعيك للخلف قدر الإمكان أو استند بيد واحدة على إطار باب وادر جسمك للجانب المعاكس لفتح عضلات الصدر وإراحتها بعد المجهود.' }
        ]
    },
    'arm-beginner': {
        title: 'الذراعين - مبتدئ',
        duration: 14,
        exercises: [
            { name: 'دوائر الذراعين', duration: '30 ثانية', calories: 15, desc: 'ارفع ذراعيك لمستوى الكتفين وقم بعمل حركات دائرية بطيئة تزداد في الحجم تدريجياً، لتهيئة عضلات البايسبس والترايسبس للتمارين القوية.' },
            { name: 'تمرين الغطس', duration: '10 تكرار', calories: 20, desc: 'اجلس على حافة كرسي أو طاولة ثابتة، ضع يديك خلفك وانزل بحوضك نحو الأرض مع ثني المرفقين، ثم ادفع للأعلى لتركيز الحمل على خلفية الذراع.' },
            { name: 'اللكمات المستمرة', duration: '30 ثانية', calories: 20, desc: 'تخيل وجود كيس ملاكمة أمامك وقم بتوجيه لكمات سريعة ومستقيمة للأمام، حافظ على سرعة عالية لرفع معدل ضربات القلب وتقوية عضلات الذراع.' },
            { name: 'الضغط الماسي الركبة', duration: '8 تكرار', calories: 25, desc: 'ضع يديك تحت صدرك بحيث يتلامس الإبهام والسبابة ليشكلان شكل ماسة، انزل برفق ثم ادفع؛ هذا الوضع هو الأقوى لاستهداف عضلة الترايسبس.' },
            { name: 'رفع الأذرع جانباً', duration: '15 تكرار', calories: 15, desc: 'ارفع ذراعيك المفرودتين إلى الجانبين حتى يصلا لمستوى الكتفين، اثبت لثانية واحدة ثم انزلهما ببطء، مما يقوي عضلات الكتف والساعد بشكل متوازن.' },
            { name: 'بلانك الساعدين', duration: '30 ثانية', calories: 15, desc: 'استند على ساعديك مع شد قبضتي يدك، حافظ على انقباض عضلات الذراع بالكامل أثناء الثبات لتقوية عضلات الجذع والذراعين معاً في تمرين واحد.' },
            { name: 'إطالة الترايسبس', duration: '30 ثانية', calories: 5, desc: 'ارفع ذراعاً خلف رأسك واثنِ المرفق، استخدم يدك الأخرى لدفع الكوع للأسفل برفق لفتح وإطالة العضلات الخلفية للذراع وتقليل الشد العضلي.' }
        ]
    },
    'leg-beginner': {
        title: 'الساقين - مبتدئ',
        duration: 16,
        exercises: [
            { name: 'الجري في المكان', duration: '30 ثانية', calories: 20, desc: 'قم برفع ركبتيك نحو الأعلى بالتناوب مع تحريك ذراعيك كما في الجري الحقيقي، حافظ على وتيرة سريعة لتسخين مفاصل القدم وعضلات الساق.' },
            { name: 'القرفصاء (Squats)', duration: '14 تكرار', calories: 30, desc: 'قف مع مباعدة قدميك بعرض الكتفين، انزل بحوضك للخلف كأنك تجلس على كرسي مع إبقاء الظهر مستقيماً والركبتين خلف مستوى أصابع القدم.' },
            { name: 'الطعن الأمامي', duration: '14 تكرار', calories: 25, desc: 'تقدم بخطوة واسعة للأمام وانزل بركبتك الخلفية حتى تكاد تلمس الأرض، تأكد من أن الركبة الأمامية بزاوية 90 درجة، ثم عد لوضع البداية وكرر.' },
            { name: 'رفع السمانة', duration: '20 تكرار', calories: 15, desc: 'قف بشكل مستقيم وارفع جسمك للأعلى ببطء حتى تقف على أطراف أصابع قدميك، اثبت في الأعلى للحظة لاستهداف عضلة السمانة ثم انزل بهدوء.' },
            { name: 'ركل الساق للخلف', duration: '16 تكرار', calories: 20, desc: 'استند على يديك وركبتيك، ارفع ساقاً واحدة للخلف وللأعلى مع إبقاء الركبة مثنية قليلأ، ركز على عصر عضلات المؤخرة في أعلى نقطة قبل التنزيل.' },
            { name: 'رفع الركبة مستلقياً', duration: '16 تكرار', calories: 15, desc: 'استلقِ على ظهرك وضم ركبتيك نحو صدرك بالتناوب، يساعد هذا التمرين على تليين مفاصل الورك وتقوية عضلات الفخذ الأمامية والبطن السفلية.' },
            { name: 'إطالة الفخذ', duration: '30 ثانية', calories: 5, desc: 'قف على ساق واحدة وامسك قدم الساق الأخرى من الخلف واسحبها نحو حوضك لإطالة عضلات الفخذ الأمامية، استند على جدار للتوازن إذا لزم الأمر.' }
        ]
    },

    // ---- INTERMEDIATE ----
    'abs-intermediate': {
        title: 'عضلات البطن - متوسط',
        duration: 20,
        exercises: [
            { name: 'تمرين V-ups', duration: '14 تكرار', calories: 25, desc: 'استلقِ ثم ارفع جذعك وساقيك معاً في نفس الوقت لتشكل بجسمك حرف V، حاول لمس أطراف أصابع قدمك بيدك في أعلى نقطة للحصول على انقباض كامل.' },
            { name: 'دراجة هوائية', duration: '20 تكرار', calories: 30, desc: 'حرك ساقيك كما لو كنت تقود دراجة، مع تدوير جذعك ليلمس الكوع الأيمن الركبة اليسرى والعكس، مما يستهدف عضلات البطن الجانبية والعليا.' },
            { name: 'البلانك الجانبي', duration: '20 ثانية', calories: 15, desc: 'استند على ساعد واحد وارفع حوضك عن الأرض ليكون جسمك خطاً مائلاً مستقيماً، حافظ على ثباتك دون هبوط الحوض لتقوية عضلات الخصر العميقة.' },
            { name: 'الضغط مع القفز', duration: '12 تكرار', calories: 35, desc: 'قم بأداء تمرين ضغط عادي، وعند الصعود ادفع يديك بقوة عن الأرض لتقفز بهما قليلاً، يزيد هذا من القوة الانفجارية لعضلات الصدر والبطن.' },
            { name: 'تسلق الجبل سريع', duration: '30 تكرار', calories: 40, desc: 'بوضعية الضغط، قم بتبديل ساقيك بسرعة قصوى كأنك تجري صعوداً، حافظ على ثبات الجزء العلوي من الجسم وشد عضلات البطن لمنع اهتزاز الحوض.' },
            { name: 'مقص الساقين المفتوح', duration: '20 تكرار', calories: 30, desc: 'ارفع ساقيك قليلاً عن الأرض وهما مستقيمتان، قم بفتحهما وإغلاقهما بشكل متقاطع (كالمقص) مع إبقاء عضلات البطن السفلية مشدودة طوال الوقت.' },
            { name: 'بلانك الصعود والنزول', duration: '10 تكرار', calories: 25, desc: 'من وضعية البلانك على الساعدين، انتقل لرفع جسمك على الكفين تدريجياً ثم عد للساعدين، يتطلب هذا توازناً كبيراً وقوة في الذراعين والجذع.' }
        ]
    },
    'chest-intermediate': {
        title: 'الصدر - متوسط',
        duration: 18,
        exercises: [
            { name: 'الضغط الكلاسيكي', duration: '16 تكرار', calories: 35, desc: 'حافظ على استقامة جسمك بالكامل، انزل بصدرك حتى يلمس الأرض تقريباً مع توجيه المرفقين بزاوية 45 درجة للخلف، ثم ادفع للأعلى بقوة وثبات.' },
            { name: 'ضغط المنحدر', duration: '12 تكرار', calories: 30, desc: 'ضع قدميك على مكان مرتفع (سرير أو كرسي) ويديك على الأرض، هذا الميل يركز الحمل على عضلات الصدر العلوية والأكتاف الأمامية بشكل مكثف.' },
            { name: 'الضغط الواسع', duration: '14 تكرار', calories: 30, desc: 'باعد بين يديك بشكل أكبر من المعتاد، هذا التمرين يسحب عضلات الصدر للخارج مما يساعد في توسيع عضلة الصدر وتقوية الألياف العضلية الخارجية.' },
            { name: 'ضغط ماسي', duration: '10 تكرار', calories: 35, desc: 'ضم يديك تحت الصدر لتشكيل مثلث، انزل ببطء وادفع للأعلى؛ يركز هذا النوع بشكل هائل على منتصف الصدر وعضلات الترايسبس الخلفية للذراع.' },
            { name: 'الضغط السريع', duration: '15 ثانية', calories: 20, desc: 'قم بأداء أكبر عدد ممكن من تكرارات الضغط في 15 ثانية مع الحفاظ على الوضعية الصحيحة، يهدف هذا التمرين لزيادة التحمل العضلي وسرعة الأداء.' },
            { name: 'بلانك مع دوران', duration: '14 تكرار', calories: 25, desc: 'من وضعية الضغط، ارفع يداً واحدة نحو السقف مع تدوير جذعك بالكامل لتنظر للأعلى، ثم عد وكرر مع اليد الأخرى لتقوية الصدر والخصر.' },
            { name: 'إطالة الصدر خلفية', duration: '30 ثانية', calories: 5, desc: 'اشبك يديك خلف ظهرك وارفع صدرك للأمام وللأعلى مع سحب كتفيك للخلف، يساعد هذا في إطالة الألياف العضلية المشدودة وتحسين استقامة القوام.' }
        ]
    },
    'full-intermediate': {
        title: 'الجسم بالكامل - متوسط',
        duration: 25,
        exercises: [
            { name: 'تمرين بيربي', duration: '10 تكرار', calories: 40, desc: 'انزل لوضع القرفصاء، اقفز بقدميك للخلف لوضع الضغط، ثم اقفز للأمام مجدداً واختتم بقفزة عالية للأعلى مع رفع اليدين، تمرين شامل يحرق دهوناً هائلة.' },
            { name: 'قرفصاء قفزي', duration: '14 تكرار', calories: 35, desc: 'قم بتمرين القرفصاء العادي، وعند الصعود اشرع بقفزة انفجارية للأعلى، عد للأرض بنعومة على أطراف أصابعك وانزل فوراً للتكرار التالي لتقوية الساقين.' },
            { name: 'بلانك سريع', duration: '30 ثانية', calories: 25, desc: 'من وضعية البلانك، قم بتحريك قدميك للداخل والخارج بسرعة (قفزات جانبية) مع الحفاظ على ثبات الجزء العلوي، مما يدمج بين تمرين الكارديو وتقوية الجذع.' },
            { name: 'ركلات خلفية', duration: '20 تكرار', calories: 30, desc: 'اقفز في مكانك مع ركل كعبيك نحو الخلف ليلمسا المؤخرة، حافظ على سرعة الحركة واستخدم ذراعيك للتوازن، مما يحرك عضلات الفخذ الخلفية بكفاءة.' },
            { name: 'لمس الأقدام', duration: '16 تكرار', calories: 35, desc: 'من وضعية الضغط المرتفع، ارفع حوضك للأعلى والمس قدمك اليمنى بيدك اليسرى، ثم عد وافعل العكس، يجمع التمرين بين المرونة وتقوية الأكتاف والبطن.' },
            { name: 'القفز بالنجمة', duration: '15 تكرار', calories: 40, desc: 'ابدأ بوضعية القرفصاء المنخفضة، ثم اقفز بقوة في الهواء مع فرد ذراعيك وساقيك كالنجمة، يوفر هذا التمرين مجهوداً عضلياً كلياً ويرفع مستوى النشاط.' },
            { name: 'إطالة الجسم كاملة', duration: '30 ثانية', calories: 10, desc: 'قف متباعد القدمين، ارفع يديك للسماء وشد جسمك بالكامل للأعلى، ثم انحنِ للأمام للمس الأرض مع إبقاء الركبتين مستقيمتين لإطالة عضلات الظهر والساقين.' }
        ]
    },

    // ---- ADVANCED ----
    'abs-advanced': {
        title: 'عضلات البطن - متقدم',
        duration: 28,
        exercises: [
            { name: 'V-ups كامل', duration: '20 تكرار', calories: 40, desc: 'ارفع جذعك وساقيك المفرودتين تماماً حتى يتلامسا في الأعلى، انزل ببطء شديد وتحكم كامل دون أن تلمس قدميك أو ظهرك الأرض لزيادة الضغط العضلي.' },
            { name: 'دراجة سريعة', duration: '30 تكرار', calories: 45, desc: 'نفذ حركة الدراجة بأقصى سرعة ممكنة مع الحفاظ على نطاق حركة كامل لتدوير الجذع، مما يؤدي لإجهاد عضلات البطن والمناطق الجانبية وحرق سعرات عالية.' },
            { name: 'بلانك سوبرمان', duration: '40 ثانية', calories: 35, desc: 'من وضعية البلانك المرتفع، ارفع ذراعاً واحدة وساقاً معاكسة في نفس الوقت واثبت، يتطلب هذا توازناً فائقاً وقوة هائلة في عضلات الظهر والبطن العميقة.' },
            { name: 'تسلق جبل كروس', duration: '40 تكرار', calories: 40, desc: 'في وضع الضغط، وجّه ركبتك اليمنى نحو كوعك الأيسر واليسرى نحو الأيمن بحركة تبادلية سريعة وقوية، لتركيز الضغط على العضلات المائلة العميقة.' },
            { name: 'تمرير الكرة', duration: '20 تكرار', calories: 35, desc: 'تخيل وجود كرة، انحنِ لرفعها من فوق رأسك ثم ضعها بين قدميك وانزلهما، ثم ارفعهما لتأخذ الكرة بيديك مجدداً، تمرين ينهك عضلات البطن العلوية والسفلية.' },
            { name: 'دفع القدمين لأعلى', duration: '15 تكرار', calories: 30, desc: 'استلقِ وارفع ساقيك للأعلى تماماً، ابدأ بدفع حوضك نحو السقف باستخدام عضلات البطن السفلية فقط دون أرجحة الساقين، لتركيز الحمل على أسفل البطن.' },
            { name: 'بلانك النجمة', duration: '20 ثانية', calories: 25, desc: 'من وضعية البلانك الجانبي، ارفع ساقك وذراعك العلويتين للأعلى لتشكل بجسمك شكل نجمة صلبة، يتطلب التمرين ثباتاً عضلياً نادراً وقوة توازن استثنائية.' }
        ]
    },
    'chest-advanced': {
        title: 'الصدر - متقدم',
        duration: 25,
        exercises: [
            { name: 'الضغط بالتصفيق', duration: '12 تكرار', calories: 50, desc: 'ادفع جسمك من الأرض بقوة انفجارية هائلة تسمح لك بالتصفيق بيديك قبل العودة، يطور هذا التمرين الألياف العضلية السريعة والقوة الخام للصدر.' },
            { name: 'الغطس العميق', duration: '15 تكرار', calories: 40, desc: 'باستخدام متوازيين أو كراسي ثابتة، انزل بجسمك لأسفل مستوى المرفقين ثم ادفع للأعلى، حمل وزن الجسم الكامل يوفر ضغطاً هائلاً على عضلات الصدر والكتف.' },
            { name: 'الضغط مع إزاحة', duration: '14 تكرار', calories: 45, desc: 'انزل بجسمك لجهة واحدة مما يضع حمل الجسم بالكامل تقريباً على ذراع واحدة، ثم عد للمنتصف وكرر للجهة الأخرى، ممتاز لبناء توازن وقوة عضلية متطرفة.' },
            { name: 'الضغط الهندوسي', duration: '12 تكرار', calories: 35, desc: 'ابدأ بوضعية "الرجل المائل للأرض" (حوض للأعلى)، ثم انزلق بجسمك وكأنك تمر تحت حاجز منخفض لتنهي الوضعية بصدر مرتفع، يجمع التمرين بين القوة والمرونة.' },
            { name: 'الضغط بيد واحدة', duration: '10 تكرار', calories: 55, desc: 'باعد بين قدميك واستند على يد واحدة فقط، انزل ببطء وادفع للأعلى؛ يمثل هذا التمرين ذروة القوة العضلية لعضلات الصدر والذراع والجذع معاً.' },
            { name: 'الضغط السريع', duration: '30 ثانية', calories: 45, desc: 'قم بأداء أكبر عدد تكرارات ممكن في 30 ثانية بأقصى سرعة تمتلكها، هذا التمرين يضع عضلاتك تحت ضغط مستمر ويحسن من كفاءة الجهاز الدوري التنفسي.' },
            { name: 'إطالة المرفقين', duration: '40 ثانية', calories: 15, desc: 'ادفع مرفقيك للخلف بقوة مع تثبيتهما على مستوى الكتفين وافتح صدرك للأمام بشكل كامل، تساعد هذه الإطالة العميقة في فك عضلات الصدر وزيادة مرونتها.' }
        ]
    },
    'full-advanced': {
        title: 'الجسم بالكامل - متقدم',
        duration: 35,
        exercises: [
            { name: 'بربي مع قفزة عالية', duration: '15 تكرار', calories: 60, desc: 'قم بتمرين البيربي وعند القفز ارفع ركبتيك عالياً لتلمسا صدرك في الهواء، تمرين مجهد للغاية يستهدف حرق الدهون وتقوية عضلات الجسم كافة.' },
            { name: 'الطعن القفزي', duration: '20 تكرار', calories: 50, desc: 'ابدأ بوضعية الطعن ثم اقفز لتبديل وضعية الساقين في الهواء بسرعة، يتطلب التمرين قوة انفجارية في الساقين وتوازناً ذهنياً عالياً للحفاظ على الاستقامة.' },
            { name: 'ضغط صدر أرنب', duration: '15 تكرار', calories: 55, desc: 'في وضعية الضغط، قم بضم ركبتيك نحو يديك بقفزة سريعة ثم أرجعهما للخلف وقم بتعداد ضغطة واحدة، مزيج قوي يجمع بين قوة الصدر وكارديو البطن.' },
            { name: 'جالوب جانبي', duration: '60 ثانية', calories: 45, desc: 'تحرك جانبياً بخطوات سريعة ومنخفضة مع لمس الأرض بيدك عند كل جانب، حافظ على سرعة عالية لزيادة كفاءة القلب وتحسين الرشاقة والحركة الجانبية.' },
            { name: 'دفع القدمين الدائري', duration: '20 تكرار', calories: 40, desc: 'من وضعية الضغط، حرك قدميك معاً في دائرة واسعة حول جذعك، يتطلب هذا التمرين قوة استثنائية في عضلات الجذع والكتف للتحكم في زخم الحركة الدائرية.' },
            { name: 'بلانك الاهتزاز', duration: '40 ثانية', calories: 45, desc: 'في وضعية البلانك، ادفع جسمك للأمام والخلف باستخدام أطراف أصابع قدميك بسرعة وبحركات صغيرة، مما يجبر عضلات الجذع والذراع على الانقباض لمواجهة الاضطراب.' },
            { name: 'إطالة الجسم الكلية', duration: '60 ثانية', calories: 20, desc: 'خُذ وضعية السجود مع مد يديك للأمام لأقصى مسافة ممكنة، ثم انتقل لوضعية فتح الحوض وإطالة الساقين ببطء، تنفس بعمق لمساعدة عضلاتك على الاسترخاء والتعافي.' }
        ]
    }
};

// Update Dashboard UI
function updateDashboardUI() {
    const today = new Date();
    const streakContainer = getEl('streak-days');
    if (streakContainer) {
        streakContainer.innerHTML = '';
        const days = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

        let html = '';
        for (let i = -6; i <= 0; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const isDone = userData.streak[dateStr];
            const isToday = i === 0;
            const dayName = days[d.getDay()];

            html += `
                <div class="streak-day ${isDone ? 'active' : ''} ${isToday ? 'today' : ''}" title="${dateStr}">
                    <span>${dayName}</span>
                    <i class="fa-solid fa-${isDone ? 'check-circle' : 'circle'}"></i>
                </div>
            `;
        }
        streakContainer.innerHTML = html;
    }

    // Update Stats
    const totalCalEl = getEl('total-burned-calories');
    const totalWorkoutsEl = getEl('total-workouts');
    const totalMinEl = getEl('total-minutes');

    if (totalCalEl) totalCalEl.textContent = userData.totalCalories || 0;
    if (totalWorkoutsEl) totalWorkoutsEl.textContent = userData.totalWorkouts || 0;
    if (totalMinEl) totalMinEl.textContent = userData.totalMinutes || 0;
}

const workoutModal = getEl('workout-modal');
const modalTitle = getEl('modal-title');
const modalBody = getEl('modal-body');
const closeModal = document.querySelector('.close-modal');

if (closeModal && workoutModal) {
    closeModal.addEventListener('click', () => {
        workoutModal.classList.remove('show');
        workoutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}
if (workoutModal) {
    window.addEventListener('click', (e) => {
        if (e.target == workoutModal) {
            workoutModal.classList.remove('show');
            workoutModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Modal Event Delegation for Leap Cards
document.addEventListener('click', (e) => {
    const card = e.target.closest('.leap-card');

    if (card) {
        const type = card.getAttribute('data-type');
        const data = workoutData[type];

        if (data && workoutModal) {
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="modal-tips" style="color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-regular fa-clock"></i> مدة التمرين المتبقية: <strong>${data.duration} دقيقة</strong>
                    </div>
                    <ul class="exercise-list">
                        ${data.exercises.map((ex) => `
                            <li>
                                <label class="exercise-checkbox-item">
                                    <input type="checkbox" class="ex-check" data-cal="${ex.calories}" checked>
                                    <div class="ex-content">
                                        <div class="ex-header">
                                            <span class="ex-name">${ex.name}</span>
                                            <span class="ex-meta"><i class="fa-solid fa-repeat"></i> ${ex.duration}</span>
                                        </div>
                                        <p class="ex-desc">${ex.desc}</p>
                                    </div>
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="modal-footer-action">
                        <button id="finish-workout-btn" class="btn btn-primary btn-block" style="font-size: 1.2rem;">إنهاء وحفظ التمرين</button>
                    </div>
                `;

                const finishBtn = modalBody.querySelector('#finish-workout-btn');
                const checkboxes = modalBody.querySelectorAll('.ex-check');

                finishBtn.addEventListener('click', () => {
                    let totalCal = 0;
                    checkboxes.forEach(box => {
                        if (box.checked) totalCal += parseInt(box.dataset.cal);
                    });

                    if (totalCal > 0) {
                        const dateStr = new Date().toISOString().split('T')[0];
                        userData.streak[dateStr] = true;

                        userData.totalCalories = (userData.totalCalories || 0) + totalCal;
                        userData.totalWorkouts = (userData.totalWorkouts || 0) + 1;
                        userData.totalMinutes = (userData.totalMinutes || 0) + data.duration;

                        saveData();

                        alert(`رائع جداً! أتممت التمارين بنجاح. وحرقت ${totalCal} سعرة حرارية!`);

                        workoutModal.classList.remove('show');
                        workoutModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    } else {
                        alert('يرجى إنهاء تمرين واحد على الأقل لحفظ التقدم!');
                    }
                });
            }
            workoutModal.classList.add('show');
            workoutModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
});

// Initial UI Load
updateDashboardUI();

