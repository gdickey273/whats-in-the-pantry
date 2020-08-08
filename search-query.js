// $(document).ready(function() {
//   var isOccupied = $("#pantry-items").val();
//   console.log(isOccupied);
//   while(isOccupied.length === 0){
//   $(".landing-button").prop("disabled", true);
//   }

$(".landing-button").on("click", function(){
  var pantryItems = $("#pantry-items").val().trim();
  
  var specialChars = new RegExp(/[~`!#$%\^*+=\-\[\]\\';/{}|\\":<>\?]/);
  
  if(pantryItems === ""){
    alert("Your query is empty, please enter something.");
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
  // window.location.replace("https://gdickey273.github.io/whats-in-the-pantry/page01.html");
  var url = "C:\\Users\\Daniel\\dev\\unc\\class-work\\project-1\\whats-in-the-pantry\\page01.html";
  $(location).attr('href',url);
});