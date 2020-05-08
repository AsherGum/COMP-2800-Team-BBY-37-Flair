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

