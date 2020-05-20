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
 * Tied to the reset button
 * @param {string} elementId 
 */
function clearInputField(elementId) {
    let element = document.getElementById(elementId);
    element.value = "";
}



/**
 * Using the loading circle code from:
 * https://loading.io/css/
 * 
 * Creates a loading circle inside the DOM element container 
 * specified. Can turn on the loading circle (isLoading is true) or
 * turn off the loading circle when loading is complete (isLoading is false)
 * 
 * @param {DOM element ID} container 
 * @param {boolean} isLoading 
 */
function loading(container, isLoading) {
    console.log(container);
    const loadingContainer = document.getElementById(container);
    const loadingCircle = document.createElement('div');
    loadingCircle.classList.add("loading-circle");
    loadingCircle.classList.add("container");
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

