/**
 * A collection of helper functions that are useful
 * on many pages.
 */



/**
 * Will parse the URL for one search parameter. Only works
 * for the following structure of URL:
 * 
 * /html/selectCategory.html?searchCategory:will
 * 
 * Code adapted from Carly Orr's COMP1800 Lecture material from BCIT
 * @author Carly Orr
 * @see COMP1800 Projects 1, Lecture 11a Javascript Relevant Bits
 * 
 */
function parseSearchURL() {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("?");
    let searchQueries = queries[1].split(":")
    searchQueries.shift();
    return searchQueries;
}


/**
 * Returns the original long version of the 
 * category using the category value in the DB.
 * 
 * ie: 'talent' becomes 'Skills/Talents'
 * 
 * @param {string} categoryValue 
 */
function convertCategoryValue(categoryValue) {
    switch (categoryValue) {
        case "physical":
            return "Physical";
            break;
        case "talent":
            return "Skills/Talents";
            break;
        case "comedy":
            return "Comedy";
            break;
        case "games":
            return "Video Games";
            break;
        case "pets":
            return "Pets";
            break;
        case "arts":
            return "Arts and Crafts";
            break;
        case "edu":
            return "Education";
            break;
        case "other":
            return "Other";
            break;
        default:
            return categoryValue;
    }
}

/**
 * Checks if the input field is empty and colours the 
 * border red if true. Otherwise, it makes the border 
 * back to default style.
 * 
 * @param {string} elementId 
 *  The DOM element ID
 */
function checkEmptyInput(elementId) {
    let element = document.getElementById(elementId);
    element.style.borderColor = "red";

    if (element.value.trim() == "" || element.value.trim() == undefined) {
        element.style.border = "3px solid red";
    } else {
        element.style.border = "";
    }
}


/**
 * Used to clear form input forms
 * Tied to the reset button on the video upload pages
 * @param {string} elementId 
 */
function clearInputField(elementId) {
    let element = document.getElementById(elementId);
    element.value = "";
}

/**
 * Using the loading circle code from:
 * @author PlotDB Ltd.
 * @see https://loading.io/css/
 * 
 * Creates a loading circle inside the DOM element container 
 * specified. Can turn on the loading circle (isLoading is true) or
 * turn off the loading circle when loading is complete (isLoading is false)
 * 
 * @param {DOM element ID} container 
 * @param {boolean} isLoading 
 */
function loading(container, isLoading) {
    const loadingContainer = document.getElementById(container);
    const loadingCircle = document.createElement('div');
    loadingCircle.classList.add("loading-circle");
    loadingCircle.classList.add("container");

    //This div span code is from https://loadin.io/css 
    loadingCircle.innerHTML = `
    <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    `;

    //Loading is true, create the loading circle, append to container
    if (isLoading) {
        loadingContainer.appendChild(loadingCircle);
    
    //Loading is false, hide the loading circle
    } else {
        //Using querySelectorAll in case there are somehow many
        //loading circle elements on the DOM
        const circles = document.querySelectorAll(".loading-circle");
        circles.forEach(circle => {
            circle.style.display = "none";
        })

    }
}

/**
 * Gets the length of a given element (a text form or input field)
 * and writes it into the inner html of an output element. 
 * Used for the length check of text fields in uploadChallenge and
 * in uploadResponse.
 * 
 * @param {string} inputField 
 *                  the desired text field to grab the string length from
 * @param {string} outputElement 
 *                  the desired element to write the length to
 */
function getInputLength(inputField, outputElement) {
    const input = document.getElementById(inputField);
    inputLength = input.value.length;
    document.getElementById(outputElement).innerHTML = inputLength;
}

