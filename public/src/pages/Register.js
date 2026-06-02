import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await register(form.name, form.email, form.password, form.phone); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">🚖 RideGo</div>
        <h2>Create Account</h2>
        <p className="subtitle">Start riding in minutes</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Full Name</label>
            <input type="text" placeholder="Arun Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="field"><label>Email</label>
            <input type="email" placeholder="arun@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="field"><label>Phone</label>
            <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div className="field"><label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p className="switch-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
