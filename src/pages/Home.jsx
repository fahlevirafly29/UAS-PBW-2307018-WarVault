import { useState, useEffect } from 'react';
import { getMovies } from '../services/tmdb';
import { db } from '../services/firebase'; // Import database
import { UserAuth } from '../context/AuthContext';
import { arrayUnion, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = UserAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getMovies(searchTerm || 'military').then(setMovies);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Fungsi CRUD: Create (Menyimpan Film)
  const saveMovie = async (movie) => {
    if (user?.email) {
      const userDoc = doc(db, 'users', user.email);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        await setDoc(userDoc, { savedMovies: [] });
      }

      await updateDoc(userDoc, {
        savedMovies: arrayUnion({
          id: movie.id,
          title: movie.title,
          img: movie.poster_path,
          rating: movie.vote_average
        }),
      });
      alert("Film berhasil masuk ke Vault!");
    } else {
      alert("Harap login untuk menyimpan film!");
    }
  };

  return (
    <div className="home-page">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Cari film aksi..." 
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="card-image">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                alt={movie.title} 
              />
              <div className="overlay">
                <button onClick={() => saveMovie(movie)} className="btn-save">💾 SAVE</button>
                <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <div className="card-info">
              <h3>{movie.title}</h3>
              <p>{movie.release_date?.split('-')[0]}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;