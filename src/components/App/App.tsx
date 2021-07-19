import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { minSizeMatrix, maxSizeMatrix } from '../utils/constants';
import './App.css';

type matrix = number[][];

const App: React.FC = () => {
  const [matrix, setMatrix] = useState<matrix>([]);

  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
  const [curInterval, setCurInterval] = useState<any>();

  useEffect(() => {
    console.log(matrix);
  }, [matrix]);

  useEffect(() => {
    updateMatrixSize();
    function setIsMousePressedTrue() {
      setIsMousePressed(true);
    }

    function setIsMousePressedFalse() {
      setIsMousePressed(false);
    }

    document.addEventListener('mousedown', setIsMousePressedTrue);
    document.addEventListener('mouseup', setIsMousePressedFalse);
    return () => {
      document.removeEventListener('mousedown', setIsMousePressedTrue);
      document.removeEventListener('mouseup', setIsMousePressedFalse);
    };
  }, []);

  function handleStart(): void {
    clearInterval(curInterval);
    const newCurInterval = setInterval(updataMatrix, 1000);
    setCurInterval(newCurInterval);
  }

  function updataMatrix(): void {
    setMatrix((oldMatrix) =>
      oldMatrix.map((line, i) =>
        line.map((cell, j) => {
          let livingNeighbors: number = 0;
          if (oldMatrix?.[i - 1]?.[j - 1]) livingNeighbors++;
          if (oldMatrix?.[i - 1]?.[j]) livingNeighbors++;
          if (oldMatrix?.[i - 1]?.[j + 1]) livingNeighbors++;
          if (oldMatrix?.[i]?.[j - 1]) livingNeighbors++;
          if (oldMatrix?.[i]?.[j + 1]) livingNeighbors++;
          if (oldMatrix?.[i + 1]?.[j - 1]) livingNeighbors++;
          if (oldMatrix?.[i + 1]?.[j]) livingNeighbors++;
          if (oldMatrix?.[i + 1]?.[j + 1]) livingNeighbors++;
          if (cell) {
            if (livingNeighbors === 2 || livingNeighbors === 3) return 1;
            else return 0;
          } else {
            if (livingNeighbors === 3) return 1;
            else return 0;
          }
        })
      )
    );
  }

  function randomlyGenerate(): void {
    const newMatrix: matrix = matrix.map((line) => line.map(() => getRandomCell()));
    setMatrix(newMatrix);
  }

  function getRandomCell(): number {
    return Math.floor(Math.random() * 2);
  }

  function updateMatrixSize(): void {
    const newMatrix: matrix = Array.from({ length: width }, () => {
      return new Array(height).fill(0);
    });
    setMatrix(newMatrix);
  }

  function handleClickCell(i: number, j: number) {
    matrix[i][j] = matrix[i][j] === 0 ? 1 : 0;
    setMatrix([...matrix]);
  }

  function handleMouseOverCell(i: number, j: number) {
    if (isMousePressed) {
      matrix[i][j] = matrix[i][j] === 0 ? 1 : 0;
    }
    setMatrix([...matrix]);
  }

  function changeWidth(e: React.ChangeEvent<HTMLInputElement>) {
    let newWidth: number | string;
    if (e.target.value === '') {
      newWidth = minSizeMatrix;
    } else {
      newWidth = parseInt(e.target.value);
      if (newWidth < minSizeMatrix) newWidth = minSizeMatrix;
      if (newWidth > maxSizeMatrix) newWidth = maxSizeMatrix;
    }
    setWidth(newWidth);
  }

  function changeHeight(e: React.ChangeEvent<HTMLInputElement>) {
    let newWidth: number | string;
    if (e.target.value === '') {
      newWidth = minSizeMatrix;
    } else {
      newWidth = parseInt(e.target.value);
      if (newWidth < minSizeMatrix) newWidth = minSizeMatrix;
      if (newWidth > maxSizeMatrix) newWidth = maxSizeMatrix;
    }
    setHeight(newWidth);
  }

  return (
    <div className="app">
      <h1>Игра "Жизнь"</h1>
      <div className="app__size-container">
        <input
          value={width}
          onChange={changeWidth}
          type="number"
          min={minSizeMatrix}
          max={maxSizeMatrix}
        />
        <input
          value={height}
          onChange={changeHeight}
          type="number"
          min={minSizeMatrix}
          max={maxSizeMatrix}
        />
        <button onClick={updateMatrixSize}>Задать размер</button>
      </div>
      <button onClick={handleStart}>Старт</button>
      <button onClick={randomlyGenerate}>Случайная генерация</button>

      <div className="app__field">
        {matrix.map((line, i) => (
          <div key={i} className="app__line">
            {line.map((cell, j) => (
              <div
                key={j}
                draggable={false}
                onClick={() => handleClickCell(i, j)}
                onMouseOver={() => handleMouseOverCell(i, j)}
                className={`app__cell ${cell && 'app__cell_live'}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
