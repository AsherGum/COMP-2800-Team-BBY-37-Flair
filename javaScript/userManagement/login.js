/**
 * Checks if user is logged in and checks if there
 * is redirect information in the URL. 
 * 
 * Code used: 
 * 
 * Firebase documentation example on how to
 * check user authentication state:
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/manage-users?authuser=0
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log("user is logged in");

      // Go to main Page.
      window.location.href = "../html/main.html";

    } else {
      // User is signed out.
      console.log("user is logged out");
      // Do nothing
      
    }
});


/**
 * Logs the user in when they click the submit button after filling in their
 * information.
 * 
 * Code used: 
 * 
 * Firebase documentation example on how to
 * sign in with email and password.
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/firebaseui?authuser=0#email_address_and_password
 */
$("#submit").closest('form').on('submit', function(event) {
    event.preventDefault();

    // Get inputs.
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    // Sign in user.
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // Alert shown if incorrect password or if email is not registered with us.
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert("Email is not registered with us");
      }
      console.log(error);
    });
    

});