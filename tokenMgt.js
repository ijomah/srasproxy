// tokenManager.js
let accessToken = null;
let tokenExpiration = null;

//I dont expiration things now
// const setAccessToken = (token, expiresIn) => {
const setAccessToken = (token) => {
    accessToken = token.access_token;
    // tokenExpiration = Date.now() + expiresIn * 1000; // Convert to milliseconds
};

const getAccessToken = async () => {
    // if (!accessToken || Date.now() >= tokenExpiration) {
    if (!accessToken) {
        return
        // Implement logic to refresh or obtain a new token
        // Example: const newToken = await fetchNewToken();
        // setAccessToken(newToken.token, newToken.expiresIn);
    }
    return accessToken;
};

module.exports = { setAccessToken, getAccessToken };