async function getCSRFToken() {
    const tokenRes = await fetch('/api/auth/v1/getcsrf');
    const { token } = await tokenRes.json();
    return token;
}