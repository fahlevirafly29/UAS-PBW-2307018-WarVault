import axios from 'axios';

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY,
  },
});

export const getMovies = async (query = 'military') => {
  try {
    // Mencari film dengan kata kunci 'military' agar sesuai tema
    const response = await tmdb.get('/search/movie', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    return [];
  }
};