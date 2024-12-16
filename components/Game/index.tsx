import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

let intervalId: NodeJS.Timeout;

const solvedTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
const initialTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

// Utility function to shuffle tiles
const shuffleArray = (array: number[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export function GameScreen() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [prize, setPrize] = useState<string | null>(null);

  const isSolved = tiles.join() === solvedTiles.join();

  useEffect(() => {
    setTiles(shuffleArray([...initialTiles]));
  }, []);

  useEffect(() => {
    if (startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime]);

  useEffect(() => {
    if (moveCount === 1) {
      setStartTime(Date.now());
    }
  }, [moveCount]);

  useEffect(() => {
    if (tiles.join() === solvedTiles.join()) {
      let prize;
      if (elapsedTime <= 60) {
        prize = 'Gold';
      } else if (elapsedTime <= 120) {
        prize = 'Silver';
      } else {
        prize = 'Bronze';
      }
      setPrize(prize);
      clearInterval(intervalId);
    }
  }, [tiles, elapsedTime]);

  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const isAdjacent =
      [index - 1, index + 1, index - 4, index + 4].includes(emptyIndex) &&
      !(index % 4 === 0 && emptyIndex === index - 1) &&
      !(index % 4 === 3 && emptyIndex === index + 1);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoveCount((prev) => prev + 1);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-xl font-bold mb-4">Jigsaw Puzzle Game</Text>
      <Text className="text-lg mb-4">Moves: {moveCount}</Text>
      <Text className="text-lg mb-4">Time: {elapsedTime} seconds</Text>

      <View className="w-80 h-80 flex flex-wrap bg-gray-200 border border-gray-400">
        {tiles.map((tile, index) => (
          <TouchableOpacity
            key={index}
            className={clsx('w-1/4 h-1/4 border justify-center items-center', {
              'bg-gray-300': tile === 0,
              'bg-white': tile !== 0,
            })}
            onPress={() => moveTile(index)}
          >
            {tile !== 0 && <Text className="text-lg font-semibold text-gray-800">{tile}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {isSolved && (
        <Text className="mt-4 text-lg font-bold text-green-500">
          You solved the puzzle! Prize: {prize}
        </Text>
      )}
    </View>
  );
}
