import React from 'react';
import fb from '../config/firebase';

const LeaderBoard = ({ changeView, currentView, highscores, closeLeaderBoard, leaderBoardButtons }) => {

  return(
    <div className='LeaderBoard-container'>
      <h1>LeaderBoard</h1>
      <div className='exit' onClick={()=> closeLeaderBoard()}>X</div>
      {leaderBoardButtons.map((button)=> {
        return(
          <button id={button.selected ? 'selected' : null} onClick={()=> changeView(button.label)}>{button.label}</button>
        );
      })}
      <table>
        <thead>
          <tr>
            <th><b>Rank</b></th>
            <th><b>User</b></th>
            <th><b>Score</b></th>
          </tr>
        </thead>
        {highscores.map((row, i)=> {
          return(
            <>
              <tbody>
                <tr id={row.user === fb.auth().currentUser.displayName ? 'currentUser' : null}>
                  <td key={i+50}>#{i+1}</td>
                  <td key={i}>{row.user === fb.auth().currentUser.displayName ? 'You' : row.user}</td>
                  <td key={row}>{row.score}</td>
                </tr>
              </tbody>
            </>
            )
          })
        }
      </table>
    </div>
  );
}

export default LeaderBoard;
