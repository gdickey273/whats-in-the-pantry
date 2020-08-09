$(document).on('keypress',function(e) {
  if(e.which == 13) {
    event.preventDefault();
    $(".landing-button").click();
  }
});

$(".landing-button").on("click", function(){
  var pantryItems = $("#pantry-items").val().trim();
  
  var specialChars = new RegExp(/[~`!#$%\^*+=\-\[\]\\';/{}|\\":<>\?]/);
  
  if(pantryItems === ""){
    alert("Your query is empty, please enter something.");
    return;
  }else if(/\d/.test(pantryItems)){
    alert("You have a number in your query, please remove and try again.");
    return;
  }else if(specialChars.test(pantryItems)){
    alert("You have special characters in your query, please remove and try again.")
    return;
  }
  
  pantryItems = pantryItems.toLowerCase().split(",");
  
  for (var i = 0; i < pantryItems.length; i++) {
    pantryItems[i] = pantryItems[i].trim();
  }
  
  localStorage.setItem("pantryList", pantryItems);
  var url = "recipes.html";
  $(location).attr('href',url);
});