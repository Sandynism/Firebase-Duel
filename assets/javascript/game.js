var config = {
    apiKey: "AIzaSyBoLOrRydq3VrF-i3YZlR9d5ihLBWkINZY",
    authDomain: "learn-firebase-3883f.firebaseapp.com",
    databaseURL: "https://learn-firebase-3883f.firebaseio.com",
    projectId: "learn-firebase-3883f",
    storageBucket: "learn-firebase-3883f.appspot.com",
    messagingSenderId: "662713414287"
  }
  firebase.initializeApp(config);
  
  // Create a variable to reference the database.
  var database = firebase.database();
  
  // --------------------------------------------------------------
  // Link to Firebase Database for viewer tracking
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  
  connectedRef.on("value", function(snapshot) {
    if (snapshot.val()) {
      let connection = connectionsRef.push(true)
      connection.onDisconnect().remove()
    }
  })

  // Add ourselves to presence list when online.
connectionsRef.on("value", function (snapshot) {
    $("#connected-viewersRENAME THIS").text(snapshot.numChildren())
  })