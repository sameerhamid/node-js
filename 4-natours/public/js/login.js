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
            }, 1000);
        }
    } catch (error) {
        showAlert("error", error?.response?.data.message ?? "Error while logging user");
    }
}
