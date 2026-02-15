/* Helper to safely get element */
const getEl = (id) => document.getElementById(id);

// Storage Key
const STORAGE_KEY = 'fitlife_progress';

// Default Data
const defaultData = {
    goal: 'muscle', // muscle, weight_loss, tone
    streak: {}, // Format: "YYYY-MM-DD": true
    totalCalories: 0
};

// Load Data
let userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

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
// 4. WORKOUT TRACKER & EXPANDED EXERCISES
// ==========================================

const workoutData = {
    'cardio': {
        title: 'تمارين الكارديو (حرق دهون مكثف)',
        exercises: [
            // Basic
            { name: 'الجري في المكان (High Knees)', duration: '30 ثانية', calories: 15, desc: 'ارفع ركبتيك للأعلى بسرعة قصوى.' },
            { name: 'قفز الحبل (Jump Rope)', duration: '1 دقيقة', calories: 20, desc: 'حافظ على إيقاع ثابت وقفزات قصيرة.' },
            { name: 'تمرين بيربي (Burpees)', duration: '15 تكرار', calories: 25, desc: 'تمرين كامل للجسم: انبطاح، ضغط، ثم قفز.' },
            // Advanced
            { name: 'تسلق الجبل (Mountain Climbers)', duration: '45 ثانية', calories: 18, desc: 'شد عضلات البطن وحرك الأرجل بسرعة.' },
            { name: 'قفز الرافعات (Jumping Jacks)', duration: '60 ثانية', calories: 12, desc: 'تمرين إحماء وحرق كلاسيكي.' },
            { name: 'القفز العريض (Broad Jumps)', duration: '12 تكرار', calories: 15, desc: 'اقفز لأبعد مسافة ممكنة للأمام ثم عد للخلف.' },
            { name: 'قفز القرفصاء (Jump Squats)', duration: '15 تكرار', calories: 18, desc: 'انزل في وضعية القرفصاء ثم اقفز بقوة للأعلى.' },
            { name: 'ملاكمة الظل (Shadow Boxing)', duration: '2 دقيقة', calories: 20, desc: 'لكمات سريعة في الهواء مع حركة مستمرة للأقدام.' },
            { name: 'ركض مع لمس المؤخرة (Butt Kicks)', duration: '45 ثانية', calories: 14, desc: 'الجري في المكان مع ركل المؤخرة بالكعبين.' },
            { name: 'القفز الجانبي (Lateral Bounds)', duration: '20 تكرار', calories: 16, desc: 'اقفز من جانب لآخر بتوازن على ساق واحدة.' },
            { name: 'رقص الزومبا (تمرين حر)', duration: '5 دقائق', calories: 40, desc: 'حركات رقص سريعة وممتعة لحرق الدهون.' }
        ]
    },
    'muscle': {
        title: 'بناء العضلات (تدريب شامل)',
        exercises: [
            // Upper Body
            { name: 'ضغط الصدر (Push-ups)', duration: '15 تكرار', calories: 10, desc: 'التركيز على الصدر، الكتفين، والترايسبس.' },
            { name: 'الضغط الماسي (Diamond Push-ups)', duration: '10 تكرار', calories: 12, desc: 'تركيز قوي على عضلة الترايسبس.' },
            { name: 'تمرين الغطس (Tricep Dips)', duration: '12 تكرار', calories: 10, desc: 'استخدم كرسياً لرفع وإنزال جسمك.' },
            { name: 'البلانك مع لمس الكتف (Plank Taps)', duration: '20 تكرار', calories: 8, desc: 'ثبات الجذع مع حركة الأذرع.' },
            // Core
            { name: 'تمرين المعدة (Crunches)', duration: '20 تكرار', calories: 8, desc: 'عزل عضلات البطن العلوية.' },
            { name: 'رفع الساقين (Leg Raises)', duration: '15 تكرار', calories: 10, desc: 'استهداف عضلات البطن السفلية.' },
            { name: 'الدوران الروسي (Russian Twists)', duration: '30 تكرار', calories: 12, desc: 'نحت الخصر والجوانب.' },
            { name: 'تمرين البلانك (Plank)', duration: '60 ثانية', calories: 6, desc: 'تمرين الثبات الأساسي للجسم كله.' },
            // Lower Body
            { name: 'القرفصاء (Squats)', duration: '20 تكرار', calories: 12, desc: 'سيد تمارين الأرجل والمؤخرة.' },
            { name: 'الطعن الأمامي (Forward Lunges)', duration: '12/ساق', calories: 10, desc: 'تقوية الفخذ الأمامي والتوازن.' },
            { name: 'الطعن الخلفي (Reverse Lunges)', duration: '12/ساق', calories: 10, desc: 'أفضل للركبة، ويركز على المؤخرة.' },
            { name: 'جسر المؤخرة (Glute Bridges)', duration: '15 تكرار', calories: 8, desc: 'عزل وتقوية عضلات المؤخرة.' },
            { name: 'رفع السمانة (Calf Raises)', duration: '25 تكرار', calories: 6, desc: 'تقوية عضلة الساق الخلفية (السمانة).' }
        ]
    },
    'yoga': {
        title: 'اليوجا والمرونة (صفاء ذهني)',
        exercises: [
            // Flow & Strength
            { name: 'تحية الشمس (Sun Salutation)', duration: '3 جولات', calories: 15, desc: 'سلسلة حركات متصلة لتنشيط الجسم.' },
            { name: 'المحارب 1 (Warrior I)', duration: '30 ثانية/ساق', calories: 5, desc: 'قوة وثبات للأرجل والجذع.' },
            { name: 'المحارب 2 (Warrior II)', duration: '30 ثانية/ساق', calories: 5, desc: 'فتح الحوض وتقوية الأكتاف.' },
            // Balance
            { name: 'وضعية الشجرة (Tree Pose)', duration: '45 ثانية/ساق', calories: 4, desc: 'توازن وتركيز عميق.' },
            { name: 'وضعية النسر (Eagle Pose)', duration: '30 ثانية', calories: 6, desc: 'توازن متقدم وتمدد للأكتاف.' },
            // Flexibility & Relax
            { name: 'الكلب المنحني (Downward Dog)', duration: '60 ثانية', calories: 4, desc: 'إطالة كاملة للسلسلة الخلفية.' },
            { name: 'وضعية الكوبرا (Cobra)', duration: '30 ثانية', calories: 3, desc: 'تمدد عضلات البطن وتقوية الظهر.' },
            { name: 'وضعية المثلث (Triangle Pose)', duration: '30 ثانية/جانب', calories: 4, desc: 'إطالة الجوانب وأوتار الركبة.' },
            { name: 'وضعية الحمام (Pigeon Pose)', duration: '45 ثانية/ساق', calories: 4, desc: 'فتح عميق لمنطقة الحوض.' },
            { name: 'وضعية الطفل (Child\'s Pose)', duration: '2 دقيقة', calories: 2, desc: 'راحة واسترخاء لأسفل الظهر.' },
            { name: 'تمرين التنفس (Pranayama)', duration: '5 دقائق', calories: 2, desc: 'تنفس بطني عميق لتهدئة الأعصاب.' }
        ]
    }
};

