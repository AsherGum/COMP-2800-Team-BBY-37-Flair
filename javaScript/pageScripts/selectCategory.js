

function parseCategorySearch() {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("?");
    let searchQueries = queries[1].split(":")
    searchQueries.shift();
    return searchQueries;
}


//query database for data from the search

function searchChallenges(queries) {
    database.collection("Challenges").where("challengeCategory", "==", queries)
    .get()
    .then(function(snapShot) {
        snapShot.forEach((doc) => {
            
            /**
             * relevant fields:
             * doc.challenge
             * doc.description
             * doc.imageURL
                doc.upvotes
             * doc.views

             */
            createVideoCard(doc.data().challenge, doc.data().description, 
                doc.data().imageURL, doc.data().upvotes, doc.data().views, doc.id);

        });



    })

    
}


//create cards based on data
function createVideoCard(challengeTitle, challengeDescription, 
    imageURL, upvotes, views, documentID) {

        //STILL NEED TO HANDLE UPVOTES AND VIEWS

        //Card Parent Element
        const parentElement = document.createElement("div");
        parentElement.classList.add("col-md-6");
        parentElement.classList.add("col-lg-3");
        document.getElementById("card_insertion").appendChild(parentElement);

        //Card Div Element attached to parent element
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        parentElement.appendChild(cardElement);

        //Image attached to card
        const image = document.createElement("img");
        image.classList.add("card-img-top");
        image.src = imageURL;
        cardElement.appendChild(image);

        //Card Body div attached to card
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardElement.appendChild(cardBody);

        //Card Title h4 attached to cardBody
        const cardTitle = document.createElement("h4");
        cardTitle.classList.add("card-title");
        cardTitle.innerHTML = challengeTitle;
        cardBody.appendChild(cardTitle);

        //Card Description p attached to cardBody
        const description = document.createElement("p");
        description.classList.add("card-text");
        description.innerHTML = challengeDescription;
        cardBody.appendChild(description);

        //Link a element attached to cardBody
        const anchor = document.createElement("a");
        anchor.classList.add("btn");
        anchor.classList.add("btn-outline-warning");
        anchor.innerHTML = "View Challenge";
        anchor.href = "./viewVideo.html?view:" + documentID;
        cardBody.appendChild(anchor);


}
