import rainbowSDK from './rainbow-sdk.min.js';
import {getConversation} from "./conversation.conf.js";

var currentPage;
var messagesContainer = null;

export function initConversation(){
    messagesContainer = document.getElementById("conversation");
    document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived);
}

export function displayMessages(){
    var conversation = getConversation();
    messagesContainer.innerHTML = '';
    conversation.messages.forEach(message => {
        renderMessage(message, messagesContainer);
    });

    if(!conversation.historyAboveComplete){
        renderLoadMoreButton(messagesContainer);
    }
}

export function initializeCurr(){
    currentPage = 0;
}

let onNewMessageReceived = function(event){
    let message = event.detail.message;
    let conversation = event.detail.conversation;
    displayNewMessages(conversation, message);
}

function displayNewMessages(){
    renderMessage(message);
}

function renderMessage(message){
    var messageElement = document.createElement('div');
    messageElement.textContent = message.data;
    messagesContainer.appendChild(messageElement);
}

function renderLoadMoreButton(){
    var loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Load More';
    messagesContainer.appendChild(loadMoreButton);    
    loadMoreButton.addEventListener('click', loadMoreMessages);
}

function loadMoreMessages(){
    var conversation = getConversation();
    currentPage++;
    rainbowSDK.im.getMessagesFromConversation(conversation.id, 10).then(function() {
        displayMessages();
    });
}
