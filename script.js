var ingredients = "butter, sugar, flour"; //localStorage.getItem("pantryList"); // When input grab is available change query to input
var edamamQueryURL = "https://api.edamam.com/search?q=";
var appId = "&app_id=595f4e2b";
var apiKey = "&app_key=d8d22c089617d4cfbff9ce15762ee548";
var spoonacularKey = "fd6475bc93094d129e4695440a886f1a";
var recipeArray = [];
var ingredientArray = [{
  amount: 1.5,
  amountCost: 145.29,
  id: 1145,
  imgURL: "https://spoonacular.com/cdn/ingredients_100x100/butter-sliced.jpg",
  line: "1 1/2 sticks unsalted butter",
  name: "butter",
  packageCost: -1,
  unit: "sticks"},
{amount: 1.3333333333333333,
  amountCost: 22.22,
  id: 20081,
  imgURL: "https://spoonacular.com/cdn/ingredients_100x100/flour.png",
  line: "1 1/3 cups all-purpose flour",
  name: "flour",
  packageCost: -1,
  unit: "cups"},
  {
    amount: 0.5,
amountCost: 35.36,
id: 10019334,
imgURL: "https://spoonacular.com/cdn/ingredients_100x100/dark-brown-sugar.png",
line: "1/2 cup packed brown sugar (preferably dark)",
name: "brown sugar",
packageCost: -1,
unit: "cup"
  },
  {amount: 1,
    amountCost: 29.83,
    id: 2050,
    imgURL: "https://spoonacular.com/cdn/ingredients_100x100/vanilla-extract.jpg",
    line: "1 teaspoon pure vanilla extract",
    name: "vanilla extract",
    packageCost: -1,
    unit: "teaspoon"},
    {
      amount: 0.25,
      amountCost: 0.16,
      id: 2047,
      imgURL: "https://spoonacular.com/cdn/ingredients_100x100/salt.jpg",
      line: "1/4 teaspoon salt (flaky salt would be great in these)",
      name: "salt",
      packageCost: -1,
      unit: "teaspoon"}
];
var deferred;
var deferredArray = [];
var recipeAmountCount = 1;
var errorIngLines = ["Demerara sugar (Sugar in the Raw) or sanding sugar for rolling (optional)"];

// Edamam Ajax
function edamamAjax() {
  queryURL = edamamQueryURL + ingredients + appId + apiKey;
$.ajax({
  url: queryURL,
  method: "GET"
}).then(updatePage);  
}

edamamAjax();

// Display returned recipe data from Edamam
function updatePage(recipeData) {
  recipeArray = recipeData.hits; 
  console.log("-----edamam recipe data-----", recipeData);
    for (var i = 0; i < recipeAmountCount; i++) {
      var recipe = recipeData.hits[i];
      console.log(recipe);

      var recipeDiv = $("<div>");
      recipeDiv.appendTo(".recipe-section");
      recipeDiv.addClass("recipe-card");

      // Recipe Name
      var recipeName = recipeData.hits[i].recipe.label;
      var name = $("<h1>");
      name.html(recipeName);
      name.appendTo(recipeDiv);       

      var recipeCard = $(".recipe-card");
      var cardList = $("<div>");
      cardList.addClass("card-list");
      cardList.appendTo(recipeCard);

      // Recipe Calories
      var recipeCalories = recipeData.hits[i].recipe.calories;
      var calories = $("<li>");
      calories.html("Recipe Calories: " + Math.round(recipeCalories));
      calories.appendTo(cardList);

      // Recipe Health Labels i.e Alcohol Free, Gluten Free
      var recipeHealthLabels = recipeData.hits[i].recipe.healthLabels;
      console.log(recipeHealthLabels);
      var health = $("<li>");
      health.html("Health Labels: " + [recipeHealthLabels]);
      health.appendTo(cardList);
      
      // Recipe Image
      var recipeImage = recipeData.hits[i].recipe.image;
      var img = $("<img>")
      img.attr("src", recipeImage);
      img.appendTo(recipeDiv);

      // Recipe Serving Amount
      var recipeServings = recipeData.hits[i].recipe.yield;
      var servings = $("<li>")
      servings.html("Servings : " + recipeServings);
      servings.appendTo(cardList);

      // Recipe Source
      var recipeSource = recipeData.hits[i].recipe.source;
      var source = $("<li>")
      source.html("Source : " + recipeSource);
      source.appendTo(cardList);

      // Recipe URL
      var recipeURL = recipeData.hits[i].recipe.url;
      var cardURL = $("<a>")
      cardURL.html("Recipe Summary");
      cardURL.attr("href", recipeURL);
      cardURL.attr("target", "_blank")
      cardURL.appendTo(recipeDiv);
  
      var ingLines = recipeData.hits[i].recipe.ingredientLines;
      
    //   parseIngredients(ingLines);
    //   console.log("------deferredArray------",deferredArray);
    //   console.log("------length: "+ deferredArray.length + "--------");
  
    //   console.log("------defArray[0].readyState-------", deferredArray[0].readyState);
    //   $.when.apply($, deferredArray).done(function(){
    //   buildIngredientsList(ingredientArray);
    // });
    
   buildIngredientsList(ingredientArray);
    
  
      
  }
}

