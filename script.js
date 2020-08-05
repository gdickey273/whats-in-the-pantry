var ingredients = prompt(); // When input grab is available change query to input
var edamamQueryURL = "https://api.edamam.com/search?q=";
var appId = "&app_id=595f4e2b";
var apiKey = "&app_key=d8d22c089617d4cfbff9ce15762ee548";
var spoonacularKey = "fd6475bc93094d129e4695440a886f1a";
var ingredientArray = [];

function updatePage(recipeData) {
  console.log("-----------------------------------")
  console.log(recipeData);
  console.log("-----------------------------------")
  
    for (var i = 0; i < 1; i++) {
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
  
      var ingLines = recipeData.hits[i].recipe.ingredientLines;
      
      parseIngredients(ingLines);
      
    $.when(){
      buildIngredientsList(ingredientArray);
    }
   
    
  
      
  }
}

//Takes an array of Ingredient Lines (i.e. ["4 Cups of Chicken Broth", "2 Teaspoons of Salt"]) as an argument and returns an array with an Ingredient object for each Ingredient Lin.e
function parseIngredients(ingLines){
  for(var i = 0; i < ingLines.length; i++){
    $.ajax({
      url: "https://api.spoonacular.com/recipes/parseIngredients?ingredientList="+ ingLines[i] + "&apiKey=" + spoonacularKey,
      beforeSend: function(xhr){
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      },
      method: "POST"
    }).then(function(response){
      parseIngredientOBJ = response;
      console.log("-----response-----", response);
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
       ingredientArray.push(ingOBJ);
       
    });
  }
  console.log("-----ingredients------", ingredientArray.length);
  
  
  
}

function buildIngredientsList(ingArray){

  console.log("Running build ing list!");
  var subTotal = 0;
  var ingDiv = $("<div>");
  var ingTable = $("<table>").attr("id", "ingredient-table");
  ingDiv.append(ingTable);
  ingDiv.appendTo("body");

  
  var ingTableHeadRow = $("<tr>");
  ingTableHeadRow.append($("<th>").html("Image"));
  ingTableHeadRow.append($("<th>").html("Ingredient Line"));
  ingTableHeadRow.append($("<th>").html("Cost"));
  ingTableHeadRow.append($("<th>").html("Link"));
  ingTable.append(ingTableHeadRow);

  console.log(Array.isArray(ingArray));
  console.log(ingArray.length);
  ingArray.forEach(function(ingredient){
    console.log("in the loop!")
    console.log(ingredient);
    var ingImage = $("<td>").append($("<img>").attr(ingredient.imgURL));
    var ingLine = $("<td>").append($("<p>").html(ingredient.line));
    var ingCost = $("<td>").append($("<p>").html(ingredient.amountCost));
    var ingLink = $("<td>").append($("<a>").attr("href", "https://www.amazon.com/s?k=" + ingredient.name +"&i=grocery"));

    var ingRow = $("<tr>").append(ingImage, ingLine, ingCost, ingLink);
    $("#ingredient-table").append(ingRow);

    subTotal += ingredient.amountCost;


  });

  ingDiv.append($("<h4>").html("Total Recipe Cost in Cents: " + subTotal));
}
