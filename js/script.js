var ingredients = localStorage.getItem("pantryList"); // When input grab is available change query to input
var edamamQueryURL = "https://api.edamam.com/search?q=";
var appId = "&app_id=595f4e2b";
var apiKey = "&app_key=d8d22c089617d4cfbff9ce15762ee548";
var spoonacularKey = "fd6475bc93094d129e4695440a886f1a";
var recipeArray = [];
var dataIdTracker = -1;
var ingredientArray = [];
var deferred;
var deferredArray = [];
var recipeAmountCount = 10;
var errorIngLines = [];

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

  var pantryDisplay = localStorage.getItem("pantryList");
  pantryDisplay = pantryDisplay.split(",");
  console.log(pantryDisplay);

  for(var i = 0; i < pantryDisplay.length; i++){
    var pantryIngredientName = $("<li>");
    pantryIngredientName.appendTo(".pantrylistitems-section");
    pantryIngredientName.html(pantryDisplay[i]);
  }

  recipeArray = recipeData.hits; 
  console.log("-----edamam recipe data-----", recipeData);
    for (var i = 0; i < recipeAmountCount; i++) {
      var recipe = recipeData.hits[i];
      console.log(recipe);

      var recipeDiv = $("<div>");
      recipeDiv.appendTo(".recipe-section");
      recipeDiv.addClass("recipe-card");

      var confirmIcon = $("<img>");
      confirmIcon.attr("src", "img/icons/check-circle.svg");
      confirmIcon.addClass("confirm-icon");

      // Recipe Name
      var recipeName = recipeData.hits[i].recipe.label;
      var name = $("<h1>");
      name.html(recipeName);
      name.appendTo(recipeDiv);       

      var recipeCard = $(".recipe-card");
      var cardList = $("<div>");
      cardList.addClass("card-list");

      // Recipe Calories
      var recipeCalories = recipeData.hits[i].recipe.calories;
      var calories = $("<li>");
      calories.html("<b>Recipe Calories: </b>" + Math.round(recipeCalories));
      calories.appendTo(cardList);

      // Recipe Health Labels i.e Alcohol Free, Gluten Free
      var recipeHealthLabels = recipeData.hits[i].recipe.healthLabels;
      console.log(recipeHealthLabels);
      var health = $("<li>");
      health.html("<b>Health Labels: </b>" + [recipeHealthLabels]);
      health.appendTo(cardList);
      
      // Recipe Image
      var recipeImage = recipeData.hits[i].recipe.image;
      var img = $("<img>");
      img.addClass("card-image");
      img.attr("src", recipeImage);
      img.appendTo(recipeDiv);

      // Recipe Serving Amount
      var recipeServings = recipeData.hits[i].recipe.yield;
      var servings = $("<li>")
      servings.html("<b>Servings: </b>" + recipeServings);
      servings.appendTo(cardList);

      // Recipe Source
      var recipeSource = recipeData.hits[i].recipe.source;
      var source = $("<li>")
      source.html("<b>Source: </b>" + recipeSource);
      source.appendTo(cardList);

      var cardBottom = $("<div>");
      cardBottom.addClass("card-bottom");

      var expandCard = $("<a>");
      expandCard.attr("data-index", i);
      expandCard.addClass("expand-card");
      expandCard.html("Recipe Cost");
      expandCard.appendTo(cardBottom);

      // Recipe URL
      var recipeURL = recipeData.hits[i].recipe.url;
      var cardURL = $("<a>")
      cardURL.html("Recipe Source & Instructions");
      cardURL.attr("href", recipeURL);
      cardURL.attr("target", "_blank")
      cardURL.appendTo(cardBottom);
          
  }

  cardList.appendTo(recipeCard);
  cardBottom.appendTo(recipeCard);
  confirmIcon.appendTo(".recipe-card");

  //When confirm icon is clicked, get ingredient data from spoonacular, build new div with data, and prepend to body
  $(".expand-card").on("click", function(event){ 
    var displayFinal = $(".ingredient-div");
    
    //If icon clicked corresponds to data in most recent ingredient-div, just show that same div instead of building new one
    if (dataIdTracker === event.target.dataset.index){
      displayFinal.css("display", "block");
      displayFinal.css("position", "absolute");
    }
    else{
      //if icon corresponds to new recipe, remove old ingredient-div
      dataIdTracker = event.target.dataset.index;
      displayFinal.remove();
      
      //get ingredient data from spoonacular for ingredient lines of the recipe with corresponding data-index in recipeArray
      parseIngredients(recipeArray[event.target.dataset.index].recipe.ingredientLines);

      //When all requests have been resolved, build new ingredient-div and prepend to body
      $.when.apply($, deferredArray).done(function(){
        buildIngredientsList(ingredientArray);

        //empty deferredArray
        deferredArray = [];
      });
    }
    

    
      
  });

  
}


