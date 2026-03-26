const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const passwordStrengthText = document.getElementById('password-strength');
const errorMessage = document.getElementById('error-message');

function togglePassword() {
        const password = passwordInput;
        const toggle = document.querySelector('.toggle-password');
        if (password.type === 'password') {
                password.type = 'text';
                toggle.textContent = 'Hide';
        } else {
                password.type = 'password';
                toggle.textContent = 'Show';
        }
}

function checkPasswordStrength(password) {
        if (!password) return '';

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-[\]{};':"\\|,.<>\/?]/.test(password);
        const length = password.length;

        if (length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol) {
                return 'Strong';
        }
        if (length >= 6 && hasUpper && hasNumber) {
                return 'Medium';
        }
        return 'Weak';
}

passwordInput.addEventListener('input', () => {
        const strength = checkPasswordStrength(passwordInput.value);
        passwordStrengthText.textContent = strength ? `Password Strength: ${strength}` : 'Enter a password to see strength.';
        passwordStrengthText.className = 'form-text mb-3 ' +
                (strength === 'Strong' ? 'text-success' : strength === 'Medium' ? 'text-warning' : 'text-danger');
});

form.addEventListener('submit', (event) => {
        event.preventDefault();
        errorMessage.textContent = '';

        const mobile = usernameInput.value.trim();
        const password = passwordInput.value;

        const mobileValid = /^\d{10}$/.test(mobile);
        if (!mobileValid) {
                errorMessage.textContent = 'Please enter a valid 10-digit mobile number.';
                usernameInput.focus();
                return;
        }

        if (password.length < 6) {
                errorMessage.textContent = 'Password must be at least 6 characters long.';
                passwordInput.focus();
                return;
        }

        if (checkPasswordStrength(password) === 'Weak') {
                errorMessage.textContent = 'Please choose a stronger password (add uppercase, numbers, symbols).';
                passwordInput.focus();
                return;
        }

        errorMessage.className = 'text-success mb-3';
        errorMessage.textContent = 'Login successful!';
        setTimeout(() => {
                form.reset();
                passwordStrengthText.textContent = 'Enter a password to see strength.';
                passwordStrengthText.className = 'form-text text-muted mb-3';
                errorMessage.textContent = '';
                errorMessage.className = 'text-danger mb-3';
        }, 1500);
});
