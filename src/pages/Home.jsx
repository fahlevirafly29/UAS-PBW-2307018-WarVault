import { useState, useEffect } from 'react';
import { getMovies } from '../services/tmdb';
import { db } from '../services/firebase';
import { UserAuth } from '../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { addMovieToVault } from '../services/movieService'; 
import '../styles/Collection.css'; 

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]); // State untuk cek duplikat
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = UserAuth();

  // Fetch daftar film dari TMDB (Read API)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getMovies(searchTerm || 'military').then(setMovies);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Sinkronisasi daftar koleksi (untuk mencegah duplikat saat save)
  useEffect(() => {
    if (user?.email) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.email), (doc) => {
        setSavedMovies(doc.data()?.savedMovies || []);
      });
      return () => unsubscribe();
    }
  }, [user?.email]);

  // Service: Create (Menyimpan Film)
  const handleSave = async (movie) => {
    if (user?.email) {
      const response = await addMovieToVault(user.email, savedMovies, movie);
      if (response.success) {
        alert("BERHASIL: Data telah diamankan di Vault.");
      }
    } else {
      alert("AKSES DITOLAK: Harap login terlebih dahulu.");
    }
  };

  return (
    <div className="home-page" style={{ padding: '20px' }}>
      <div className="search-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="CARI OPERASI MILITER / FILM..." 
          className="search-input"
          style={{ 
            width: '80%', maxWidth: '600px', padding: '12px', 
            background: '#141414', border: '1px solid #e50914', color: 'white' 
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="image-container">
              <img 
                className="movie-img"
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                alt={movie.title} 
              />
              <div className="overlay">
                 <span style={{ color: 'white', fontWeight: 'bold' }}>RATING: {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="card-info" style={{ padding: '15px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{movie.title}</h3>
              <p style={{ color: '#aaa', fontSize: '0.8rem' }}>RELEASE: {movie.release_date?.split('-')[0]}</p>
              
              {/* TOMBOL SAVE */}
              <button 
                onClick={() => handleSave(movie)} 
                className="btn-save-home"
                style={{
                  width: '100%', marginTop: '15px', padding: '10px',
                  backgroundColor: '#e50914', color: 'white', border: 'none',
                  fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px'
                }}
              >
                SAVE TO VAULT
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;