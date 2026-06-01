const API_URL = "http://127.0.0.1:8000/todos";

// 1. Charger et afficher les ToDos depuis l'API
async function fetchTodos() {
    const response = await fetch(API_URL);
    const todos = await response.json();
    const listElement = document.getElementById("todoList");
    listElement.innerHTML = ""; 

    todos.forEach(todo => {
        const li = document.createElement("li");
        // ON AJOUTE LA CLASSE SUR LE LI
        li.className = "todo-item"; 
        li.innerHTML = `
            <div class="todo-content" onclick="toggleTodo(${todo.id})">
                <span class="todo-icon">${todo.completed ? '✅' : '⏹️'}</span>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.title}</span>
            </div>
            <button onclick="deleteTodo(${todo.id})" class="btn-delete">
                Supprimer
            </button>
        `;
        listElement.appendChild(li);
    });
}

// 2. Envoyer un nouveau ToDo à l'API
async function addTodo() {
    const input = document.getElementById("todoInput");
    if (!input.value.trim()) return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.value })
    });

    input.value = ""; // On vide le champ
    fetchTodos(); // On rafraîchit l'affichage
}

// 3. Modifier le statut d'un ToDo (Cocher/Décocher)
async function toggleTodo(id) {
    await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    fetchTodos();
}

// 4. Supprimer un ToDo
async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTodos();
}

// Charger les tâches dès l'ouverture de la page
fetchTodos();