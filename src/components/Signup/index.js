import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FirebaseContext} from '../Firebase';

const Signup = () => {

    const firebase = useContext(FirebaseContext);

    const data = {
      pseudo: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    const [loginData, setLoginData] = useState(data);

    const [error, seterror] = useState('');

    const handleChange = (e) => {
      setLoginData({...loginData, [e.target.id]: e.target.value});
    }
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      const {email, password, pseudo} = loginData;
      firebase.signupUser(email, password)
      .then((authUser) => {
        return firebase.user(authUser.user.uid).set({
          pseudo,
          email
        })
      })
      .then(() => {
        setLoginData({...data});
        navigate("/welcome");
      })
      .catch(error => {
        seterror(error);
        setLoginData({...data});
      })
    }

    const {pseudo, email, password, confirmPassword} = loginData;

    const btn = pseudo === '' || email === '' || password === '' || password !== confirmPassword
    ? <button disabled>S'incrire</button> 
    : <button>S'incrire</button>

    // Gestion des erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>

    return (
      <div className='signUpLoginBox'>
          <div className='slContainer'>
              <div className='formBoxLeftSignup'></div>
              <div className='formBoxRight'>
                  <div className='formContent'>
                      {errorMsg}
                      <h2>Inscription</h2>
                      <form onSubmit={handleSubmit}>
                          <div className='inputBox'>
                              <input onChange={handleChange} value={pseudo} type="text" id='pseudo' autoComplete='off' required />
                              <label htmlFor='pseuso'>Pseudo</label>
                          </div>
                          <div className='inputBox'>
                              <input onChange={handleChange} value={email} type="email" id='email' autoComplete='off' required />
                              <label htmlFor='email'>Email</label>
                          </div>
                          <div className='inputBox'>
                              <input onChange={handleChange} value={password} type="password" id='password' autoComplete='off' required />
                              <label htmlFor='password'>Mot de passe</label>
                          </div>
                          <div className='inputBox'>
                              <input onChange={handleChange} value={confirmPassword} type="password" id='confirmPassword' autoComplete='off' required />
                              <label htmlFor='confirmPassword'>Confirmer le mot de passe</label>
                          </div>

                          {btn}
                      </form>
                      <div className='linkContainer'>
                        <Link className='simpleLink' to="/login">Déjà inscrit ? Connectez-vous</Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default Signup;