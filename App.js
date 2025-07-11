
//////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Game from './src/components/Game';

export default function App() {
  const [gameId, setGameId] = useState(1);

  const resetGame = () => {
    setGameId(prevGameId => prevGameId + 1);
  };

  return (
    <Game 
      key={gameId}
      onPlayAgain={resetGame}
      randomNumberCount={6} 
      initialSeconds={10}
    />
  );
}
