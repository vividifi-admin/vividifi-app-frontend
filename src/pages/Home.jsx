import React, { useEffect, useState ,useRef } from "react";
import Navbar from "../components/layouts/includes/Navbar";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { isEmpty } from "lodash";
import Countdown from "react-countdown";
import axios from "axios";
import $ from 'jquery';
import _ from 'lodash';

import { getSeries } from "../store/actions/series";
import { getClient } from "../store/actions/clinet";
import { getUser } from "../services/getClinet";

import "swiper/css";
import { getPreQuiz } from "../services/getQuiz";
import config from "../services/config.json";

let selectedItemQuiz = 0;
let PreQuizLengthVar = 0;

let trueAnswer = 0;
let wrongAnswer = 0;
let minTotalScore = 0;
const Home = () => {
  const series = useSelector((state) => state.series);
  const clinet = useSelector((state) => state.clinet);
  const history = useHistory();
  const [toggleNav, setToggleNav] = useState("");
  const [searchText, setSearchText] = useState("");
  const [UserDetail,setUserDetail] = useState({});

  const [Quiz,setQuiz] = useState([]);
  const [NoIndexOfQuiz,setNoIndexOfQuiz] = useState(0);
  const [NoIndexOfassessment,setNoIndexOfassessment] = useState(0);
  const [QuizMaxTime,setQuizMaxTime] = useState(60);
  const [userScore, setUserScore] = useState(0);
  const [Answer,setAnswer] = useState(0);
  const [PreQuizLength,setPreQuizLength] = useState(0);

  const [ShowChoiceModal,setShowChoiceModal] = useState(0)
  const [AssessmentDetailState,setAssessmentDetailState] = useState(0);
  const [LoadingShowQuiz,setLoadingShowQuiz] = useState(true);

  const checkAnswerbtnRef = useRef(null);


  const dispatch = useDispatch();
  // console.log("series", series);

  useEffect(() => {
    if (isEmpty(series)) {
      dispatch(getSeries());
    }
  }, [series]);

  useEffect(() => {
    if (isEmpty(clinet)) {
      dispatch(getClient(localStorage.getItem("client_id")));
    }
  }, [clinet]);

  const handleToggleNav = () => {
    setToggleNav((prev) => {
      if (prev == "active") {
        return "";
      } else {
        return "active";
      }
    });
  };
  const openDropDown = (e, number) => {
    let target;
    if (number == 1) {
      target = e.target
        .closest(".profile-wrapper")
        .querySelector(".dropdown-content");
    } else {
      target = e.target
        .closest(".notification-wrapper")
        .querySelector(".dropdown-content");
    }
    if (target.classList.contains("active")) {
      target.classList.remove("active");
    } else {
      target.classList.add("active");
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("client_id");
    history.replace("/login");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/series?search=${searchText}`);
  };

  const checkEndOfQuiz = () => {
    // $(".preAssetsQuizMainBox").addClass("d-none");
    // $(".question-result.total")
    //   .children(".title")
    //   .children("span")
    //   .html(quiz.length);
    $(".score-result.correct")
      .children(".title")
      .children("span")
      .html(trueAnswer);
    $(".score-result.incorrect")
      .children(".title")
      .children("span")
      .html(wrongAnswer);
    // $(".your-score")
    //   .children("span")
    //   .html(userScore);
    // if (userScore >= minTotalScore) {
    //   $(".quiz-result-wrapper.success")
    //     .children(".quiz-box")
    //     .children(".score")
    //     .children("span")
    //     .css("color", "#2f9e0e");
    // } else {
    //   $(".quiz-result-wrapper.success")
    //     .children(".quiz-box")
    //     .children(".score")
    //     .children("span")
    //     .css("color", "#fc2c2c");
    // }

    // console.log(NoIndexOfQuiz);
    // console.log(PreQuizLength);
    // console.log(PreQuizLengthVar);

    if(NoIndexOfQuiz == (Quiz.length - 1)){
      // console.log("end");
      $(".endMainBoxPreQuiz").removeClass("d-none");
      $(".PAQMB-header").addClass("d-none");
      $(".PAQMB-body").addClass("d-none");
      handleClearQuizValue();
      
    }else{
      // console.log("not");
      handleClearQuizValue();
      let testVal = NoIndexOfQuiz + 1;
      console.log(testVal);
      setNoIndexOfQuiz( testVal );

    }

  };

  const checkValue = (e) => {
    selectedItemQuiz = $(e).val();
    // console.log($(e).val());
    // console.log(selectedItemQuiz);
    setAnswer(selectedItemQuiz);
    // console.log("selectedItemQuiz", selectedItemQuiz);
    $(e).parents(".quiz-box").find("button").addClass("active");
    $(e).parents(".quiz-box").find("button").prop("disabled", false);
  };

  const handleGetUserInfo = async () =>{
    const {data} = await getUser(localStorage.getItem('user_id'));
    let dataUser = data.data;

    if(dataUser.pre_ass){

    }else{
      const {data} = await getPreQuiz(localStorage.getItem('client_id'));
      if(data.data.length > 0){

        const resPreQuizArray = data.data[NoIndexOfassessment].Quiz;
        setAssessmentDetailState(data.data);
        if(resPreQuizArray != null){

          if(resPreQuizArray.length > 0){
            setPreQuizLength(resPreQuizArray.length);
            PreQuizLengthVar = resPreQuizArray.length;
            setQuiz(resPreQuizArray);
    
            // document.querySelector(".checkAnswerbtn").addEventListener("click", () => {
              
            // });
    
          }else{
              // $(".preAssetsQuizMainBox").hide(400);
          }
          // console.log();
        }
      }
    }
    setLoadingShowQuiz(false);


    // console.log(dataUser);
    setUserDetail(dataUser);
  }

  const handleCheckAnswerBTN = () => {
    if($('.checkAnswerbtn').hasClass("active")){

      console.log(selectedItemQuiz);
      console.log(Quiz[NoIndexOfQuiz].CorrectOption);
      if (selectedItemQuiz == Quiz[NoIndexOfQuiz].CorrectOption) {
        console.log("suc");
        trueAnswer++;
        // userScore = userScore + quizScore;
        setUserScore(userScore + parseInt(Quiz[NoIndexOfQuiz].point))
        
        checkEndOfQuiz();
      } else {
        wrongAnswer++;
        console.log("wrong");
        checkEndOfQuiz();
      }
    }else{
      console.log("choose!");
    }
  }

  const handleGoToNextQuestion = () => {
    // $(".quiz-options-wrapper").toggleClass("d-none");
    // $(".quiz-result-wrapper").addClass("d-none");
    // $(".preAssetsQuizMainBox").removeClass("d-none");
    selectedItemQuiz = 0 ;
    setAnswer(0);
    // $(".checkAnswerbtn").removeClass("active");
    // $(".checkAnswerbtn").prop("disabled", true);
    // $('.quizOpIn').prop('checked', false);
    // setNoIndexOfQuiz(NoIndexOfQuiz + 1)
    checkEndOfQuiz()
  }



  const rendererCountDown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return (
        <>
          {handleGoToNextQuestion}
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
  
          <span>
              <img src="/assets/images/assenment/quiz-time.gif" alt="" />
          </span>
          <span>
            {minutes} m : {seconds} s
          </span>

          {/* <div>remaining time</div> */}
        
        </>
      );
    }
  };

  const handleClearQuizValue = () => {
    // selectedItemQuiz = 0;
    // userScore = 0;
    // trueAnswer = 0;
    // wrongAnswer = 0;
    // setNoIndexOfQuiz(0);
    // setAnswer(0)
    // setShowChoiceModal(1)
    $('.quizOpIn').prop('checked', false);
    $(".checkAnswerbtn").removeClass("active");
    $(".checkAnswerbtn").prop("disabled", true);
  };

  const handleQuitQuiz = () =>{
    $('.preAssetsQuizMainBox').hide();
    setQuiz([]);
    setShowChoiceModal(-1);
  }

  const handleChangeOPValue = (e) =>{
    // $(".checkAnswerbtn").prop("disabled", false);
    // checkAnswerbtnRef.current.disabled = false;
    checkValue(e.target);
  }

  const handleSubmitPreQuiz = () =>{

    // console.log("userScore : " + userScore);
    axios({
      url:`${config.api}/api/answer/create/pre`,
      method:"post",
      data:{
        assId:AssessmentDetailState[NoIndexOfassessment]._id,
        quiz:Quiz[NoIndexOfQuiz]._id,
        user:localStorage.getItem('user_id'),
        point:userScore
      }
    }).then((res) => {
      if(AssessmentDetailState.length == NoIndexOfassessment + 1){
        // handleQuitQuiz();
      }else{
        // handleGotoNextAssessment();
      }
    }).catch((err) => {

    })
  }

  const handleGotoNextAssessment = () =>{
    handleSubmitPreQuiz();

    let nextAssIndex = NoIndexOfassessment + 1 ;
    console.log(nextAssIndex); 
    setNoIndexOfassessment(nextAssIndex); 
    setShowChoiceModal(1);
    handleClearQuizValue();
    const resPreQuizArray1 = AssessmentDetailState[nextAssIndex].Quiz;

    if(resPreQuizArray1 != null){

      if(resPreQuizArray1.length > 0){
        console.log("objectTest");
        setPreQuizLength(resPreQuizArray1.length);
        PreQuizLengthVar = resPreQuizArray1.length;
        setQuiz(resPreQuizArray1);
        console.log(resPreQuizArray1);
        selectedItemQuiz = 0;
        setUserScore(0);
        trueAnswer = 0;
        wrongAnswer = 0;
        setNoIndexOfQuiz(0);
      }else{}

    }
  }

  const handleShowPreAssessmentQuiz = () =>{
    if(ShowChoiceModal == 0){
      return (
        <section class="popup ensurance-popup">
          <div class="ensurance">
            <span onClick={() => handleLogOut()}>Logout</span>
            <img src="assets/images/assenment/ensure-logo.png" alt="" />
            <h2>Welcome Onboard</h2>
            <div class="btn-wrapper">
              {/* {AssessmentDetailState[NoIndexOfassessment].Type.search("Stand-alone") > -1 ? } */}
              <button class="ensurance-btn pre-assenment-btn" onClick={() => setShowChoiceModal(1)}>
                <img src="/assets/images/assenment/ensure-aseess.png" alt="" />
                Take Pre-Assessment
              </button>
              <button onClick={() => {setShowChoiceModal(-1);setQuiz([])}}>
                <img src="/assets/images/assenment/ensure-learning.png" alt="" />
                Start Learning
              </button>
            </div>
          </div>
        </section>
      )
    }else if(ShowChoiceModal == 1){
      return(
        <section class="popup pre-assenment-popup">
        <div class="pre-assenment">
          <h2>{AssessmentDetailState[NoIndexOfassessment].Name}</h2>
          <div class="assenment-detail">
            <div class="assenment-box">
              <div class="thumb">
                <img src={clinet.data.logo} alt="" style={{width:"123px",borderRadius:"7px"}}/>
              </div>
              <div class="content">
                <p>
                  <span>Assessment Code</span>:&nbsp;&nbsp;&nbsp;&nbsp; {AssessmentDetailState[NoIndexOfassessment].assId}
                </p>
                <p>
                  <span>Expected Duration</span>:&nbsp;&nbsp;&nbsp;&nbsp;
                  {(()=>{
                    var totalTime = 0 ;
                    AssessmentDetailState[NoIndexOfassessment].Quiz?.map((quiz,index) =>{
                      console.log(quiz)
                      totalTime += parseInt(quiz.max_time);

                    }
                  )
                    console.log(totalTime)
                    return (totalTime / 60).toFixed(2)
                    // Math.ceil(AssessmentDetailState[NoIndexOfassessment].Time / 60)
                  })()}
                  &nbsp;Minutes
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div class="please-ensure">
            <h3>Please Ensure</h3>
            <div class="container">
              <div class="row">
                <div class="col-lg-3 col-6">
                  <div class="box">
                    <img src="/assets/images/assenment/desktop.png" alt="" />
                    <h6>Preferably take Assessment on a desktop</h6>
                  </div>
                </div>
                <div class="col-lg-3 col-6">
                  <div class="box">
                    <img src="/assets/images/assenment/dnd.png" alt="" />
                    <h6>
                      Choose a place & time, where you will not be disturbed
                    </h6>
                  </div>
                </div>
                <div class="col-lg-3 col-6">
                  <div class="box">
                    <img src="/assets/images/assenment/silent.png" alt="" />
                    <h6>Phone on silent mode, Do not take calls</h6>
                  </div>
                </div>
                <div class="col-lg-3 col-6">
                  <div class="box">
                    <img src="/assets/images/assenment/time.png" alt="" />
                    <h6>
                      If you quit, or time-out, you will need to re-do the
                      assessment
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-wrapper">
            <button class="pre-assenment-btn ensurance-btn" onClick={() => setShowChoiceModal(0)}>Do Assessment Later</button>
            <button class="question1-btn pre-assenment-btn" onClick={() => setShowChoiceModal(2)}>
              Start Assessment
            </button>
          </div>
        </div>
        </section>
      )
    }else {
      return(
          
        <>

        {/* <div className="endMainBoxPreQuiz d-none">
          <img src="/assets/images/" alt="" />
          <div className="EMBPQ-title"> Thank You! </div>
          <div className="EMBPQ-text">
            You have successfully completed this Pre-Assessment
          </div>
          <div className=" EMBPQ-btn" onClick={() => {handleSubmitPreQuiz();}}>
            Continue
          </div>
      </div> */}

        <section class="popup thanks-popup endMainBoxPreQuiz d-none">
          <div class="thanks">
            <img src="/assets/images/assenment/thanks-thumb.png" alt="" />
            <h2>Thank You!</h2>
            <p>
              You have successfully completed this <br />
              Pre-Assessment.
            </p>
            <div class="btn-wrapper">
              <button class="thanks-btn score-btn" onClick={() => handleShowPreAssScore()}>Your Score</button>

              {(()=>{

                if(AssessmentDetailState.length == NoIndexOfassessment + 1 ){
  
                  if (AssessmentDetailState[NoIndexOfassessment].Type.search("Stand-alone") > -1) {
                    return(
                      <span>
                        <button style={{background:"#ccc",cursor:"default"}}>Enter Series <i class="fas fa-arrow-right"></i></button>

                      </span>
                    ) 
                  }else if(AssessmentDetailState[NoIndexOfassessment].Type.search("Mandatory-conditional") > -1 && userScore >= AssessmentDetailState[NoIndexOfassessment].Point){
                    return(
                      <span onClick={()=> {handleSubmitPreQuiz();handleQuitQuiz()}}>
                        <button>Enter Series <i class="fas fa-arrow-right"></i></button>
                      </span>
                    ) 
                  }else if (AssessmentDetailState[NoIndexOfassessment].Type.search("Mandatory-unconditional") > -1){
                    return(
                      <span onClick={()=> {handleSubmitPreQuiz();handleQuitQuiz()}}>
                        <button>Enter Series <i class="fas fa-arrow-right"></i></button>
                      </span>
                    )
                  }else{
                    return(
                      <span>
                        <button style={{background:"#ccc",cursor:"default"}}>Enter Series <i class="fas fa-arrow-right"></i></button>
                      </span>
                    )
                  }

                }else{
                  return(
                    <span onClick={()=> handleGotoNextAssessment()}>
                      <button>Next Pre Assessment <i class="fas fa-arrow-right"></i></button>
                    </span>
                  )
                }

              })()}

              
              
            </div>
          </div>
        </section>

        <section class="popup score-popup scorePopUpPreAss d-none">
          <div class="score">
            <h2>Your Pre-Assessment Score</h2>
            <div class="your-score">
              <img src="assets/images/assenment/your-score.png" alt="" />
              <span>{userScore}</span>
            </div>
            <h4>YOUR SCORE</h4>
            <div class="score-result-wrapper">
              <div class="score-result total">
                <div class="title">
                  <img src="assets/images/assenment/score.png" alt="" />
                  <span>{Quiz.length}</span>
                </div>
                <div class="description">
                  <span></span>
                  <h6>No. of question</h6>
                </div>
              </div>
              <div class="score-result correct">
                <div class="title">
                  <img src="assets/images/assenment/score.png" alt="" />
                  <span>5</span>
                </div>
                <div class="description">
                  <span></span>
                  <h6>correct</h6>
                </div>
              </div>
              <div class="score-result incorrect">
                <div class="title">
                  <img src="assets/images/assenment/score.png" alt="" />
                  <span>15</span>
                </div>
                <div class="description">
                  <span></span>
                  <h6>incorrect</h6>
                </div>
              </div>
            </div>
            <button class="score-btn thanks-btn" onClick={() => handleShowPreAssScore()}>Close</button>
          </div>
        </section>

        <div className="PAQMB-header">
          <div className="PAQMB-headerTitle"> Quiz </div>
          <div>
            <div className="PAQMB-headerScore">
              <div className="PAQMB-headerScoreBadge">
                <img src="/assets/images/dashboard/badge.png" alt="" className="PAQMB-headerScoreBadgeImg" />
                <img src="/assets/images/coin.png" alt="" className="PAQMB-headerScoreBadgeImgCoin" />
              </div>
              <div className="PAQMB-headerScoreNo">
                {Quiz[NoIndexOfQuiz]?.point}
              </div>

            </div>
            <div className="PAQMB-text">
              points for this question
            </div>
          </div>
          <div className="PAQMB-headerNoOfQues">
            <div className="QPB-title">
                <span> Question </span>
                <span> {NoIndexOfQuiz + 1 } / {PreQuizLength} </span>
              </div>
            <div className="QPB-pr">
              <div className="QPB-prInner" style={{"width":`${((NoIndexOfQuiz + 1 )/PreQuizLength)*100}%`}}></div>
            </div>
          </div>

          <div>
            <div className="PAQMB-headerQuizTimeCountdown">
              <Countdown date={Date.now() + (Quiz[NoIndexOfQuiz].max_time * 1000)} renderer={rendererCountDown} />
            </div> 
            <div className="PAQMB-text">
              remaining time
            </div>
          </div>

          <div className="PAQMB-headerClose">
            <button
              onClick={() => {
                handleQuitQuiz();
              }}
              className="close-wrapper quit-quiz-button"
            >
              Quit<i className="fa fa-times"></i>
            </button>
          </div>
        </div>

        <div className="quiz-page-wrapper PAQMB-body">
          <div className="quiz-options-wrapper">
          {/* style={{position: "relative",transform:!isEmpty(Quiz[NoIndexOfQuiz].Banner) ? "translateX(25%)" : ""}} */}
          <div  className="quiz-box text-center " >
            {!isEmpty(Quiz) ? (
                <>
                  <h4
                    style={{ marginTop: 50, marginBottom: 15 }}
                    className="tagline"
                  >
                    {!isEmpty(Quiz[NoIndexOfQuiz].Description) ? Quiz[NoIndexOfQuiz].Description : null}
                  </h4>
                  {!isEmpty(Quiz[NoIndexOfQuiz].Title) ? (
                    <h4>{Quiz[NoIndexOfQuiz].Title}</h4>
                  ) : null}

                  {!isEmpty(Quiz[NoIndexOfQuiz].Banner) ? (
                    // style={{position: "absolute",left: "-20px",top:"0",transform: "translateX(-100%)", marginTop: 20 }}
                    <div style={{marginTop: 20 }} className="">
                      <img
                        className="quizImageBox"
                        src={!isEmpty(Quiz[NoIndexOfQuiz].Banner) ? Quiz[NoIndexOfQuiz].Banner : ""}
                        alt=""
                      />
                    </div>
                  ) : null}

                  <div className="row options-wrapper" style={{ marginTop: 20 }}>
                    <label className="col-md-6 px-1 option">
                      <input
                        className="quizOpIn"
                        type="radio"
                        value="1"
                        name="option1"
                        onChange={(e) => handleChangeOPValue(e)}
                      />
                      <span className="checkmark">{Quiz[NoIndexOfQuiz].Option1}</span>
                    </label>
                    <label className="col-md-6 px-1 option">
                      <input
                        className="quizOpIn"
                        type="radio"
                        value="2"
                        name="option1"
                        onChange={(e) => handleChangeOPValue(e)}
                      />
                      <span className="checkmark">{Quiz[NoIndexOfQuiz].Option2}</span>
                    </label>
                    <label className="col-md-6 px-1 option">
                      <input
                        className="quizOpIn"
                        type="radio"
                        value="3"
                        name="option1"
                        onChange={(e) => handleChangeOPValue(e)}
                      />
                      <span className="checkmark">{Quiz[NoIndexOfQuiz].Option3}</span>
                    </label>
                    <label className="col-md-6 px-1 option">
                      <input
                        className="quizOpIn"
                        type="radio"
                        value="4"
                        name="option1"
                        onChange={(e) => handleChangeOPValue(e)}
                      />
                      <span className="checkmark">{Quiz[NoIndexOfQuiz].Option4}</span>
                    </label>
                  </div>
                  <button
                    className="quiz-question-button checkAnswerbtn"
                  
                    onClick={handleCheckAnswerBTN}
                  >
                    Submit
                  </button>
                </>
              ) : null}
          </div>
          </div>
        </div>

        </>
      )
    }
  }


  const handleShowPreAssScore = () => {
    $(".endMainBoxPreQuiz").toggleClass("d-none");
    $(".scorePopUpPreAss").toggleClass("d-none");
  }

  useEffect(() =>{
    // $(".preAssetsQuizMainBox").on("change", ".quizOpIn", function () {
    //   console.log("object");
    // });
    handleGetUserInfo();
  },[]);

  useEffect(() =>{

  },[NoIndexOfassessment])
  
  return (
    <>
    
      {!isEmpty(Quiz) && (
        <>
          <div className="preAssetsQuizMainBox" style={{overflowY:"auto"}}>
            {handleShowPreAssessmentQuiz()}
          </div>

        </>
      )}
    
      {LoadingShowQuiz && (
        <>
          <div className="preAssetsQuizMainBox"></div>
        </>
      )}

      <section className="main-wrapper">
        <Navbar toggleNav={toggleNav} />
        <div className={`page-content transition ${toggleNav}`}>
          <header>
            <button onClick={handleToggleNav} className="toggle-box">
              {toggleNav == "active" ? (
                <img
                  className="close-sidebar"
                  src="/assets/images/header/close-bar.png"
                  alt=""
                />
              ) : (
                <img
                  className="open-sidebar"
                  src="/assets/images/header/open-bar.png"
                  alt=""
                />
              )}
            </button>
            <form
              onSubmit={(e) => {
                handleSearch(e);
              }}
              className="search-box"
            >
              <input
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="Search Series"
              />
              <button onClick={() => handleSearch()}>
                <i className="fa fa-search"></i>
              </button>
            </form>
            <div className="profile-box">
              <div className="notification-wrapper position-relative">
                <button
                  onClick={(e) => {
                    openDropDown(e, 2);
                  }}
                  className="notifications dropdown-button"
                >
                  <div className="noti"></div>
                  <i className="fa fa-bell"></i>
                </button>
                <ul className="dropdown-content">
                  <li className="title">
                    Notifications <span>(4 New)</span>
                  </li>
                  <li>
                    <a href="#">This is a sample notification text.</a>
                  </li>
                  <li>
                    <a href="#">This is a sample notification text.</a>
                  </li>
                  <li>
                    <a href="#">This is a sample notification text.</a>
                  </li>
                  <li>
                    <a href="#">This is a sample notification text.</a>
                  </li>
                  <li>
                    <a href="#">This is a sample notification text.</a>
                  </li>
                  <li className="see-all">
                    <a href="#">View All Notifications</a>
                  </li>
                </ul>
              </div>
              <div className="profile-wrapper position-relative">
                <button
                  onClick={(e) => {
                    openDropDown(e, 1);
                  }}
                  className="profile dropdown-button"
                >
                  <img
                    src="assets/images/header/profile-pic.png"
                    className="rounded"
                    alt=""
                  />
                </button>
                <ul className="dropdown-content">
                  <li>
                    <NavLink to="/home">{UserDetail?.email}</NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard">Account</NavLink>
                  </li>
                  <li
                    onClick={() => {
                      handleLogOut();
                    }}
                    className="text-primary"
                  >
                    <a href="#">logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </header>
          <ul className="bread-crumb">
            <li className="active">
              <a href="#">Home</a>
            </li>
            <li>
              <i className="fa fa-chevron-right"></i>
            </li>
          </ul>
          <section className="home-wrapper">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div className="user-profile">
                    <div className="profile-thumb">
                      <img src="assets/images/home/beginnerr.png" alt="" />
                    </div>
                    <div className="profile-rank">
                      <h4>YOUR RANK</h4>
                      <h2>
                        # <span className="text-white">00</span>
                      </h2>
                      <h4>000 POINTS</h4>
                    </div>
                    <Link to={'/leader-board'}>
                      <button className="profile-leaderboard">Leaderboard</button>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="side-banner">
                    <img
                      width="100%"
                      height="200px"
                      src={!isEmpty(clinet) ? clinet.data.Banner : null}
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="series-wrapper">
                    <div className="title">
                      <div className="showUserFullname pl-3">
                        {!isEmpty(clinet)
                          ? 
                          <>
                            <span>{clinet.data.fullName}</span>
                            <span style={{marginLeft:6}}>Series</span>
                          </>
                          : null}
                      </div>
                      <div className="pagination">
                        <Link to="/series">View All</Link>
                        <button className="left">
                          <i className="fa fa-chevron-left"></i>
                        </button>
                        <button className="right">
                          <i className="fa fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                    <Swiper
                      className="seriesSwiper"
                      modules={[Navigation, A11y]}
                      spaceBetween={0}
                      // slidesPerView={5}
                      loop={true}
                      navigation={{
                        nextEl: ".right",
                        prevEl: ".left",
                      }}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 40,
                        },
                        1024: {
                          slidesPerView: 5,
                          spaceBetween: 0,
                        },
                      }}
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      {series?.data?.map((item, index) => (
                        <>
                          {item != null? 
                          
                            <SwiperSlide>
                              <div key={index} className="swiper-slide">
                                <div className="series">
                                  <div className="thumbnail">
                                    {item.Banner.length > 0 ? 
                                    
                                    <img src={item.Banner[0]} alt="" />
                                    :null}
                                    <div className="description">
                                      <p>{item.Description}</p>
                                      <Link to={`/series/${item._id}`}>
                                        <button>Enter Series</button>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="title">{item.Title}</div>
                                </div>
                              </div>
                            </SwiperSlide>
                          :null}
                        
                        </>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};
export default Home;
