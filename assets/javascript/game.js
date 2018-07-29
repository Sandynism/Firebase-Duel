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
let p1wins = 0
let p2wins = 0
let p1losses = 0
let p2losses = 0
let ties
let currentPlayer = ""

// Links to Firebase Database.
let database = firebase.database()
let connectionsRef = database.ref('/connections')
let connectedRef = database.ref('.info/connected')
let playersRef = database.ref('/players')
let turnRef = database.ref('/turn')
let chatRef = database.ref('/chat')

function gameDisplay() {
    $(".welcome-screen").addClass("hide")
    $(".footer").addClass("hide")
    $(".game-directions").removeClass("hide")
    $(".game-page").removeClass("hide")
    console.log(currentPlayer)
}

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
            $('#player1').text(name)

            playersRef.child('player1').set({
                name: name,
                move: ""
            })
        } else if (snapshot.child('player1').exists() && !snapshot.child('player2').exists()) {
            currentPlayer = 'player2'
            $('#player2').text(name)

            playersRef.child('player2').set({
                name: name,
                move: ""
            })
        }
        playersRef.child(currentPlayer).onDisconnect().remove()
        gameDisplay()

    })
})

// Checks to see if player is added, adds to current players page.
database.ref().on('value', snapshot => {
    if (!snapshot.val().players) return
    let player1 = snapshot.val().players.player1
    let player2 = snapshot.val().players.player2

    if (currentPlayer === 'player1') {
        $('.choices2').hide()
        $('.fake-choices1').hide()
    } else if (currentPlayer === 'player2') {
        $('.choices1').hide()
        $('.fake-choices2').hide()
    }

    if (player1) {
        $('#player1').text(player1.name)
    }  
    
    if (player2) {
        $('#player2').text(player2.name)
    }
    
    // If player1 and player2 made their moves, revert their moves back to empty string
    if (player1.move && player2.move) {
        console.log('Player1 chose', player1.move)
        console.log('Player2 chose', player2.move)
        let p1 = `<h3>${player1.name} chose ${player1.move.toLowerCase()}</h3>`
        let p2 = `<h3>${player2.name} chose ${player2.move.toLowerCase()}</h3>`
        let div = $('<div>')
        div.append(p1).append(p2)
        $('.versus').html(div)

        checkWinner(player1.move, player2.move)

        playersRef.child('player1').update({
            move: ""
        }).then(() => {
            if (currentPlayer === 'player1') {
                $('.choices1').show()
            }
        })

        playersRef.child('player2').update({
            move: ""
        }).then(() => {
            if (currentPlayer === 'player2') {
                $('.choices2').show()
            }
        })

    }

})

function checkWinner(player1, player2) {
    
    if (player1 === 'Rock' && player2 === 'Paper') {
        console.log('Player2 wins!')
        player2win()
        showWinner('Paper')
    } 
    if (player1 === 'Rock' && player2 === 'Scissor') {
        console.log('Player1 wins!')
        player1win()
        showWinner('Rock')
    }
    if (player1 === 'Rock' && player2 === 'Rock') {
        console.log('IT`S A TIE!')
        tieGame()
    }
    if (player1 === 'Paper' && player2 === 'Rock') {
        console.log('Player1 wins!')
        player1win()
        showWinner('Paper')
    }
    if (player1 === 'Paper' && player2 === 'Scissor') {
        console.log('Player2 wins!')
        player2win()
        showWinner('Scissor')
    }
    if (player1 === 'Paper' && player2 === 'Paper') {
        console.log('IT`S A TIE!')
        tieGame()
    } 
    if (player1 === 'Scissor' && player2 === 'Paper') {
        console.log('Player1 wins!')
        player1win()
        showWinner('Scissor')
    }
    if (player1 === 'Scissor' && player2 === 'Rock') {
        console.log('Player2 wins!')
        player2win()
        showWinner('Rock')
    } 
    if (player1 === 'Scissor' && player2 === 'Scissor') {
        console.log('IT`S A TIE!')
        tieGame()
    } 
}

function player1win() {
    if (currentPlayer === 'player1') {
        p1wins++
        $('#wins').text(p1wins)
    } else {
        p2losses++
        $('#losses').text(p2losses)
    }  
}

function player2win() {
    if (currentPlayer === 'player2') {
        p2wins++
        $('#wins').text(p2wins)
    } else {
        p1losses++
        $('#losses').text(p1losses)
    }   
}

function tieGame() {
    let div = ('<div class="tie"><img src="assets/images/secondary/tie-game.gif"/></div>')
    $('.versusImg').html(div)
}

function showWinner(move) {
    if (move === 'Rock') {
        let div = ('<div class="rpsVersus"><img src="assets/images/secondary/rockWins.jpg"/></div>')
        $('.versusImg').html(div)
    } else if (move === 'Paper') {
        let div = ('<div class="rpsVersus"><img src="assets/images/secondary/paperWins.jpg"/></div>')
        $('.versusImg').html(div)
    } else if (move === 'Scissor') {
        let div = ('<div class="rpsVersus"><img src="assets/images/secondary/scissorWins.jpg"/></div>')
        $('.versusImg').html(div)
    }
}

// Let player1 choose their move
$('.choices1').on('click', function (event) { 
    playersRef.once('value', snapshot => {
        if(snapshot.child('player2').exists()) {
            let choice = event.target.alt
            playersRef.child('player1').update({
                move: choice
            })
        }
    })
    $('.choices1').hide()
    //add a waiting for other player message here

})
// Let player2 choose their move
$('.choices2').on('click', function (event) { 
    playersRef.once('value', snapshot => {
        if(snapshot.child('player1').exists()) {
            let choice = event.target.alt
            playersRef.child('player2').update({
                move: choice
            })
        }
    })
    $('.choices2').hide()

})




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

