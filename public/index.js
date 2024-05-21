/* Chose one of the import statement below */
import rainbowSDK from './rainbow-sdk.min.js'; // If you do not use the bundler
import { initChat } from './chat.js';
import { initSearch } from './search.js';
import { initConversation } from './conversation.js';
import  {redirectToAuthentication, handleAuthenticationCallback} from './auth.js';

var onReady = function onReady(){
    var sessionToken = getAccessTokenFromSession();
    if (sessionToken) {
        // Token exists, sign in with the token
        rainbowSDK.connection.signinWithToken(sessionToken)
            .then(function (account) {
                // Successfully signed in with token
                console.log('Signed in Successfully');
                console.log(account);

            })
            .catch(function (err) {
                // An error occurs
                console.log('[Hello World] :: Something went wrong with the signing...', err);
            });
    } else {
        redirectToAuthentication();
    };
};


// Function to retrieve the access token from the session
function getAccessTokenFromSession() {
  // Retrieve the access token from the session storage
  return sessionStorage.getItem('accessToken');
}


var onSigned = function onSigned(event) {
	let account = event.detail;
}

var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(event) {
        let status = event.detail.status;

        switch(status) {
            case rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED:
                // The state of the connection has changed to "connected" which means that your application is now connected to Rainbow
                console.log('[Hello World] : the state of the connection has changed to "connected"');
		break;
            case rainbowSDK.connection.RAINBOW_CONNECTIONINPROGRESS:
                // The state of the connection is now in progress which means that your application try to connect to Rainbow
                console.log('[Hello World] : the state of the connection has changed to in progress');
		break;
            case rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED:
                // The state of the connection changed to "disconnected" which means that your application is no more connected to Rainbow
                console.log('[Hello World] : the state of the connection changed to "disonnected" !');
		break;
            default:
                break;
        };
};

var signout = function signout() {

        // The SDK for Web is ready to be used, so you can sign in
        rainbowSDK.connection.signout()
        .then(function() {
              // Successfully signed out from Rainbow
		console.log('[Hello World] Signed out has done succesfully !');
        	search();
	})
        .catch(function(err) {
              // An error occurs during the stop of the Rainbow SDK
		console.log('[Hello World ] : Something bad happened to the server');
        });
    };

var onStopped = function onStopped(event) {
        // The SDK has been completely stopped.
	console.log("[Hello World ] : you cannot call any method, Rainbow SDK has been stopped !");
};

var onStarted = function onStarted() {
    console.log('[Hello World] :: On SDK Started !');
};

var onLoaded = function onLoaded() {
    console.log('[Hello World] :: On SDK Loaded!');

    rainbowSDK
        .initialize('23b6d4d0061111ef9f25994f9ae1ef66', 'AGYoE8SZ6w8Zpr7XjrKAN9rUYndOkYO7CZwbIbJKvdcn3uGDl5s3EzTZAFEM7YaJ')
        .then(() => {
            console.log('[Hello World] :: Rainbow SDK is initialized!');
	    handleAuthenticationCallback();
        })
        .catch(err => {
            console.log('[Hello World] :: Something went wrong with the SDK...', err);
        });
};



document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSIGNED, onSigned);
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTARTED, onStarted); // event will be fired once user connects and all SDK services start
document.addEventListener(rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED, onConnectionStateChangeEvent)
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTOPPED, onStopped)

// initializations 

initSearch();
initConversation();
initChat();

rainbowSDK.start();
rainbowSDK.load();