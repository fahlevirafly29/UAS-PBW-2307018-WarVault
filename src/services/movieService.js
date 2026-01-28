import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Internal: Sinkronisasi data ke Firebase
export const syncMoviesToFirebase = async (userEmail, updatedMovies) => {
  try {
    const userRef = doc(db, 'users', userEmail);
    await updateDoc(userRef, { savedMovies: updatedMovies });
    return { success: true };
  } catch (error) {
    console.error("Firebase Error:", error);
    return { success: false };
  }
};

// CREATE: Menambah film baru ke Vault
export const addMovieToVault = async (userEmail, currentMovies, movieToAdd) => {
  // Validasi: Cek apakah film sudah ada di koleksi
  const isExist = currentMovies.find((item) => item.id === movieToAdd.id);
  
  if (isExist) {
    alert("Film ini sudah tersimpan di markas!");
    return { success: false };
  }

  // Menyiapkan objek film baru untuk ditambahkan
  const updatedMovies = [...currentMovies, {
    id: movieToAdd.id,
    title: movieToAdd.title || movieToAdd.name,
    img: movieToAdd.poster_path,
    rating: movieToAdd.vote_average,
    note: "" // Default catatan kosong untuk fitur Update nanti
  }];

  return await syncMoviesToFirebase(userEmail, updatedMovies);
};

// DELETE: Menghapus film dari koleksi
export const deleteMovie = async (userEmail, allMovies, movieID) => {
  const filtered = allMovies.filter((item) => item.id !== movieID);
  return await syncMoviesToFirebase(userEmail, filtered);
};

// UPDATE: Mengubah catatan (note) pada film
export const updateNote = async (userEmail, allMovies, movieID, newNote) => {
  const updated = allMovies.map((item) => 
    item.id === movieID ? { ...item, note: newNote } : item
  );
  return await syncMoviesToFirebase(userEmail, updated);
};