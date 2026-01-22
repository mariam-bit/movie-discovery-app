import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { movieAPI, fallbackPoster } from '../../services/api';
import { LanguageContext } from '../../context/LanguageContext';
import { FavoritesContext } from '../../context/FavoritesContext';
import Modal from '../../components/Modal/Modal';
import './MovieDetails.scss';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);
  const [showModal, setShowModal] = useState(false);

  const { t } = useContext(LanguageContext);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    if (location.state?.movie) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await movieAPI.getMovieDetails(id);
        setMovie(response.data); 
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, location.state]);

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page movie-details-page">
        <button onClick={() => navigate(-1)} className="back-button">
          ← {t('backToHome')}
        </button>
        <p>Movie not found (try going back and opening it again).</p>
      </div>
    );
  }

  const posterSrc = movie.poster_path || fallbackPoster(movie.title);
  const movieFavorite = isFavorite(movie.id);

  const hasRating =
    typeof movie.vote_average === 'number' && movie.vote_average > 0;

  return (
    <div className="page movie-details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← {t('backToHome')}
      </button>

      <div className="movie-details-container">
        <div className="movie-poster-section">
          <img
            src={posterSrc}
            alt={movie.title}
            className="movie-poster-large"
            onError={(e) => {
              e.currentTarget.src = fallbackPoster(movie.title);
            }}
          />
        </div>

        <div className="movie-info-section">
          <h1 className="movie-title-large">{movie.title}</h1>

          <div className="movie-stats">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">
                {hasRating ? movie.vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{movie.release_date || 'N/A'}</span>
            </div>

            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">
                {movie.runtime ? `${movie.runtime} ${t('minutes')}` : 'N/A'}
              </span>
            </div>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="genres-section">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="overview-section">
            <h3>{t('overview')}</h3>
            <p className="overview-text">{movie.overview}</p>
          </div>

          <button
            onClick={handleFavoriteToggle}
            className={`favorite-button ${movieFavorite ? 'active' : ''}`}
          >
            {movieFavorite ? (
              <>❤️ {t('removeFromFavorites')}</>
            ) : (
              <>🤍 {t('addToFavorites')}</>
            )}
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-success">
          <h2>✅ {t('success')}</h2>
          <p>{t('addedToFavorites')}</p>
        </div>
      </Modal>
    </div>
  );
};

export default MovieDetails;
