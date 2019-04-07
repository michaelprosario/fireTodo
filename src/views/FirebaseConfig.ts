import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
  var config = {
    apiKey: "...",
    authDomain: "fixme.firebaseapp.com",
    databaseURL: "https://fixme.firebaseio.com",
    projectId: "fixme",
    storageBucket: "fixme.appspot.com",
    messagingSenderId: "..."
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();
