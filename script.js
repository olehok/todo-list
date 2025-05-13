// Доробити todolist, в якому буде можливість:
// Додати завдання
// Видалити завдання
// Відзначити як виконане
// Усі дані повинні зберегтися після перезавантаження сторінки.

// base
const form = document.querySelector(".js--form");
const todoList = document.querySelector(".js--todos-wrapper");
let todoItems = [];

// getting from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("todoItems");
    if (saved) {
        todoItems = JSON.parse(saved);
        todoItems.forEach(renderTodo);
    }
    renderDeleteAll();
});

// functions
function saveToLocalStorage() {
    localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function renderTodo(todo) {
    const li = document.createElement("li");
    li.classList.add('todo-item');
    if (todo.checked) li.classList.add("todo-item--checked");
    li.innerHTML = `
    <label>
      <input type="checkbox" ${todo.checked ? "checked" : ""} data-id="${todo.id}" />
    </label>
    <span class="todo-item__description">${todo.text}</span>
    <button class="todo-item__delete" data-id="${todo.id}">X</button>
  `;
    todoList.appendChild(li);
}

function renderDeleteAll() {
    let existingDeleteAll = document.querySelector(".delete_all");

    if (todoItems.length < 2) {
        if (existingDeleteAll) existingDeleteAll.remove();
        return
    }

    if (!existingDeleteAll) {
        const deleteAll = document.createElement('div');
        deleteAll.classList.add('delete_all');
        deleteAll.innerText = "X";
        document.querySelector('.container').appendChild(deleteAll);
    }
}

// Events
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector(".js--form__input");
    const text = input.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now().toString(),
        text,
        checked: false
    };

    todoItems.push(newTodo);
    saveToLocalStorage();
    renderTodo(newTodo);
    renderDeleteAll();
    input.value = "";
    input.focus();
});

document.querySelector('.container').addEventListener('click', (e) => {
    const id = e.target.getAttribute("data-id");
    if (e.target.classList.contains("todo-item__delete")) {
        todoItems = todoItems.filter(item => item.id !== id);
        saveToLocalStorage();
        e.target.closest("li").remove();
        renderDeleteAll();
    }

    if (e.target.type === "checkbox") {
        const todo = todoItems.find(item => item.id === id);
        if (todo) {
            todo.checked = e.target.checked;
            saveToLocalStorage();
            e.target.closest("li").classList.toggle("todo-item--checked", todo.checked);
        }
    }

    if (e.target.classList.contains("delete_all")) {
        todoItems = [];
        todoList.innerHTML = "";
        saveToLocalStorage();
        renderDeleteAll();
    }
});