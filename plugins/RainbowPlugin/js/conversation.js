import rainbowSDK from '../rainbow-web-sdk/src/rainbow-sdk.min.js';

export function getRecentConversations() {

    let totalInvitations = 0;
    let totalMissedMessages = 0;

    // Get recent conversations and populate the flipper flesh
    rainbowSDK.conversations.getAllConversations()
        .then(function(conversations) {
            console.log("we're getting the convos");

            const flipperFlesh = document.getElementById('recentConversationsList');
            flipperFlesh.innerHTML = '';
            //flipperFlesh.style.display = 'block';

            conversations.forEach(conversation => {
                console.log("conversations", conversation)

                if (conversation.missedCounter > 0) {
                    totalMissedMessages += conversation.missedCounter;
                }
                if (conversation.type === 0) {
                    rainbowSDK.contacts.getContactById(conversation.contact.dbId)
                        .then(contact => {
                            var contactName = contact.firstname + ' ' + contact.lastname;
                            var contactAvatar = contact.avatar;

                            // Create the conversation item container
                            var conversationItem = document.createElement('div');
                            conversationItem.classList.add('conversation-item');

                            // Create the avatar container
                            var avatarContainer = document.createElement('div');
                            avatarContainer.classList.add('avatar-container');

                            // Create the avatar element
                            var avatarImg = document.createElement('img');
                            avatarImg.classList.add('contact-avatar');
                            avatarImg.alt = contactName;

                            if (contactAvatar) {
                                avatarImg.src = contactAvatar.src;
                            } else {
                                var initials = contactName.split(' ').map(part => part.charAt(0)).join('');
                                avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                            }

                            // Create the status icon element
                            var statusIcon = document.createElement('i');
                            statusIcon.classList.add('status-icon');

                            // Check the contact status and add the appropriate icon
                            switch (conversation.contact.status) {
                                case 'online':
                                    statusIcon.classList.add('fas', 'fa-check-circle', 'online');
                                    break;
                                case 'unknown':
                                    statusIcon.classList.add('fas', 'fa-moon', 'away');
                                    break;
                                case 'dnd':
                                    statusIcon.classList.add('fas', 'fa-minus-circle', 'dnd');
                                    break;
                                case 'offline':
                                default:
                                    statusIcon.classList.add('fas', 'fa-circle', 'offline');
                                    break;
                            }

                            // Append the avatar and status indicator to the avatar container
                            avatarContainer.appendChild(avatarImg);
                            avatarContainer.appendChild(statusIcon);

                            // Create the text container
                            var textContainer = document.createElement('div');
                            textContainer.classList.add('text-container');

                            // Create the name element
                            var nameSpan = document.createElement('span');
                            nameSpan.classList.add('contact-name');
                            nameSpan.textContent = contactName;

                            var lastMessage = conversation.lastMessageText;
                            var truncatedMessage = lastMessage.length > 30 ? lastMessage.substring(0, 30) + '...' : lastMessage;

                            // Create the last message element
                            var lastMessageSpan = document.createElement('span');
                            lastMessageSpan.classList.add('last-message');
                            lastMessageSpan.textContent = truncatedMessage;

                            // Create the missed messages count element
                            var missedCountSpan = document.createElement('span');
                            missedCountSpan.classList.add('missed-count');
                            if (conversation.missedCounter > 0) {
                                missedCountSpan.style.display = 'inline-block';
                                missedCountSpan.textContent = conversation.missedCounter;
                            }


                            // Append name, last message, and missed count to the text container
                            textContainer.appendChild(nameSpan);
                            textContainer.appendChild(lastMessageSpan);


                            // Append avatar container and text container to the conversation item
                            conversationItem.appendChild(avatarContainer);
                            conversationItem.appendChild(textContainer);
                            conversationItem.appendChild(missedCountSpan);


                            // Make the conversation item clickable
                            conversationItem.addEventListener('click', function() {
                                var contactId = contact.dbId;
                                console.log("here is the conv one to one ID", conversation.dbId);
                                handleConversationClick(conversation.dbId);

                                // Add active class to the selected item and remove from others
                                document.querySelectorAll('.conversation-item').forEach(item => {
                                    item.classList.remove('active');
                                });
                                conversationItem.classList.add('active');
                                handleDisplayContact(contactId);
                            });

                            // Append the conversation item to the flipper flesh
                            document.getElementById('recentConversationsList').appendChild(conversationItem);
                        })
                        .catch(err => {
                            console.log('[Hello World] :: Something went wrong while getting the contactById..', err);
                        });
                }


                if (conversation.type === 1) {
                    // Create the conversation item
                    var conversationItem = document.createElement('div');
                    conversationItem.classList.add('conversation-item');
                    
                                                // Create the avatar container
                            var avatarContainer = document.createElement('div');
                            avatarContainer.classList.add('avatar-container');

                    // Create the avatar element
                    var avatarImg = document.createElement('img');
                    avatarImg.classList.add('contact-avatar');

                    // Set the avatar source
                    if (conversation.room.avatar) {
                        avatarImg.src = conversation.room.avatar;
                    } else {
                        // If no avatar, use the first letter of the room name as initials
                        var initials = conversation.room.name.charAt(0).toUpperCase();
                        avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                    }
                    
                    avatarContainer.appendChild(avatarImg);   
                    // Create the text container
                    var textContainer = document.createElement('div');
                    textContainer.classList.add('text-container');

                    // Create the name element
                    var nameSpan = document.createElement('span');
                    nameSpan.classList.add('contact-name');
                    nameSpan.textContent = conversation.room.name;

                    var lastMessage = conversation.lastMessageText;
                    
                    var truncatedMessage = lastMessage.length > 30 ? lastMessage.substring(0, 30) + '...' : lastMessage;

                    // Create the last message element
                    var lastMessageSpan = document.createElement('span');
                    lastMessageSpan.classList.add('last-message');
                    lastMessageSpan.textContent = truncatedMessage;

                    // Append name, last message, and missed count to the text container
                    textContainer.appendChild(nameSpan);
                    textContainer.appendChild(lastMessageSpan);



                    // Create the missed messages count element
                    var missedCountSpan = document.createElement('span');
                    missedCountSpan.classList.add('missed-count');
                    if (conversation.missedCounter > 0) {
                        missedCountSpan.style.display = 'inline-block';
                        missedCountSpan.textContent = conversation.missedCounter;
                    }

                    // Append avatar and name to the conversation item
                    conversationItem.appendChild(avatarContainer);
                    conversationItem.appendChild(textContainer);
                    conversationItem.appendChild(missedCountSpan);

                    // Make the conversation item clickable
                    conversationItem.addEventListener('click', function() {

                        handleBubbleClick(conversation.dbId);
                        //handleDisplayContact(conversation.room.dbId);
                        console.log("here is the conversation bubble ID", conversation.dbId);
                        // Add active class to the selected item and remove from others
                        document.querySelectorAll('.conversation-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        conversationItem.classList.add('active');
                        handleDisplayBubble(conversation.room.dbId);
                        

                    });

                    // Append the conversation item to the flipper flesh
                    flipperFlesh.appendChild(conversationItem);
                }
            });

            totalInvitations = getInvitationsCount();
            sentCounts(totalInvitations, totalMissedMessages);
        })
        .catch(function(error) {
            console.error('Error getting conversations:', error);

        });
    updateNotificationCounter();

}

function getInvitationsCount() {
    const invitations = rainbowSDK.contacts.getInvitationsReceived();
    const count = invitations.length;
    return count;
}
// Function to update notification counter
export function updateNotificationCounter() {
    const invitations = rainbowSDK.contacts.getInvitationsReceived();
    const count = invitations.length;
    var counter = document.getElementById("notificationCounter");
    counter.innerText = count;
    if (count > 0) {
        counter.classList.remove("hide");
    } else {
        counter.classList.add("hide");
    }
}


function sentCounts(invitationCount, messagesCount) {

    const URL = window.WebsiteURL;
    jQuery.ajax({
        url: URL + 'plugins/RainbowPlugin/jsp/app/LoginInfo.jsp',
        type: 'POST',
        data: {
            invitationsCountParam: invitationCount,
            messagesCountParam: messagesCount
        },
        dataType: 'text', // Change dataType to text since the response is plain text
        success: function(response) {
            // Handle success scenario
            if (response === "Success") {
                console.log("Counts Sent successfully.");
                // Perform any additional actions on success, such as redirection or updating UI elements
            } else {
                console.error("Failed to save counts.");
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });


}

function isSentByMe(conversationId) {
    // Get conversation history messages
    rainbowSDK.im.getMessagesFromConversation(conversationId, 30)
        .then(conversation => {
            var messages = conversation.messages;
            console.log("here are the messages " + messages)

        })
        .catch(error => {

            console.error('Error getting conversation history:', error);
        });

}

// function to handle the onlick of bubble conversation
function handleBubbleClick(conversationId) {
    // Get the main content element
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.error('Element with ID mainContent not found');
        return;
    }

    const myUserId = rainbowSDK.contacts.getConnectedUser().dbId;

    // Get chat box and input container
    const chatBox = document.getElementById('chatBox');
    const inputContainer = document.querySelector('.input-container');
    if (!chatBox || !inputContainer) {
        console.error('Chat box or input container not found');
        return;
    }

    // Clear previous content in the chat box
    chatBox.innerHTML = '';

    chatBox.style.display = 'block';
    inputContainer.style.display = 'flex';

    // Get conversation data
    const conversationData = rainbowSDK.conversations.getConversationById(conversationId);
    if (!conversationData) {
        console.error('Conversation data not found');
        return;
    }

    // Get conversation history messages
    rainbowSDK.im.getMessagesFromConversation(conversationData.dbId, 30)
        .then(conversation => {
            console.log("New conversation", conversation);
            const messages = conversation.messages;
            console.log("Messages:", messages);

            if (Array.isArray(messages) && messages.length > 0) {
                messages.forEach(message => {
                    console.log("Message:", message);
                    const isMe = message.from.dbId === myUserId;
                    displayMessage(message, isMe);
                });
            } else {
                console.log('No messages found for this conversation.');
            }
        })
        .catch(error => {
            console.error('Error getting conversation history:', error);
        });

    // Add event listener to send button
    
    const sendMessageBtn = document.getElementById('sendMessageBtn');
        if (!sendMessageBtn) {
            console.error('Send message button not found');
            return;
        }

        sendMessageBtn.addEventListener('click', function() {
            const messageInput = document.getElementById('messageInput');
            if (!messageInput) {
                console.error('Message input field not found');
                return;
            }
            const message = messageInput.value.trim();
            if (message !== '') {
                chatWithBubble(conversationId, message);
                messageInput.value = '';
            }
        });
}

function chatWithBubble(conversationId, message){
    
    console.log('Starting chat with contact with ID :', contactId);
    
    const conversationData = rainbowSDK.conversations.getConversationById(conversationId);
    
    rainbowSDK.sendMessageToBubble(conversationData.room,message)
    .then(message =>{
        console.log("here is ",message);
        handleBubbleClick(conversationData.dbId);
        
        
    })
    .catch(error=>{
        
        console.log("soemthing went wrong while sending a message to the bubble",error);
    })
}

// Function to handle conversation click
export function handleConversationClick(conversationId) {
    
    // Get the main content element
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.error('Element with ID mainContent not found');
        return;
    }

    const myUserId = rainbowSDK.contacts.getConnectedUser().dbId;

    // Get chat box and input container
    const chatBox = document.getElementById('chatBox');
    const inputContainer = document.querySelector('.input-container');
    if (!chatBox || !inputContainer) {
        console.error('Chat box or input container not found');
        return;
    }

    // Clear previous content in the chat box
    chatBox.innerHTML = '';

    chatBox.style.display = 'block';
    inputContainer.style.display = 'flex';

    // Get contact ID from the conversation
    const conversationData = rainbowSDK.conversations.getConversationById(conversationId);
    

    if (!conversationData) {
        console.error('Conversation data not found');
        return;
    }

    const contactId = conversationData.contact.dbId;
    
    rainbowSDK.im.getMessagesFromConversation(conversationData.dbId, 30)
        .then(conversation => {
            console.log("new conversation", conversation);
            const messages = conversation.messages;
            console.log("Messages:", messages);

            if (Array.isArray(messages) && messages.length > 0) {
                messages.forEach(message => {
                    console.log("Message:", message);
                    const isMe = message.from.dbId === myUserId;
                    displayMessage(message, isMe);
                });
            } else {
                console.log('No messages found for this conversation.');
            }
        })
        .catch(error => {
            console.error('Error getting conversation history:', error);
        });

        const sendMessageBtn = document.getElementById('sendMessageBtn');
        if (!sendMessageBtn) {
            console.error('Send message button not found');
            return;
        }

        sendMessageBtn.addEventListener('click', function() {
            const messageInput = document.getElementById('messageInput');
            if (!messageInput) {
                console.error('Message input field not found');
                return;
            }
            const message = messageInput.value.trim();
            if (message !== '') {
                chatWithContact(contactId, message);
                messageInput.value = '';
            }
        });

}
// Function to display message
function displayMessage(message, isMe) {
    const chatBox = document.getElementById('chatBox');

    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message.data;

    // Create message metadata element (sender's name and date)
    const metadataElement = document.createElement('div');
    metadataElement.classList.add('message-metadata');

    const senderName = document.createElement('span');
    senderName.classList.add('sender-name');
    senderName.textContent = isMe ? 'You' : `${message.from.firstname} ${message.from.lastname}`;

    const messageDate = document.createElement('span');
    messageDate.classList.add('message-date');
    messageDate.textContent = new Date(message.date).toLocaleString();

    metadataElement.appendChild(senderName);
    metadataElement.appendChild(messageDate);

    // Apply different styles based on sender (me or not me)
    if (isMe) {
        messageElement.classList.add('sent-message');
        messageElement.id = 'sentMessage'; // Add ID for sent message
    } else {
        messageElement.classList.add('received-message');
        messageElement.id = 'receivedMessage'; // Add ID for received message
        messageContainer.appendChild(metadataElement); // Add metadata above message for received messages
    }

    // Append message element to message container
    messageContainer.appendChild(messageElement);

    // Append message container to chat box
    chatBox.appendChild(messageContainer);
}


// Function to start a chat with the specified contact
function chatWithContact(contactId, message) {
    console.log('Starting chat with contact with ID :', contactId);

    rainbowSDK.contacts.getContactById(contactId)
        .then(function(selectedContact) {
            console.log('the contact found:', selectedContact);
            if (selectedContact) {
                // Contact found, do something with it
                var associatedConversation = null;
                rainbowSDK.conversations.getConversationByContactId(selectedContact.dbId)
                    .then(function(conversation) {
                        associatedConversation = conversation;
                        var lastMessage = associatedConversation.lastMessageText;
                        console.log('Last message:', lastMessage);
                        // Send an answer
                        rainbowSDK.im.sendMessageToConversation(associatedConversation.dbId, message)
                        // Reload conversation after sending message
                        handleConversationClick(associatedConversation.dbId);
                    })
                    .catch(function(err) {
                        console.log('Error getting the associated conversation:', err);
                        reject(err); // Reject the promise if there's an error getting the conversation
                    });
            } else {
                console.log('Contact not found');
                reject(new Error('Contact not found')); // Reject the promise if the contact is not found
            }
        })
        .catch(function(err) {
            console.log('Error getting contact by ID:', err);
            reject(err); // Reject the promise if there's an error getting the contact by ID
        });
}


let onNewMessageReceived = function(event) {
    let message = event.detail.message;
    let conversation = event.detail.conversation;
    console.log('the conversation', conversation);
    console.log('You just recieved this Message :', message.data)

    if (conversation.type === 0) {

        rainbowSDK.contacts.getContactById(conversation.contact.dbId)
            .then(contact => {

                console.log('the conversation id', conversation);
                var contactName = contact.firstname + ' ' + contact.lastname;
                var contactAvatar = contact.avatar;
                //var name=contact.name;

                // Create the conversation item
                var conversationItem = document.createElement('div');
                conversationItem.classList.add('conversation-item');
                // Create the avatar element
                var avatarImg = document.createElement('img');
                avatarImg.classList.add('contact-avatar');

                avatarImg.src = contactAvatar;
                avatarImg.alt = contactName;

                // Create the avatar element
                var avatarImg = document.createElement('img');
                avatarImg.classList.add('contact-avatar');
                avatarImg.alt = contactName;

                if (contactAvatar) {
                    // If avatar exists, use it
                    avatarImg.src = contactAvatar.src;
                } else {
                    // If avatar is null, use first letter of the name
                    var initials = contactName.split(' ').map(part => part.charAt(0)).join('');
                    avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
                }

                // Create the name element
                var nameSpan = document.createElement('span');
                nameSpan.classList.add('contact-name');
                nameSpan.textContent = contactName;

                // Append avatar and name to the conversation item
                conversationItem.appendChild(avatarImg);
                conversationItem.appendChild(nameSpan);

                // Make the conversation item clickable
                conversationItem.addEventListener('click', function() {
                    
                    var contactId = contact.dbId;
                    handleConversationClick(conversation.dbId);
                    // Send a read receipt on a message received
                    rainbowSDK.im.markMessageFromConversationAsRead(conversation.dbId, message.id);
                    handleDisplayContact(contactId);

                });

                // Append the conversation item to the flipper flesh
                flipperFlesh.appendChild(conversationItem);
            })
            .catch(err => {
                console.log('[Hello World] :: Something went wrong while getting the contactById..', err)
            });

    }

    // Do something with the new message received
};

document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived)


