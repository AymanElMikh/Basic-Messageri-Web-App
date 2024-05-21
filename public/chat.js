import {getConversation} from "./conversation.conf.js";
import rainbowSDK from './rainbow-sdk.min.js'; // If you do not use the bundler


export function initChat(){
    addMessageListener();
} 

export function sendMessageToUser(message){
    try{
        console.log("Starting chat");
        rainbowSDK.im.sendMessageToConversation(getConversation().id, message);
        console.log("message has been sent !");
    } catch(error){
        console.log(error);
    }
}

function addMessageListener() {
    document.getElementById("messageForm").addEventListener("submit", function(event) {
        // Prevent default form submission
        event.preventDefault();
        // Get the input value from the text box
        let message = document.getElementById("message").value;
        // Call a function to handle sending the message
        sendMessageToUser(message);
        // Empty the input field 
        document.getElementById("message").value = "";
    });
}