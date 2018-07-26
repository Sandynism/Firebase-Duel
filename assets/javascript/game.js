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

// Links to Firebase Database.
let database = firebase.database()
let connectionsRef = database.ref('/connections')
let connectedRef = database.ref('.info/connected')
let playersRef = database.ref('/playersRef')
let turnRef = database.ref('/turn')
let chatRef = database.ref('/chat')


// function onlineStatus() 
//Listening for players.
connectedRef.on("value", function (snapshot) {
    if (snapshot.val()) {
        let connection = connectionsRef.push(true)
        connection.onDisconnect().remove()
       
        if ($.isEmptyObject(player) && $.isEmptyObject(otherPlayer)) {
            player.id = connection.key 
            playerInfo(player)
        } else if ($.isEmptyObject(otherPlayer)) {
            otherPlayer.id = connection.key
            playerInfo(otherPlayer)
        }
        //need disconnect value
    }
})
// Add ourselves to presence list when online.
connectionsRef.on("value", function (snapshot) {
    $("#connected-viewers").text(snapshot.numChildren())
})

// let playerInfo = () => 
//     name = $("#player-name").val().trim()

//On submit-name, the player's name is pushed into database.
$("#submit-name").on('click', function () {
    event.preventDefault()
    name = $("#player-name").val()
    // let player = playerInfo() ??
    // database.ref().push({
    //     name: name,
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP
    // })
})


let playerInfo = (currPlayer) => { 
    $("#submit-name").on('click', function () {
        event.preventDefault()
        if ($("#player-name").val()) {
            currPlayer.name = $("#player-name").val().trim()
            gameDisplay()
        }
    })
}

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

