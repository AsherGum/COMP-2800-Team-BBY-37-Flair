
/**
 * Authentication state observer.
 * Code used from Firebase documentation example on how to
 * check user authentication state
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/manage-users?authuser=0
 * 
 * 
 * This code is used to check if the user has verified their email
 * with the email authentication, and adds that as a field of data
 * to their document in the database.
 */
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    console.log("user is logged in");

    // Check if user if verified.
    if (user.emailVerified === true) {
      // if verified, set users verification to true.
      database.collection("Users").doc(user.uid).update({
        isVerified: true,
      }).then(function () {
        console.log("user is verified");

      }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating Profile");
        console.error("Error updating Profile", error);
      });
    }
  } else {
    // User is signed out.
    console.log("user is logged out");
    // Go to login page
    window.location.href = "../html/login.html";
  }
});