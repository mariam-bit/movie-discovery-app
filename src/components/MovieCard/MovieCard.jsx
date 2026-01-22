import React, { useContext } from 'react';
import { FavoritesContext } from '../../context/FavoritesContext';
import { fallbackPoster } from '../../services/api';
import './MovieCard.scss';

const MovieCard = ({ movie, onClick }) => {
  const { isFavorite } = useContext(FavoritesContext);
  const isMovieFavorite = isFavorite(movie.id);

  const hasRating =
    typeof movie.vote_average === 'number' && movie.vote_average > 0;

  const posterSrc = movie.poster_path || fallbackPoster(movie.title);

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-card-image">
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackPoster(movie.title);
          }}
        />

        {isMovieFavorite && <span className="favorite-badge">❤️</span>}

        <div className="movie-card-overlay">
          <p className="overlay-text">Click for details</p>
        </div>
      </div>

      <div className="movie-card-info">
        <h3 className="movie-title">{movie.title}</h3>

        <div className="movie-meta">
          <span className="rating">
            ⭐ {hasRating ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>

          <span className="year">
            {movie.release_date?.toString().split('-')[0] || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
