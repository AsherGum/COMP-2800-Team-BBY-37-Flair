
/**
 * This is called to first check if the user is logged in.
 * If the user is not logged in, they will be redirected to login.
 * If they are logged in, then a query is made to the database to pull and
 * populate the DOM with recent challenge videos.
 * 
 * 
 * Code used from Firebase documentation example on how to
 * check user authentication state
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/auth/web/manage-users?authuser=0
 * 
 * Code used from Firebase documentation example on how
 * to query database
 * @author Firebase Documentation
 * @see https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
 *  
 * */ 
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

  //Turn the loading circle on
  loading("content", true);

  
  /**
   *  Queries the database for challenge video data.
   */
  let getPosts = database.collection("Challenges");
  getPosts.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (challenge) {
      // Make sure challenge exists.
      if (challenge) {
        // Create the challenge videos on the DOM
        createChallengeVideo(challenge.data().challenge,
        challenge.data().imageURL,
        challenge.id, challenge.data().owner, challenge.data().upvotes);
      }
    })
    //Removes loading circle from DOM
    loading("content", false);
  });

  /**
   * On click listener for the myAccount button.
   * Redirects user to the account page
   */
  $("#myAccount").on("click", function name(event) {
    openAccountPage(user.uid);
  })
});

/**
 * Opens the page that was clicked. Saves user ID so
 * that the account page correctly populates the page
 * with their account data.
 * @param {string} id 
 */
function openAccountPage(id) {
  localStorage.setItem("globalUser", id);
  window.location.href = "../html/account.html";
}


// Main container.
let content = document.getElementsByClassName("content")[0];

/**
 * Create a challenge video DOM element with its title, image URL (picture), and unique ID (to keep track of post) as inputs.
 * Queries the database for user data to fetch correct user data,
 * then creates a clickable challenge video DOM element on the page inside
 * the container.
 * 
 * @param {string} title 
 * @param {string} imageURL 
 * @param {string} videoURL 
 * @param {string} id 
 * @param {string} owner 
 * @param {number} likesCount 
 */
function createChallengeVideo(title, imageURL, id, owner, likesCount) {
  const docUser = database.collection("Users").doc(owner);
  docUser.get().then(function (user) {

    // Create the post on the main page.
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

    let like = document.createElement('img');
    like.src = "../images/icons/like.png"
    like.id = "view";

    let likes = document.createElement("h4");
    likes.id = "likes";
    likes.innerHTML = likesCount;

    content.appendChild(vidBox);
    vidBox.appendChild(info);
    vidBox.appendChild(like);
    vidBox.appendChild(accountName);
    vidBox.appendChild(likes);
    vidBox.appendChild(img);
  });
}