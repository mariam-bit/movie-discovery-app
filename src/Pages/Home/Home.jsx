import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../../services/api';
import { LanguageContext } from '../../context/LanguageContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import MovieBanner from '../../components/MovieBanner/MovieBanner';
import './Home.scss';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const response = await movieAPI.getTrending();
        setTrendingMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  const bannerMovies = trendingMovies.slice(0, 5);
  const gridMovies = trendingMovies.slice(5, 17);

  return (
    <div className="page home-page">
      <MovieBanner 
        movies={bannerMovies} 
        onMovieClick={(movie) => navigate(`/movie/${movie.id}`, { state: { movie } })}
      />

     

      <div className="movies-grid">
        {gridMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;