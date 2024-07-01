document.addEventListener('DOMContentLoaded', () => {
    // Get references to the various DOM elements by their IDs
    const listName = document.getElementById('list-name');
    const newListBtn = document.getElementById('new-list');
    const todoTitle = document.getElementById('todo-title');
    const todoDate = document.getElementById('todo-date');
    const todoPriority = document.getElementById('todo-priority');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const listsContainer = document.getElementById('lists-container');

    // Initialize the current list to 'default'
    let currentList = 'default';
    // Retrieve the lists from localStorage or initialize an empty object
    let lists = JSON.parse(localStorage.getItem('todo-lists')) || {};

    // If the 'default' list doesn't exist, create it
    if (!lists[currentList]) {
        lists[currentList] = [];
    }

    // Function to search for lists based on the input value
    function searchLists() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const matchingLists = Object.keys(lists).filter(listName =>
            listName.toLowerCase().includes(searchTerm)
        );

        if (matchingLists.length > 0) {
            currentList = matchingLists[0]; // Set the current list to the first match
            listName.value = currentList; // Update the list name input
            renderList(); // Render the new current list
            alert(`Switched to list: ${currentList}`);
        } else {
            alert('No matching lists found.');
        }
    }

    // Function to save the lists to localStorage
    function saveLists() {
        localStorage.setItem('todo-lists', JSON.stringify(lists));
    }

    // Function to render the current list
    function renderList() {
        todoList.innerHTML = ''; // Clear the current list display
        listName.value = currentList; // Update the list name input when rendering
        lists[currentList].forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item priority-${todo.priority}`;
            if (todo.completed) li.classList.add('completed');
            li.innerHTML = `
                <span class="title">${todo.title}</span>
                <span class="date">${todo.date}</span>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            `;
            li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(index));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(index));
            todoList.appendChild(li);
        });
        renderListsPane(); // Update the lists pane
    }

    // Function to add a new todo item to the current list
    function addTodo() {
        const title = todoTitle.value.trim();
        const date = todoDate.value;
        const priority = todoPriority.value;
        if (title) {
            lists[currentList].push({ title, date, priority, completed: false });
            // Sort the list by priority
            lists[currentList].sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            saveLists(); // Save the updated lists to localStorage
            renderList(); // Render the updated list
            todoTitle.value = '';
            todoDate.value = '';
            todoPriority.value = 'low';
            // Add a fade-in effect to the last item
            const lastItem = todoList.lastElementChild;
            lastItem.classList.add('added');
            setTimeout(() => lastItem.classList.remove('added'), 500);
        }
    }

    // Function to toggle the completion status of a todo item
    function toggleComplete(index) {
        lists[currentList][index].completed = !lists[currentList][index].completed;
        saveLists(); // Save the updated lists to localStorage
        renderList(); // Render the updated list
    }

    // Function to delete a todo item from the current list
    function deleteTodo(index) {
        lists[currentList].splice(index, 1);
        saveLists(); // Save the updated lists to localStorage
        renderList(); // Render the updated list
    }

    // Function to create a new list
    function createNewList() {
        const name = listName.value.trim();
        if (name && !lists[name]) {
            lists[name] = [];
            currentList = name;
            saveLists(); // Save the updated lists to localStorage
            renderList(); // Render the new list
            listName.value = '';
        }
    }

    // Function to render the lists pane with all list names
    function renderListsPane() {
        listsContainer.innerHTML = ''; // Clear the current lists pane
        Object.keys(lists).forEach(listName => {
            const li = document.createElement('li');
            li.textContent = listName;
            li.addEventListener('click', () => {
                currentList = listName;
                renderList(); // Render the clicked list
                updateActiveList(); // Update the active list highlight
            });
            if (listName === currentList) {
                li.classList.add('active');
            }
            listsContainer.appendChild(li);
        });
    }

    // Function to update the active list highlight
    function updateActiveList() {
        const listItems = listsContainer.querySelectorAll('li');
        listItems.forEach(item => {
            if (item.textContent === currentList) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Add event listeners to the search, add, and new list buttons
    searchBtn.addEventListener('click', searchLists);
    addBtn.addEventListener('click', addTodo);
    newListBtn.addEventListener('click', createNewList);

    // Initial render of the current list and lists pane
    renderList();
    renderListsPane();
});
