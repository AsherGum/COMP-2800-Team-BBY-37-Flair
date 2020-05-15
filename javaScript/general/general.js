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