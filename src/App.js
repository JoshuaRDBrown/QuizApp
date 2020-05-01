import React from 'react';
import './App.scss';
import fb from './config/firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import LeaderBoard from './components/LeaderBoard';
import fetchHighScores from './components/service/fetchHighScores';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userObj: null,
      requestedLevel: '',
      firstLoginProcess: false,
      gameInProgress: false,
      viewingLeaderBoard: false,
      currentScoreBoard: 'Easy',
      scoreList: null,
      leaderBoardButtons: [
        {id: 'easy', label: 'Easy', selected: true},
        {id: 'med', label: 'Medium', selected: false},
        {id: 'hard', label: 'Hard', selected: false}
      ]
    }

    this.onAuth = this.onAuth.bind(this);

  }

  componentDidMount() {
    this.onAuth();
  }

  async toggleLeaderBoardButtons(id) {
    const selectedTab = this.state.leaderBoardButtons[id];

    await this.setState({
      leaderBoardButtons: {
        ...this.state.leaderBoardButtons,
        [id]: {
          ...selectedTab,
          selected: !selectedTab.selected,
        },
      },
    });
  }

  setUserName(username) {
    fb.auth().currentUser.updateProfile({
      displayName: username
    });
    this.setState({ firstLoginProcess: false });
  }

  onAuth() {
    fb.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({ userObj: user });
      }
    });
  }

  userLogOut() {
    fb.auth().signOut().then(()=> {
      console.log('signed out');
    }).catch((err)=> {
      console.log('Error: ', err);
    });

    window.location.reload();
  }

  isNewUser() {
    this.setState({ firstLoginProcess: true });
  }

  toggleDashboard() {
    this.setState({ gameInProgress: false });
  }

  async viewLeaderBoard() {
    const highscores = await fetchHighScores(this.state.currentScoreBoard);
    this.setState({ viewingLeaderBoard: true, scoresList: highscores });
  }

  async changeLeaderBoardView(view) {
    await this.setState({ currentScoreBoard: view });

    this.viewLeaderBoard();
  }

  startGame(diff) {
    this.setState({requestedLevel: diff, gameInProgress: true });
  }

  toggleLeaderBoard() {
    this.viewLeaderBoard();
  }

  closeLeaderBoard() {
    this.setState({ viewingLeaderBoard: false });
  }

  render() {
    return(
      <>
        {this.state.gameInProgress ?
          <Game
            currentLevelUnlocked={this.state.currentLevelUnlocked}
            toggleDashboard={this.toggleDashboard.bind(this)}
            requestedLevel={this.state.requestedLevel}
            toggleLeaderBoard={this.toggleLeaderBoard.bind(this)}
          /> :
          this.state.userObj ?
            <Dashboard
              newUser={this.state.firstLoginProcess}
              setUserName={this.setUserName.bind(this)}
              startGame={this.startGame.bind(this)}
              viewLeaderBoard={this.viewLeaderBoard.bind(this)}
              logOut={this.userLogOut.bind(this)}
            /> :
            <Login isNewUser={this.isNewUser.bind(this)} />
        }

        {this.state.viewingLeaderBoard &&
          <LeaderBoard
            changeView={this.changeLeaderBoardView.bind(this)}
            currentView={this.state.currentScoreBoard}
            highscores={this.state.scoresList}
            closeLeaderBoard={this.closeLeaderBoard.bind(this)}
            leaderBoardButtons={this.state.leaderBoardButtons}
          />
        }
      </>
    );
  }


}
