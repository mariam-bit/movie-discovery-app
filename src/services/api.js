import axios from 'axios';

const BASE_URL = 'https://api.sampleapis.com/movies';

const api = axios.create({
  baseURL: BASE_URL,
});

const ensureHttps = (url) =>
  typeof url === 'string' ? url.replace(/^http:\/\//, 'https://') : null;

export const fallbackPoster = (title = 'No Image') =>
  `https://via.placeholder.com/500x750/1a1a2e/eee?text=${encodeURIComponent(title)}`;

const getRating = (movie) => {
  const candidates = [movie.imdbRating, movie.rating, movie.score];
  for (const v of candidates) {
    if (v == null) continue;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      const n = Number.parseFloat(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null; 
};

const getReleaseDate = (movie) => movie.releaseDate || movie.year || 'N/A';

const isValidPoster = (url) => {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!u) return false;
  return u.startsWith('http://') || u.startsWith('https://');
};

const transformMovie = (movie, index) => {
  const rating = getRating(movie);

  return {
    id: movie.id ?? index,
    title: movie.title || 'Unknown Title',
    poster_path: ensureHttps(movie.posterURL) || null,
    vote_average: rating ?? 0, 
    release_date: getReleaseDate(movie),
    overview: movie.synopsis || movie.description || 'No description available.',
    runtime: movie.runtime || null,
    genres: Array.isArray(movie.genres)
      ? movie.genres.map((g, i) => ({ id: i, name: g }))
      : [],
  };
};

const BLOCKED_TITLES = new Set([
  'it happened one night',
  'up',
  'finding nemo',
  'kind hearts and coronets',
  'la dolce vita',
  'birdman',
]);

const cleanResults = (arr) => {
  const filteredByTitle = arr.filter((m) => {
    const title = (m.title || '').trim().toLowerCase();
    return !BLOCKED_TITLES.has(title);
  });

  const withPoster = filteredByTitle.filter((m) => isValidPoster(m.posterURL));

  return withPoster.map(transformMovie);
};

export const movieAPI = {
  getTrending: async () => {
    const { data } = await api.get('/action-adventure');
    const results = cleanResults(data).slice(0, 20);
    return { data: { results } };
  },

  getPopular: async () => {
    const { data } = await api.get('/comedy');
    const results = cleanResults(data).slice(0, 40);
    return { data: { results } };
  },

  searchMovies: async (query) => {
    const { data } = await api.get('/drama');
    const q = (query || '').toLowerCase();

    const filtered = data.filter((m) =>
      (m.title || '').toLowerCase().includes(q)
    );

    const results = cleanResults(filtered).slice(0, 40);
    return { data: { results } };
  },

  getMovieDetails: async (id) => {
    const numericId = Number.parseInt(id, 10);
    const categories = ['/action-adventure', '/comedy', '/drama', '/animation'];

    for (const cat of categories) {
      const { data } = await api.get(cat);
      const found = data.find((m) => m.id === numericId);
      if (found) return { data: transformMovie(found, 0) };
    }

    return { data: null };
  },
};
