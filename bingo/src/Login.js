import React, { useState, useEffect } from 'react'
import {v4 as uuid} from 'uuid';


const Login = ({setUser,setMasterStatus}) => {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');

    const joinRoomClick = ()=>{
        if(name && roomId){
            setUser(name,roomId,'joinRoom')
            return;
        }
        alert("Name and roomId is required!")
        return
    }
    const createNewRoom = ()=>{
        if(name){
            setUser(name,uuid(),'createRoom')
           return;
        }
        alert('Name is required! ');
        return;
    }


    return (
        <div className='login-form-container'>
            <div className='Play-ground'>
                <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} />
                <br />
                <input type="text" placeholder='roomId' onChange={e => setRoomId(e.target.value)} />
                <button type="button" onClick={joinRoomClick}>Join room</button>
                <br />
                <p>--- or ---</p>
                <br />
                <button type="button" onClick={createNewRoom}>Create new room</button>
            </div>
        </div>
    )
}

export default Login;