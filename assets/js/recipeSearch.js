const RECIPE_SEARCH_API_ID = "3074c0c2";
const RECIPE_SEARCH_API_KEY = "c3d552607ffb94d88d65387ada3819bb";

// Array of favourite recipe IDs taken from localStorage
const favouriteRecipies = JSON.parse(localStorage.getItem("recipeSearch_favouriteRecipes")) || [];

// Array of ingredients to search
const ingredientsSearch = [];

// Function to fetch given recipes using search

// Function to display a single recipe

// Event listener on ingredient button to remove it from the array
$("#ingredientsToSearch").on("click", ".search-recipe-ingredient", function (e) {
  // Which button did we click
  // console.log($(e.target).attr("data-ingredient"));

  // remove it from the array of ingredients
  for (let i = 0; i < ingredientsSearch.length; i++) {
    const ingredient = ingredientsSearch[i];
    if (ingredient === $(e.target).attr("data-ingredient")) {
      // remove this ingredient from search array
      ingredientsSearch.splice(i, 1);
    }
  }
  // rerender the buttons
  renderRecipeSearchIngredients();
});

// Event listener on ingredient search form
$("#addIngredient").on("submit", function (e) {
  e.preventDefault();
  //  console.log("Add Ingredients");

  const inputText = $("#addIngredient input").val().trim();

  // Convert all non word or special characters other than hyphen, with "+"
  const ingredient = inputText.replace(/[^\w\s-]+/g, "").replace(/\s+/g, "+");
  // console.log(ingredient);
  // Array of searched items
  const ingredients = ingredient.split("+");

  //  console.log(ingredients);

  for (i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];

    // Add ingredient to global array of ingredients to search
    ingredientsSearch.push(ingredient);
  }

  $("#addIngredient input").val("");

  // Show recipe ingredients
  renderRecipeSearchIngredients();
});

// Render the buttons for searching with
function renderRecipeSearchIngredients() {
  // Clear the ingredients search buttons
  $("#ingredientsToSearch").empty();
  $("#searchRecipes").addClass("d-none");

  // Add buttons for each in the global array to search
  for (i = 0; i < ingredientsSearch.length; i++) {
    const ingredient = ingredientsSearch[i];
    const button = $(`<div class="d-inline">
                        <button class="search-recipe-ingredient btn btn-sm btn-secondary" data-ingredient="${ingredient}">${ingredient} <i class="bi bi-dash"></i></button>
                      </div>`);

    // Add button
    $("#ingredientsToSearch").append(button);
  }

  // Show the search button if there are ingredients to search with
  if (i > 0) {
    $("#searchRecipes").removeClass("d-none");
  }
}

// Event listener on the recipe search button
$("#searchRecipes").on("click", function () {
  console.log("Recipe Search");

  fetchRecipes().then((data) => {
    // Array of returned recipes
    const recipes = data.hits;

    // Empty the results
    $("#recipe-results").empty();

    // Loop the recipes returned
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i].recipe;
      const recipeUri = recipe.uri;
      //      const recipeImageWidth = recipe.images.REGULAR.width;
      const recipeYield = recipe.yield;
      const recipeIngredients = recipe.ingredients;
      let totalTime = recipe.totalTime;

      // If a prep time exists then create the clock and duration code
      if (!totalTime || isNaN(parseFloat(totalTime)) || !isFinite(totalTime) || totalTime === 0) {
        totalTime = "?";
      }

      // List the ingredients
      const recipeIngredientsList = $("<ul>").addClass("recipe-ingredients-list");
      for (let j = 0; j < recipeIngredients.length; j++) {
        const recipeIngredient = $(`<li>${recipeIngredients[j].food}</li>`);
        // console.log(`Recipe Ingredient: ${recipeIngredients[j].food}`);
        recipeIngredientsList.append(recipeIngredient);
      }

      // Build list with images of ingredients
      const recipeIngredientsDetail = $("<ul>").addClass("recipe-ingredients-detail");
      const recipeIngredientsArray = recipe.ingredients;
      for (let i = 0; i < recipeIngredientsArray.length; i++) {
        const title = $("<h5>").text(recipeIngredientsArray[i].text);
        const image = $("<img>")
          .attr("src", recipeIngredientsArray[i].image)
          .attr("loading", "lazy")
          .addClass("rounded")
          .attr("style", "max-width:50px;height:auto");
        const li = $("<li>").append(image, title);
        recipeIngredientsDetail.append(li);
      }

      const recipeResult = $(`

        <div class="recipe-result py-3" style="cursor:pointer" data-uri="${recipeUri}">
          <div class="row">

            <div class="col-sm-3">
              <img src="${recipe.images.REGULAR.url}" style="width:100%;height:auto" loading="lazy">
              <div class="recipe-meta d-flex justify-content-between">
                <span class="recipe-servings">Servings ${recipeYield}</span>
                <span class="recipe-time"><i class="bi bi-clock"></i> ${totalTime}</span>
              </div>
            </div>

            <div class="col-sm-9">
              <h4>${recipe.label}</h4>
              <button class="recipe-favourite"><i class="bi bi-heart"></i></button>
              <button class="recipe-favourite"><i class="bi bi-heart-fill"></i></button>
              <div class="recipe-ingredients">Ingredients: 
                ${recipeIngredientsList.prop("outerHTML")}
              </div>
              <button data-url="${recipe.url}" 
                      class="btn btn-secondary btn-md">Method <i class="bi bi-box-arrow-up-right"></i></button>
              <button class="btn btn-primary btn-md">Nutrition <i class="bi bi-chevron-down"></i></button>
          </div>

        </div> 

- - - - - - - - - - - 
        <!-- Hidden view -->
        <div class="row">
          <div class="col-sm-6">

            <h3>Ingredients</h3>
            ${recipeIngredientsDetail.prop("outerHTML")}
            <button data-url="${recipe.url}" 
                    class="btn btn-secondary btn-md">Method <i class="bi bi-box-arrow-up-right"></i></button>
            <div class="recipe-attribution">by ${recipe.source}</div>

          </div>
          <div class="col-sm-6">

            <h3>Nutrition</h3>
            <table>TABLE</table>

          </div>
        </div>

      </div>

      `);

      $("#recipe-results").append(recipeResult);
    }
  });
});

// Event listener on recipe favourite button to add to favourites and localStorage

// API search
async function fetchRecipes() {
  try {
    // Get search terms from array of search terms

    // Get incredients from text box - this will be changed to pull ingredients from the array
    //const inputText = $("#addIngredient input").val().trim();
    //const tags = inputText.replace(/ |,/g, "+");

    const tags = ingredientsSearch.join("+");

    // Construct search URL
    const recipeSearchURL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${RECIPE_SEARCH_API_ID}&app_key=${RECIPE_SEARCH_API_KEY}&tag=${tags}`;

    // await response call
    //console.log("Requesting:", recipeSearchURL);
    let response = await fetch(recipeSearchURL);
    //console.log("Response Status:", response.status);

    // once response retrieved, convert to json format
    let data = await response.json();

    // Convert the JSON data to a string
    const jsonString = JSON.stringify(data);

    // Check the length of the string in bytes
    const byteSize = new Blob([jsonString]).size;

    //console.log(`JSON Data Size: ${byteSize} bytes`);

    // return data
    return data;
  } catch (error) {
    // console error message
    console.error("Fetch error:", error);
  }
}
