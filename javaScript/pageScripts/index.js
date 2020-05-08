
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

    // User is found now get Posts from their Uni.
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
                            post.id);
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
function createPost(title, imageURL, videoURL, id) {
    var vidBox = document.createElement("div");
    vidBox.className = "card";

    // Getting images.
    
    var img = document.createElement("img");
    img.src = imageURL;
    img.id = id;

    var info = document.createElement("p");
    info.innerHTML = title;


    content.appendChild(vidBox);
    vidBox.appendChild(info);
    vidBox.appendChild(img);
    

}

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