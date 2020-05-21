/**
 * Queries database for challenges whose category data field
 * matches the category provided as a parameter. It then
 * sorts them based on the upvotes.
 * @param {*} category 
 * 
 * Uses code from Firebase documentation:
 * @author Firebase documentation
 * @see https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
 * 
 * 
 */
function rank(category) {
    let count = 0;
    let docRef = database.collection("Challenges");
    docRef.where("challengeCategory", "==", category).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (post) {
            count++;
        })
    }).then(function (event) {
        ranking.push([count, category]);
        ranking = bubbleSort(ranking);
    });
    return count;
}

/**
 * Sorts the array based on a bubble sort
 * algorithm.
 * 
 * @param {array} arr 
 * 
 * Code adapted from:
 * @author "That JS Dude" https://github.com/khan4019 
 * @see https://khan4019.github.io/front-end-Interview-Questions/sort.html
 * 
 */
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
            if (arr[j - 1] > arr[j]) {
                var temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

let ranking = [];
rank("comedy");
rank("physical");
rank("games");
rank("pets");
rank("edu");
rank("talent");
rank("arts");
rank("other");
