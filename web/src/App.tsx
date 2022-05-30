import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { render } from 'react-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import logo from './logo.svg';
import './App.css';

import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import GameRoomPage from './pages/GameRoomPage/GameRoomPage';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/room" element={<GameRoomPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>    
      </BrowserRouter>
    );
  }
}

export default App;
