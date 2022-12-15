import React, {useState, Fragment, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Logout from '../Logout';
import Quiz from '../Quiz';
import {FirebaseContext} from '../Firebase';
import Loader from '../Loader'

const Welcome = () => {

  const [userSession, setUserSession] = useState(null);
  const [userData, setUserData] = useState({})

  const firebase = useContext(FirebaseContext);

  const navigate = useNavigate();

  useEffect(() => {

    let listener = firebase.auth.onAuthStateChanged(user => {
      user ? setUserSession(user) : navigate("/");
    });

    if(userSession !== null){
      firebase.user(userSession.uid)
      .get()
      .then((doc) => {
        if (doc && doc.exists) {
          const myData = doc.data();
          setUserData(myData);
        }
      })
      .catch((error) => {
        console.log(error);
      })
    };

    return () => {
      listener();
    };

  }, [userSession]);
  

  return userSession === null ? (
    <Loader loadingMsg={"Authentification ..."} styling={{textAlign: 'center', color: '#FFFFFF'}}/>
  ) : (
    <div className='quiz-bg'>
      <div className='container'>
          <Logout />
          <Quiz userData={userData}/>
      </div>
    </div>
  );
}

export default Welcome;