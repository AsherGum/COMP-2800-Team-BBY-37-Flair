


/**
 * Query the database for data that matches the queries string and return those documents.
 * Create cards for those documents to display on DOM.
 * @param {string} query 
 */
function searchChallenges(query, title) {
    const queryID = query;
    const titleString = title;
    database.collection("Challenges").doc(query).collection("Responses")
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
            const imageURL = doc.data().imageURL;
            const videoURL = doc.data().videoURL;
            const userVideoID = doc.data().userVideo;
            database.collection("userVideos").doc(userVideoID).get()
            .then(function(doc) {
                createVideoCard(imageURL, videoURL, doc, queryID, titleString);
            })
        });

        if (counter === 0) {
            noVideosFound();
        }
        
        
    })
}


//create cards based on data
function createVideoCard(imageURL, videoURL, doc, query, title) {

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
        cardTitle.innerHTML = doc.data().title;
        cardBody.appendChild(cardTitle);

        //Card Description p attached to cardBody
        const description = document.createElement("p");
        description.classList.add("card-text");
        description.innerHTML = doc.data().description;
        cardBody.appendChild(description);

        //Link a element attached to cardBody
        const anchor = document.createElement("a");
        anchor.classList.add("btn");
        anchor.classList.add("btn-outline-warning");
        anchor.innerHTML = "View Challenge";
        anchor.href = "./viewVideoResponse.html?view:" + doc.id + "?" + query + "?" + title;
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
    //parseSearchURL called from general.js
    const queries = parseSearchURL();
    const queryString = queries[0]
    
    const urlString = decodeURIComponent(window.location.search);
    const splitUrl = urlString.split("?");
    const titleString = splitUrl[2];
    document.getElementById("search_parameter").innerHTML = titleString;
    document.getElementById("back_button").href = "./viewVideo.html?" + queryString;

    if (queryString != undefined) {
        searchChallenges(queryString, titleString);
    }
}

pageLoad();



