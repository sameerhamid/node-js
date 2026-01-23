import '@babel/polyfill';

import { login, logout } from "./login";
import { updateSettings } from './updateSettings';


const loginForm = document.querySelector('.login--form');
const logoutButton = document.querySelector('.nav__el--logout');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector('.form-user-password');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        e.preventDefault();
        login(email, password)
    })
}

if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}


if (updateUserDataForm) {
    updateUserDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data')
    })
}

if (updateUserPasswordForm) {
    updateUserPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm').value;
        await updateSettings({ currentPassword, password, confirmPassword }, 'password');
        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    })
}
