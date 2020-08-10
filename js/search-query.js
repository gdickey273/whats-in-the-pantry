$(document).on('keypress',function(e) {
  if(e.which == 13) {
    event.preventDefault();
    $(".landing-button").click();
  }
});

$(".landing-button").on("click", function(){
  var pantryItems = $("#pantry-items").val().trim();
  
  var specialChars = new RegExp(/[~`!#$%\^*+=\-\[\]\\';/{}|\\":<>\?]/);

  var titleSectionContent = $(".title-section__content");
  var alertMessage = $("<p>");
  alertMessage.css("color", "red");
  alertMessage.css("padding-top", "1em");
  
  if(pantryItems === ""){
    alertMessage.html("Your query is empty, please enter something.");
    alertMessage.appendTo(titleSectionContent);   
    setTimeout(function(){ 
      alertMessage.css("display", "none");
    },3000); 
    return;
  }else if(/\d/.test(pantryItems)){
    alertMessage.html("You have numbers in your query, please remove and try again.");
    alertMessage.appendTo(titleSectionContent);
    setTimeout(function(){ 
      alertMessage.css("display", "none");
    },3000); 
    return;
  }else if(specialChars.test(pantryItems)){
    alertMessage.html("You have special characters in your query, please remove and try again.");
    alertMessage.appendTo(titleSectionContent);
    setTimeout(function(){ 
      alertMessage.css("display", "none");
    },3000); 
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