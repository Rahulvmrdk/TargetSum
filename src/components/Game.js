

/////////////////////////////////////////////////

import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber'
import shuffle from 'lodash.shuffle'

const Game = ({ randomNumberCount, initialSeconds, onPlayAgain }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);

  // Generate random numbers and target (only once per component mount)
  const { randomNumbers, target, shuffledRandomNumbers } = useMemo(() => {
    const nums = Array
      .from({ length: randomNumberCount })
      .map(() => 1 + Math.floor(10 * Math.random()));
    
    const targetSum = nums
      .slice(0, randomNumberCount - 2)
      .reduce((acc, curr) => acc + curr, 0);
    
    const shuffled = shuffle(nums);
    
    return {
      randomNumbers: nums,
      target: targetSum,
      shuffledRandomNumbers: shuffled
    };
  }, [randomNumberCount]);

  // Calculate game status
  const calcGameStatus = (currentSelectedIds, currentRemainingSeconds) => {
    const sumSelected = currentSelectedIds.reduce((acc, curr) => {
      return acc + shuffledRandomNumbers[curr];
    }, 0);
    
    if (currentRemainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < target) {
      return 'PLAYING';
    }
    if (sumSelected === target) {
      return 'WON';
    }
    if (sumSelected > target) {
      return 'LOST';
    }
  };

  const gameStatus = calcGameStatus(selectedIds, remainingSeconds);

  // Timer effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Stop timer when game ends
  useEffect(() => {
    if (gameStatus !== 'PLAYING' && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [gameStatus]);

  const isNumberSelected = (numberIndex) => {
    return selectedIds.indexOf(numberIndex) >= 0;
  };

  const selectNumber = (numberIndex) => {
    setSelectedIds(prevSelectedIds => [...prevSelectedIds, numberIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
        {target}
      </Text>
      <View style={styles.randomContainer}>
        {shuffledRandomNumbers.map((randomNumber, index) => (
          <RandomNumber 
            key={index} 
            id={index}
            number={randomNumber}
            isDisabled={isNumberSelected(index) || gameStatus !== 'PLAYING'}
            onPress={selectNumber}
          />
        ))}
      </View>
      <Text style={styles.timer}>{remainingSeconds}</Text>
      <Button title="Play Again" color="#841584" onPress={onPlayAgain} />
      
    </View>
  );
};

Game.propTypes = {
  randomNumberCount: PropTypes.number.isRequired,
  initialSeconds: PropTypes.number.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 60,
  },
  target: {
    fontSize: 50,
    backgroundColor: '#bbb',
    marginHorizontal: 10,
    textAlign: 'center'
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 40,
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb'
  },
  STATUS_WON: {
    backgroundColor: 'green'
  },
  STATUS_LOST: {
    backgroundColor: 'red'
  },
  timer: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  }
});

export default Game;