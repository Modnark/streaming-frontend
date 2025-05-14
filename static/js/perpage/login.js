const loginButton = document.getElementById('Form_Login_Button');
const loginUsername = document.getElementById('Form_Login_Username');
const loginPassword = document.getElementById('Form_Login_Password');
const errorList = document.getElementById('errorList');
const errorListContainer = document.getElementById('errorListContainer');

loginButton.addEventListener('click', async (e) => {
    const token = await getCSRFToken();
    errorListContainer.style.display = 'none';

    if(token) {
        const res = await fetchEndpoint(
            {
                endpointUrl: '/api/auth/v1/login',
                method: 'POST',
                headers: {
                    'x-csrf-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername.value,
                    password: loginPassword.value,
                })
            }
        );

        if(res.ok) {
            errorListContainer.style.display = 'none';
            location.href = '/';
        } else {
            const resDat = await res.json();
            if(resDat.error) {
                errorListContainer.style.display = 'block';
                errorList.innerHTML = '';
                for(let detail of resDat.error.details) {
                    errorList.innerHTML += `<li>${detail.message}</li>`;
                }
            }
        }
    }
});