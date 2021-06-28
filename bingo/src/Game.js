import './styles/index.scss';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board';


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function shuffle() {
  let array = ["audi", "bmw", "benz", "jeep", "porsche", "chevrolet", "toyota", "hyundai", "lamborghini", "ford", "renault",
    "mazda", "mini", "volvo", "honda", "volkswagen", "nissan", "maserati", "kia", "landrover", "alfaromeo", "lexus",
    "citroen", "Peugeot"];
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  array.splice(12, 0, "");
  return array;
}

function iniCheckedListMaker() {
  const array = [];
  for (let index = 0; index < 25; index++) {
    array[index] = index === 12;
  }
  return array;
}
function difference(a1, a2) {

  var a = [], diff = [];

  for (var i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (var k in a) {
    diff.push(k);
  }
  return diff.length > 0 ? parseInt(diff[0]) : null;
}
let bingoSound = null;


function Game({ user, members, clickCell, lastBrand, startPlaying, gameStatus, endGame, winer, restartGame }) {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [brandsList, setBrandsList] = useState([]);
  const [headerList, setHeaderList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [point, setPoint] = useState({
    horizontal: [], vertical: [], diagonalUp: false,
    diagonalDown: false, point: 0, diffArray: []
  });
  bingoSound = new Audio("/images/ding.mp3");

  const initFunc = () => {
    setBrandsList(shuffle());
    setHeaderList([{ char: 'B', pass: false },
    { char: 'I', pass: false },
    { char: 'N', pass: false },
    { char: 'G', pass: false },
    { char: 'O', pass: false }]);
    setCheckedList(iniCheckedListMaker());
    setPoint({
      horizontal: [], vertical: [], diagonalUp: false,
      diagonalDown: false, point: 0, diffArray: []
    });
  }

  useEffect(() => {
    if (gameStatus === 'gameUI') {
      initFunc();
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }


  }, [gameStatus]);

  useEffect(() => {
    if (lastBrand) {
      cellClick(brandsList.indexOf(lastBrand));
    }

  }, [lastBrand])



  let lessSize = windowDimensions.width;
  let protrait = true;
  if (windowDimensions.width > windowDimensions.height) {
    lessSize = windowDimensions.height;
    protrait = false;
  }
  const size = (lessSize * (protrait ? 17 : 15)) / 100;
  const fullSize = size * 5;
  const fontSize = size / 20;

  const cellClick = (index) => {
    if (index === 12) return false;
    let newArray = checkedList;
    newArray[index] = !checkedList[index];
    setCheckedList([...newArray]);
    const newPoint = isWon();
    if (newPoint.point >= 5) {
      const endGameSound = new Audio('/images/clapping.mp3');
      const fullArray = [];
      for (let index = 0; index < 25; index++) {
        fullArray.push(index);
      }
      setPoint({ ...newPoint, diffArray: fullArray });
      endGame();
      endGameSound.play();
      resetDiff(newPoint);
      return false;
    }
    if (point.point != newPoint.point) {
      if (point.point > newPoint.point) newPoint.diffArray = [];
      setPoint(newPoint);
      if (point.point < newPoint.point) {
        bingoSound.play();
        resetDiff(newPoint);
      }
    }
  }

  const resetDiff = (newPoint) => {
    setTimeout(() => {
      setPoint({ ...newPoint, diffArray: [] });
    }, 2000);
  }



  const isWon = checked => {
    let pointResult = 0;
    const range = [0, 1, 2, 3, 4];
    const horizontal = range.filter(row => range.every(column => checkedList[row * 5 + column]));
    const vertical = range.filter(column => range.every(row => checkedList[row * 5 + column]));
    const diagonalUp = range.every(index => checkedList[index * 5 + index]);
    const diagonalDown = range.every(index => checkedList[index * 5 + 4 - index]);
    if (horizontal)
      pointResult += horizontal.length;
    if (vertical)
      pointResult += vertical.length;
    if (diagonalUp)
      pointResult++;
    if (diagonalDown)
      pointResult++;
    const diffHorizontal = difference(point.horizontal, horizontal);
    const diffVertical = difference(point.vertical, vertical);
    const diffDiUp = point.diagonalUp != diagonalUp;
    const diffDiDown = point.diagonalDown != diagonalDown;
    let diffArray = [];
    if (diffHorizontal !== null) {
      var mul = diffHorizontal * 5;
      for (let index = 0; index < 5; index++) {
        diffArray.push(mul + index);
      }
    }
    if (diffVertical !== null) {
      for (let index = diffVertical; index < 25; index += 5) {
        diffArray.push(index);
      }
    }
    if (diffDiUp || diffDiDown) {
      diffArray = diffDiUp ? [0, 6, 12, 18, 24] : [4, 8, 12, 16, 20];
    }
    return { horizontal, vertical, diagonalUp, diagonalDown, point: pointResult, diffArray };
  };
  return (
    <div className="Play-ground"
      style={{ width: fullSize + 30, fontSize: `${fontSize}rem` }}>
      <Header headerList={headerList} size={size}
        point={point.point} user={user} members={members}
        gameStatus={gameStatus} winer={winer} />
      <div className='board-container'>
        {(!user.isTurn || gameStatus == 'gameEnded' || gameStatus == 'gameUI') && <div className='disabler'>
          {(user.isHost && gameStatus == 'gameUI') && <button onClick={() => { startPlaying() }}>Start Game</button>}
          {(user.isHost && gameStatus == 'gameEnded') && <button onClick={restartGame}>Restart Game</button>}
        </div>}
        <Board size={size} fullSize={fullSize}
          brandsList={brandsList} cellClick={(index) => { clickCell(brandsList[index]) }}
          checkedList={checkedList} diffArray={point.diffArray} />
      </div>
    </div>
  );
}

export default Game;
