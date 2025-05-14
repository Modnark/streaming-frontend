const registerButton = document.getElementById('Form_Register_Button');
const registerUsername = document.getElementById('Form_Register_Username');
const registerPassword = document.getElementById('Form_Register_Password');
const registerPasswordConfirm = document.getElementById('Form_Register_Password_Confirm');
const errorList = document.getElementById('errorList');
const errorListContainer = document.getElementById('errorListContainer');

registerButton.addEventListener('click', async (e) => {
    const token = await getCSRFToken();
    errorListContainer.style.display = 'none';

    if(token) {
        const res = await fetchEndpoint(
            {
                endpointUrl: '/api/auth/v1/register',
                method: 'POST',
                headers: {
                    'x-csrf-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerUsername.value,
                    password: registerPassword.value,
                    passwordConfirmation: registerPasswordConfirm.value
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