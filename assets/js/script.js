// Event listener on nav link to show Recipe Sections
$("#recipeNavigation").on("click", function () {
  $("#recipe-search-section").removeClass("d-none");
  $("#recipe-results-section").removeClass("d-none");
  // $("#random-recipes-section").removeClass("d-none"); // Disabled for now
  $("#nutritional-analysis-container").addClass("d-none");
  $("#display-user-ingredients").addClass("d-none");
  $("#nutritional-info").addClass("d-none");
});

// Event listener on nav link to show Nutritional Sections
$("#nutritionalNavigation").on("click", function () {
  $("#recipe-search-section").addClass("d-none");
  $("#recipe-results-section").addClass("d-none");
  $("#random-recipes-section").addClass("d-none");
  $("#nutritional-analysis-container").removeClass("d-none");
});
