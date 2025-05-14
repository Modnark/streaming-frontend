const logoutLink = document.getElementById("Header_LogoutLink");

logoutLink.addEventListener('click', async (e) => {
    const token = await getCSRFToken();

    const logoutResult = await fetch('/api/auth/v1/logout', 
    {
        method: 'DELETE',
        headers: {
            'x-csrf-token': token        
        }
    });

    if(logoutResult.ok) {
        location.href = '/login';
    }
});