import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { deleteMovie, updateNote } from '../services/movieService'; 
import EditModal from '../components/EditModal';
import '../styles/Collection.css'; 

const Collection = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [tempNote, setTempNote] = useState('');
  const { user } = UserAuth();

  useEffect(() => {
    if (user?.email) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.email), (doc) => {
        setMovies(doc.data()?.savedMovies || []);
      });
      return () => unsubscribe();
    }
  }, [user?.email]);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateNote(user.email, movies, editingMovie.id, tempNote);
    setEditingMovie(null);
  };

  return (
    <div className="collection-page">
      <h2 className="vault-title">MY <span className="vault-highlight">VAULT</span></h2>
      
      <EditModal 
        movie={editingMovie} 
        note={tempNote} 
        setNote={setTempNote} 
        onSave={handleSave} 
        onCancel={() => setEditingMovie(null)} 
      />

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="image-container">
              <img className="movie-img" src={`https://image.tmdb.org/t/p/w500${movie.img}`} alt={movie.title} />
              <div className="overlay">
                <button className="btn-action btn-edit" onClick={() => { setEditingMovie(movie); setTempNote(movie.note || ''); }}>EDIT NOTE</button>
                <button className="btn-action btn-remove" onClick={() => deleteMovie(user.email, movies, movie.id)}>REMOVE</button>
              </div>
            </div>
            <div className="card-info">
              <h3>{movie.title}</h3>
              <p>RATING: {movie.rating.toFixed(1)}</p>
              {movie.note && <div className="note-box">{movie.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;