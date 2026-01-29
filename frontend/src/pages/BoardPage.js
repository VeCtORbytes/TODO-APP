import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchBoard();
    fetchTodos();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const { data } = await api.get(`/boards/${boardId}`);
      setBoard(data);
    } catch {
      navigate('/dashboard');
    }
  };

  const fetchTodos = async () => {
    try {
      const { data } = await api.get(`/todos/${boardId}`);
      setTodos(data);
    } catch {
      console.error('Failed to fetch todos');
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const { data } = await api.post('/todos', {
        boardId,
        title,
        description,
        priority
      });
      setTodos([data, ...todos]);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch {
      alert('Failed to create todo');
    }
  };

  const updateTodoStatus = async (todoId, newStatus) => {
    try {
      const { data } = await api.put(`/todos/${todoId}`, { status: newStatus });
      setTodos(todos.map(t => t._id === todoId ? data : t));
    } catch {
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (todoId) => {
    if (window.confirm('Delete todo?')) {
      try {
        await api.delete(`/todos/${todoId}`);
        setTodos(todos.filter(t => t._id !== todoId));
      } catch {
        alert('Failed to delete todo');
      }
    }
  };

  if (!board) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Boards
      </button>

      <h1>{board.title}</h1>
      <p>{board.description}</p>

      <form onSubmit={createTodo} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Add Todo</h3>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Add Todo
        </button>
      </form>

      <h2>Todos ({todos.length})</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {todos.map(todo => (
          <div key={todo._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{todo.title}</h3>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>{todo.description}</p>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', marginBottom: '10px' }}>
              <span>Priority: <strong>{todo.priority}</strong></span>
              <span>Status: <strong>{todo.status}</strong></span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={todo.status}
                onChange={(e) => updateTodoStatus(todo._id, e.target.value)}
                style={{ padding: '4px' }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => deleteTodo(todo._id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}