let onNewMessageReceiptReceived = function(event) {
    let message = event.detail.message;
    let conversation = event.detail.conversation;
    let type = event.detail.type;

    switch (type) {
        case "server":
            // Do something when Rainbow receives your message


            break;
        case "received":
            // Do something when the recipient application receives your message

            break;
        case "read":
            // Do something when the recipient application or the recipient user reads your message

            break;
        default:
            break;
    }
};

document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMRECEIPTRECEIVED, onNewMessageReceiptReceived)


function handleDisplayContact(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.style.display = 'flex';



    // Initially display the profile section
    displayProfile(contactId);

    // Set up event listeners for section icons
    document.getElementById('profileSection').addEventListener('click', () => {
        setActiveSection('profileSection');
        displayProfile(contactId);
    });
    document.getElementById('callsSection').addEventListener('click', () => {
        setActiveSection('callsSection');
        displayCalls(contactId);
    });
    document.getElementById('filesSection').addEventListener('click', () => {
        setActiveSection('filesSection');
        displayFiles(contactId);
    });
}

// Function to set the active section
function setActiveSection(sectionId) {
    const sections = document.querySelectorAll('.user-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Function to display profile content
function displayProfile(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = '';

    rainbowSDK.contacts.getContactById(contactId)
        .then(contact => {
            const avatar = document.createElement('img');
            avatar.src = contact.avatar.src || ''; // Use contact avatar if available, otherwise empty string
            avatar.alt = 'Contact Avatar';
            avatar.classList.add('contact-detail-avatar');
            detailContact.appendChild(avatar);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('contact-buttons');

            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = 'Favorite';
            favoriteButton.classList.add('favorite-button');
            favoriteButton.addEventListener('click', () => {
                Favorite(contact.dbId, 'user');
            });
            buttonsDiv.appendChild(favoriteButton);

            const inviteButton = document.createElement('button');
            inviteButton.textContent = 'Invite';
            inviteButton.classList.add('invite-button');
            inviteButton.addEventListener('click', () => {
                inviteContact(contact.dbId);
            });
            buttonsDiv.appendChild(inviteButton);

            detailContact.appendChild(buttonsDiv);

            const nameCompanyDiv = document.createElement('div');
            nameCompanyDiv.classList.add('name-company-container');

            const fullName = document.createElement('h2');
            fullName.textContent = `${contact.firstname} ${contact.lastname}`;
            fullName.classList.add('contact-display-name');
            nameCompanyDiv.appendChild(fullName);

            const organizerCompany = document.createElement('div');
            organizerCompany.textContent = contact.company.filterName; // Adjust according to available data
            organizerCompany.classList.add('contact-company');
            nameCompanyDiv.appendChild(organizerCompany);

            detailContact.appendChild(nameCompanyDiv);

            const contactInfoDiv = document.createElement('div');
            contactInfoDiv.classList.add('contact-information');

            const infoTitle = document.createElement('h3');
            infoTitle.textContent = 'Contact Information';
            contactInfoDiv.appendChild(infoTitle);

            const emailDiv = document.createElement('div');
            emailDiv.classList.add('contact-info-item');
            const emailIcon = document.createElement('i');
            emailIcon.classList.add('fas', 'fa-envelope');
            const emailLabel = document.createElement('span');
            emailLabel.textContent = ' Work Email:';
            emailLabel.classList.add('info-label');
            const emailValue = document.createElement('span');
            emailValue.textContent = contact.loginEmail || '';
            emailDiv.appendChild(emailIcon);
            emailDiv.appendChild(emailLabel);
            emailDiv.appendChild(emailValue);
            contactInfoDiv.appendChild(emailDiv);

            const locationDiv = document.createElement('div');
            locationDiv.classList.add('contact-info-item');
            const locationIcon = document.createElement('i');
            locationIcon.classList.add('fas', 'fa-map-marker-alt');
            const locationLabel = document.createElement('span');
            locationLabel.textContent = ' Country:';
            locationLabel.classList.add('info-label');
            const locationValue = document.createElement('span');
            locationValue.textContent = contact.country || 'N/A';
            locationDiv.appendChild(locationIcon);
            locationDiv.appendChild(locationLabel);
            locationDiv.appendChild(locationValue);
            contactInfoDiv.appendChild(locationDiv);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from Network';
            removeButton.classList.add('remove-from-network-button');
            removeButton.addEventListener('click', () => {
                removeFromNetwork(contact.dbId);
            });
            contactInfoDiv.appendChild(removeButton);

            detailContact.appendChild(contactInfoDiv);
            detailContact.style.display = 'block';
        })
        .catch(err => {
            console.error('Error getting contact info:', err);
        });
}

// Function to display calls content
function displayCalls(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = ''; // Clear previous content

    // Create and append content related to calls
    const callsDiv = document.createElement('div');
    callsDiv.classList.add('section-content');
    callsDiv.textContent = `Displaying calls for contact ID: ${contactId}`;
    detailContact.appendChild(callsDiv);
}

// Function to display files content
function displayFiles(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = ''; // Clear previous content

    // Create and append content related to files
    const filesDiv = document.createElement('div');
    filesDiv.classList.add('section-content');
    filesDiv.textContent = `Displaying files for contact ID: ${contactId}`;
    detailContact.appendChild(filesDiv);
}

// Function to handle the onclick of bubble conversation
function handleDisplayBubble(conversationId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.style.display = 'flex';

    // Get conversation data
    const conversationData = rainbowSDK.conversations.getConversationById(conversationId);
    console.log("Here is the room", conversationData.room);

    // Initially display the profile section
    displayRoomProfile(conversationData);

    // Set up event listeners for section icons
    document.getElementById('profileSection').addEventListener('click', () => {
        setActiveSection('profileSection');
        displayRoomProfile(conversationData.room);
    });
    document.getElementById('callsSection').addEventListener('click', () => {
        setActiveSection('callsSection');
        displayRoomCalls(conversationData.room);
    });
    document.getElementById('filesSection').addEventListener('click', () => {
        setActiveSection('filesSection');
        displayRoomFiles(conversationData.room);
    });
}

// Function to display profile content
function displayRoomProfile(conversationData) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = '';

    // Room avatar
    const roomAvatar = document.createElement('img');
    roomAvatar.classList.add('room-avatar');

    // Set the avatar source
    if (conversationData.room.avatar) {
        roomAvatar.src = conversationData.room.avatar;
    } else {
        // If no avatar, use the first letter of the room name as initials
        const initials = conversationData.room.name.charAt(0).toUpperCase();
        roomAvatar.src = `https://ui-avatars.com/api/?name=${initials}`;
    }
    detailContact.appendChild(roomAvatar);

    // Organizers
    if (conversationData.room.organizers && conversationData.room.organizers.length > 0) {
        const organizersTitle = document.createElement('h4');
        organizersTitle.textContent = 'ORGANIZER';
        organizersTitle.classList.add('section-title');
        detailContact.appendChild(organizersTitle);

        conversationData.room.organizers.forEach(org => {
            const organizer = org.contact;

            const organizerDiv = document.createElement('div');
            organizerDiv.classList.add('contact-item');

            // Create the avatar container
            const avatarContainer = document.createElement('div');
            avatarContainer.classList.add('avatar-container');

            // Create the avatar element
            const avatarImg = document.createElement('img');
            avatarImg.classList.add('contact-members-avatar');
            avatarImg.alt = organizer.name;

            if (organizer.avatarSrc) {
                avatarImg.src = organizer.avatarSrc;
            } else {
                avatarImg.src = organizer.initials;
            }

            // Create the status icon element
            const statusIcon = document.createElement('i');
            statusIcon.classList.add('status-icon');

            // Check the contact status and add the appropriate icon
            switch (organizer.status) {
                case 'online':
                    statusIcon.classList.add('fas', 'fa-check-circle', 'online');
                    break;
                case 'unknown':
                    statusIcon.classList.add('fas', 'fa-moon', 'away');
                    break;
                case 'dnd':
                    statusIcon.classList.add('fas', 'fa-minus-circle', 'dnd');
                    break;
                case 'offline':
                default:
                    statusIcon.classList.add('fas', 'fa-circle', 'offline');
                    break;
            }

            // Append the avatar and status indicator to the avatar container
            avatarContainer.appendChild(avatarImg);
            avatarContainer.appendChild(statusIcon);

            organizerDiv.appendChild(avatarContainer);

            const organizerInfo = document.createElement('div');
            organizerInfo.classList.add('contact-info');

            const organizerName = document.createElement('div');
            organizerName.textContent = `${organizer.firstname} ${organizer.lastname}`;
            organizerName.classList.add('contact-display-name');
            organizerInfo.appendChild(organizerName);

            const organizerCompany = document.createElement('div');
            organizerCompany.textContent = organizer.company.filterName; // Adjust according to available data
            organizerCompany.classList.add('contact-company');
            organizerInfo.appendChild(organizerCompany);

            organizerDiv.appendChild(organizerInfo);

            // Crown icon for organizer
            const crownIcon = document.createElement('i');
            crownIcon.classList.add('fas', 'fa-crown', 'organizer-icon');
            organizerDiv.appendChild(crownIcon);

            detailContact.appendChild(organizerDiv);
        });
    }

    // Members
    if (conversationData.room.members && conversationData.room.members.length > 0) {
        const membersTitle = document.createElement('h4');
        membersTitle.textContent = `MEMBERS (${conversationData.room.members.length})`;
        membersTitle.classList.add('section-title');
        detailContact.appendChild(membersTitle);

        conversationData.room.members.forEach(ber => {
            const member = ber.contact;
            const memberDiv = document.createElement('div');
            memberDiv.classList.add('contact-item');
            
            // Create the avatar container
            const avatarContainer = document.createElement('div');
            avatarContainer.classList.add('avatar-container');

            // Create the avatar element
            const avatarImg = document.createElement('img');
            avatarImg.classList.add('contact-members-avatar');
            avatarImg.alt = member.name;

            if (member.avatarSrc) {
                avatarImg.src = member.avatarSrc;
            } else {
                var initials = '';
                if (member.firstname) {
                    initials += member.firstname.charAt(0).toUpperCase();
                }
                if (member.lastname) {
                    initials += member.lastname.charAt(0).toUpperCase();
                }

                avatarImg.src = `https://ui-avatars.com/api/?name=${initials}`;
            }
         
             avatarContainer.append(avatarImg);
             
            if(ber.status=== 'accepted'){
            
                // Create the status icon element
            const statusIcon = document.createElement('i');
            statusIcon.classList.add('status-icon');

            // Check the contact status and add the appropriate icon
            switch (member.status) {
                case 'online':
                    statusIcon.classList.add('fas', 'fa-check-circle', 'online');
                    break;
                case 'unknown':
                    statusIcon.classList.add('fas', 'fa-moon', 'away');
                    break;
                case 'dnd':
                    statusIcon.classList.add('fas', 'fa-minus-circle', 'dnd');
                    break;
                case 'offline':
                default:
                    statusIcon.classList.add('fas', 'fa-circle', 'offline');
                    break;
            }
            
            avatarContainer.appendChild(statusIcon);
            }


            memberDiv.appendChild(avatarContainer);

            const memberInfo = document.createElement('div');
            memberInfo.classList.add('contact-info');

            const memberName = document.createElement('div');
            memberName.textContent = `${member.firstname} ${member.lastname}`;
            memberName.classList.add('contact-display-name');
            memberInfo.appendChild(memberName);

            const memberCompany = document.createElement('div');
            memberCompany.textContent = member.company.filterName; // Adjust according to available data
            memberCompany.classList.add('contact-company');
            memberInfo.appendChild(memberCompany);

            memberDiv.appendChild(memberInfo);

            // Black ticking clock icon for invited members
            if (ber.status === 'invited') {
                const invitedIcon = document.createElement('i');
                invitedIcon.classList.add('fas', 'fa-clock', 'invited-icon');
                memberDiv.appendChild(invitedIcon);
            }
            detailContact.appendChild(memberDiv);
        });
    }
}


// Function to display calls content
function displayRoomCalls(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = ''; // Clear previous content

    // Create and append content related to calls
    const callsDiv = document.createElement('div');
    callsDiv.classList.add('section-content');
    callsDiv.textContent = `Displaying calls for contact ID: ${contactId}`;
    detailContact.appendChild(callsDiv);
}

// Function to display files content
function displayRoomFiles(contactId) {
    const detailContact = document.getElementById('detailContact');
    detailContact.innerHTML = ''; // Clear previous content

    // Create and append content related to files
    const filesDiv = document.createElement('div');
    filesDiv.classList.add('section-content');
    filesDiv.textContent = `Displaying files for contact ID: ${contactId}`;
    detailContact.appendChild(filesDiv);
}

