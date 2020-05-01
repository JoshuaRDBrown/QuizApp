import React, { useState } from 'react';
import fb from '../config/firebase';
import { useInput } from './hooks/useInput';

const DashBoard = ({ newUser, setUserName, startGame, viewLeaderBoard, logOut }) => {

  const {val, bind} = useInput('');
  const [easyScore, setEasyScore] = useState('');
  const [mediumScore, setMedScore] = useState('');
  const [hardScore, setHardScore] = useState('');

  const db = fb.firestore();
  db.doc(`Easy_scores/${fb.auth().currentUser.uid}`).get().then((doc) => {
    if(doc.exists) {
      setEasyScore(doc.data().score);
    }
  });
  db.doc(`Medium_scores/${fb.auth().currentUser.uid}`).get().then((doc) => {
    if(doc.exists) {
      setMedScore(doc.data().score);
    }
  });
  db.doc(`Hard_scores/${fb.auth().currentUser.uid}`).get().then((doc) => {
    if(doc.exists) {
      setHardScore(doc.data().score);
    }
  });

  return(
    <>
      <div className='dashboard-container'>
        <h1><span id='user'>{fb.auth().currentUser.displayName || val}'s</span> Dashboard</h1>
        <button onClick={()=> startGame('Easy')}><span>Easy</span>  | <span>{easyScore || 0}/10</span></button>
        <button onClick={()=> startGame('Medium')}><span>Medium</span> | <span>{mediumScore || 0}/10</span></button>
        <button onClick={()=> startGame('Hard')}><span>Hard</span> | <span>{hardScore || 0}/10</span></button>
        <div className='leaderboards-button'>
          <button onClick={viewLeaderBoard}>🏆Leaderboards🏆</button>
        </div>
        <button id='logout' onClick={()=> logOut()}>Logout</button>
        {newUser &&
          <div>
            <div className='overlay'></div>
            <div className='setUsernameForm'>
              <h1> First things first... </h1>
              <p> Please enter a username:</p>
              <form>
                <input
                  maxLength='20'
                  placeholder='iloveig123'
                  {...bind}
                />
                <br />
                <button onClick={()=> setUserName(val)}type='button'>Submit</button>
              </form>
            </div>
          </div>
        }
      </div>
    </>
  );
}

export default DashBoard;
