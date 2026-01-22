const login = async (email, password) =>{
    if (!email || !password) {
        return;
    }
    try {
        // const res = await axios({
        //     method: 'POST',
        //     url: 'http://127.0.0.1:3000/api/v1/users/login',
        //     body: {
        //         email: email,
        //         password: password
        //     }
        // });
        const res = await fetch('/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ email, password })
        });

        const data = await res.json(); // 👈 REQUIRED
        if(data?.status === 'success'){
            alert('Logged in successfull!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (error) {
        alert(error?.response?.data.message ?? "Error while logging user");
    }

}

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password)
})

console.log("login form>>>")
