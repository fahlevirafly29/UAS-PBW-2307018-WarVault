import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Menambahkan logOut dari AuthContext
  const { logIn, signUp, logOut } = UserAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        // Alur Login: Langsung masuk ke Home
        await logIn(email, password);
        navigate('/');
      } else {
        // Alur Register: Daftar lalu paksa Logout agar login manual
        await signUp(email, password);
        await logOut(); 
        
        alert("Registrasi Berhasil, Prajurit! Silakan Login untuk memulai misi.");
        
        // Mengosongkan form setelah berhasil daftar
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      // Menampilkan pesan jika password < 6 karakter atau email tidak valid
      alert("Gagal! Pastikan email benar dan password min. 6 karakter.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>MISSION <span>ACCESS</span></h2>
        <input 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} // Ditambahkan agar form bisa dikosongkan otomatis
          type="email" 
          placeholder="Email Intel" 
        />
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} // Ditambahkan agar form bisa dikosongkan otomatis
          type="password" 
          placeholder="Passcode" 
        />
        <div className="auth-buttons">
          <button onClick={(e) => handleSubmit(e, 'login')} className="btn-login">LOGIN</button>
          <button onClick={(e) => handleSubmit(e, 'signup')} className="btn-signup">REGISTER</button>
        </div>
      </form>
    </div>
  );
};

export default Login;