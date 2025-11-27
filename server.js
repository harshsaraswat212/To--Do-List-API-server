// JavaScript source code
// To-Do List API - In-Memory CRUD using Express.js

// 1. Setup Express
const express = require('express');
const app = express();
const port = 3001; // Using a different port to avoid conflict with the student manager

// Middleware to parse JSON request bodies
app.use(express.json());

// 2. In-Memory Data Store
let todos = [
    { id: 1, task: "Learn Node", done: false }
];

// Simple mechanism for generating unique IDs
let nextId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

// --- ROUTES ---

// 1. GET /todos - List all tasks
app.get('/todos', (req, res) => {
    console.log('GET /todos request received.');
    // Return the entire array of to-do items
    res.status(200).json(todos);
});

// 2. POST /todos - Add a new task
app.post('/todos', (req, res) => {
    console.log('POST /todos request received.');
    const { task } = req.body;

    // Basic validation
    if (!task || typeof task !== 'string') {
        return res.status(400).json({ error: "Invalid request body. 'task' (string) is required." });
    }

    // Create the new to-do item
    const newTodo = {
        id: nextId++,
        task: task,
        done: false // New tasks always start as not done
    };

    // Add the new item to the in-memory array
    todos.push(newTodo);

    console.log(`Added new task: ${JSON.stringify(newTodo)}`);
    // Return the created object with a 201 Created status
    res.status(201).json(newTodo);
});

// 3. PATCH /todos/:id - Mark task as done (Update)
app.patch('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    console.log(`PATCH /todos/${todoId} request received.`);

    // Find the index of the to-do item
    const todoIndex = todos.findIndex(t => t.id === todoId);

    if (todoIndex === -1) {
        // If not found, return a 404 Not Found error
        return res.status(404).json({ error: `Task with ID ${todoId} not found.` });
    }

    // Update the 'done' property of the found task to true
    todos[todoIndex].done = true;

    const updatedTodo = todos[todoIndex];

    console.log(`Task ${todoId} marked as done.`);

    // Return the updated task object
    res.status(200).json({
        message: "Task updated",
        todo: updatedTodo
    });
});


// 4. Start the server
app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`To-Do List API running on http://localhost:${port}`);
    console.log(`\nAvailable Routes:`);
    console.log(`- GET /todos (List all)`);
    console.log(`- POST /todos (Add new task)`);
    console.log(`- PATCH /todos/:id (Mark task as done)`);
    console.log(`======================================================\n`);
});