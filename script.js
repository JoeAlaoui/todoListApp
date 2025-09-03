const todoform = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

todoform.addEventListener('submit', function(e) {
    e.preventDefault();
   addTodo();
}   );

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0)  {

        const todoObject = { text: todoText, completed: false };
        allTodos.push(todoObject); 
        updateTodoList();
        saveTodos();
        todoInput.value = '';
    } 
}

function updateTodoList() {
    todoListUL.innerHTML = '';
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement('li');
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}">
                <label for="${todoId}" class="custom-checkbox">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="transparent">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                </label>
                <label for="${todoId}" class="todo-text">${todoText}</label>
                <button class="edit-button">
                   <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--secondary-color)"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </button>
                <button class="delete-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="var(--secondary-color)">
                        <path
                            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                </button>
    `;

    const deleteButton = todoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
       deleteTodoItems(todoIndex);
    });

const editButton = todoLI.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
        enableEditMode(todoLI, todo, todoIndex);
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
       allTodos[todoIndex].completed = checkbox.checked;
       saveTodos();
    });

    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItems(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(allTodos));
}

function getTodos() {
   const todos = localStorage.getItem('todos') || "[]";
  return JSON.parse(todos);
}

function enableEditMode(todoLI, todo, todoIndex) {
    const currentText = todo.text;
    todoLI.innerHTML = `
        <input type="checkbox" id="todo-${todoIndex}" ${todo.completed ? "checked" : ""} style="display:none;">
        <input type="text" class="edit-input" value="${currentText}" style="flex-grow:1; padding:10px;">
        <button class="save-edit-button">Save</button>
        <button class="cancel-edit-button">Cancel</button>
    `;

    const saveBtn = todoLI.querySelector('.save-edit-button');
    const cancelBtn = todoLI.querySelector('.cancel-edit-button');
    const editInput = todoLI.querySelector('.edit-input');

    saveBtn.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText.length > 0) {
            allTodos[todoIndex].text = newText;
            saveTodos();
            updateTodoList();
        }
    });

    cancelBtn.addEventListener('click', () => {
        updateTodoList();
    });
}