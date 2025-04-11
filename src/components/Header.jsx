import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <Link to="/">
          <img src="/src/assets/images/waresolucions-removebg-preview.png" alt="Logo" className="app-header__logo" />
        </Link>
      </div>
      <nav className="app-header__nav">
        <ul>
        <li><a href="#home">Inicio</a></li>
          <li><a href="#about">Quiénes Somos</a></li>
          <li><a href="#services">Servicios</a></li>
          <li><a href="#contact">Contáctanos</a></li>
        </ul>
      </nav>
      <div className="app-header__right">
        <Link to="/login">
          <button className="app-login-btn">Iniciar Sesión</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
