import React, { Component, Fragment } from 'react';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel';
import { FaChevronRight } from 'react-icons/fa';

toast.configure();

const initialState = {
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    WelcomeMsg: false,
    quizEnd: false,
  }

const levelNames = ['debutant', 'confirme', 'expert'];



class Quiz extends Component{

  constructor(props) {
    super(props)
  
    this.state = initialState;
    this.storedDataRef = React.createRef();
  }

  loadQuestions = (quizz) => {
    const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
    if (fetchedArrayQuiz.length >= this.state.maxQuestions) {

      this.storedDataRef.current = fetchedArrayQuiz;

      const newArray = fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest);

      this.setState({storedQuestions: newArray});

    }
  }

  componentDidMount() {
    this.loadQuestions(levelNames[this.state.quizLevel]);
  }

  componentDidUpdate(prevProps, prevState) {

    const {maxQuestions, storedQuestions, idQuestion, quizEnd, score} = this.state;

    if ((storedQuestions !== prevState.storedQuestions) && storedQuestions.length) {
      
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options
      })
    }

    if ((idQuestion !== prevState.idQuestion) && storedQuestions.length) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        userAnswer: null,
        btnDisabled: true
      })
    }

    if (quizEnd !== prevState.quizEnd) {
      const gradePercent = this.getPercent(maxQuestions, score);
      this.gameOver(gradePercent);
    }

    if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
      this.showWelcomeMsg(this.props.userData.pseudo)
    }
  }

  submitAnswer = (selectedAnswer) => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisabled: false
    })
  }

  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) { 
      this.setState({quizEnd: true});

    } else {

      this.setState((prevState) => ({idQuestion: prevState.idQuestion + 1}))
    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if (this.state.userAnswer === goodAnswer) {

      this.setState((prevState) => ({score: prevState.score + 1}))

      toast.success(`Bravo + 1 point !`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyClassName: "toastify-color"
      });

    } else {
        toast.error(`Mauvaise réponse !`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          bodyClassName: "toastify-color"
        });
    }

  }

  showWelcomeMsg = (pseudo) => {
    if (!this.state.WelcomeMsg) {

      this.setState({
        WelcomeMsg: true
      });

      toast.warn(`Bienvenue ${pseudo} Bon Chance !`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        bodyClassName: "toastify-color-welcome"
      });
    }

  }

  getPercent = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

  gameOver = (percent) => {
    
    if (percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent
      })
    } else {
      this.setState({percent})
    }
  }

  loadLevelQuestion = (param) => {
    this.setState({...initialState, quizLevel: param});

    this.loadQuestions(levelNames[param]);
  }

  render(){

    const {
      quizLevel,
      maxQuestions,
      question,
      options,
      idQuestion,
      btnDisabled,
      userAnswer,
      score,
      quizEnd,
      percent
    } = this.state;

    const displayOptions = options.map((options, index) => {
      return (
        <p  
          key={index} 
          onClick={() => this.submitAnswer(options)} 
          className={`answerOptions ${userAnswer === options ? "selected" : null}`}
        >
        <FaChevronRight /> {options}            
        </p>
      )
    });

    return quizEnd ? (
      <QuizOver 
        ref={this.storedDataRef} 
        levelNames={levelNames}
        score={score}
        maxQuestions={maxQuestions}
        quizLevel={quizLevel}
        percent={percent}
        loadLevelQuestion={this.loadLevelQuestion}
      />
    ) 
    : 
    (
      <Fragment>
        <Levels levelNames={levelNames} quizLevel={quizLevel}/>
        <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions}/>

        <h2>{question}</h2>

        {displayOptions}

        <button 
            disabled={btnDisabled} 
            className='btnSubmit'
            onClick={this.nextQuestion}
            >

        {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}

        </button>
      </Fragment>
    );
  }  
}

export default Quiz;