import React, { useState } from 'react';

function Header(props) {
    const { headerList, point, user, members, gameStatus, winer } = props;
    return (<header className="App-header" >
        <ul className="room-info">
            <li>{user.room}</li>
            <li>{user.name}{user.isHost && <span>(Host)</span>}</li>
            {members && members.map(item => {
                if (user.name != item.name)
                    return <li>{item.name}{item.isHost && <span>(Host)</span>}</li>
            })}
        </ul>
        <div className="game-status">
            {gameStatus == 'gameStarted' ? <span>{user.isTurn ? "It's your turn" : "It's not your turn"}</span> 
            :gameStatus == 'gameEnded' ? <span>{winer ? "You Won" : 'Game Over'}</span> : <span>waiting for start</span>}
        </div>
        <ul className="bingoScoreBoard">
            {headerList && headerList.map((ele, index) => (<li key={ele.char}
                style={{ width: props.size, color: (index + 1 <= point ? 'red' : '#fff') }}>{ele.char}</li>))}
        </ul>
    </header >);
}

export default Header;