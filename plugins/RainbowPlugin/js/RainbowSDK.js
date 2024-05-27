
import rainbowSDK from '../rainbow-web-sdk/src/rainbow-sdk.min.js';
//import rainbowSDK from 'rainbow-web-sdk'; // If you use the bundler (for example - Webpack)
import { getRecentConversations } from './conversation.js';


let onReady = function onReady() {

    console.log('[Hello World] :: On SDK Ready!');

    fetchLoginInfo();

}
function fetchLoginInfo() {

    const URL = window.WebsiteURL;

    //send an AJAX GET Request to get the login infos from the LoginInfo.jsp
    jQuery.ajax({
        url: URL + 'plugins/RainbowPlugin/jsp/app/LoginInfo.jsp',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
        },
        success: function(data) {
            let token = data.token;
            //if token isn't null then we do the signing to rainbow with the token

            if (token) {
                rainbowSDK.connection.signinWithToken(token)
                    .then(function(account) {
                        console.log('[Hello World] :: Signed in Successfully');
                        getRecentConversations();
                    })
                    .catch(function(err) {
                        console.log('[Hello World] :: Something went wrong with the signing...', err);
                    });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching login information:', textStatus, errorThrown);
        }
    });
}


var onSigned = function onSigned(event) {

    let account = event.detail;
    console.log('[Hello World] :: Signed in Successfully')

}


let onStarted = function onStarted() {
    console.log('[Hello World] :: On SDK Started!');
};

let onLoaded = function onLoaded() {
    // Inside RainbowSDK.js
    const URL = window.WebsiteURL;

    console.log('[Hello World] :: On SDK Loaded');

    //send an AJAX GET Request to get the AppID and AppSecretID from the LoginInfo.jsp    
    jQuery.ajax({
        url: URL + 'plugins/RainbowPlugin/jsp/app/LoginInfo.jsp',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
        },
        success: function(data) {

            let appID = data.appID;
            let appSecretID = data.appSecretID;

            rainbowSDK
                .initialize(appID, appSecretID)
                .then(() => {
                    console.log('[Hello World] :: Rainbow SDK is initialized!');
                })
                .catch(err => {
                    console.log('[Hello World] :: Something went wrong with the SDK...', err);
                });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching login information:', textStatus, errorThrown);
        }
    });

};

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);

document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSIGNED, onSigned);
document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTARTED, onStarted);

rainbowSDK.start();
rainbowSDK.load();


