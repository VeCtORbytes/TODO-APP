import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await api.get('/boards');
      setBoards(data);
    } catch {
      setError('Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const { data } = await api.post('/boards', { title });
      setBoards([data, ...boards]);
      setTitle('');
    } catch {
      setError('Failed to create board');
    }
  };

  const deleteBoard = async (id) => {
    if (window.confirm('Delete board?')) {
      try {
        await api.delete(`/boards/${id}`);
        setBoards(boards.filter(b => b._id !== id));
      } catch {
        setError('Failed to delete board');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard - {user?.name}</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={createBoard} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Create Board
        </button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {boards.map(board => (
            <div key={board._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', cursor: 'pointer' }}>
              <h3 onClick={() => navigate(`/board/${board._id}`)} style={{ margin: '0 0 10px 0' }}>
                {board.title}
              </h3>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                {board.description || 'No description'}
              </p>
              <button
                onClick={() => deleteBoard(board._id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}