
// Function to redirect the user to authentication page
export function redirectToAuthentication() {
    // Construct the redirect URL
    const redirectURL = 'https://sandbox.openrainbow.com/api/rainbow/authentication/v1.0/oauth/authorize?response_type=token&client_id=23b6d4d0061111ef9f25994f9ae1ef66&redirect_uri=https://127.0.0.1:8080/&scope=all';
    // Redirect the user to the authentication URL
    window.location.replace(redirectURL);
}

// Function to handle the callback after successful authentication
export function handleAuthenticationCallback() {
    // Check if the URL contains the access token
    const accessToken = getAccessTokenFromURL();
    if (accessToken) {
          // Authentication successful, proceed with your application logic
          console.log("Authentication successful. Access Token:", accessToken);
          // Use the access token for further API calls or other operations
      storeAccessTokenInSession(accessToken);
    } else {
          // Authentication failed or access token not found in URL
      console.error("Authentication failed or Access Token not found.");
    }
}

// Function to extract the access token from the URL fragment
function getAccessTokenFromURL() {

	const urlParams = new URLSearchParams(window.location.hash.substring(1));
  	return urlParams.get('access_token');
}

// Function to store the access token in the session
function storeAccessTokenInSession(accessToken) {
    // Store the access token in the session storage
    sessionStorage.setItem('accessToken', accessToken);
}
  