import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { minSizeMatrix, maxSizeMatrix } from '../utils/constants';
import InputRadio from '../InputRadio/InputRadio';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './App.css';

type matrix = number[][];

const App: React.FC = () => {
  const [matrix, setMatrix] = useState<matrix>([]);
  const [width, setWidth] = useState<number>(15);
  const [height, setHeight] = useState<number>(15);
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
  const [lifeSpeed, setLifeSpeed] = useState<number>(700);
  const [lifeIsGoing, setLifeIsGoing] = useState<boolean>(false);
  const curInterval = useRef<any>();

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

  function handleStartGame(): void {
    handleStopGame();
    setLifeIsGoing(true);
    const newCurInterval = setInterval(updataMatrix, lifeSpeed);
    curInterval.current = newCurInterval;
  }

  function handleStopGame(): void {
    clearInterval(curInterval.current);
    setLifeIsGoing(false);
  }

  function handleOneStep(): void {
    handleStopGame();
    updataMatrix();
  }

  function handleClearMatrix(): void {
    handleStopGame();
    updateMatrixSize();
  }

  function updataMatrix(): void {
    console.log('updataMatrix');
    setMatrix((oldMatrix) => {
      const newMatrix = generateNewMatrix(oldMatrix);
      if (JSON.stringify(oldMatrix) === JSON.stringify(newMatrix)) {
        handleStopGame();
      }
      return newMatrix;
    });
  }

  function generateNewMatrix(matrix: matrix): matrix {
    return matrix.map((line, i) =>
      line.map((cell, j) => {
        let livingNeighbors: number = 0;
        if (matrix?.[i - 1]?.[j - 1]) livingNeighbors++;
        if (matrix?.[i - 1]?.[j]) livingNeighbors++;
        if (matrix?.[i - 1]?.[j + 1]) livingNeighbors++;
        if (matrix?.[i]?.[j - 1]) livingNeighbors++;
        if (matrix?.[i]?.[j + 1]) livingNeighbors++;
        if (matrix?.[i + 1]?.[j - 1]) livingNeighbors++;
        if (matrix?.[i + 1]?.[j]) livingNeighbors++;
        if (matrix?.[i + 1]?.[j + 1]) livingNeighbors++;
        if (cell) {
          if (livingNeighbors === 2 || livingNeighbors === 3) return 1;
          else return 0;
        } else {
          if (livingNeighbors === 3) return 1;
          else return 0;
        }
      })
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

  function handleOverCell(i: number, j: number) {
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

  function handleRadio(e: React.ChangeEvent<HTMLInputElement>): void {
    setLifeSpeed(+e.target.value);
  }

  return (
    <div className="app">
      <h1 className="app__title">Игра "Жизнь"</h1>
      <div className="app__btn-container">
        <Button onClick={handleStartGame} title="Старт" />
        <Button onClick={handleStopGame} title="Стоп" />
        <Button onClick={randomlyGenerate} title="Случайно" />
        <Button onClick={handleOneStep} title="Один шаг" />
        <Button onClick={handleClearMatrix} title="Отчистить" />
      </div>
      <div className="app__size-container">
        <Input value={width} onChange={changeWidth} min={minSizeMatrix} max={maxSizeMatrix} />
        <Input value={height} onChange={changeHeight} min={minSizeMatrix} max={maxSizeMatrix} />

        <Button onClick={updateMatrixSize} title="Задать размер" />
      </div>

      <p className="app__text">Скорость</p>
      <div className="app__input-container">
        <InputRadio
          handleChange={handleRadio}
          disabled={lifeIsGoing}
          name="speed"
          value={1100}
          currentValue={lifeSpeed}
          title="медленная"
        />
        <InputRadio
          handleChange={handleRadio}
          disabled={lifeIsGoing}
          name="speed"
          value={700}
          currentValue={lifeSpeed}
          title="средняя"
        />
        <InputRadio
          handleChange={handleRadio}
          disabled={lifeIsGoing}
          name="speed"
          value={300}
          currentValue={lifeSpeed}
          title="быстрая"
        />
      </div>
      <div className="app__field">
        {matrix.map((line, i) => (
          <div key={i} draggable={false} className="app__line">
            {line.map((cell, j) => (
              <div
                key={j}
                draggable={false}
                onClick={() => handleClickCell(i, j)}
                onMouseOver={() => handleOverCell(i, j)}
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
