import fb from '../../config/firebase';

async function fetchHighScores(diff) {
  const scores = []

  await fb.firestore().collection(`${diff}_scores`).get()
  .then(querySnapshot => {
    querySnapshot.docs.forEach(doc => {
      scores.push(doc.data());
    });
  });

  const sortedScores = scores.sort((a, b) => {
    return b.score - a.score  ||  b.user.localeCompare(a.user);
  });
  return sortedScores;
}

export default fetchHighScores;
