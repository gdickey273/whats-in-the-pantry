
var ingredients = "chicken,rice";



queryURL = "https://api.edamam.com/search?q=" + ingredients + "&app_id=5af58a3f&app_key=b16b5ae107b9c5c0a2d30d43d00f64b7";
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response){
  console.log(response);
});
