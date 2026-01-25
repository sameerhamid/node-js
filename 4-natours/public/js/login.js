import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    if (!email || !password) {
        return;
    }
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res?.data?.status === 'success') {
            showAlert('success', 'Logged in successfull!');
            window.setTimeout(() => {
                location.assign('/');
            }, 600);
        }
    } catch (error) {
        showAlert("error", error?.response?.data.message ?? "Error while logging user");
    }
}


export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if(res?.data?.status === 'success'){
            showAlert('success', 'Logged out successfull!');
             window.setTimeout(() => {
                location.assign('/');
            }, 500);
        }
    } catch (error) {
        console.log("error while logging out>>", error);
        showAlert('error', 'Error logging out! try again later');
    }
}
