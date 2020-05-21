function rank(category){
    let count = 0;
    let docRef = database.collection("Challenges");
    docRef.where("challengeCategory", "==", category).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (post) {
            count++;
        })
    }).then( function (event){
        ranking.push([count, category]);
        ranking = bubbleSort(ranking);
    });
    return count;
}
function bubbleSort(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
        if(arr[j-1] > arr[j]){
            var temp = arr[j-1];
            arr[j-1] = arr[j];
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




console.log(ranking);


 