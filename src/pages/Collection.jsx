import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const Collection = () => {
  const [movies, setMovies] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    if (user?.email) {
      // Fungsi CRUD: Read (Membaca Data secara Real-time)
      const unsubscribe = onSnapshot(doc(db, 'users', user.email), (doc) => {
        setMovies(doc.data()?.savedMovies || []);
      });
      return () => unsubscribe();
    }
  }, [user?.email]);

  // Fungsi CRUD: Delete (Menghapus Data)
  const deleteMovie = async (passedID) => {
    try {
      const result = movies.filter((item) => item.id !== passedID);
      await updateDoc(doc(db, 'users', user.email), {
        savedMovies: result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="collection-page">
      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>MY <span>VAULT</span></h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="card-image">
              <img src={`https://image.tmdb.org/t/p/w500${movie.img}`} alt={movie.title} />
              <div className="overlay">
                <button onClick={() => deleteMovie(movie.id)} className="btn-delete">❌ REMOVE</button>
              </div>
            </div>
            <div className="card-info">
              <h3>{movie.title}</h3>
              <span className="rating">⭐ {movie.rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;