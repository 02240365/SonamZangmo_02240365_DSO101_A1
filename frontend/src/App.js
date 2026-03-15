import React, { useState, useEffect } from 'react';  // React hooks
import axios from 'axios';  // For API calls

function App() {
  // ===== STATE VARIABLES (data that can change) =====
  
  // useState returns [currentValue, functionToChangeIt]
  const [todos, setTodos] = useState([]);        // List of todos (starts empty)
  const [task, setTask] = useState('');           // Current input field value
  const [editingId, setEditingId] = useState(null); // Which todo is being edited?
  const [editTask, setEditTask] = useState('');    // Edited text value

  // Get API URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  // ===== LOAD DATA WHEN COMPONENT STARTS =====
  // useEffect runs when component first appears on screen
  useEffect(() => {
    fetchTodos();
  }, []); // Empty array = run only once

  // ===== FUNCTIONS (what the app can do) =====

  // 1. Get all todos from backend
  const fetchTodos = async () => {
    try {
      // Ask backend for todos
      const response = await axios.get(`${API_URL}/api/todos`);
      // Update the todos state with response data
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  // 2. Add new todo
  const addTodo = async (e) => {
    e.preventDefault(); // Stop form from refreshing page
    
    // Don't add empty tasks
    if (!task.trim()) return;
    
    try {
      // Send new todo to backend
      await axios.post(`${API_URL}/api/todos`, { task });
      
      // Clear input field
      setTask('');
      
      // Refresh the list to show new todo
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // 3. Delete todo
  const deleteTodo = async (id) => {
    try {
      // Tell backend to delete this todo
      await axios.delete(`${API_URL}/api/todos/${id}`);
      
      // Refresh list
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  // 4. Start editing (when user clicks Edit button)
  const startEdit = (todo) => {
    setEditingId(todo.id);      // Remember which todo we're editing
    setEditTask(todo.task);      // Fill edit field with current task
  };

  // 5. Save edited todo
  const updateTodo = async (id) => {
    try {
      // Find the todo we're editing
      const todo = todos.find(t => t.id === id);
      
      // Send update to backend
      await axios.put(`${API_URL}/api/todos/${id}`, {
        task: editTask,
        completed: todo.completed
      });
      
      // Exit edit mode
      setEditingId(null);
      
      // Refresh list
      fetchTodos();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // 6. Toggle complete status (checkbox)
  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      
      // Send update with opposite completed value
      await axios.put(`${API_URL}/api/todos/${id}`, {
        task: todo.task,
        completed: !todo.completed
      });
      
      fetchTodos();
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  // ===== WHAT THE USER SEES (JSX = HTML in JavaScript) =====
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Todo List</h1>
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}  // Update state as user types
          placeholder="Enter a task"
          style={{ padding: '8px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
            
            {/* If this todo is being edited, show edit form */}
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  style={{ padding: '4px', width: '60%' }}
                />
                <button onClick={() => updateTodo(todo.id)} style={{ marginLeft: '10px' }}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px' }}>
                  Cancel
                </button>
              </>
            ) : (
              // Otherwise show normal todo
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.task}
                </span>
                <button onClick={() => startEdit(todo)} style={{ marginLeft: '10px' }}>
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '5px' }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;  // Make this component available to other files