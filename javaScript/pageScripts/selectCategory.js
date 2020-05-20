


/**
 * Query the database for data that matches the queries string and return those documents.
 * Create cards for those documents to display on DOM.
 * @param {array} queries 
 */
function searchChallenges(queries) {
    database.collection("Challenges").where("challengeCategory", "==", queries)
    .get()
    .then(function(snapShot) {
        //counter used to check if nothing was found
        let counter = 0;
        snapShot.forEach((doc) => {
            counter++;
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

        if (counter === 0) {
            noVideosFound();
        }
        
        //Loading circle is turned off
        loading("card_insertion", false);
        
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
        cardTitle.classList.add("overflow-auto");
        cardTitle.innerHTML = challengeTitle;
        cardBody.appendChild(cardTitle);

        //Card Description p attached to cardBody
        const description = document.createElement("p");
        description.classList.add("card-text");
        description.classList.add("overflow-auto");
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

/**
 * is called when there are no videos found
 * matching the search query. Will create a no videos message
 * for the user and display it.
 */
function noVideosFound() {
    //Create a container div element to hold the message
    const container = document.createElement("div");
    container.classList.add("container");
    document.getElementById("card_insertion").appendChild(container);

    //The no videos message to display
    const noVideosMsg = document.createElement("h2");
    noVideosMsg.innerHTML = "We didn't find any videos with that search. Try a different search?";
    container.appendChild(noVideosMsg);

}

/**
 * The function to call the rest of the functions.
 * Call this function to load the cards from
 * the search
 */
function pageLoad() {
    //Loading circle is turned on
    loading("card_insertion", true);

    //parseSearchURL called from general.js
    const queries = parseSearchURL();
    const queryString = queries[0]
    document.getElementById("search_parameter").innerHTML = convertCategoryValue(queryString);

    if (queryString != undefined) {
        searchChallenges(queryString);
    }
}

pageLoad();



