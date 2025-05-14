const streamKeyInput = document.getElementById('Form_Settings_StreamKey');
const revealButton = document.getElementById('Button_Reveal');
const copyButton = document.getElementById('Button_Copy');
const regenButton = document.getElementById('Button_Regenerate');

revealButton.addEventListener('click', (e) => {
    const dType = streamKeyInput.type;
    const btnTxt = revealButton.innerText;

    streamKeyInput.type = dType === 'text' ? 'password' : 'text';
    revealButton.innerText = btnTxt === 'Reveal' ? 'Hide' : 'Reveal';
});

copyButton.addEventListener('click', (e) => {
    streamKeyInput.select();
    streamKeyInput.setSelectionRange(0, 9999999);

    navigator.clipboard.writeText(streamKeyInput.value);

    streamKeyInput.blur();
});

// TODO: Make my own popup boxes, they look nicer
regenButton.addEventListener('click', async (e) => {
    const goForward = confirm('Regenerate stream key? Clicking OK will shut your current stream off!');

    if(goForward) {
        const token = await getCSRFToken();
        errorListContainer.style.display = 'none';
    
        if(token) {
            const res = await fetchEndpoint(
                {
                    endpointUrl: '/api/user/v1/resetkey',
                    method: 'PATCH',
                    headers: {
                        'x-csrf-token': token,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if(res.ok) {
                const resDat = await res.json();
                if(resDat.newKey) {
                    streamKeyInput.value = resDat.newKey;
                    alert('Stream key has been updated. You can now copy it.');
                }
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
    }
});