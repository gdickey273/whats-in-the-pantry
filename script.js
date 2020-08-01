var ingredients = prompt(); // When input grab is available change query to input
var queryURL = "https://api.edamam.com/search?q="

function updatePage(recipeData) {
  console.log("-----------------------------------")
  console.log(recipeData);
  console.log("-----------------------------------")
  
    for (var i = 0; i < 10; i++) {
      var recipe = recipeData.hits[i];
      console.log(recipe);

      var recipeDiv = $("<div>")
      recipeDiv.addClass("recipe-card")
      recipeDiv.appendTo("body");

      // Recipe Name
      var recipeName = recipeData.hits[i].recipe.label;
      console.log(recipeName);
      var name = $("<p>")
      name.html(recipeName);
      name.appendTo(recipeDiv);       

      // Recipe Calories
      var recipeCalories = recipeData.hits[i].recipe.calories;
      console.log(recipeCalories);
      var calories = $("<p>")
      calories.html(Math.round(recipeCalories));
      calories.appendTo(recipeDiv);

      // Recipe Health Labels i.e Alcohol Free, Gluten Free
      var recipeHealthLabels = recipeData.hits[i].recipe.healthLabels;
      console.log(recipeHealthLabels);
      var health = $("<p>")
      health.html([recipeHealthLabels]);
      health.appendTo(recipeDiv);
      
      // Recipe Image
      var recipeImage = recipeData.hits[i].recipe.image;
      var img = $("<img>")
      img.attr("src", recipeImage);
      img.appendTo(recipeDiv);
  
  }
}

queryURL = "https://api.edamam.com/search?q=" + ingredients + "&app_id=5af58a3f&app_key=b16b5ae107b9c5c0a2d30d43d00f64b7";
$.ajax({
  url: queryURL,
  method: "GET"
}).then(updatePage);