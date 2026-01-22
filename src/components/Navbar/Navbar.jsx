import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import './Navbar.scss';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, toggleLanguage, t } = useContext(LanguageContext);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🎬 MovieApp
        </Link>

        <button 
          className="nav-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            {t('home')}
          </Link>
          <Link to="/browse" className="nav-link" onClick={closeMenu}>
            {t('browse')}
          </Link>
          <Link to="/favorites" className="nav-link" onClick={closeMenu}>
            {t('favorites')}
          </Link>

          <div className="nav-actions">
            <button 
              onClick={toggleTheme} 
              className="nav-btn theme-btn"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button 
              onClick={toggleLanguage} 
              className="nav-btn lang-btn"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'EN' : 'ქარ'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;