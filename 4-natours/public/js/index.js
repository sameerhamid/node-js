import '@babel/polyfill';

import { login, logout } from "./login";


const loginForm = document.querySelector('.login--form');
const logoutButton = document.querySelector('.nav__el--logout');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        e.preventDefault();
        login(email, password)
    })
}

if(logoutButton){
    logoutButton.addEventListener('click', (e)=>{
        e.preventDefault();
        logout();
    });
}
