import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { render } from 'react-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import logo from './logo.svg';
import './App.css';
import {io} from "socket.io-client";

import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import GameRoomPage from './pages/GameRoomPage/GameRoomPage';

import socketService from './services/socketService';
import GameContext, { IGameContextProps } from './gameContext';



const GAME_SERVER_URL = process.env.REACT_APP_GAME_SERVER_URL as string;

export default function App () {

  const [isInRoom, setInRoom] = useState(false);

  const connectSocket = async () => {
    console.log(GAME_SERVER_URL);
    const socket = await socketService.connect(GAME_SERVER_URL).catch((err)=> {
      console.log("Cannot Connect to Server Error: ", err);
    });
  }

  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom
  }

  return (
    <GameContext.Provider value={gameContextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/room" element={<GameRoomPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>    
      </BrowserRouter>
    </GameContext.Provider>
    
  );
  
}
