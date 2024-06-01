import rainbowSDK from './rainbow-sdk.min.js';

let conversations;

let onReady = function onReady() {
    console.log('[Hello World] :: On SDK Ready!');
    let myRainbowLogin = "aymanmikh7@gmail.com";
    let myRainbowPassword = "aymanMIKH@2000";

    rainbowSDK.connection.signin(myRainbowLogin, myRainbowPassword)
        .then(function(account) {
            console.log('[Hello World] :: Signed in as', account);
            document.getElementById('searchContainer').style.display = 'block';
        })
        .catch(function(err) {
            console.error('[Hello World] :: Sign-in error', err);
        });

};

let onLoaded = function onLoaded() {
    console.log('[Hello World] :: On SDK Loaded!');

    rainbowSDK.initialize('23b6d4d0061111ef9f25994f9ae1ef66', 'AGYoE8SZ6w8Zpr7XjrKAN9rUYndOkYO7CZwbIbJKvdcn3uGDl5s3EzTZAFEM7YaJ')
        .then(() => {
            console.log('[Hello World] :: Rainbow SDK is initialized!');
        })
        .catch(err => {
            console.log('[Hello World] :: Something went wrong with the SDK initialization', err);
        });

    conversations = rainbowSDK.conversations;
};

function searchByName() {
    let searchInput = document.getElementById('searchInputByName').value;
    if (searchInput.length > 0) {
        rainbowSDK.contacts.searchByName(searchInput, 10)
            .then(usersFound => {
                let resultsDiv = document.getElementById('searchResults');
                resultsDiv.innerHTML = '';

                if (usersFound.length > 0) {
                    usersFound.forEach(user => {
                        let listItem = document.createElement('div');
                        listItem.innerHTML = `
                            <div><strong>Name:</strong> ${user.firstname} ${user.lastname}</div>
                            <div><strong>Email:</strong> ${user.loginEmail}</div>
                            <div><strong>Job Title:</strong> ${user.jobTitle}</div>
                            <div><strong>Company:</strong> ${user.company ? user.company.name : 'N/A'}</div>
                            <div><strong>Phone:</strong> ${user.professionalPhoneNumber || 'N/A'}</div>
                            <div><strong>Mobile:</strong> ${user.professionalMobileNumber || 'N/A'}</div>
                            <div><strong>Status:</strong> ${user.status || 'N/A'}</div>
                            <div><strong>Country:</strong> ${user.country || 'N/A'}</div>
                            <hr>
                        `;
                        resultsDiv.appendChild(listItem);
                    });
                } else {
                    resultsDiv.textContent = 'No user found with that name';
                }
            })
            .catch(err => {
                console.error("Error during search by name: ", err);
            });
    }
}

async function searchConversationsByText(inputText) {
    if (!conversations) {
        console.error("Conversations object is not defined.");
        return [];
    }
    
    let filteredConversations = [];

    let allConversations = await conversations.getAllConversations();

    for (let conversation of allConversations) {
        
            let conv = await rainbowSDK.im.getMessagesFromConversation(conversation.dbId, 30);
            const messages = conv.messages;

            let occurrenceCount = 0;
            let messageIds = [];

            for (let message of messages) {
                if (message.type.value === "Chat" && message.data.includes(inputText)) {
                    occurrenceCount++;

                    messageIds.push(message.id);
                }
            }

            if (occurrenceCount > 0) {
                filteredConversations.push({
                    conversationId: conversation.dbId,
                    occurrenceCount: occurrenceCount,
                    messageIds: messageIds
                });
            }
        
    }

    return filteredConversations;
}



function displaySearchResults(conversations) {
    let resultsDiv = document.getElementById('conversationResults');
    resultsDiv.innerHTML = '';

    if (conversations.length > 0) {
        conversations.forEach(conversation => {
            let conversationDiv = document.createElement('div');
            conversationDiv.classList.add('conversation-item');

            let conversationInfo = document.createElement('div');
            conversationInfo.textContent = `Conversation ID: ${conversation.conversationId} | Occurrences: ${conversation.occurrenceCount}`;
            conversationInfo.classList.add('conversation-info');
            conversationDiv.appendChild(conversationInfo);

            let messageList = document.createElement('ul');
            conversation.messageIds.forEach(messageId => {
                let messageItem = document.createElement('li');
                messageItem.textContent = `Message ID: ${messageId}`;
                messageList.appendChild(messageItem);
            });
            conversationDiv.appendChild(messageList);

            resultsDiv.appendChild(conversationDiv);
        });
    } else {
        resultsDiv.textContent = 'No conversations found with the provided text';
    }
}


document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);

rainbowSDK.start();
rainbowSDK.load();

document.getElementById('searchInputByName').addEventListener('input', searchByName);
document.getElementById('searchInputByText').addEventListener('input', async function() {
    let searchText = this.value.trim();
    let conversations = await searchConversationsByText(searchText);
    displaySearchResults(conversations);
});