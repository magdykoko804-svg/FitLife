/* Helper to safely get element */
const getEl = (id) => document.getElementById(id);

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

// 2. Calorie Calculator
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
            const tdeeValue = getEl('tdee-value');
            const calorieResult = getEl('calorie-result');
            if (tdeeValue) tdeeValue.textContent = tdee;
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

// 4. Workout Modal
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

// Explicit Descriptions Only (No Images as requested)
const workoutData = {
    'cardio': {
        title: 'تمارين الكارديو ورفع نبضات القلب',
        exercises: [
            {
                name: 'الجري في المكان (High Knees)',
                duration: '30 ثانية',
                desc: 'ارفع ركبتيك للأعلى بسرعة مع تحريك الذراعين لزيادة معدل حرق الدهون.'
            },
            {
                name: 'قفز الحبل (Jump Rope)',
                duration: '1 دقيقة',
                desc: 'تمرين كلاسيكي رائع لحرق السعرات وتقوية الجسم بالكامل.'
            },
            {
                name: 'تمرين بيربي (Burpees)',
                duration: '15 تكرار',
                desc: 'انخفض للأرض، اقفز للخلف، ثم عد للأمام واقفز عالياً. تمرين شامل وقوي.'
            },
            {
                name: 'تسلق الجبل (Mountain Climbers)',
                duration: '45 ثانية',
                desc: 'في وضع البلانك، حرك ركبتيك بالتناوب نحو صدرك بسرعة.'
            },
            {
                name: 'تمرين القفز (Jumping Jacks)',
                duration: '45 ثانية',
                desc: 'اقفز مع فتح الذراعين والقدمين، ثم عد لوضعية الوقوف. ممتاز للإحماء والكارديو.'
            }
        ]
    },
    'muscle': {
        title: 'تمارين بناء العضلات',
        exercises: [
            {
                name: 'ضغط الصدر (Push-ups)',
                duration: '12-15 تكرار',
                desc: 'حافظ على استقامة ظهرك، وانخفض حتى يقترب صدرك من الأرض، ثم ادفع للأعلى.'
            },
            {
                name: 'القرفصاء (Squats)',
                duration: '15-20 تكرار',
                desc: 'باعد بين قدميك، وانخفض كما لو كنت تجلس على كرسي، مع الحفاظ على استقامة الظهر.'
            },
            {
                name: 'الطعن (Lunges)',
                duration: '12 تكرار لكل ساق',
                desc: 'تقدم بساق واحدة للأمام وانخفض حتى تشكل ركبتك زاوية 90 درجة.'
            },
            {
                name: 'تمرين المعدة (Crunches)',
                duration: '20 تكرار',
                desc: 'استلق على ظهرك، وارفع كتفيك عن الأرض باستخدام عضلات البطن.'
            },
            {
                name: 'تمرين البلانك (Plank)',
                duration: '1 دقيقة',
                desc: 'ارتكز على ساعديك وأطراف أصابعك، وحافظ على جسمك مشدوداً ومستقيماً.'
            }
        ]
    },
    'yoga': {
        title: 'تمارين اليوجا والمرونة',
        exercises: [
            {
                name: 'وضعية الطفل (Child\'s Pose)',
                duration: '1 دقيقة',
                desc: 'اجلس على ركبتيك وانحن للأمام مع مد ذراعيك، وارخي جسمك بالكامل.'
            },
            {
                name: 'وضعية الكلب المنحني (Downward Dog)',
                duration: '45 ثانية',
                desc: 'شكل حرف V مقلوب بجسمك، مع الضغط بالكعبين نحو الأرض.'
            },
            {
                name: 'وضعية الشجرة (Tree Pose)',
                duration: '30 ثانية لكل ساق',
                desc: 'قف على ساق واحدة، وضع باطن القدم الأخرى على الفخذ الداخلي، وحافظ على التوازن.'
            },
            {
                name: 'وضعية الكوبرا',
                duration: '30 ثانية',
                desc: 'استلق على بطنك، وارفع صدرك للأعلى باستخدام عضلات الظهر، وانظر للأمام.'
            },
            {
                name: 'تمرين التنفس العميق',
                duration: '2 دقيقة',
                desc: 'اجلس في وضع مريح، وركز على التنفس العميق والهادئ لتصفية الذهن.'
            }
        ]
    }
};

// Event delegation for opening modal
document.addEventListener('click', (e) => {
    const card = e.target.closest('.workout-card');

    if (card) {
        const type = card.getAttribute('data-type');
        const data = workoutData[type];
        if (data && workoutModal) {
            if (modalTitle) modalTitle.textContent = data.title;
            if (modalBody) {
                modalBody.innerHTML = `
                    <ul class="exercise-list">
                        ${data.exercises.map(ex => `
                            <li class="exercise-item-text-only">
                                <div class="exercise-details">
                                    <span class="exercise-name">${ex.name}</span>
                                    <p class="exercise-desc">${ex.desc}</p>
                                    <span class="exercise-meta"><i class="fa-regular fa-clock"></i> ${ex.duration}</span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
            workoutModal.classList.add('show');
            workoutModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
});
