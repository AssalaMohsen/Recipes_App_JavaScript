var navLinks = document.getElementsByClassName("nav-link");
var dataSection = document.getElementById("data");
var fixedBox = document.getElementById("fixedBox");
var smallBoxData = document.getElementById("smallBoxData");
var closeBtn = document.getElementById("closeBtn");
var searchInput = document.getElementById("searchInput");
var searchResults = document.getElementById("searchResults");
let timer = null;
var categories = [
  "carrot",
  "broccoli",
  "asparagus",
  "cauliflower",
  "corn",
  "cucumber",
  "green pepper",
  "lettuce",
  "mushrooms",
  "onion",
  "potato",
  "pumpkin",
  "red pepper",
  "tomato",
  "beetroot",
  "brussel sprouts",
  "peas",
  "zucchini",
  "radish",
  "sweet potato",
  "artichoke",
  "leek",
  "cabbage",
  "celery",
  "chili",
  "garlic",
  "basil",
  "coriander",
  "parsley",
  "dill",
  "rosemary",
  "oregano",
  "cinnamon",
  "saffron",
  "green bean",
  "bean",
  "chickpea",
  "lentil",
  "apple",
  "apricot",
  "avocado",
  "banana",
  "blackberry",
  "blackcurrant",
  "blueberry",
  "boysenberry",
  "cherry",
  "coconut",
  "fig",
  "grape",
  "grapefruit",
  "kiwifruit",
  "lemon",
  "lime",
  "lychee",
  "mandarin",
  "mango",
  "melon",
  "nectarine",
  "orange",
  "papaya",
  "passion fruit",
  "peach",
  "pear",
  "pineapple",
  "plum",
  "pomegranate",
  "quince",
  "raspberry",
  "strawberry",
  "watermelon",
  "salad",
  "pizza",
  "pasta",
  "popcorn",
  "lobster",
  "steak",
  "bbq",
  "pudding",
  "hamburger",
  "pie",
  "cake",
  "sausage",
  "tacos",
  "kebab",
  "poutine",
  "seafood",
  "chips",
  "fries",
  "masala",
  "paella",
  "som tam",
  "chicken",
  "toast",
  "marzipan",
  "tofu",
  "ketchup",
  "hummus",
  "chili",
  "maple syrup",
  "parma ham",
  "fajitas",
  "champ",
  "lasagna",
  "poke",
  "chocolate",
  "croissant",
  "arepas",
  "bunny chow",
  "pierogi",
  "donuts",
  "rendang",
  "sushi",
  "ice cream",
  "duck",
  "curry",
  "beef",
  "goat",
  "lamb",
  "turkey",
  "pork",
  "fish",
  "crab",
  "bacon",
  "ham",
  "pepperoni",
  "salami",
  "ribs",
];

getRecipesbyCategory("pizza");

async function fetchData(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function getRecipesbyCategory(category) {
  showPreloader();
  let url = `https://forkify-api.herokuapp.com/api/search?q=${category}`;
  fetchData(url)
    .then((data) => {
      hidePreloader();
      displayAllData(data);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

async function getRecipeData(id) {
  let url = `https://forkify-api.herokuapp.com/api/get?rId=${id}`;
  fetchData(url)
    .then((data) => {
      displayIngredients(data.recipe);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

function displayAllData(allData) {
  var str = "";
  for (var i = 0; i < allData.recipes.length; i++) {
    str += `<div class="col-md-4"><div class="d-flex flex-column text-center align-items-center p-3 mr-3 mt-3">
    <img src="${allData.recipes[i].image_url}" id="${allData.recipes[i].recipe_id}" height="200" class="border border-light border-4 rounded-1"/>
    <h2>${allData.recipes[i].title}</h2>
    <p>${allData.recipes[i].publisher}</p>
    </div></div>`;
  }
  $("#data").append(str);
  var imgs = document.querySelectorAll("img");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener("click", function (e) {
      smallBoxData.innerHTML = "";
      showSlider();
      getRecipeData(e.target.id);
    });
  }
}

function displayIngredients(recipe) {
  var str = `<h2 class="mb-4">${recipe.title}</h2>
  <img src="${recipe.image_url}" class="img-fluid" alt="">
  <h3 class="mt-4">Ingredients</h3>
  <ul>`;
  for (var i = 0; i < recipe.ingredients.length; i++) {
    str += `<li>${recipe.ingredients[i]}</li>`;
  }
  str += `</ul>`;
  smallBoxData.innerHTML = str;
}

function showSlider() {
  fixedBox.classList.replace("d-none", "d-flex");
}

function closeSlider() {
  fixedBox.classList.replace("d-flex", "d-none");
}

function displaySearchResults() {
  searchResults.innerHTML = "";
  let filtered = categories.filter(isSearchMatch);
  if (filtered.length > 0) {
    let str =
      ' <ul  class="text-start p-3 m-2 bg-white rounded" style="max-height: 300px;overflow-y: scroll;">';

    filtered.forEach((element) => {
      str += `<li class='p-1'><a href="" class="searchResult text-dark text-decoration-none">${element}</a></li>`;
    });

    str += "</ul>";

    searchResults.innerHTML = str;

    addEventListenersToSearchResults();
  }
}

function isSearchMatch(element) {
  let val = new RegExp(searchInput.value, "g");
  return val.test(element);
}

function addEventListenersToSearchResults() {
  let results = document.querySelectorAll(".searchResult");
  results.forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToDataSection();
      searchResults.innerHTML = "";
      searchInput.value = e.target.innerText;
      getRecipesbyCategory(e.target.innerText);
    });
  });
}

(function () {
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function (e) {
      e.preventDefault();
      scrollToDataSection();
      for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i] != e.target) {
          navLinks[i].classList.remove("active");
        }
      }
      e.target.classList.add("active");
      getRecipesbyCategory(e.target.innerText.toLowerCase());
    });
  }

  closeBtn.addEventListener("click", closeSlider);

  fixedBox.addEventListener("click", closeSlider);

  smallBox.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  searchInput.addEventListener("keyup", function () {
    displaySearchResults();
  });

  searchResults.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    searchResults.innerHTML = "";
  });
})();

$(window).scroll(function () {
  let WinscrollTop = $(window).scrollTop();
  let mainOffset = $("main").offset().top;
  if (WinscrollTop > mainOffset) {
    $(".navbar").addClass("navbar-colored");
  } else {
    $(".navbar").removeClass("navbar-colored");
  }
});

function showPreloader() {
  $("#data")
    .html(`<div class="preloader justify-content-center align-items-center">
  <div class="spinner">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
  </div>
</div>`);
}
function showNoResultsFound() {
  $("#data")
    .html(`<div class="preloader justify-content-center align-items-center">
  <span class="text-white">
   No Results Found
  </span>
</div>`);
}

function hidePreloader() {
  $(".spinner").fadeOut();
  $(".preloader").delay(400).fadeOut("slow");
}

function scrollToDataSection() {
  let offset = $("#data").offset().top;

  $("body, html").animate(
    {
      scrollTop: offset - 40,
    },
    1500
  );
}
