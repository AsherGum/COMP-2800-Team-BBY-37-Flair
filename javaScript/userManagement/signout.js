/**
 * Signs the user out when they click the button.
 * 
 * Code used: 
 * 
 * Firebase documentation example on how to
 * sign out.
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/manage-users?authuser=0
 */
//Sign out button clicked, signs out of firebase authentification.
$("#sign-out").closest('form').on('submit', function (event) {
    event.preventDefault();
    firebase.auth().signOut().then(function () {
        window.location.href = "./main.html"
    })
});