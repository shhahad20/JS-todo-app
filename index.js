const taskList = document.getElementById("task-list");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todoInput");
const todoCounter = document.getElementById("todo-counter");
const completedTasksRadio = document.getElementById("completed-tasks");
const activeTasksRadio = document.getElementById("active-tasks");
const filterBtn = document.getElementById("filter-btn");

// Load tasks from local storage (if available)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

//////////////////////////////////////////////////
function renderTasks(filteredTasks) {
    taskList.innerHTML = "";

    // Use the filteredTasks array if provided, otherwise use the original tasks array
    const tasksToRender = filteredTasks || tasks;

    // Initialize counters for total tasks and completed tasks
    let totalTasks = 0;
    let completedTasksCount = 0;

    // Loop through tasks and create list items
    for (let i = 0; i < tasksToRender.length; i++) {
        const task = tasksToRender[i];
        const listItem = document.createElement("li");
        listItem.innerHTML = `<div class="task-item"> 
            <input type="checkbox" id="task${i}" ${task.completed ? "checked" : ""}>
            <h4>${task.description}</h4>
            <button class="edit-btn" data-index="${i}">Edit</button>
            <button class="delete-btn" data-index="${i}">Delete</button>
            </div>
        `;

        // Update counters based on task completion
        totalTasks++;
        if (task.completed) {
            completedTasksCount++;
        }

        // checkbox change
        const checkbox = listItem.querySelector(`#task${i}`);
        checkbox.addEventListener("change", () => {
            tasksToRender[i].completed = checkbox.checked;
            saveTasksToLocalStorage(); // Save tasks to local storage after a change
            renderTasks(); // Re-render the tasks after a change
        });

        // delete button
        const deleteButton = listItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            tasksToRender.splice(i, 1);
            saveTasksToLocalStorage(); // Save tasks to local storage after a change
            renderTasks(); // Re-render the tasks after a change
        });

        // edit button
        const editButton = listItem.querySelector(".edit-btn");
        editButton.addEventListener("click", () => {
            const newDescription = prompt("Edit the task:", tasksToRender[i].description);
            if (newDescription !== null) {
                tasksToRender[i].description = newDescription;
                saveTasksToLocalStorage(); // Save tasks to local storage after a change
                renderTasks(); // Re-render the tasks after a change
            }
        });

        taskList.appendChild(listItem);
    }

    // Update the total tasks and completed tasks counters in the UI
    todoCounter.textContent = `Total Tasks: ${totalTasks} | Completed Tasks: ${completedTasksCount}`;
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const description = todoInput.value.trim();
    if (description) {
        tasks.push({ description, completed: false });
        todoInput.value = "";
        saveTasksToLocalStorage(); // Save tasks to local storage after adding a new task
        renderTasks();
    }
}

// Function to filter tasks
function filterTasks() {
    let filteredTasks = [];

    switch (currentFilter) {
        case "completed":
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case "active":
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        default:
            filteredTasks = tasks;
    }

    renderTasks(filteredTasks);
}

// Event listener for the "Filter" button
filterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Determine the selected filter criteria
    if (completedTasksRadio.checked) {
        currentFilter = "completed";
    } else if (activeTasksRadio.checked) {
        currentFilter = "active";
    } else {
        currentFilter = "all";
    }

    // Apply the filter and render the tasks
    filterTasks();
});

// Event listener for the form submission
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
});
const searchInput = document.getElementById("searchInput");

// Function to search tasks based on keywords
function searchTasks(keyword) {
    keyword = keyword.toLowerCase(); // Convert the keyword to lowercase for case-insensitive search
    const filteredTasks = tasks.filter(task => task.description.toLowerCase().includes(keyword));
    renderTasks(filteredTasks);
}

// Event listener for the search input
searchInput.addEventListener("input", () => {
    const searchKeyword = searchInput.value.trim();
    searchTasks(searchKeyword);
});
// Initial rendering of tasks
renderTasks();
