// API URLs
const API_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const randomMealURL = 'https://www.themealdb.com/api/json/v1/1/random.php';
const searchMealURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const searchByIngredientURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';

// Select elements from HTML
const mealName = document.getElementById('meal-name');
const mealImage = document.getElementById('meal-image');
const mealCategory = document.getElementById('meal-category');
const mealArea = document.getElementById('meal-area');
const mealDescription = document.getElementById('meal-description');
const ingredientsList = document.getElementById('ingredients-list');
const mealInstructions = document.getElementById('meal-instructions');
const youtubeLink = document.getElementById('youtube-link');
const mealList = document.getElementById('meal-list');
const saveToFileBtn = document.getElementById('saveToFileBtn');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const ingredientForm = document.getElementById('ingredient-form');
const ingredientInput = document.getElementById('ingredient-input');
const ingredientMealsList = document.getElementById('ingredient-meals-list');
const relatedMealsList = document.getElementById('related-meals-list');
const groceryForm = document.getElementById('grocery-form');
const groceryInput = document.getElementById('grocery-input');
const groceryList = document.getElementById('grocery-list-items');
const addToPlannerBtn = document.getElementById('add-to-planner-btn');

// Load initial data once
window.onload = () => {
    fetchRandomMeal();
    displayMeals();
    displayGroceryItems();
    addToPlannerBtn.style.display = 'none';
};

// Function to fetch and display a random meal
async function fetchRandomMeal() {
    try {
        const response = await fetch(randomMealURL);
        const data = await response.json();
        const meal = data.meals[0];
        displayMealInfo(meal);
    } catch (error) {
        console.error('Error fetching random meal:', error);
    }
}

// Function to fetch and display meals based on search query
async function searchMeal(query) {
    try {
        const response = await fetch(`${searchMealURL}${query}`);
        const data = await response.json();
        
        if (data.meals) {
            const meal = data.meals[0];
            displayMealInfo(meal);
            displayRelatedMeals(data.meals);
        } else {
            alert('No meals found for your search. Try a different name.');
        }
    } catch (error) {
        console.error('Error fetching meal by search:', error);
    }
}

// Function to display related meals
function displayRelatedMeals(meals) {
    relatedMealsList.innerHTML = '';
    
    meals.forEach((meal) => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('related-meal-card');
        
        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;

        const mealTitle = document.createElement('h4');
        mealTitle.textContent = meal.strMeal;

        mealCard.appendChild(mealImage);
        mealCard.appendChild(mealTitle);
        
        mealCard.addEventListener('click', () => fetchMealDetails(meal.idMeal));

        relatedMealsList.appendChild(mealCard);
    });
}

// Display meal information on the page
function displayMealInfo(meal) {
    if (!meal) return;
    mealName.textContent = meal.strMeal;
    mealImage.src = meal.strMealThumb;
    mealCategory.textContent = `Category: ${meal.strCategory}`;
    mealArea.textContent = `Area: ${meal.strArea}`;
    mealDescription.textContent = `Description: ${meal.strInstructions.slice(0, 100)}...`;
    youtubeLink.href = meal.strYoutube;
    youtubeLink.textContent = 'Watch on YouTube';

    addToPlannerBtn.style.display = 'block';

    ingredientsList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            const li = document.createElement('li');
            li.textContent = `${ingredient} - ${measure}`;
            ingredientsList.appendChild(li);
        }
    }

    mealInstructions.textContent = meal.strInstructions;
    document.getElementById('meal-info').scrollIntoView({ behavior: 'smooth' });
}

// Event listener for search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchMeal(query);
        searchInput.value = '';
    }
});

// Function to fetch and display meals by ingredient
async function searchByIngredient(ingredient) {
    try {
        const response = await fetch(`${searchByIngredientURL}${ingredient}`);
        const data = await response.json();
        
        ingredientMealsList.innerHTML = '';
        relatedMealsList.innerHTML = '';

        if (data.meals) {
            data.meals.forEach((meal) => {
                const mealCard = document.createElement('div');
                mealCard.classList.add('ingredient-meal-card');
                
                const mealImage = document.createElement('img');
                mealImage.src = meal.strMealThumb;
                mealImage.alt = meal.strMeal;

                const mealTitle = document.createElement('h4');
                mealTitle.textContent = meal.strMeal;

                mealCard.appendChild(mealImage);
                mealCard.appendChild(mealTitle);

                mealCard.addEventListener('click', () => fetchMealDetails(meal.idMeal));

                ingredientMealsList.appendChild(mealCard);
            });
        } else {
            alert('No meals found for your ingredient. Try a different ingredient.');
        }
    } catch (error) {
        console.error('Error fetching meals by ingredient:', error);
    }
}

