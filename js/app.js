const API_URL = "http://127.0.0.1:8000/todos";

// 1. Charger et afficher les ToDos depuis l'API
async function fetchTodos() {
    const response = await fetch(API_URL);
    const todos = await response.json();
    const listElement = document.getElementById("todoList");
    listElement.innerHTML = ""; // On vide la liste

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-xs";
        li.innerHTML = `
            <div class="flex items-center gap-3 cursor-pointer" onclick="toggleTodo(${todo.id})">
                <span class="text-xl">${todo.completed ? '✅' : '⚪'}</span>
                <span class="text-slate-700 ${todo.completed ? 'line-through text-slate-400' : ''}">${todo.title}</span>
            </div>
            <button onclick="deleteTodo(${todo.id})" class="text-red-400 hover:text-red-600 transition-colors text-sm font-semibold">
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