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
let currentPlayer = ""
let p1name = ""
let p2name = "" 

// Links to Firebase Database.
let database = firebase.database()
let connectionsRef = database.ref('/connections')
let connectedRef = database.ref('.info/connected')
let playersRef = database.ref('/players')
let chatRef = database.ref('/chat')

function gameDisplay() {
    $(".welcome-screen").addClass("hide")
    $(".footer").addClass("hide")
    $(".game-directions").removeClass("hide")
    $(".game-page").removeClass("hide")
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

// Reset chat if all players leave.
playersRef.on('value', snapshot => {
    if (!snapshot.child('player1').exists() && !snapshot.child('player2').exists()) {
        chatRef.remove()
    }
})

//On submit-name, the player's name is pushed into database.
$("#submit-name").on('click', function () {
    event.preventDefault()
    let name = $("#player-name").val()

    playersRef.once('value', snapshot => {
        if (!snapshot.child('player1').exists()) {
            currentPlayer = 'player1'
            $('#player1').text(name)
            p1name = name

            playersRef.child('player1').set({
                name: name,
                move: ""
            })
        } else if (snapshot.child('player1').exists() && !snapshot.child('player2').exists()) {
            currentPlayer = 'player2'
            $('#player2').text(name)
            p2name = name

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

    if (!snapshot.val().players.player1 || !snapshot.val().players.player2) {
        if (currentPlayer === 'player1') {
            $('.fake-choices1').show()
            $('.choices2').hide()
            $('.choices1').hide()
        } else if (currentPlayer === 'player2') {
            $('.fake-choices2').show()
            $('.choices1').hide()
            $('.choices2').hide()
        }
        return
    } 

    if (currentPlayer === 'player1') {
        $('.choices2').hide()
        $('.fake-choices1').hide()
        $('.choices1').show()
    } else if (currentPlayer === 'player2') {
        $('.choices1').hide()
        $('.fake-choices2').hide()
        $('.choices2').show()
    }

    if (player1) {
        $('#player1').text(player1.name)
    }  
    
    if (player2) {
        $('#player2').text(player2.name)
    }
    
    // If player1 and player2 made their moves, revert their moves back to empty string.
    if (player1.move && player2.move) {
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
        player2win()
        showWinner('Paper')
    } else if (player1 === 'Rock' && player2 === 'Scissor') {
        player1win()
        showWinner('Rock')
    } else if (player1 === 'Paper' && player2 === 'Rock') {
        player1win()
        showWinner('Paper')
    } else if (player1 === 'Paper' && player2 === 'Scissor') {
        player2win()
        showWinner('Scissor')
    } else if (player1 === 'Scissor' && player2 === 'Paper') {
        player1win()
        showWinner('Scissor')
    } else if (player1 === 'Scissor' && player2 === 'Rock') {
        player2win()
        showWinner('Rock')
    } else if (player1 === player2) {
        tieGame()
    } 
}

function player1win() {
    if (currentPlayer === 'player1') {
        p1wins++
        $('#wins').text(p1wins)
    } else if (currentPlayer === 'player2') {
        p2losses++
        $('#losses').text(p2losses)
    }  
}

function player2win() {
    if (currentPlayer === 'player2') {
        p2wins++
        $('#wins').text(p2wins)
    } else if (currentPlayer === 'player1'){
        p1losses++
        $('#losses').text(p1losses)
    }   
}

function tieGame() {
    $('.versusImg').html('<div class="tie"><img src="assets/images/secondary/tie-game.gif"/></div>')
}

// Pick image based what winning move was.
function showWinner(move) {
    if (move === 'Rock') {
        $('.versusImg').html('<div class="rpsVersus"><img src="assets/images/secondary/rockWins.jpg"/></div>')
    } else if (move === 'Paper') {
        $('.versusImg').html('<div class="rpsVersus"><img src="assets/images/secondary/paperWins.jpg"/></div>')
    } else if (move === 'Scissor') {
        $('.versusImg').html('<div class="rpsVersus"><img src="assets/images/secondary/scissorWins.jpg"/></div>')
    }
}

// Let player1 choose their move.
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
// Let player2 choose their move.
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

function timeStamp() {
    // Create a date object with the current time
      var now = new Date()
    
    // Create an array with the current hour, minute and second
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ]
    
    // Determine AM or PM suffix based on the hour
      var suffix = ( time[0] < 12 ) ? "AM" : "PM"
    
    // Convert hour from military time
      time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12
    
    // If hour is 0, set it to 12
      time[0] = time[0] || 12
    
    // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i]
        }
      }
    
    // Return the formatted string
      return time.join(":") + " " + suffix
    }
    

//Chat functionality.
$('#send-message').on('click', function() {
    let message = $('#message-input').val()
    if (currentPlayer === 'player1') {
        chatRef.push({
            message: [p1name, timeStamp(), message]
        })
    } else if (currentPlayer === 'player2') {
        chatRef.push({
            message: [p2name, timeStamp(), message]
        })
    }

})


chatRef.on('value', snapshot => {
    $('#player-chat').empty()
    $('#message-input').val('')

    for (key in snapshot.val()) {
        let li = `<li> <b>${snapshot.val()[key].message[0].toUpperCase()}</b> ${snapshot.val()[key].message[1]}: ${snapshot.val()[key].message[2]}</li>`
        $('#player-chat').append(li)
    }
})


}) //end of page



