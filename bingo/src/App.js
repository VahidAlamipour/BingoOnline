import React, { useState, useEffect } from "react"
import Game from "./Game"
import Login from "./Login"
import io from 'socket.io-client'
const ENDPOINT = 'http://192.168.49.81:3400/';
let socket;
socket = io(ENDPOINT, { transports: ['websocket'] });


const App = () => {
  //#region states initialazation
  const [status, setStatus] = useState('login');
  const [user, setUser] = useState({ name: '', room: '', isHost: false });
  const [isTurn, setIsTurn] = useState(false)
  const [members, setMembers] = useState([]);
  const [lastBrand, setLastBrand] = useState('');
  //#endregion

  useEffect(() => {
    socket.on('roomStarted', data => {
      setUser({ name: data.name, room: data.roomId, isHost: data.isHost });
      setStatus('gameUI');
    });
    socket.on('membersChanged', data => {
      setMembers(data);
    });
    
  }, []);
  useEffect(() => {
    if (user.name) {
      socket.on('gameStarted', data => {
        setIsTurn(data.turnOf.name == user.name);
        setStatus('gameStarted');
      });
      socket.on('cellClicked', data => {
        setLastBrand(data.brand);
        setIsTurn(data.turnOf.name == user.name);
      });
    }
  }, [user]);

  const setUserStates = (name, room, status) => {
    socket.emit('startGame', { name, room, isCreateRoom: (status == 'createRoom') }, error => {
      if (error) {
        alert(error);
        return false;
      }
    });
  }
  const clickCell = (brand) => {
    socket.emit('clickCell', { brand, user: user }, error => {
      if (error) {
        alert(error);
        return false;
      }
    });
  }
  const startPlaying = () => {
    socket.emit('startPlaying', user.room, error => {
      if (error) {
        alert(error);
        return false;
      }
    })

  }
  const viewMaker = () => {
    if (status === 'login')
      return <Login setUser={setUserStates} />
    return <Game user={{...user,isTurn}} members={members} clickCell={clickCell}
      lastBrand={lastBrand} startPlaying={startPlaying} gameStatus={status} />
  }
  //console.log("user: ",user)
  return (<div className="App">
    {viewMaker()}
  </div>)
}
export default App