// Takes an array of Ingredient Lines (i.e. ["4 Cups of Chicken Broth", "2 Teaspoons of Salt"]) as an argument and returns an array with an Ingredient object for each Ingredient Lin.e
function parseIngredients(ingLines){
  for(var i = 0; i < ingLines.length; i++){

    deferred = $.ajax({
      url: "https://api.spoonacular.com/recipes/parseIngredients?ingredientList="+ ingLines[i] + "&apiKey=" + spoonacularKey,
      beforeSend: function(xhr){
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      },
      method: "POST",
      success: function(response){
        parseIngredientOBJ = response;
        console.log("-----response-----", response);

        //If api cant find information on the ingredient line, the returned name will be "". If thats the case, push that ing line into an array of error ing lines.
        if(response[0].name.length === 0){
          errorIngLines.push(response[0].original);
        } else{
          var ingOBJ = {
            line: response[0].original,
            name: response[0].name,
            id: response[0].id,
            imgURL: "https://spoonacular.com/cdn/ingredients_100x100/" + response[0].image,
            unit: response[0].unit,
            amount: response[0].amount,
            amountCost: response[0].estimatedCost.value,
            packageCost: -1
          };
          ingredientArray.push(ingOBJ);   
        }
        
      }
      
    });
  
    deferredArray.push(deferred);

  }
  
  
}

// Build ingredient list from spoonacular
function buildIngredientsList(ingArray){

  console.log("Running build ing list!");
  console.log("------ingArray length: " + ingredientArray.length + "-------");
  var subTotal = 0;
  var ingDiv = $("<div>").addClass("ingredient-div");
  var ingTable = $("<table>").attr("id", "ingredient-table");
  ingDiv.append(ingTable);
  ingDiv.appendTo("body");

  
  var ingTableHeadRow = $("<tr>");
  ingTableHeadRow.append($("<th>").html("Image"));
  ingTableHeadRow.append($("<th>").html("Ingredient Line"));
  ingTableHeadRow.append($("<th>").html("Cost"));
  ingTableHeadRow.append($("<th>").html("Shopping Link"));
  ingTable.append(ingTableHeadRow);

  console.log(Array.isArray(ingArray));
  console.log(ingArray.length);
  ingArray.forEach(function(ingredient){
    console.log("in the loop!")
    console.log(ingredient);
    var ingImage = $("<td>").append($("<img>").attr("src", ingredient.imgURL));
    var ingLine = $("<td>").append($("<p>").html(ingredient.line));
    var ingCost = $("<td>").append($("<p>").html("$" + (ingredient.amountCost/100).toFixed(2)));
    var ingLink = $("<td>").append($("<a>").attr("href", "https://www.amazon.com/s?k=" + ingredient.name +"&i=grocery").html(ingredient.name));

    var ingRow = $("<tr>").append(ingImage, ingLine, ingCost, ingLink);
    $("#ingredient-table").append(ingRow);
    
    //If current ingredient is not part of the list of ingredients user entered, add ingredient cost to subTotal. 
    if(ingredients.indexOf(ingredient.name) === -1){
    subTotal += ingredient.amountCost;
    }

  });

  subTotal = "$" + Math.round(subTotal)/100; 

  ingDiv.append($("<h4>").html("Total Recipe Cost: " + subTotal));

  if(errorIngLines.length > 0){
    var errorIngLinesHeader = $("<p>").html("We're sorry to say we couldn't find any information for the following ingredient lines:");
    var errorLineList = $("<ul>")
    errorIngLines.forEach(function(line){
      var listEl = $("<li>").html(line);
      errorLineList.append(listEl);
    });
    ingDiv.append(errorIngLinesHeader, errorLineList);
  }

  
}