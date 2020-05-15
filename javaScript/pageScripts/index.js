
// Initializes the post.
var storage = firebase.storage();
console.log("Getting Posts");

// Authentication state observer.
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

    var getPosts = database.collection("Challenges");
    // Gets the book postings. Query where() function.
    getPosts.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (post) {
            // Make sure post exists.
            console.log(post.id, " => ", post.data());
            if (post) {
                console.log("post found");
                // Create the post.
                createPost(post.data().challenge,
                            post.data().imageURL,
                            post.data().videoURL,
                            post.id, post.data().owner, post.data().upvotes);
            }
        })
    });




    //Going to my account page
    $("#myAccount").on("click", function name(event) {
        openAccountPage(user.uid);
    })
});


// Opens the page that was clicked. carries user ID
function openAccountPage(id) {
    localStorage.setItem("globalUser", id);
    window.location.href = "./html/account.html";
}


// Body.
var body = document.getElementsByTagName("body");

// Main container.
var content = document.getElementsByClassName("content")[0];

//Create a book posting with its title, price, image URL (picture), and unique ID (to keep track of book post) as inputs
function createPost(title, imageURL, videoURL, id, owner, likesCount) {

  var docUser = database.collection("Users").doc(owner);
  docUser.get().then(function (user) {

  // Create the post on the main page.
    var vidBox = document.createElement("div");
    vidBox.className = "card";

    // Getting images.
    var img = document.createElement("img");
    img.src = imageURL;
    img.id = id;
    img.onclick = function() {
      window.location.href = "./html/viewVideo.html?view:" + id;
    }
 
    var info = document.createElement("p");
    info.innerHTML = title;

    var accountName = document.createElement("p");
    accountName.id = "accountName";
    accountName.innerHTML = '@' + user.data().UserName;

    var eye = document.createElement('img');
    eye.src = "./images/icons/like.png"
    eye.id = "view";

    var likes = document.createElement("h4");
    likes.id = "likes";
    likes.innerHTML = likesCount;



    content.appendChild(vidBox);
    vidBox.appendChild(info);
    vidBox.appendChild(eye);
    vidBox.appendChild(accountName);
    vidBox.appendChild(likes);
    vidBox.appendChild(img);
    
  });

    

}

/* Changed it so that the link is created when the card is created,
so this code is depreciated.

Changed it because the code was causing our Flair icon to link
to an empty video.



// Clicker for opening the description post.
$("body").unbind().on("click", 'img', function (event) {
    event.preventDefault();
    console.log(event);
    openPage(event.target.id);

});

// Opens description the post that was clicked.
function openPage(id) {
    localStorage.setItem("postID", id);
    window.location.href = "./html/viewVideo.html?view:" + id;
}
*/