// Update Dashboard UI
function updateDashboardUI() {
    // 1. Update Goal Buttons
    const goalBtns = document.querySelectorAll('.goal-btn');
    if (goalBtns) {
        goalBtns.forEach(btn => {
            if (btn.dataset.goal === userData.goal) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    // 2. Update Streak Circles
    const today = new Date();
    const streakContainer = getEl('streak-days');
    if (streakContainer) {
        streakContainer.innerHTML = '';
        const days = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

        let html = '';
        // Create 7 days view ending today + 2 future
        for (let i = -4; i <= 2; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const isDone = userData.streak[dateStr]; // true if done
            const isToday = i === 0;
            const dayName = days[d.getDay()]; // Arabic day

            html += `
                <div class="streak-day ${isDone ? 'active' : ''} ${isToday ? 'today' : ''}" title="${dateStr}">
                    <span>${dayName}</span>
                    <i class="fa-solid fa-${isDone ? 'check' : 'circle'}"></i>
                </div>
            `;
        }
        streakContainer.innerHTML = html;
    }

    // 3. Update Total Calories
    const totalCalEl = getEl('total-burned-calories');
    if (totalCalEl) totalCalEl.textContent = userData.totalCalories;
}

// Initialize Dashboard (Check for elements first)
const dashGoalContainer = getEl('goal-selection');
if (dashGoalContainer) {
    // Goal Selection clicking
    dashGoalContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('goal-btn')) {
            userData.goal = e.target.dataset.goal;
            saveData();
        }
    });
}

