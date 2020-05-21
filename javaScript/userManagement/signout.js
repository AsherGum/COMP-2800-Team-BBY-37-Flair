
//Sign out button clicked, signs out of firebase authentification.
$("#sign-out").closest('form').on('submit', function (event) {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
        window.location.href = "./main.html"
    })
    
});