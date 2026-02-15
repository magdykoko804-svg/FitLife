document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0'; // RTL left
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(15, 23, 42, 0.95)';
                navLinks.style.padding = '2rem';
                navLinks.style.zIndex = '999';
            }
        });
    }

    // 2. Calorie Calculator
    const calorieForm = document.getElementById('calorie-form');
    const calorieResult = document.getElementById('calorie-result');
    const tdeeValue = document.getElementById('tdee-value');

    if (calorieForm) {
        calorieForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const gender = document.querySelector('input[name="gender"]:checked').value;
            const age = parseFloat(document.getElementById('age').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const activity = parseFloat(document.getElementById('activity').value);

            if (!age || !weight || !height) return;

            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }

            const tdee = Math.round(bmr * activity);

            tdeeValue.textContent = tdee;
            calorieResult.classList.remove('hidden');
        });
    }

    // 3. BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    const bmiResult = document.getElementById('bmi-result');
    const bmiValueEl = document.getElementById('bmi-value');
    const bmiStatusEl = document.getElementById('bmi-status');
    const bmiPointer = document.getElementById('bmi-pointer');

    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const weight = parseFloat(document.getElementById('bmi-weight').value);
            const heightCm = parseFloat(document.getElementById('bmi-height').value);

            if (!weight || !heightCm) return;

            const heightM = heightCm / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(1);

            bmiValueEl.textContent = bmi;
            
            let status = '';
            let color = '';
            
            if (bmi < 18.5) {
                status = 'نحافة (Underweight)';
                color = '#3498db'; // Blue
            } else if (bmi >= 18.5 && bmi < 24.9) {
                status = 'وزن طبيعي (Normal)';
                color = '#2ecc71'; // Green
            } else if (bmi >= 25 && bmi < 29.9) {
                status = 'وزن زائد (Overweight)';
                color = '#f1c40f'; // Yellow
            } else {
                status = 'سمنة (Obese)';
                color = '#e74c3c'; // Red
            }

            bmiStatusEl.textContent = status;
            bmiStatusEl.style.color = color;
            
            // Simple visual indication logic could be added here
            bmiResult.classList.remove('hidden');
        });
    }
});
