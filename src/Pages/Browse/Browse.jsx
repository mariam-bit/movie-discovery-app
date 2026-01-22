import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../../services/api';
import { LanguageContext } from '../../context/LanguageContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Browse.scss';

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.getPopular();
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const response = await movieAPI.searchMovies(searchQuery);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearched(false);
    fetchPopularMovies();
  };

  return (
    <div className="page browse-page">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>

          {searched && (
            <button type="button" onClick={handleReset} className="reset-btn">
              ✕
            </button>
          )}
        </form>
      </div>

      <h2 className="section-title">
        {searched ? t('searchResults') : t('popular')}
      </h2>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t('loading')}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="no-results">
          <p>😕 {t('noResults')}</p>
          <button onClick={handleReset} className="back-btn">
            {t('backToHome')}
          </button>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
