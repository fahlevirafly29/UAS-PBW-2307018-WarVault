import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate('/');
    } catch (error) {
      alert("AKSES DITOLAK! Periksa kembali Email Intel dan Passcode kamu.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>MISSION <span>ACCESS</span></h2>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Intel" required />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Passcode" required />
        <div className="auth-buttons">
          <button type="submit" className="btn-login">LOGIN</button>
        </div>
        <p>Belum punya akses? <Link to="/register">Daftar Rekrutmen</Link></p>
      </form>
    </div>
  );
};

export default Login;