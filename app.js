const recipesKey = "recipes";
let recipes = JSON.parse(localStorage.getItem(recipesKey)) || [];

const dom = {
  container: document.getElementById("recipes-container"),
  btnAdd: document.getElementById("add-recipe-btn"),
  modal: document.getElementById("recipe-modal"),
  form: document.getElementById("recipe-form"),
  inputs: {
    id: document.getElementById("recipe-id"),
    title: document.getElementById("recipe-title"),
    ingredients: document.getElementById("recipe-ingredients"),
    instructions: document.getElementById("recipe-instructions")
  },
  btnCancel: document.getElementById("cancel-btn")
};

function saveRecipes() {
  localStorage.setItem(recipesKey, JSON.stringify(recipes));
}

function renderRecipes() {
  dom.container.innerHTML = "";
  if (recipes.length === 0) {
    dom.container.innerHTML = "<p>No recipes yet. Click + Add to start.</p>";
    return;
  }
  recipes.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>${r.title}</h3>
      <p><strong>Ingredients:</strong><br>${r.ingredients.map(i => "- " + i).join("<br>")}</p>
      <p><strong>Instructions:</strong><br>${r.instructions}</p>
      <div class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>`;
    const [btnEdit, btnDelete] = card.querySelectorAll("button");
    btnEdit.onclick = () => openModal(r.id);
    btnDelete.onclick = () => {
      if (confirm("Delete this recipe?")) {
        recipes = recipes.filter(x => x.id !== r.id);
        saveRecipes();
        renderRecipes();
      }
    };
    dom.container.appendChild(card);
  });
}

function openModal(id = null) {
  dom.inputs.id.value = id || "";
  dom.form.reset();
  document.getElementById("modal-title").textContent = id ? "Edit Recipe" : "Add Recipe";

  if (id) {
    const r = recipes.find(x => x.id === id);
    dom.inputs.title.value = r.title;
    dom.inputs.ingredients.value = r.ingredients.join("\n");
    dom.inputs.instructions.value = r.instructions;
  }

  dom.modal.classList.remove("hidden");
}

dom.form.onsubmit = e => {
  e.preventDefault();
  const id = dom.inputs.id.value || Date.now().toString();
  const newRecipe = {
    id,
    title: dom.inputs.title.value.trim(),
    ingredients: dom.inputs.ingredients.value.trim().split(/\r?\n/),
    instructions: dom.inputs.instructions.value.trim()
  };
  const existingIndex = recipes.findIndex(x => x.id === id);
  if (existingIndex >= 0) recipes[existingIndex] = newRecipe;
  else recipes.push(newRecipe);

  saveRecipes();
  renderRecipes();
  dom.modal.classList.add("hidden");
};

dom.btnCancel.onclick = () => dom.modal.classList.add("hidden");
dom.btnAdd.onclick = () => openModal();

// Initial render
renderRecipes();
