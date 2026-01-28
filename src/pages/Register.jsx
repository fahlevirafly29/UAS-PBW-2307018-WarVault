import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      await logOut(); 
      alert("Registrasi Berhasil, Prajurit! Silakan Login untuk memulai misi.");
      navigate('/login');
    } catch (error) {
      alert("Gagal! Pastikan email benar dan password min. 6 karakter.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>MISSION <span>REGISTRATION</span></h2> {/* <--- Judul harus REGISTRATION */}
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Daftarkan Email Intel" required />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Buat Passcode Strategis" required />
        <div className="auth-buttons">
          <button type="submit" className="btn-login">REGISTER</button>
        </div>
        <p>Sudah punya akses? <Link to="/login">Masuk Markas</Link></p>
      </form>
    </div>
  );
};

export default Register;