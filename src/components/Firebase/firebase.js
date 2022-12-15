import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDXmcho03sbos2zmuQ5sGGsSKC8XQgYh_g",
    authDomain: "marvel-quiz-913ec.firebaseapp.com",
    projectId: "marvel-quiz-913ec",
    storageBucket: "marvel-quiz-913ec.appspot.com",
    messagingSenderId: "174060461048",
    appId: "1:174060461048:web:6fd695059740fec2ae540d"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    //signup
    signupUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    //login
    loginUser = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    //logout
    signOutUser = () => this.auth.signOut();

    //ForgetPassword
    passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

    //
    user = (uid) => this.db.doc(`users/${uid}`);
}

export default Firebase;