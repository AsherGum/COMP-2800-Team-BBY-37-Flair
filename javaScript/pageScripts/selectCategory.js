/**
 * Query the database for data that matches the queries string and return those documents. Query string is passed in the URL and the value is extracted.
 * It then create cards containing the image of the challenge, title, and description of those documents to display on DOM
 * @param {array} queries 
 * 
 * 
 * Uses code from Firebase documentation:
 * @author Firebase documentation
 * @see https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
 * 
 */
function searchChallenges(queries) {
    database.collection("Challenges").where("challengeCategory", "==", queries)
        .get()
        .then(function (snapShot) {
            //counter used to check if nothing was found
            let counter = 0;
            snapShot.forEach((doc) => {
                counter++;
                createVideoCard(doc.data().challenge, doc.data().description,
                    doc.data().imageURL, doc.id);

            });

            if (counter === 0) {
                noVideosFound();
            }

            //Loading circle is turned off
            loading("card_insertion", false);

        })
}


/**
 * Creates the DOM element cards. Each card will
 * contain the title, description, an image to show,
 * and the challengeID to be passed onto the href link.
 * 
 * @param {string} challengeTitle 
 * @param {string} challengeDescription 
 * @param {string} imageURL 
 * @param {string} documentID 
 */
function createVideoCard(challengeTitle, challengeDescription,
    imageURL, documentID) {
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
 * Function is called when there are no videos found
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
 * The function used to call the rest of the functions.
 * Call this function to load the cards from
 * the search parameter.
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


window.onload = function() {
    pageLoad();
}
