import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Pencil, Check, X, ClipboardList,
  CheckCircle2, Circle, Loader2, AlertCircle
} from 'lucide-react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim() }),
      });
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      setInput('');
    } catch {
      setError('Failed to add task.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editValue.trim() }),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditId(null);
    } catch {
      setError('Failed to edit task.');
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') action();
    if (e.key === 'Escape') setEditId(null);
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-icon">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="header-title">TaskFlow</h1>
            <p className="header-sub">Sonam Zangmo · 02240365</p>
          </div>
          {totalCount > 0 && (
            <div className="header-stats">
              <span className="stat">{completedCount}/{totalCount}</span>
              <span className="stat-label">done</span>
            </div>
          )}
        </header>

        {/* Error */}
        {error && (
          <div className="error-bar">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={14} /></button>
          </div>
        )}

        {/* Add Task */}
        <div className="add-bar">
          <input
            className="add-input"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => handleKeyDown(e, addTask)}
            disabled={submitting}
          />
          <button
            className="add-btn"
            onClick={addTask}
            disabled={submitting || !input.trim()}
          >
            {submitting ? <Loader2 size={18} className="spin" /> : <Plus size={18} />}
            <span>Add</span>
          </button>
        </div>

        {/* Filter Tabs */}
        {totalCount > 0 && (
          <div className="filter-tabs">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="tab-count">
                  {f === 'all' ? totalCount
                    : f === 'active' ? tasks.filter(t => !t.completed).length
                    : completedCount}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="empty-state">
              <Loader2 size={32} className="spin" />
              <p>Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={40} strokeWidth={1.5} />
              <p>{filter === 'completed' ? 'No completed tasks yet.' : filter === 'active' ? 'All tasks done!' : 'No tasks yet. Add one above!'}</p>
            </div>
          ) : (
            filtered.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
                {/* Check */}
                <button className="check-btn" onClick={() => toggleComplete(task)}>
                  {task.completed
                    ? <CheckCircle2 size={22} className="check-icon done" />
                    : <Circle size={22} className="check-icon" />}
                </button>

                {/* Title / Edit */}
                {editId === task.id ? (
                  <input
                    className="edit-input"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => handleKeyDown(e, () => saveEdit(task.id))}
                    autoFocus
                  />
                ) : (
                  <span className="task-title">{task.title}</span>
                )}

                {/* Actions */}
                <div className="task-actions">
                  {editId === task.id ? (
                    <>
                      <button className="action-btn save" onClick={() => saveEdit(task.id)}>
                        <Check size={16} />
                      </button>
                      <button className="action-btn cancel" onClick={() => setEditId(null)}>
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn edit" onClick={() => startEdit(task)} disabled={task.completed}>
                        <Pencil size={15} />
                      </button>
                      <button className="action-btn delete" onClick={() => deleteTask(task.id)}>
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <span>DSO101 Assignment 1 · CI/CD Pipeline</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
