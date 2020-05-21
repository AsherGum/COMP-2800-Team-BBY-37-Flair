//Start loading circle
loading("loading_insertion", true);

/**
 * Queries the database for challenge video data and
 * orders them based on upvotes. Fetches the top 10 and then
 * creates clickable DOM elements for those top 10 challenge videos.
 * 
 * This is used to load the top 10 videos of the week.
 * 
 * Uses code from Firebase Documentation:
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0
 */
let getChallenges = database.collection("Challenges");
getChallenges.orderBy("upvotes", "desc").limit(10).get().then(function (querySnapshot) {
  querySnapshot.forEach(function (challenge) {
    // Make sure challenge exists.
    if (challenge) {
      // Create the challenge on the page.
      createChallenge(challenge.data().challenge,
        challenge.data().imageURL,
        challenge.id, challenge.data().owner, 0);
    }
  })
  //End loading circle
  loading("loading_insertion", false);
});

/**
 * Queries the database for challenge video data and
 * orders them based on upvotes. Fetches the top 10 and then
 * creates clickable DOM elements for those top 10 challenge videos.
 * 
 * This is used to load the top 10 videos of each category
 * 
 * Uses code from Firebase Documentation:
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0
 */
function getChallenge(category, div) {
  getChallenges.orderBy("upvotes", "desc").limit(10).where("challengeCategory", "==", category).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (challenge) {
      // Make sure challenge exists on the page.
      if (challenge) {
        // Create the challenge on the page.
        createChallenge(challenge.data().challenge,
        challenge.data().imageURL,
        challenge.id, challenge.data().owner, div);
      }
    })
  });
}


/**
 * Populates the DOM with the clickable challenge
 * video element. Each element shows the image of the
 * challenge, the title of the challenge, and who uploaded
 * the video.
 * 
 * @param {string} title 
 * @param {string} imageURL 
 * @param {string} id 
 * @param {string} owner 
 * @param {number} cat 
 *                the category on the page.
 */
function createChallenge(title, imageURL, id, owner, cat) {
  let content = document.getElementsByClassName("content")[cat];
  let docUser = database.collection("Users").doc(owner);
  docUser.get().then(function (user) {

    // Create the challenge video on the main page.
    let vidBox = document.createElement("div");
    vidBox.className = "card";

    // Getting images.
    let img = document.createElement("img");
    img.src = imageURL;
    img.id = id;
    img.onclick = function () {
      window.location.href = "../html/viewVideo.html?view:" + id;
    }

    let info = document.createElement("p");
    info.innerHTML = title;

    let accountName = document.createElement("p");
    accountName.id = "accountName";
    accountName.innerHTML = '@' + user.data().UserName;

    content.appendChild(vidBox);
    vidBox.appendChild(info);
    vidBox.appendChild(accountName);
    vidBox.appendChild(img);

  });
}

getChallenge("comedy", 1);
getChallenge("physical", 2);
getChallenge("games", 3);
getChallenge("pets", 4);
getChallenge("edu", 5);
getChallenge("talent", 6);
getChallenge("arts", 7);
getChallenge("other", 8);