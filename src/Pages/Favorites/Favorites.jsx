import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../../context/FavoritesContext';
import { LanguageContext } from '../../context/LanguageContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Favorites.scss';

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <div className="page favorites-page">
      <h1 className="page-title">❤️ {t('favorites')}</h1>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">💔</div>
          <p className="empty-text">{t('noFavorites')}</p>
          <button onClick={() => navigate('/browse')} className="browse-button">
            {t('browse')}
          </button>
        </div>
      ) : (
        <div className="favorites-content">
          <p className="favorites-count">
            You have {favorites.length} favorite {favorites.length === 1 ? 'movie' : 'movies'}
          </p>

          <div className="movies-grid">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