// Takes an array of Ingredient Lines (i.e. ["4 Cups of Chicken Broth", "2 Teaspoons of Salt"]) as an argument and returns an array with an Ingredient object for each Ingredient Lin.e
function parseIngredients(ingLines){
  //for each ingredient line in ingLines array, make ajax "POST" call to spoonacular for data
  for(var i = 0; i < ingLines.length; i++){

    //create a deferred promise for each ajax call and store in deferredArray
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
          //if data can be found, create ingredient object with response data
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
          console.log(ingOBJ);
          //push ingredient object into ingredientArray
          ingredientArray.push(ingOBJ);   
        }
        
      }
      
    });
  
    deferredArray.push(deferred);

  }
  
}

// Build ingredient list from spoonacular
function buildIngredientsList(ingArray){

  var subTotal = 0;

  //create ingredient-div
  var ingDiv = $("<div>").addClass("ingredient-div");

  //create and append ingredient-table
  var ingTable = $("<table>").attr("id", "ingredient-table");
  ingDiv.append(ingTable);
  var ingTableTotals = $("<div>").attr("class", "table-totals");
  ingDiv.prependTo("body");
  ingTableTotals.appendTo(".ingredient-div");

  //create close-icon and append to table
  var closeIcon = $("<img>");
  closeIcon.appendTo("#ingredient-table");
  closeIcon.attr("src", "img/icons/close-circle.svg");
  closeIcon.addClass("close-icon");
  
  //create ingredient-table header row and append to table 
  var ingTableHeadRow = $("<tr>");
  ingTableHeadRow.append($("<th>").html("<b>Image</b>"));
  ingTableHeadRow.append($("<th>").html("<b>Ingredient Line</b>"));
  ingTableHeadRow.append($("<th>").html("<b>Cost</b>"));
  ingTableHeadRow.append($("<th>").html("<b>Shopping Link</b>"));
  ingTable.append(ingTableHeadRow);

  //for each ingredient in ingArray, create table row and fill with data
  ingArray.forEach(function(ingredient){
    var ingImage = $("<td>").append($("<img>").attr("src", ingredient.imgURL));
    var ingLine = $("<td>").append($("<p>").html(ingredient.line));
    var ingCost = $("<td>").append($("<p>").html("$" + (ingredient.amountCost/100).toFixed(2)));
    var cartIcon = $("<img>");
    cartIcon.attr("src", "img/icons/cart-add.svg");
    // var ingLink = $("<td>").append($("<a>").attr("href", "https://www.amazon.com/s?k=" + ingredient.name +"&i=grocery").html(cartIcon));
    var ingLink = $("<td>").html("<a href= https://www.amazon.com/s?k="+ ingredient.name +"&i=grocery><img src=\"img/icons/cart-add.svg\" width=30px\"></a>");

    var ingRow = $("<tr>").append(ingImage, ingLine, ingCost, ingLink);
    $("#ingredient-table").append(ingRow);
    
    //If current ingredient is not part of the list of ingredients user entered, add ingredient cost to subTotal. 
    if(ingredients.indexOf(ingredient.name) === -1){
    subTotal += ingredient.amountCost;
    }

  });

  //Convert subtotal from cents to dollars and append to table
  subTotal = "$" + Math.round(subTotal)/100; 
  ingTableTotals.append($("<p>").html("<b>Total Recipe Cost: </b>" + subTotal));

  //if spoonacular couldn't find information on one or more ingredient lines, append those lines here with a message
  if(errorIngLines.length > 0){
    var errorIngLinesHeader = $("<p>").html("We're sorry to say we couldn't find any information for the following ingredient lines:");
    var errorLineList = $("<ul>")
    errorIngLines.forEach(function(line){
      var listEl = $("<li>").html(line);
      errorLineList.append(listEl);
    });
    ingTableTotals.append(errorIngLinesHeader, errorLineList);
  }

  //Once ingredient-div is built, display block with position absolute
  var displayFinal = $(".ingredient-div");
    displayFinal.css("display", "block");
    displayFinal.css("position", "absolute");

    //if close-icon is clicked, hide ingredient-div
  $(".close-icon").on("click", function(){ 
    displayFinal.css("display", "none");

  });

  //Once ingredient-div is built, empty ingredientArray
  ingredientArray = [];
}

