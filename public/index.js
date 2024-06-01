import rainbowSDK from './rainbow-sdk.min.js';

let conversations;
let searchText = '';
let bubbles;
let channels;
let contacts;

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
    bubbles = rainbowSDK.bubbles;
    channels = rainbowSDK.channels;
    contacts = rainbowSDK.contacts;
};

function searchByName() {
    let searchInput = document.getElementById('searchInput').value;
    if (searchInput.length > 0) {
        contacts.searchByName(searchInput, 10)
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

async function searchConversationsByText() {
    let searchInput = document.getElementById('searchInput').value;
    if (!conversations) {
        console.error("Conversations object is not defined.");
        return [];
    }

    let filteredConversations = [];
    searchText = searchInput; // Update the global searchText variable

    let allConversations = await conversations.getAllConversations();

    for (let conversation of allConversations) {
        let conv = await rainbowSDK.im.getMessagesFromConversation(conversation.dbId, 30);
        const messages = conv.messages;

        let occurrenceCount = 0;
        let messageIds = [];

        for (let message of messages) {
            if (message.type.value === "Chat" && message.data.includes(searchInput)) {
                occurrenceCount++;
                messageIds.push(message.id);
            }
        }

        if (occurrenceCount > 0) {
            filteredConversations.push({
                conversationId: conversation.dbId,
                occurrenceCount: occurrenceCount,
                messages: messages
            });
        }
    }

    return filteredConversations;
}

function displaySearchResults(conversations) {
    let resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    if (conversations.length > 0) {
        conversations.forEach(conversation => {
            let conversationDiv = document.createElement('div');
            conversationDiv.classList.add('conversation-item');

            let conversationInfo = document.createElement('div');
            conversationInfo.textContent = `Conversation ID: ${conversation.conversationId} | Occurrences: ${conversation.occurrenceCount}`;
            conversationInfo.classList.add('conversation-info');
            conversationDiv.appendChild(conversationInfo);

            let showContentButton = document.createElement('button');
            showContentButton.textContent = "Show Content";
            showContentButton.classList.add('show-content-button');
            showContentButton.addEventListener('click', function() {
                displayConversationContent(conversation);
            });
            conversationDiv.appendChild(showContentButton);

            resultsDiv.appendChild(conversationDiv);
        });
    } else {
        resultsDiv.textContent = 'No conversations found with the provided text';
    }
}

async function displayConversationContent(conversation) {
    let contentDiv = document.getElementById('conversationContent');
    contentDiv.innerHTML = '';

    let conversationIdHeading = document.createElement('h2');
    conversationIdHeading.textContent = `Conversation ID: ${conversation.conversationId}`;
    contentDiv.appendChild(conversationIdHeading);

    let messageList = document.createElement('ul');
    conversation.messages.forEach(message => {
        let messageItem = document.createElement('li');
        messageItem.innerHTML = `
            <strong>Message Data:</strong> ${message.data}
        `;
        if (message.data.includes(searchText)) {
            messageItem.style.color = 'red';
        }
        messageList.appendChild(messageItem);
    });
    contentDiv.appendChild(messageList);
}

async function searchBubblesByName() {
    let searchInput = document.getElementById('searchInput').value;
    if (searchInput.length > 0) {
        try {
            let allBubbles = await bubbles.getAllBubbles();
            let filteredBubbles = allBubbles.filter(bubble => bubble.name.includes(searchInput));

            let resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = '';

            if (filteredBubbles.length > 0) {
                filteredBubbles.forEach(bubble => {
                    let listItem = document.createElement('div');
                    listItem.innerHTML = `
                        <div><strong>Bubble Name:</strong> ${bubble.name}</div>
                        <div><strong>Bubble ID:</strong> ${bubble.dbId}</div>
                        <hr>
                    `;
                    resultsDiv.appendChild(listItem);
                });
            } else {
                resultsDiv.textContent = 'No bubbles found with that name';
            }
        } catch (err) {
            console.error("Error during search by bubble name: ", err);
        }
    }
}

async function searchChannelsByName() {
    let searchInput = document.getElementById('searchInput').value;
    if (searchInput.length > 0) {
        try {
            let filteredChannels = await channels.fetchChannelsByName(searchInput);

            let resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = '';

            if (filteredChannels.length > 0) {
                filteredChannels.forEach(channel => {
                    let listItem = document.createElement('div');
                    listItem.innerHTML = `
                        <div><strong>Channel Name:</strong> ${channel.name}</div>
                        <div><strong>Channel ID:</strong> ${channel.id}</div>
                        <hr>
                    `;
                    resultsDiv.appendChild(listItem);
                });
            } else {
                resultsDiv.textContent = 'No channels found with that name';
            }
        } catch (err) {
            console.error("Error during search by channel name: ", err);
        }
    }
}

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);

rainbowSDK.start();
rainbowSDK.load();

async function proxy(searchType) {
    let searchText = document.getElementById('searchInput').value.trim();
    
    switch (searchType) {
        case 'user':
            searchByName();
            break;
        case 'bubble':
            await searchBubblesByName();
            break;
        case 'channel':
            await searchChannelsByName();
            break;
        case 'conversation':
            let conversations = await searchConversationsByText(searchText);
            displaySearchResults(conversations);
            break;
        default:
            console.error("Invalid search type");
            break;
    }
}

document.getElementById('searchInput').addEventListener('input', function() {
    proxy(document.getElementById('searchType').value);
});