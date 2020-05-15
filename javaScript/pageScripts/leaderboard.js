// Initializes the post.
var storage = firebase.storage();
console.log("Getting Posts");

var getPosts = database.collection("Challenges");

getPosts.orderBy("upvotes", "desc").limit(10).get().then(function (querySnapshot) {
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


function createPost(title, imageURL, videoURL, id, owner, likesCount) {

    var content = document.getElementsByClassName("content")[0];
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
        window.location.href = "../html/viewVideo.html?view:" + id;
      }
   
      var info = document.createElement("p");
      info.innerHTML = title;
  
      var accountName = document.createElement("p");
      accountName.id = "accountName";
      accountName.innerHTML = '@' + user.data().UserName;
  
      content.appendChild(vidBox);
      vidBox.appendChild(info);
      vidBox.appendChild(accountName);
      vidBox.appendChild(img);
      
    });
  
      
  
  }