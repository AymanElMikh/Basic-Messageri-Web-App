import rainbowSDK from './rainbow-sdk.min.js'; // If you do not use the bundler

var associatedConversation = null;

/* Handler called when the user clicks on a contact */
export var associatedConversationFct = function associatedConversationFct(contactId) {
    var selectedContact = rainbowSDK.contacts.getContactById(contactId);
    // Contact not found locally, ask to the server
    if(!selectedContact) {
        rainbowSDK.contacts.searchContactById(contactId).then(function(contact) {
            selectedContact = contact;
        }).catch(function(err) {
            //Something when wrong with the server. Handle the trouble here
            console.log("Erros has been happened");
        });;
        return associatedConversation;
    } 

    if(selectedContact) {
        // Ok, we have the contact object
        rainbowSDK.conversations.getConversationByContactId(contactId).then(function(conversation) {
        associatedConversation = conversation;
        }).catch(function(err) {
            //Something when wrong with the server. Handle the trouble here
            console.log("Some errors must be happened");
        });
    }
    else {
        // Strange, no contact with that Id. Are you sure that the id is correct?
        console.log("The contact with the provided id is not found");
    }
    
}

export function getConversation(){
    return associatedConversation;
}