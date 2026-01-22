import React, { useState, useEffect, useRef } from 'react';
import './MovieBanner.scss';

const MovieBanner = ({ movies, onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const timerRef = useRef(null);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
    return `https://image.tmdb.org/t/p/w1280${path}`;
  };

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    movies.forEach((movie) => {
      const img = new Image();
      img.src = getImageUrl(movie.backdrop_path || movie.poster_path);
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, movie.id]));
      };
    });
  }, [movies]);

  useEffect(() => {
    if (movies && movies.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentIndex, movies]);

  const handleNext = () => {
    if (!isTransitioning && movies.length > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning && movies.length > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  if (!movies || movies.length === 0) {
    return <div className="movie-banner">Loading...</div>;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="movie-banner">
      <div 
        className={`banner-background ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path || currentMovie.poster_path)})`
        }}
      />

      <div className="banner-overlay" />

      <div className="banner-container">
        <div className={`banner-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <h1 className="banner-title">{currentMovie.title || currentMovie.name}</h1>
          
          <div className="banner-meta">
            <span className="banner-rating">
              ⭐ {currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : 'N/A'}
            </span>
            <span className="banner-divider">•</span>
            <span className="banner-year">
              {currentMovie.release_date?.substring(0, 4) || 
               currentMovie.first_air_date?.substring(0, 4) || 
               'N/A'}
            </span>
          </div>

          <p className="banner-description">
            {currentMovie.overview || 'No description available.'}
          </p>

          <div className="banner-buttons">
            <button 
              className="btn-primary"
              onClick={() => onMovieClick && onMovieClick(currentMovie)}
            >
              <span className="btn-icon">▶</span>
              Watch Now
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onMovieClick && onMovieClick(currentMovie)}
            >
              <span className="btn-icon"></span>
              More Info
            </button>
          </div>
        </div>
      </div>


      <button className="banner-nav prev" onClick={handlePrev} aria-label="Previous">
        ‹
      </button>
      <button className="banner-nav next" onClick={handleNext} aria-label="Next">
        ›
      </button>

      <div className="banner-pagination">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    
    </div>
  );
};

export default function App() {
  const sampleMovies = [
    {
      id: 1,
      title: "The Matrix Resurrections",
      overview: "Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a physical or mental construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more.",
      backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
      vote_average: 8.7,
      release_date: "2024-01-15"
    },
    {
      id: 2,
      title: "Dune: Part Two",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
      backdrop_path: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop",
      vote_average: 9.2,
      release_date: "2024-03-01"
    },
    {
      id: 3,
      title: "Inception",
      overview: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      backdrop_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
      vote_average: 8.8,
      release_date: "2024-02-20"
    },
    {
      id: 4,
      title: "Interstellar",
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      backdrop_path: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
      vote_average: 8.6,
      release_date: "2024-01-10"
    },
    {
      id: 5,
      title: "Blade Runner 2049",
      overview: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
      backdrop_path: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",
      vote_average: 8.5,
      release_date: "2024-02-05"
    }
  ];

  const handleMovieClick = (movie) => {
    alert(`Clicked: ${movie.title}`);
  };

  return (
    <div style={{ minHeight: '5vh' }}>
      <MovieBanner movies={sampleMovies} onMovieClick={handleMovieClick} />
     
      </div>
   
  );
}