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