// Fetch and display detailed meal information by meal ID
async function fetchMealDetails(mealId) {
    try {
        const response = await fetch(`${API_URL}${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];
        displayMealInfo(meal);
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
}

// Event listener for ingredient search form submission
ingredientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
        searchByIngredient(ingredient);
        ingredientInput.value = '';
    }
});

// CRUD Operations for Meal Planner and Grocery List
let meals = JSON.parse(localStorage.getItem('meals')) || [];
let groceryItems = JSON.parse(localStorage.getItem('groceryItems')) || [];

// Function to display meals in the "Meal Planner" section
function displayMeals() {
    mealList.innerHTML = '';
    meals.forEach((meal, index) => {
        const li = document.createElement('li');
        li.textContent = meal; // Display meal name in the "Meal Planner" list

        // Create a "Remove" button for each meal
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // Optional: add a class for styling
        removeButton.addEventListener('click', () => {
            removeMeal(index); // Call function to remove the meal by index
        });

        li.appendChild(removeButton); // Append the remove button to the list item
        mealList.appendChild(li); // Add the list item to the meal list
    });
}

// Function to remove a meal by index
function removeMeal(index) {
    meals.splice(index, 1); // Remove the meal from the array
    localStorage.setItem('meals', JSON.stringify(meals)); // Update localStorage
    displayMeals(); // Refresh the displayed meal list
}

// Function to display grocery items in the "Grocery List" section with "Remove" and "Edit" buttons
function displayGroceryItems() {
    groceryList.innerHTML = '';
    groceryItems.forEach((item, index) => {
        const li = document.createElement('li');
        
        // Display grocery item name or input if editing
        const itemText = document.createElement('span');
        itemText.textContent = item;
        itemText.classList.add('grocery-item-text');

        // Create an input field for editing
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = item;
        editInput.classList.add('edit-input');
        editInput.style.display = 'none';

        // Create "Edit" button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => {
            if (editInput.style.display === 'none') {
                editInput.style.display = 'inline';
                itemText.style.display = 'none';
                editButton.textContent = 'Save';
            } else {
                groceryItems[index] = editInput.value; // Update the item in the array
                localStorage.setItem('groceryItems', JSON.stringify(groceryItems)); // Update localStorage
                displayGroceryItems(); // Refresh the displayed grocery list
            }
        });

        // Create "Remove" button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => {
            removeGroceryItem(index); // Call function to remove the item
        });

        li.appendChild(itemText);
        li.appendChild(editInput);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        groceryList.appendChild(li); // Add the list item to the grocery list
    });
}

// Function to remove a grocery item by index
function removeGroceryItem(index) {
    groceryItems.splice(index, 1); // Remove the item from the array
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems)); // Update localStorage
    displayGroceryItems(); // Refresh the displayed grocery list
}

// Event listener for adding grocery items
groceryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const groceryItem = groceryInput.value.trim();
    if (groceryItem) {
        groceryItems.push(groceryItem); // Add the new grocery item
        localStorage.setItem('groceryItems', JSON.stringify(groceryItems)); // Update localStorage
        displayGroceryItems(); // Refresh the displayed grocery list
        groceryInput.value = ''; // Clear the input field
    }
});

// Event listener for adding meals to the planner
addToPlannerBtn.addEventListener('click', () => {
    const mealToAdd = mealName.textContent; // Get the current meal name
    if (meals.includes(mealToAdd)) {
        alert('This meal is already in your planner.');
    } else {
        meals.push(mealToAdd); // Add the meal to the array
        localStorage.setItem('meals', JSON.stringify(meals)); // Update localStorage
        displayMeals(); // Refresh the displayed meal list
    }
});

// Function to save the meal planner and grocery list to a file
function saveToFile() {
    const mealPlannerContent = `Meal Planner:\n${meals.join('\n')}\n\nGrocery List:\n${groceryItems.join('\n')}`;
    const blob = new Blob([mealPlannerContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal_planner.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Release the blob URL
}

// Event listener for "Save to File" button
saveToFileBtn.addEventListener('click', saveToFile);
