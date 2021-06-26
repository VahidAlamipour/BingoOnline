import React, { useState } from 'react';

function Header(props) {
    const { headerList, point, user, members, startPlaying, gameStatus } = props;

    return (<header className="App-header" >
        <ul style={{ fontSize: 12 }}>
            <li>{user.room}</li>
            <li>{user.name}{user.isHost && <span>(Host)</span>}</li>
            {members && members.map(item => {
                if (user.name != item.name)
                    return <li>{item.name}{item.isHost && <span>(Host)</span>}</li>
            })}
        </ul>
        <div>{gameStatus == 'gameStarted' ? <span>{user.isTurn ? "It's your turn" : "It's not your turn"}</span>: <span>waiting for start</span>}</div>
        {user.isHost && gameStatus !== 'gameStarted' && <div><button onClick={()=>{startPlaying()}}>Start Game</button></div>}
        <ul className="bingoScoreBoard">
            {headerList && headerList.map((ele, index) => (<li key={ele.char}
                style={{ width: props.size, color: (index + 1 <= point ? 'red' : '#fff') }}>{ele.char}</li>))}
        </ul>
    </header >);
}

export default Header;