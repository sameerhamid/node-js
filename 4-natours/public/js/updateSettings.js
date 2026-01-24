import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe'
    try {
        const res = await axios({
            method: 'PATCH',
            url,
            data,
            // headers: {
            //     'Content-Type': 'application/json'
            // }
        });
        if (res?.data?.status === 'success') {
            showAlert('success', `${type?.toUpperCase()} ppdated successfull!`);
        }
    } catch (error) {
        showAlert("error", error?.response?.data.message ?? "Error while updating!");
        window.setTimeout(() => location.reload(), 500)
    }
}
