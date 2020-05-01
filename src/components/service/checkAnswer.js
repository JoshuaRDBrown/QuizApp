const checkAnswer = (userAns, questionAns) => {
  if(userAns === questionAns) {
    return true;
  }
  return false;
}

export default checkAnswer;
