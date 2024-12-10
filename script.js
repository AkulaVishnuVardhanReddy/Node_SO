const API_BASE = "http://localhost:4000"; 

if (document.getElementById("loginForm")) {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                window.location.href = "todos.html";
            } else {
                loginMessage.textContent = "Login failed. Try again.";
            }
        } catch (error) {
            loginMessage.textContent = "Error logging in.";
            console.error(error);
        }
    });
}

if (document.getElementById("fileUploadForm")) {
    const fileUploadForm = document.getElementById("fileUploadForm");
    const fileList = document.getElementById("fileList");

    const fetchFiles = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch(`${API_BASE}/files`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const files = await response.json();
            fileList.innerHTML = files
                .map((file) => `<li>${file.filename} <button onclick="deleteFile(${file.id})">Delete</button></li>`)
                .join("\n");
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    fileUploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("fileInput").files[0];
        const token = sessionStorage.getItem("token");

        const formData = new FormData();
        formData.append("file", fileInput);

        try {
            await fetch(`${API_BASE}/files/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            fetchFiles();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    });

    window.deleteFile = async (id) => {
        const token = sessionStorage.getItem("token");
        try {
            await fetch(`${API_BASE}/files/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFiles();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    fetchFiles();
}

if (document.getElementById("addTodoButton")) {
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const token = sessionStorage.getItem("token");

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_BASE}/items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const todos = await response.json();
            todoList.innerHTML = todos
                .map((todo) => `<li>${todo.name} <button onclick="deleteTodo(${todo.id})">Delete</button></li>`)
                .join("");
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    document.getElementById("addTodoButton").addEventListener("click", async () => {
        const name = todoInput.value;
        const description = todoInputdesc.value;
        try {
            await fetch(`${API_BASE}/items`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name,description }),
            });
            todoInput.value = "";
            todoInputdesc.value = "";
            fetchTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    });

    window.deleteTodo = async (id) => {
        try {
            await fetch(`${API_BASE}/items/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTodos();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    fetchTodos();
}
