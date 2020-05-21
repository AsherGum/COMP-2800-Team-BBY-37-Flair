// Initializes the post.
var storage = firebase.storage();
console.log("Getting Posts");

var getPosts = database.collection("Challenges");
 //Start loading circle
loading("loading_insertion", true);

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
                      post.id, post.data().owner, post.data().upvotes, 0);
      }
  })
  //End loading circle
  loading("loading_insertion", false);
});

function getPost(category, div){
    getPosts.orderBy("upvotes", "desc").limit(10).where("challengeCategory", "==", category).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (post) {
            // Make sure post exists.
            console.log(post.id, " => ", post.data());
            if (post) {
                console.log("post found");
                // Create the post.
                createPost(post.data().challenge,
                            post.data().imageURL,
                            post.data().videoURL,
                            post.id, post.data().owner, post.data().upvotes, div);
            }
        })
    });
}



function createPost(title, imageURL, videoURL, id, owner, likesCount, cat) {

    var content = document.getElementsByClassName("content")[cat];
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
  
getPost("comedy", 1);
getPost("physical", 2);
getPost("games", 3);
getPost("pets", 4);
getPost("edu", 5);
getPost("talent", 6);
getPost("arts", 7);
getPost("other", 8);