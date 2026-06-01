from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <-- IMPORTANT
from pydantic import BaseModel
from typing import List

app = FastAPI(title="API ToDo List")

# --- CONFIGURATION CORS ---
# Permet à votre fichier HTML (même ouvert en local) de se connecter à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines en développement
    allow_credentials=True,
    allow_methods=["*"],  # Autorise GET, POST, PATCH, DELETE, etc.
    allow_headers=["*"],
)

# Base de données en mémoire
todo_db = [
    {"id": 1, "title": "Acheter du pain", "completed": False},
]

class TodoCreate(BaseModel):
    title: str

@app.get("/todos")
def get_all_todos():
    return todo_db

@app.post("/todos", status_code=201)
def create_todo(todo: TodoCreate):
    new_id = max([item["id"] for item in todo_db], default=0) + 1
    new_item = {"id": new_id, "title": todo.title, "completed": False}
    todo_db.append(new_item)
    return new_item

@app.patch("/todos/{todo_id}/toggle")
def toggle_todo(todo_id: int):
    for item in todo_db:
        if item["id"] == todo_id:
            item["completed"] = not item["completed"]
            return item
    raise HTTPException(status_code=404, detail="Tâche non trouvée")

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todo_db
    todo_db = [item for item in todo_db if item["id"] != todo_id]
    return {"message": "Supprimé"}