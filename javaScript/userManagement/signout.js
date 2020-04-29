
//Sign out button clicked, signs out of firebase authentification.
$("#submit").closest('form').on('submit', function (event) {
    event.preventDefault();
    firebase.auth().signOut();
});