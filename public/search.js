import {associatedConversationFct, getConversation} from './conversation.conf.js';
import rainbowSDK from './rainbow-sdk.min.js'; // If you do not use the bundler
import { displayMessages, initializeCurr} from './conversation.js';


var searchInputbyName;
var searchInputbyId;
var searchResults;
var messageContainer;
var labelFor;

export function initSearch(){
    searchInputbyName = document.getElementById("searchInputbyName");
    searchInputbyId = document.getElementById("searchInputbyId");
    searchResults = document.getElementById("searchResults");
    messageContainer = document.getElementById("chatContainer");
    labelFor = document.getElementById("labelForUser");

    handleSearchByName();
    handleSearchById();
}

function searchUserByName() {
    var contactName  = searchInputbyName.value.toLowerCase();
    searchResults.innerHTML = '';
    rainbowSDK.contacts.searchByName(contactName, 10).then(function(usersFound) {
        if (usersFound.length > 0) {
            // At least one user has been found
            usersFound.forEach(function (user) {
                creatUserItem(user);
            });
        }
        else {
            console.log("no contact found");
        }
})};

function searchUserById() {

    // this for searching results
    var contactId  = searchInputbyId.value.toLowerCase();
    searchResults.innerHTML = '';

    rainbowSDK.contacts.searchById(contactId, 10).then(function(user) {
        if (user != null) {
            creatUserItem(user);
        }
        else {
            console.log("no contact found");
        }
})};

function creatUserItem(user){
    let contactDiv = document.createElement('div');
    contactDiv.textContent = user.firstname + " " + user.lastname; 
    // Button to start a chat with the contact
    let chatButton = document.createElement('button');
    chatButton.textContent = 'Start chating';
    // Set a unique identifier for the button
    chatButton.dataset.userId = user.dbId;
    chatButton.dataset.userName = user.firstname;
    // add Event listener
    handleClickOnChat(chatButton);
    // Append the contact div and chat button to the search results container
    searchResults.appendChild(contactDiv);
    searchResults.appendChild(chatButton);
}

function handleSearchByName(){
    // Add Event triggered in the client Side application 
    document.getElementById('searchInputbyName').addEventListener('input', searchUserByName);
}
function handleSearchById(){
    // Add Event triggered in the client Side application 
    document.getElementById('searchButtonbyId').addEventListener('click', searchUserById);
}

function handleClickOnChat(chatButton){
    chatButton
    .addEventListener('click', function() {
        let userId = this.dataset.userId;
        labelFor.innerHTML = "Messaging with " + chatButton.dataset.userName;
        messageContainer.style.display = 'block';
        associatedConversationFct(userId);
        displayMessages();
        initializeCurr();
    });
}