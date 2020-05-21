/**
 * Checks if user is logged in and redirects the user
 * to main if they're logged in.
 * 
 * Code used: 
 * 
 * Firebase documentation example on how to
 * check user authentication state:
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/manage-users?authuser=0
 */
firebase.auth().onAuthStateChanged(function (user) {
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
$("#submit").closest('form').on('submit', function (event) {
  event.preventDefault();

  // Get inputs.
  let userEmail = document.getElementById("email").value;
  let userPassword = document.getElementById("password").value;

  // Sign in user.
  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // Alert shown if incorrect password or if email is not registered with us.
    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert("Email is not registered with us");
    }
    console.log(error);
  });


});