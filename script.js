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
    'abs-beginner': {
        title: 'عضلات البطن - مبتدئ',
        duration: 10,
        exercises: [
            { name: 'قفز الرافعات (Jumping Jacks)', duration: '20 ثانية', calories: 15, desc: 'حركة سريعة للإحماء.' },
            { name: 'تمرين المعدة (Crunches)', duration: '16 تكرار', calories: 20, desc: 'استلقِ وارفع كتفيك عن الأرض.' },
            { name: 'الدوران الروسي (Russian Twist)', duration: '20 تكرار', calories: 18, desc: 'المس الأرض بجانبك لتقوية الخصر.' },
            { name: 'تسلق الجبل (Mountain Climber)', duration: '16 تكرار', calories: 22, desc: 'رائع لحرق دهون البطن.' },
            { name: 'رفع الساقين (Leg Raises)', duration: '14 تكرار', calories: 15, desc: 'يقوي عضلات البطن السفلية.' },
            { name: 'تمرين البلانك (Plank)', duration: '20 ثانية', calories: 10, desc: 'حافظ على استقامة جسمك.' },
            { name: 'إطالة الكوبرا (Cobra Stretch)', duration: '30 ثانية', calories: 5, desc: 'إطالة لعضلات البطن في النهاية.' }
        ]
    },
    'chest-beginner': {
        title: 'الصدر - مبتدئ',
        duration: 8,
        exercises: [
            { name: 'قفز الرافعات (Jumping Jacks)', duration: '30 ثانية', calories: 20, desc: 'إحماء أولي.' },
            { name: 'ضغط الصدر على الركبة (Knee Push-ups)', duration: '12 تكرار', calories: 25, desc: 'نسخة أسهل من الضغط العادي.' },
            { name: 'ضغط الصدر العريض (Wide Arm Push-ups)', duration: '10 تكرار', calories: 25, desc: 'ينشط عضلات الصدر بشكل أكبر.' },
            { name: 'تمرين البلانك (Plank)', duration: '30 ثانية', calories: 15, desc: 'لتقوية الجذع.' },
            { name: 'إطالة الصدر (Chest Stretch)', duration: '30 ثانية', calories: 5, desc: 'لإرخاء العضلات.' }
        ]
    },
    'arm-beginner': {
        title: 'الذراعين - مبتدئ',
        duration: 10,
        exercises: [
            { name: 'دوائر الذراعين (Arm Circles)', duration: '30 ثانية', calories: 15, desc: 'إحماء للكتف والذراع.' },
            { name: 'تمرين الغطس (Triceps Dips)', duration: '10 تكرار', calories: 20, desc: 'استخدم كرسياً لتقوية الترايسبس.' },
            { name: 'ضغط الصدر الماسي (Diamond Push-ups)', duration: '8 تكرار', calories: 25, desc: 'لتقوية مكثفة للترايسبس.' },
            { name: 'اللكمات (Punches)', duration: '30 ثانية', calories: 20, desc: 'حركة سريعة ومستمرة.' },
            { name: 'إطالة الترايسبس (Triceps Stretch)', duration: '30 ثانية', calories: 5, desc: 'لكل ذراع.' }
        ]
    },
    'leg-beginner': {
        title: 'الساقين - مبتدئ',
        duration: 12,
        exercises: [
            { name: 'الجري في المكان', duration: '30 ثانية', calories: 20, desc: 'إحماء للقدمين.' },
            { name: 'القرفصاء (Squats)', duration: '14 تكرار', calories: 30, desc: 'تمرين أساسي للساقين.' },
            { name: 'الطعن الأمامي (Lunges)', duration: '14 تكرار', calories: 25, desc: '7 تكرارات لكل ساق.' },
            { name: 'رفع السمانة (Calf Raises)', duration: '20 تكرار', calories: 15, desc: 'تقوية عضلة السمانة.' },
            { name: 'إطالة الفخذ (Quad Stretch)', duration: '30 ثانية', calories: 5, desc: 'لإرخاء أوتار الركبة.' }
        ]
    },
    'abs-intermediate': {
        title: 'عضلات البطن - متوسط',
        duration: 15,
        exercises: [
            { name: 'قفز الرافعات', duration: '40 ثانية', calories: 30, desc: 'إحماء مكثف.' },
            { name: 'تمرين V-ups', duration: '14 تكرار', calories: 25, desc: 'لتقوية وسط الجسم بالكامل.' },
            { name: 'مقص الساقين (Scissors)', duration: '30 ثانية', calories: 25, desc: 'ممتد لعضلات البطن السفلية.' },
            { name: 'دراجة هوائية (Bicycle Crunches)', duration: '20 تكرار', calories: 30, desc: 'عزل للجوانب.' },
            { name: 'تمرين البلانك الجانبي (Side Plank)', duration: '20 ثانية', calories: 15, desc: 'قوة جانبية للخصر.' }
        ]
    },
    'chest-intermediate': {
        title: 'الصدر - متوسط',
        duration: 14,
        exercises: [
            { name: 'ضغط الصدر الكلاسيكي (Push-ups)', duration: '16 تكرار', calories: 35, desc: 'تمرين الصدر بامتياز.' },
            { name: 'ضغط الصدر مائل (Incline Push-ups)', duration: '14 تكرار', calories: 25, desc: 'لصدر سفلي.' },
            { name: 'ضغط الصدر المنحدر (Decline Push-ups)', duration: '12 تكرار', calories: 30, desc: 'أقدامك على كرسي، لصدر علوي.' },
            { name: 'ضغط الصدر الواسع (Wide Push-ups)', duration: '14 تكرار', calories: 30, desc: 'تركيز على أطراف الصدر.' }
        ]
    },
    'full-intermediate': {
        title: 'الجسم بالكامل - متوسط',
        duration: 20,
        exercises: [
            { name: 'تمرين بيربي (Burpees)', duration: '10 تكرار', calories: 40, desc: 'تمرين كامل وقوي للجسم.' },
            { name: 'القرفصاء مع القفز (Jump Squats)', duration: '14 تكرار', calories: 35, desc: 'قوة انفجارية للأرجل.' },
            { name: 'ضغط الصدر (Push-ups)', duration: '14 تكرار', calories: 30, desc: 'تقوية علوية.' },
            { name: 'تمرين البلانك مع الذراعين (Plank Jacks)', duration: '30 ثانية', calories: 25, desc: 'كارديو مع بلانك.' },
            { name: 'تسلق الجبل (Mountain Climber)', duration: '30 ثانية', calories: 30, desc: 'قوة للجذع.' }
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
                    <div class="modal-tips" style="color: var(--text-muted); background: rgba(255,255,255,0.05);">
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
                                        </div>
                                        <p class="ex-desc">${ex.desc}</p>
                                        <span class="ex-meta"><i class="fa-solid fa-repeat"></i> ${ex.duration}</span>
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
