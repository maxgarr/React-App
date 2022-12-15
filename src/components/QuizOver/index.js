import React, { Fragment, useEffect, useState } from 'react';
import { GiTrophyCup } from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';
import axios from 'axios';

const QuizOver = React.forwardRef((props, ref) => {

  const {levelNames, score, maxQuestions, quizLevel, percent, loadLevelQuestion} = props;

  const API_PUBLIC_KEY = 'a23927df7be026714e999a495de348ab';
  const hash = '7baf0d016a48421a305eeb619521f5ef';

  const [asked, setAsked] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAsked(ref.current);

    if (localStorage.getItem('marvelStorageDate')) {
      const date = localStorage.getItem('marvelStorageDate');
      checkDataAge(date);
    }
  }, [ref])

  const checkDataAge = (date) => {
    const today = Date.now();
    const timeDifference = today - date;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference >= 15) {
      localStorage.clear();
      localStorage.setItem('marvelStorageDate', Date.now());
    }
  }

  const showModal = (id) => {
    setOpenModal(true);

    if (localStorage.getItem(id)) {

        setCharacters(JSON.parse(localStorage.getItem(id)));
        setLoading(false);

    } else {

        axios
        .get(`https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
        .then(response => {
          console.log(response);
          setCharacters(response.data);
          setLoading(false);

          localStorage.setItem(id, JSON.stringify(response.data));
          if (!localStorage.getItem('marvelStorageDate')) {
            localStorage.setItem('marvelStorageDate', Date.now());
          }
          
        })
        .catch(error => {
          console.log(error);
        })
        }

  }

  const hideModal = () => {
    setOpenModal(false);
    setLoading(true);
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const averageGrade = maxQuestions / 2;

  if (score < averageGrade) {
    setTimeout(() => loadLevelQuestion(quizLevel), 3000);
  }

  const decision = score >= averageGrade ? (
    <Fragment>
      <div className='stepsBtnContainer'>
        {
          quizLevel < levelNames.length ?
          (
            <Fragment>
              <p className='successMsg'>Bravo, passez au niveau suivant !</p>
              <button className='btnResult success' onClick={() => loadLevelQuestion(quizLevel)}>Niveau suivant</button>
            </Fragment>
          )
          :
          (
            <Fragment>
              <p className='successMsg'><GiTrophyCup size='50px'/>Bravo, vous êtes un expert !</p>
              <button className='btnResult gameOver' onClick={() => loadLevelQuestion(0)}>Accueil</button>
            </Fragment>
          )
        }
      </div>
      <div className='percentage'>
        <div className='progressPercent'>Réussite: {percent}%</div>
        <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
      </div>      
      
    </Fragment>
  ) 
  : 
  (
    <Fragment>
      <div>
        <p className='failureMsg'>Vous avez échoué !</p>
      </div>
      <div className='percentage'>
        <div className='progressPercent'>Réussite: {percent}%</div>
        <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
      </div>
    </Fragment>
  );

  const questionAnswer = score >= averageGrade ? (
    asked.map((question) => {
      return (
        <tr key={question.id}>
          <td>{question.question}</td>
          <td>{question.answer}</td>
          <td>
            <button onClick={() => showModal(question.heroId)} className='btnInfo'>Infos</button>
          </td>
        </tr>
      )
    })
  )
  :
  (
    <tr>
      <td colSpan="3">
        <Loader loadingMsg={"Pas d'aide coquinou !"} styling={{textAlign: 'center', color: 'red'}}/>
      </td>
    </tr>
  )

  const resultInModal = !loading ? 
  (
    <Fragment>
        <div className='modalHeader'>
          <h2>{characters.data.results[0].name}</h2>
        </div>
        <div className='modalBody'>
          <div className='comicImage'>
              <img 
                src={characters.data.results[0].thumbnail.path+'.'+characters.data.results[0].thumbnail.extension} 
                alt={characters.data.results[0].name}                  
              />
              {characters.attributionText}
          </div>
          <div className='comicDetails'>
              <h3>Description</h3>
              {
                characters.data.results[0].description ?
                (
                  <p>{characters.data.results[0].description}</p>
                )
                :
                (
                  <p>Description indisponible ...</p>
                )
              }
              <h3>Plus d'infos</h3>
              {
                  characters.data.results[0].urls &&
                  characters.data.results[0].urls.map((url, index) => {
                    return (
                    <a 
                      key={index} 
                      href={url.url}
                      target="blank"
                      rel='noopener noreferrer'
                    >
                      {capitalizeFirstLetter(url.type)}
                    </a>
                    )
                  })
              }
          </div>
        </div>
        <div className='modalFooter'>
          <button className='modalBtn' onClick={hideModal}>Fermer</button>
        </div>
    </Fragment>
  )
  :
  (
    <Fragment>
    <div className='modalHeader'>
      <h2>Réponse de Marvel ...</h2>
    </div>
    <div className='modalBody'>
      <Loader />
    </div>
</Fragment>
  )
  return (

    <Fragment>
      {decision}

      <hr />
      <p>Les réponses aux questions posées:</p>

      <div className='answerContainer'>
        <table className='answers'>
          <thead>
            <tr>
              <th>Question</th>
              <th>Réponse</th>
              <th>Infos</th>
            </tr>
          </thead>
          <tbody>
            {questionAnswer}
          </tbody>
        </table>
      </div>

      <Modal showModal={openModal} hideModal={hideModal}>
        {resultInModal}
      </Modal>

    </Fragment>
  )
});

export default React.memo(QuizOver);