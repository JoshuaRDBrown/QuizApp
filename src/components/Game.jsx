import React from 'react';
import fb from '../config/firebase';
import saveScore from './service/saveScore';
import checkAnswer from './service/checkAnswer';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionData: null,
      questionCount: 1,
      score: 0,
      userAnswer: '',
      showGameOver: false,
      correctAnswer: false,
      wrongAnswer: false,
    }

    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.isCorrectAnswer = this.isCorrectAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.calculateScore = this.calculateScore.bind(this);

  }

  componentDidMount() {
    this.fetchQuestion();
  }

  async isCorrectAnswer() {
      let answerIsCorrect = checkAnswer(this.state.userAnswer.toLowerCase(), this.state.questionData.answer);
      if(answerIsCorrect) {
        await this.setState({score: this.state.score + 1, correctAnswer: true});
        setTimeout(() => {
          this.setState({ correctAnswer: false });
        }, 500);
      } else {
        this.setState({ wrongAnswer: true });
        setTimeout(() => {
          this.setState({ wrongAnswer: false });
        }, 500);
      }
      this.setState({ userAnswer: '' });
      this.fetchQuestion();
    }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  fetchQuestion() {
    const db = fb.firestore();
    if(this.state.questionCount <= 10) {
      const ref = db.doc(`${this.props.requestedLevel.toLowerCase()}/question${this.state.questionCount}`);
      ref.get().then((doc) => {
        this.setState({ questionData: doc.data() });
      });
      this.setState({ questionCount: this.state.questionCount + 1 });
    } else {
      this.calculateScore();
    }
  }

  calculateScore() {
    this.setState({ showGameOver: true });
    saveScore(this.state.score, this.props.requestedLevel);
  }

  render() {
    return(
      <>
        <div className='question-container'>
          <div className='information-banner'>
            <p>Difficulty: <b>{this.props.requestedLevel}</b></p>
            <p>Current Score: <b>{this.state.score}</b></p>
          </div>
          <h1>Q{this.state.questionCount -1}. {this.state.questionData ? this.state.questionData.question : 'Loading...'} </h1>
          <input
            placeholder='Your answer here...'
            value={this.state.userAnswer}
            onChange={this.handleChange}
            name='userAnswer'
            className={this.state.correctAnswer ? 'correctAns' : this.state.wrongAnswer ? 'wrongAns' : null}
            autoComplete="off"
          />
          <br />
          <button onClick={()=> this.isCorrectAnswer()}>Submit</button>
          <p id='tip'><b>TIP:</b> If you don't know the answer to a question, click submit to continue to the next question.</p>
        </div>
        {this.state.showGameOver &&
          <div>
            <div className='overlay'></div>
            <div className='gameover-container'>
              <h1>Game Over</h1>
              <p id='final_score'> You scored <b>{this.state.score} / 10!</b></p>
              <p>
                {this.state.score === 10 ?
                  'Well done! You got a perfect score!' :
                  `Unfortunately, you needed ${10 - this.state.score} more points for a perfect score, keep trying!`
                }
              </p>
              <button onClick={()=> this.props.toggleDashboard()}>Dashboard</button>
              <button onClick={()=> this.props.toggleLeaderBoard()}>Leaderboard</button>
            </div>
          </div>
        }
      </>
    );
  }
}