const workoutModal = getEl('workout-modal');
const modalTitle = getEl('modal-title');
const modalBody = getEl('modal-body');
const closeModal = document.querySelector('.close-modal');

// Close Logic
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

// Modal Event Delegation
document.addEventListener('click', (e) => {
    const card = e.target.closest('.workout-card');

    if (card) {
        const type = card.getAttribute('data-type');
        const data = workoutData[type];

        if (data && workoutModal) {
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="modal-tips">
                        <i class="fa-solid fa-fire-flame-curved"></i>
                        نصيحة: اختر التمارين التي قمت بها اليوم وسجل إنجازك!
                    </div>
                    <ul class="exercise-list">
                        ${data.exercises.map((ex) => `
                            <li>
                                <label class="exercise-checkbox-item">
                                    <input type="checkbox" class="ex-check" data-cal="${ex.calories}">
                                    <div class="ex-content">
                                        <div class="ex-header">
                                            <span class="ex-name">${ex.name}</span>
                                            <span class="ex-cal badge">+${ex.calories} kcal</span>
                                        </div>
                                        <p class="ex-desc">${ex.desc}</p>
                                        <span class="ex-meta"><i class="fa-regular fa-clock"></i> ${ex.duration}</span>
                                    </div>
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="modal-footer-action">
                        <div class="session-summary">
                             مجموع الحرق في هذه الجلسة: <span id="session-cals">0</span> سعرة
                        </div>
                        <button id="finish-workout-btn" class="btn btn-primary">تسجيل وإضافة للسجل اليومي</button>
                    </div>
                `;

                // Add Checkbox Logic
                const checkboxes = modalBody.querySelectorAll('.ex-check');
                const sessionCalEl = modalBody.querySelector('#session-cals');
                const finishBtn = modalBody.querySelector('#finish-workout-btn');

                checkboxes.forEach(cb => {
                    cb.addEventListener('change', () => {
                        let total = 0;
                        checkboxes.forEach(box => {
                            if (box.checked) total += parseInt(box.dataset.cal);
                        });
                        sessionCalEl.textContent = total;
                    });
                });

                // Finish Logic
                finishBtn.addEventListener('click', () => {
                    let total = 0;
                    checkboxes.forEach(box => {
                        if (box.checked) total += parseInt(box.dataset.cal);
                    });

                    if (total > 0) {
                        const dateStr = new Date().toISOString().split('T')[0];
                        userData.streak[dateStr] = true;
                        userData.totalCalories += total;
                        saveData();

                        // SweetAlert style feedback (using standard alert for now)
                        alert(`ممتاز! أضفت ${total} سعرة حرارية لرصيدك. استمر في العمل الرائع!`);

                        workoutModal.classList.remove('show');
                        workoutModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    } else {
                        alert('لم تختر أي تمرين! حدد نشاطاً واحداً على الأقل.');
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
