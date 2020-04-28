const firebaseConfig = {
    apiKey: "AIzaSyCrZxHyhpgxa_Ou80t84gkZfsFgOsPzNuI",
    authDomain: "mipee-e5ade.firebaseapp.com",
    databaseURL: "https://mipee-e5ade.firebaseio.com",
    projectId: "mipee-e5ade",
    storageBucket: "mipee-e5ade.appspot.com",
    messagingSenderId: "371760459849",
    appId: "1:371760459849:web:350366fcca4be66b2ccf98"
};

// Initialize firebase config & database.
firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();