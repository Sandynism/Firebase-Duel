//Document ready.
$(function() { 

let config = {
    apiKey: "AIzaSyBoLOrRydq3VrF-i3YZlR9d5ihLBWkINZY",
    authDomain: "learn-firebase-3883f.firebaseapp.com",
    databaseURL: "https://learn-firebase-3883f.firebaseio.com",
    projectId: "learn-firebase-3883f",
    storageBucket: "learn-firebase-3883f.appspot.com",
    messagingSenderId: "662713414287"
}
firebase.initializeApp(config);

//Game variables.
let player = {}
let otherPlayer = {}
let p1wins
let p2wins
let p1losses
let p2losses 
let ties
let choices = ['rock', 'paper', 'scissor']
let currentPlayer = ""

// Links to Firebase Database.
let database = firebase.database()
let connectionsRef = database.ref('/connections')
let connectedRef = database.ref('.info/connected')
let playersRef = database.ref('/players')
let turnRef = database.ref('/turn')
let chatRef = database.ref('/chat')


// function onlineStatus() 
//Listening for players.
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


//On submit-name, the player's name is pushed into database.
$("#submit-name").on('click', function () {
    event.preventDefault()
    let name = $("#player-name").val()

    playersRef.once('value', snapshot => {
        if (!snapshot.child('player1').exists()) {
            currentPlayer = 'player1'
            playersRef.child('player1').set({
                name: name
            })
        } else if (snapshot.child('player1').exists() && !snapshot.child('player2').exists()) {
            currentPlayer = 'player2'
            playersRef.child('player2').set({
                name: name
            })
        }
        playersRef.child(currentPlayer).onDisconnect().remove()

    })

    gameDisplay()
})


function gameDisplay() {
    $(".welcome-screen").addClass("hide")
    $(".footer").addClass("hide")
    $(".game-directions").removeClass("hide")
    $(".game-page").removeClass("hide")
}

}) //end of page

// let ref = firebase.database().ref()

// ref.on("value", function (snapshot) {
//     output.innerHTML = JSON.stringify(snapshot.val(), null, 2)
// })

// Removes players when disconnected.
// turnRef.onDisconnect().remove();
// chatRef.onDisconnect().remove();

// Loads chat messages history and listens for upcoming ones. (Taken from Firebase)
// function loadMessages() {
//     // Loads the last 12 messages and listen for new ones.
//     let callback = function(snapshot) {
//       let data = snapshot.val()
//       displayMessage(snapshot.key, data.name, data.text)
//     };
  
//     firebase.database().ref('/messages/').limitToLast(12).on('child_added', callback);
//     firebase.database().ref('/messages/').limitToLast(12).on('child_changed', callback);
//   }

