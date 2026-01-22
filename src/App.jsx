import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home/Home';
import Browse from './Pages/Browse/Browse';
import MovieDetails from './Pages/MovieDetails/MovieDetails';
import Favorites from './Pages/Favorites/Favorites';
import './App.scss';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </FavoritesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;