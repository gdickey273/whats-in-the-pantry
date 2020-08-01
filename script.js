var ingredients = prompt(); // When input grab is available change query to input
var edamamQueryURL = "https://api.edamam.com/search?q="
var appId = "&app_id=5af58a3f"
var apiKey = "&app_key=b16b5ae107b9c5c0a2d30d43d00f64b7"

function edamamAjax() {
  queryURL = edamamQueryURL + ingredients + appId + apiKey;
$.ajax({
  url: queryURL,
  method: "GET"
}).then(updatePage);  
}

edamamAjax();

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

//Takes an array of Ingredient Lines (i.e. ["4 Cups of Chicken Broth", "2 Teaspoons of Salt"]) as an argument and returns an array with an Ingredient object for each Ingredient Lin.e
function parseIngredients(ingLines){
  var ingredients = [];
  for(var i = 0; i < ingLines.length; i++){
    $.ajax({
      url: "https://api.spoonacular.com/recipes/parseIngredients?ingredientList="+ ingLines[i] + "&apiKey=" + spoonacularKey,
      beforeSend: function(xhr){
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      },
      method: "POST"
    }).then(function(response){
      parseIngredientOBJ = response;
      var ingOBJ = {
        line: response[0].original,
        name: response[0].name,
        id: response[0].id,
        imgURL: "https://spoonacular.com/cdn/ingredients_100x100/" + response[0].name,
        unit: response[0].unit,
        amount: response[0].amount,
        amountCost: response[0].estimatedCost.value,
        packageCost: -1
      }
      ingredients.push(ingOBJ);
    });
  }
  return ingredients;
}