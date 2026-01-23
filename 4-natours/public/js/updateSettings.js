import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data: {
                name,
                email,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res?.data?.status === 'success') {
            showAlert('success', 'Data updated successfull!');
            location.reload();
        }
    } catch (error) {
        showAlert("error", error?.response?.data.message ?? "Error while update user data");
    }
}
