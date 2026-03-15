import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State management
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get API URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/todos`, newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
      setError('');
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  // Update todo
  const updateTodo = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/api/todos/${id}`, updatedData);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      setEditingTodo(null);
      setError('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await axios.delete(`${API_URL}/api/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
        setError('');
      } catch (err) {
        setError('Failed to delete todo. Please try again.');
        console.error('Error deleting todo:', err);
      }
    }
  };

  // Toggle todo completion
  const toggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📝 To-Do List Application</h1>
      </header>

      <main className="container">
        {/* Error Display */}
        {error && <div className="error-message">{error}</div>}

        {/* Create Todo Form */}
        <form onSubmit={createTodo} className="todo-form">
          <h2>Add New Task</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title *"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="form-input"
            />
            <textarea
              placeholder="Task description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="form-input"
              rows="3"
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>

        {/* Todos List */}
        <div className="todos-section">
          <h2>Your Tasks</h2>
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <div className="todos-list">
              {todos.length === 0 ? (
                <p className="no-todos">No tasks yet. Add one above!</p>
              ) : (
                todos.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    {editingTodo === todo.id ? (
                      // Edit mode
                      <div className="todo-edit">
                        <input
                          type="text"
                          defaultValue={todo.title}
                          onChange={(e) => todo.title = e.target.value}
                          className="edit-input"
                        />
                        <textarea
                          defaultValue={todo.description}
                          onChange={(e) => todo.description = e.target.value}
                          className="edit-input"
                          rows="2"
                        />
                        <div className="edit-actions">
                          <button
                            onClick={() => updateTodo(todo.id, { title: todo.title, description: todo.description })}
                            className="btn btn-success"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTodo(null)}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <>
                        <div className="todo-content">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo)}
                            className="todo-checkbox"
                          />
                          <div className="todo-text">
                            <h3 className={todo.completed ? 'completed-text' : ''}>{todo.title}</h3>
                            {todo.description && <p>{todo.description}</p>}
                          </div>
                        </div>
                        <div className="todo-actions">
                          <button
                            onClick={() => setEditingTodo(todo.id)}
                            className="btn btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="btn btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;