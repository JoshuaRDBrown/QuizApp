import fb from '../../config/firebase';

const saveScore = (score, level) => {
  const db = fb.firestore();
  const ref = db.doc(`${level}_scores/${fb.auth().currentUser.uid}`);
  ref.get().then((doc) => {
    if(doc.exists && doc.data().score < score) {
      return ref.update({
        score: score
      }).then(()=> {
        console.log('score updated');
      }).catch((err) => {
        console.log('error while updating score: ', err);
      });
    } else if(!doc.exists) {
      db.collection(`${level}_scores`).doc(fb.auth().currentUser.uid).set({
        user: fb.auth().currentUser.displayName || 'Unknown player',
        score: score
      }).then(()=> {
        console.log('score created');
      }).catch((err) => {
        console.log('error while creating score: ', err);
      });
    }
  });
}

export default saveScore;
