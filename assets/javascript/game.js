let config = {
    apiKey: "AIzaSyBoLOrRydq3VrF-i3YZlR9d5ihLBWkINZY",
    authDomain: "learn-firebase-3883f.firebaseapp.com",
    databaseURL: "https://learn-firebase-3883f.firebaseio.com",
    projectId: "learn-firebase-3883f",
    storageBucket: "learn-firebase-3883f.appspot.com",
    messagingSenderId: "662713414287"
}
firebase.initializeApp(config);

// Create a variable to reference the database.
let database = firebase.database();
// let playersRef = new Firebase('https://learn-firebase-3883f.firebaseio.com/playersRef')
// let turnRef = new Firebase('https://learn-firebase-3883f.firebaseio.com/turn')
// let chatRef = new Firebase('https://learn-firebase-3883f.firebaseio.com/chat')

// Link to Firebase Database for viewer tracking.
let connectionsRef = database.ref('/connections')
let connectedRef = database.ref('.info/connected')

connectedRef.on("value", function (snapshot) {
    if (snapshot.val()) {
        let connection = connectionsRef.push(true)
        connection.onDisconnect().remove()
    }
})

// Add ourselves to presence list when online.
connectionsRef.on("value", function (snapshot) {
    $("#connected-viewers").text(snapshot.numChildren())
})

// var ref = firebase.database().ref()

// ref.on("value", function (snapshot) {
//     output.innerHTML = JSON.stringify(snapshot.val(), null, 2)
// })

// Removes players when disconnected.
// turnRef.onDisconnect().remove();
// chatRef.onDisconnect().remove();


// Chat object
// let chat = {
//     message: '',
//     listeners: function () {
//         // Send button click
//         $('#send-message').on('click', function (event) {
//             chat.getMessage();
//             return false;
//         });
//         // Show message when received
//         chatRef.on('child_added', function (childSnapshot) {
//             // Get name and message
//             let playerName = childSnapshot.val().name;
//             let message = childSnapshot.val().message;
//             // Show message
//             chat.showMessage(playerName, message);
//         });
//     },
//     getMessage: function () {
//         var input = $('#message-input');
//         // Get message then clear it
//         chat.message = input.val();
//         input.val('');
//         // Send data to database if player has name
//         if (player !== undefined) {
//             chat.sendMessage();
//         }
//     },
//     sendMessage: function () {
//         let obj = {};
//         obj['name'] = name[player];
//         obj['message'] = chat.message;
//         chatRef.push(obj);
//     },
//     sendDisconnect: function (key) {
//         let obj = {};
//         obj['name'] = name[key];
//         obj['message'] = ' has disconnected.';
//         chatRef.push(obj);
//     },
//     showMessage: function (playerName, message) {
//         // Auto scroll to bottom variables
//         let messages = document.getElementById('messages');
//         let isScrolledToBottom = messages.scrollHeight - messages.clientHeight <= messages.scrollTop + 1;
//         // Create p with display string
//         let $p = $('<p>');
//         if (message == ' has disconnected.' && player !== undefined) {
//             $p.text(playerName + message);
//             $p.css('background', 'gray');
//         } else if (player !== undefined) {
//             $p.text(playerName + ': ' + message);
//         }
//         // If player 1 -> blue text
//         if (name[1] == playerName) {
//             $p.css('color', 'green');
//             // If player 2 -> red text
//         } else if (name[2] == playerName) {
//             $p.css('color', 'purple');
//         }
//         // Append message
//         if ($p.text() !== '') {
//             $('#messages').append($p);
//         }
//         // Auto scroll to bottom
//         if (isScrolledToBottom) {
//             messages.scrollTop = messages.scrollHeight - messages.clientHeight;;
//         }
//     }
// }

// // Start chat
// chat.listeners();
