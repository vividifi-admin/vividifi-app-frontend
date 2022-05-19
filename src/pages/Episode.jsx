import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useHistory, NavLink } from "react-router-dom";
import { isEmpty } from "lodash";
import $ from "jquery";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay , Lazy } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { getSingleSeasen } from "../store/actions/seasons";
import { getSingleSeries } from "../store/actions/series";
import { getLearning as learn } from "../store/actions/learning";
import { getLearning } from "../services/getLearning";
import { getSingleEpisode } from "../store/actions/episode";
import { getQuiz } from "../services/getQuiz";
import { getQuizList } from "../store/actions/quiz";
import config from '../services/config.json';
import _ from "lodash";
import { getUser } from "../services/getClinet";
import Countdown from "react-countdown";
import { useSpeechSynthesis } from "react-speech-kit";
import { getHowTo } from "../services/getEpisode";

const Episode = () => {
  let selectedItemQuiz = 0;
  let trueAnswer = 0;
  let wrongAnswer = 0;
  let minTotalScore = 0;
  let userScore = 0;
  let mainComicsArray = [];
  let learningHelp = [];

  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { episodeId, seasonId, seriesId } = params;
  // console.log(episodeId, seasonId, seriesId);
  const singleSeasen = useSelector((state) => state.singleSeasen);
  const singleSeries = useSelector((state) => state.singleSeries);
  const learning = useSelector((state) => state.learning);
  const singleEpisode = useSelector((state) => state.singleEpisode);
  const quiz = useSelector((state) => state.quiz);
  const [answer, setAnswer] = useState();
  const [selectedIdBox, setSelectedIdBox] = useState("");
  const [videoData, setVideoData] = useState({ id: "", video: "" });
  const [showSliderBeforeQuez, setShowSliderBeforeQuez] = useState(false);

  const [ClientRecommended,setClientRecommended] = useState({});


  const [GameArray,setGameArray] = useState([]);
  const [HowToArray,setHowToArray] = useState([]);


  const [NoOfQuiz,setNoOfQuiz] = useState('');
  const [NoIndexOfQuiz,setNoIndexOfQuiz] = useState(0);
  const [UserDetail,setUserDetail] = useState({});

  const [QuizMaxTime , setQuizMaxTime] = useState(0);
  
  const { speak } = useSpeechSynthesis();


  let learningItemId = -1 ;
  const quizScore = 100;
  const userId = localStorage.getItem("user_id");
  const clientId = localStorage.getItem("client_id");

  // console.log("singleEpisode", singleEpisode);

  const handleLogOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("client_id");
    history.replace("/login");
  };

  useEffect(() => {
    if (seasonId) {
      if (isEmpty(singleSeasen)) {
        dispatch(getSingleSeasen(seasonId));
      } else {
        document.getElementById("seasonTitle").innerHTML = !isEmpty(
          singleSeasen
        )
          ? singleSeasen?.data.Title
          : "";
      }
    }
  }, [singleSeasen]);
  useEffect(() => {
    if (seriesId) {
      if (isEmpty(singleSeries)) {
        dispatch(getSingleSeries(seriesId));
      } else {
        minTotalScore = parseInt(singleSeries.data.CompletionCriteria);
        $("#series_name").text(singleSeries.data.Title);
      }
    }
  }, [singleSeries]);
  useEffect(async () => {
    if (episodeId) {
      if (isEmpty(learning)) {
        const { data, success } = await getLearning(episodeId);
        dispatch(learn(data));
        learningHelp = data.data;
        console.log(learningHelp);
      }
    }
  }, [learning]);
  useEffect(() => {
    if (episodeId) {
      if (isEmpty(singleEpisode)) {
        dispatch(getSingleEpisode(episodeId));
      } else {
        $("#episodeTitle_").html(
          !isEmpty(singleEpisode) ? singleEpisode.data.Title : ""
        );
        $("#episodeTitle").html(
          !isEmpty(singleEpisode) ? singleEpisode.data.Title : ""
        );
        $("#episodeDesc").html(
          !isEmpty(singleEpisode) ? singleEpisode.data.Description : ""
        );
        $("#rank_score").text("00");
        $("#points_score").text("00");
        $("#badges_score").text("00");
        $(".episode-detail-wrapper").fadeIn();
      }
    }
  }, [singleEpisode]);
  const checkValue = (e) => {
    selectedItemQuiz = $(e).val();
    setAnswer(selectedItemQuiz);
    console.log("selectedItemQuiz", selectedItemQuiz);
    $(e).parents(".quiz-box").find("button").addClass("active");
    $(e).parents(".quiz-box").find("button").prop("disabled", false);
  };

  const checkEndOfQuiz = () => {
    $(".quiz-result-wrapper").removeClass("d-none");
    $(".showQuizQu").addClass("d-none");
    // $(".question-result.total")
    //   .children(".title")
    //   .children("span")
    //   .html(quiz.length);
    $(".question-result.correct")
      .children(".title")
      .children("span")
      .html(trueAnswer);
    $(".question-result.incorrect")
      .children(".title")
      .children("span")
      .html(wrongAnswer);
    $(".quiz-result-wrapper.success")
      .children(".quiz-box")
      .children(".score")
      .children("span")
      .html(userScore);
    if (userScore >= minTotalScore) {
      $(".quiz-result-wrapper.success")
        .children(".quiz-box")
        .children(".score")
        .children("span")
        .css("color", "#2f9e0e");
    } else {
      $(".quiz-result-wrapper.success")
        .children(".quiz-box")
        .children(".score")
        .children("span")
        .css("color", "#fc2c2c");
    }

    if(NoIndexOfQuiz == (NoIndexOfQuiz.length - 1)){
      handleClearQuizValue();
    }else{
      // setNoIndexOfQuiz( NoIndexOfQuiz + 1 );
    }

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

  const handleClearQuizValue = () => {
    selectedItemQuiz = 0;
    userScore = 0;
    trueAnswer = 0;
    wrongAnswer = 0;
    setNoIndexOfQuiz(0);
    setAnswer(0)
    $('.quizOpIn').prop('checked', false);
    $(".checkAnswerbtn").removeClass("active");
    $(".checkAnswerbtn").prop("disabled", true);
  };

  const handleOpenVideo = (id, video, target = undefined) => {
    if (target != undefined) {
      $(`.${target}`).removeClass("active");
    }
    $(".video-page-wrapper").addClass("active");
    setVideoData({ id, video });
    $("video").get(0).pause();
    setSelectedIdBox(id);
    $("#videoItem").attr("src", video);
  };

  const handleClickInfo = (id) => {
    $(".loaderForImage").fadeIn(400);
    $("body").toggleClass("overflow-hidden");
    $("video").get(0).pause();
    $(".infograph-page-wrapper").toggleClass("active");
    $(".infoImage").children("img").attr("src", null);
    setSelectedIdBox(id);
    $(".infoImage").children("img").hide(1000);
    var image = new Image();
    image.onload = function () {
      console.info("Image loaded !");
      $(".infoImage").children("img").attr("src", image.src).fadeIn(500);
      $(".infoImage").children("img").fadeIn(1000);
      $(".loaderForImage").fadeOut(400);
    };
    image.onerror = function () {
      console.error("Cannot load image");
      $(".infoImage").children("img").slideDown(1000);
      $(".loaderForImage").fadeOut(400);
    };
    for (let i = 0; i < learning.data.length; i++) {
      const element = learning.data[i];
      if (element.MediaType == "infographics") {
        if (id == element._id) {
          // console.log(element);

          image.src = element.Media[0];
        }
      }
    }
  };
  const handleClickComic = (id, file, showSlider = true) => {
    setShowSliderBeforeQuez(showSlider);
    $("video").get(0).pause();
    $(".comic-page-wrapper").toggleClass("active");
    setSelectedIdBox(id);
    if (file != undefined) {
      window.open(`https://docs.google.com/gview?url=${file}`, "_blank");
    }
  };


  const handleAddAnswer = (typeOfAnswer) =>{
    let earnScore = 0;
    let learningType = '';
    let isCorrect = false;
    if(typeOfAnswer == "success"){
      earnScore = quizScore;
      isCorrect = true;
    }

    console.log(learning.data);
    console.log(learningItemId);

    for (let i = 0; i < learning.data.length; i++) {
      const element = learning.data[i];
      if(element._id == learningItemId){
        learningType =  element.MediaType;
        break;
      }
    }

    console.log(learningItemId);
    console.log(learningType);

    axios({
      url:`${config.api}/api/answer/create`,
      method:'post',
      data:{
        user : userId,
        learning_item : learningItemId,
        type: learningType,
        score: earnScore,
        is_correct:isCorrect
      }
    }).then((res) =>{
      console.log(res.data);
    }).catch((err) =>{
      console.log(err);
    })
  }


  const handleTakeQuiz = async () => {
    $("body").toggleClass("overflow-hidden");
    $("video").get(0).pause();
    $(".quiz-page-wrapper").toggleClass("active");

    learningItemId = selectedIdBox;
    
    const { data } = await getQuiz(selectedIdBox);
    console.log(data.data);
    dispatch(getQuizList(data.data));
    handleClearQuizValue();
    // $(".QBox").children(".score").children("span").html(data.data.length);
    setNoOfQuiz(data.data.length);
    
    document.querySelector(".checkAnswerbtn").addEventListener("click", () => {
      console.log("hiiiii");
      if (selectedItemQuiz == data.data[NoIndexOfQuiz].CorrectOption) {
        trueAnswer++;
        userScore = userScore + quizScore;
        handleAddAnswer('success');

        checkEndOfQuiz();
      } else {
        wrongAnswer++;
        handleAddAnswer('wrong');
        checkEndOfQuiz();
      }
    });
  };
  const handleQuitQuiz = () => {
    $("video").get(0).pause();
    const wrapper = document.querySelector(".quiz-page-wrapper");
    const wrapperInfograph = document.querySelector(".infograph-page-wrapper");
    const wrapperComic = document.querySelector(".comic-page-wrapper");
    wrapper.classList.remove("active");
    wrapperInfograph.classList.remove("active");
    wrapperComic.classList.remove("active");
  };
  const startQuizClick = () => {
    $(".start-quiz-wrapper").toggleClass("d-none");
    $(".quiz-options-wrapper").removeClass("d-none");
    $(".quiz-result-wrapper").addClass("d-none");
    $(".showQuizQu").removeClass("d-none");

    handleClearQuizValue();
  };

  const handleGoToNextQuestion = () => {
    // $(".quiz-options-wrapper").toggleClass("d-none");
    $(".quiz-result-wrapper").addClass("d-none");
    $(".showQuizQu").removeClass("d-none");
    selectedItemQuiz = 0 ;
    setAnswer(0);
    $(".checkAnswerbtn").removeClass("active");
    $(".checkAnswerbtn").prop("disabled", true);
    $('.quizOpIn').prop('checked', false);
    setNoIndexOfQuiz(NoIndexOfQuiz + 1)
  }

  const handleGoToEp = () => {
      handleQuitQuiz();
      $('.quiz-result-wrapper ').addClass('d-none');
      $('.start-quiz-wrapper').removeClass('d-none');
      $('.close-wrapper').click();

  }

  const handleGetRecommended = () =>{
    axios({
        url: config.api + "/api/recomended/"+clientId,
        method:'GET',
    }).then((res) => {
        setClientRecommended(res.data.data);
        
    }).catch((err) => {
        console.log(err);
    })
  }

  useEffect(() => {
    $(".quiz-response-button").click(function () {
      $(".quiz-response-wrapper").toggleClass("d-none");
    });

    $(document).on("click", ".close-wrapper", function () {
      $("body").removeClass("overflow-hidden");
      $(".video-page-wrapper").removeClass("active");
    });

    $(document).on("click", ".dictonary-thumb", function () {
      $(this).parent().toggleClass("active");
      $(this).find("i").toggleClass("d-none");
      $(this).parent().find(".content").toggleClass("d-none");
    });
  }, []);
  $(".showQuizQu").on("change", ".quizOpIn", function () {
    checkValue(this);
  });
  const handleActiveTab = (tab) => {};

const handleGetGames = () =>{
  axios({
    url:`${config.api}/api/game/${episodeId}`,
    method:'get'
  }).then((res) =>{
    // console.log(res);
    setGameArray(res.data.data);
  }).catch((err)=>{
    console.log(err);
  })
}


const handleGetUserInfo = async () =>{
  const {data} = await getUser(localStorage.getItem('user_id'));
  let dataUser = data.data;
  setUserDetail(dataUser);
}

const handleGetHowTo = async () =>{
  const {data} = await getHowTo(episodeId);
  let dataHowTo = data.data;
  setHowToArray(dataHowTo);
}

const rendererCountDown = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return (
      <>
        Time out!
      </>
    );
  } else {
    // Render a countdown
    return (
      <>

        <span>
            <img src="/assets/images/clock.svg" alt="" />
        </span>
        <span>
          {minutes}:{seconds}
        </span>
      
      </>
    );
  }
};

  useEffect(() => {
    document.querySelectorAll(".nav-tabs li a").forEach((el) => {
      el.classList.remove("active");
      el.addEventListener("click", () => {
        $(".nav-tabs li a").removeClass("active");
        el.classList.add("active");
        const target = el.getAttribute("route");
        document
          .querySelectorAll(".tab-content .tab-pane")
          .forEach((element) => {
            element.classList.remove("active");
            element.classList.remove("show");
            const id = element.getAttribute("id");
            if (target == id) {
              element.classList.add("active");
              element.classList.add("show");
            }
          });
      });
    });

    $(".nav-tabs li a").eq(0).addClass("active");

    $(document).on("hidden.bs.modal", ".modal", function () {
      $(".modal:visible").length && $(document.body).addClass("modal-open");
    });

    $(document).on("click", ".HT-cardHeader", function () {
      
      $(this).next(".HT-cardBody").slideToggle(400);
      $(this).children(".HT-cardHeaderIcon").toggleClass("tr-180");

    });

    $(document).on("click", ".HT-cardtabsCard", function () {
      var boxes = $(this).parent().next(".HT-cardtabsContent").children(".HT-cardtabsContentbox");
      $(boxes).removeClass("active");
      $(this).parent().children(".HT-cardtabsCard").removeClass("active");
      for (let i = 0; i < boxes.length; i++) {
        const element = boxes[i];
        if($(element).hasClass($(this).data("target"))){
          $(this).addClass("active");
          $(element).addClass("active")
        }
      }

    });

    $(document).on("click", ".HT-cardBoxImage", function () {
      
      var imgSrc = $(this).children("img").attr("src");
      $(".howToShowPreviewMain").children("img").attr("src",imgSrc);
      $(".howToShowPreviewMain").fadeIn(400).css("display","flex");

    });

    $(document).on("click", ".HTSP-exitBtn", function () {

      $(".howToShowPreviewMain").fadeOut(400);

    });

    


    handleGetGames();
    handleGetUserInfo();
    handleGetRecommended();
    handleGetHowTo();


  }, []);

  return (
    <div>
      <section className="main-wrapper inner-wrapper">
        <div className="page-content transition">
          <header>
            <button
              className="back-button"
              onClick={() => {
                history.goBack();
              }}
            >
              <a>
                <i className="fa fa-arrow-left"></i>
              </a>
            </button>
            <ul className="bread-crumb">
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <i className="fa fa-chevron-right"></i>
              </li>
              <li>
                <Link to="/home">Series</Link>
              </li>
              <li
              // onClick={() => {
              //   history.go(-2);
              // }}
              >
                <a href={`/series/${seriesId}`} id="series_name"></a>
              </li>
              <li>
                <i className="fa fa-chevron-right"></i>
              </li>
              <li
              // onClick={() => {
              //   history.go(-1);
              // }}
              >
                <a
                  href={`/season/${seasonId}/${seriesId}`}
                  id="seasonTitle"
                ></a>
              </li>
              <li>
                <i className="fa fa-chevron-right"></i>
              </li>
              <li className="active">
                <a href="" id="episodeTitle_"></a>
              </li>
            </ul>
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
                    src="/assets/images/header/profile-pic.png"
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
          <ul className="bread-crumb mobile-crumb">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <i className="fa fa-chevron-right"></i>
            </li>
            <li>
              <Link to="/home">Series</Link>
            </li>
            <li>
              <a></a>
            </li>
            <li>
              <i className="fa fa-chevron-right"></i>
            </li>
            <li
              onClick={() => {
                history.go(-1);
              }}
            >
              <a href="#">Season 1</a>
            </li>
            <li>
              <i className="fa fa-chevron-right"></i>
            </li>
            <li className="active">
              <a href="#">Episode 1</a>
            </li>
            <li className="active">
              <i className="fa fa-chevron-right"></i>
            </li>
          </ul>
          <section className="episode-wrapper">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div
                    className="episode-detail-wrapper"
                    style={{ display: "none" }}
                  >
                    <h5 id="episodeTitle"></h5>
                    <h2 id="episodeDesc"></h2>
                    <div className="thumbnail">
                      <img
                        src={
                          !isEmpty(singleEpisode)
                            ? 

                            singleEpisode?.data?.Episode_banner ? singleEpisode?.data?.Episode_banner : singleEpisode?.data?.Banner[0]
                            
                            : null
                        }
                        className="w-100"
                        alt=""
                      />
                    </div>
                    <div className="user-points-wrapper">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-lg-4 col-md-6">
                            <div className="user-points">
                              <div className="title">
                                <img
                                  src="/assets/images/episode/rank.png"
                                  alt=""
                                />
                                Rank
                              </div>
                              <div className="score1" id="rank_score"></div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="user-points">
                              <div className="title">
                                <img
                                  src="/assets/images/episode/point.png"
                                  alt=""
                                />
                                points
                              </div>
                              <div className="score1" id="points_score"></div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="user-points">
                              <div className="title">
                                <img
                                  src="/assets/images/episode/badge.png"
                                  alt=""
                                />
                                badges
                              </div>
                              <div className="score1" id="badges_score"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="episode-games-wrapper overflow-hidden">
                    <div className="title">
                      Specially Chosen for you,
                      <span className="text-secondary ml-1">{UserDetail?.fullName}</span>
                      <div className="pagination">
                        <button className="left">
                          <i className="fa fa-chevron-left"></i>
                        </button>
                        <button className="right">
                          <i className="fa fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                    <Swiper
                      className="swiper episodeGameSwiper"
                      modules={[Navigation, Pagination, A11y, Autoplay]}
                      spaceBetween={0}
                      slidesPerView={1}
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                      }}
                      spaceBetween={0}
                      loop={true}
                      navigation={{
                        nextEl: ".right",
                        prevEl: ".left",
                      }}
                      pagination={{
                        el: ".episode-game-pagination",
                        clickable: true,
                        renderBullet: function (index, className) {
                          return '<span class="' + className + '"></span>';
                        },
                      }}
                      // onSlideChange={() => console.log("slide change")}
                      // onSwiper={(swiper) => console.log(swiper)}
                    >
                      <div className="swiper-wrapper">
                        {_.isEmpty(ClientRecommended)? 
                            <>
                                <div className="noRecTitle">
                                    No recommendation(s) found for you
                                </div>
                            </>
                        :
                            <>

                            {ClientRecommended?.Banner?.map((Banner,index) => 
                            
                                <SwiperSlide>

                                  <div className="swiper-slide">
                                    {ClientRecommended?.Link?.length >0 ?
                                      <a
                                        target={"_blank"}
                                        href={ClientRecommended?.Link[index]}
                                      >
                              
                                        <div className="game game-button">
                                          <img
                                            className="w-100"
                                            src={Banner}
                                            alt=""
                                          />
                                        </div>
                                      </a>
                                        
                                      :null}
                                    {/* <a
                                      target={"_blank"}
                                      href={"https://admin.vividifi.com/hotseat/game/"}
                                    >
                                      <div className="game game-button">
                                        <img
                                          className="w-100"
                                          src="/assets/images/episode/game-1.png"
                                          alt=""
                                        />
                                      </div>
                                    </a> */}
                                  </div>
                                    
                                </SwiperSlide>
                            )}
                            </>
                        }
                        {/* <SwiperSlide>
                          <div className="swiper-slide">
                            <a
                              target={"_blank"}
                              href={"https://admin.vividifi.com/hotseat/game/"}
                            >
                              <div className="game game-button">
                                <img
                                  className="w-100"
                                  src="/assets/images/episode/game-1.png"
                                  alt=""
                                />
                              </div>
                            </a>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <a
                              target={"_blank"}
                              href={"https://admin.vividifi.com/thedon/game/"}
                            >
                              <div className="game game-button">
                                <img
                                  className="w-100"
                                  src="/assets/images/episode/game-2.png"
                                  alt=""
                                />
                              </div>
                            </a>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <a
                              target={"_blank"}
                              href={
                                "https://admin.vividifi.com/vision-champ/game/"
                              }
                            >
                              <div className="game game-button">
                                <img
                                  className="w-100"
                                  src="/assets/images/episode/game-3.png"
                                  alt=""
                                />
                              </div>
                            </a>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <div className="game game-button">
                              <img
                                className="w-100"
                                src="/assets/images/episode/game-2.png"
                                alt=""
                              />
                            </div>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="swiper-slide">
                            <div className="game game-button">
                              <img
                                className="w-100"
                                src="/assets/images/episode/game-3.png"
                                alt=""
                              />
                            </div>
                          </div>
                        </SwiperSlide> */}
                      </div>
                      <div className="episode-game-pagination"></div>
                    </Swiper>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="episode-items">
                    <div className="tab-header">
                      <ul className="nav nav-tabs d-block border-0">
                        <li
                          onClick={() => {
                            handleActiveTab("video");
                          }}
                        >
                          <a
                            className="active"
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="video"
                          >
                            Videos / Role-plays
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            handleActiveTab("games");
                          }}
                        >
                          <a
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="games"
                          >
                            Games
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            handleActiveTab("simulation");
                          }}
                        >
                          <a
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="simulation"
                          >
                            Presenter PPTs/Docs
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            handleActiveTab("comics");
                          }}
                        >
                          <a
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="comics"
                          >
                            Comics
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            handleActiveTab("info");
                          }}
                        >
                          <a
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="info"
                          >
                            Infographics
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            handleActiveTab("dictonary");
                          }}
                        >
                          <a
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="dictonary"
                          >
                            Glossary
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            handleActiveTab("howTo");
                          }}
                        >
                          <a
                            data-toggle="tab"
                            style={{ whiteSpace: "nowrap" }}
                            route="howTo"
                          >
                            How to
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content">
                      <div id="video" className="tab-pane fade show active">
                        <ul className="video-list" id="allVideos">
                          {!isEmpty(learning)
                            ? learning.data.map((item, index) => {
                                if (item.MediaType == "videos") {
                                  return (
                                    <li
                                      key={index}
                                      onClick={() => {
                                        handleOpenVideo(
                                          item._id,
                                          item.Media[0]
                                        );
                                      }}
                                      className="video-thumb video-button videoOpen"
                                      data-video={item.Media[0]}
                                      data-title={item.Title}
                                      data-id={item._id}
                                    >
                                      <img
                                        src="/assets/images/episode/video_thumb.png"
                                        alt=""
                                      />
                                      <span>{item.Title}</span>
                                      <i className="fa fa-chevron-right"></i>
                                    </li>
                                  );
                                }
                              })
                            : null}
                        </ul>
                      </div>
                      <div id="games" className="tab-pane fade">
                        <div className="game-content">
                          <ul>

                            {GameArray.map((game,index)=>
                               <li key={game._id} data-id={game._id}>
                               <a
                                href={game.Url}
                                target="_blank"
                                className="w-100"
                              >
                                {game.Banner != null ? 
                                
                                  <img
                                    className="w-100"
                                    src={game.Banner[0]}
                                    alt=""
                                  />
                                :
                                  null
                                }
                              </a>
                             </li>
                            )}

                            {!isEmpty(learning)
                              ? learning.data.map((item, index) => {
                                  if (item.MediaType == "games") {
                                    return (
                                      <li key={index} data-id={item._id}>
                                        <img
                                          className="w-100"
                                          src="{item.Banner[0]}"
                                          alt=""
                                        />
                                        <button
                                          onClick={() => {
                                            // handleClickGame(item._id);
                                          }}
                                          className="game-button"
                                        >
                                          Play{" "}
                                          <i className="fa fa-arrow-right"></i>
                                        </button>
                                      </li>
                                    );
                                  }
                                })
                              : null}
{/* 
                            <li className="">
                              <a
                                href="https://admin.vividifi.com/hotseat/game/"
                                target="_blank"
                                className="w-100"
                              >
                                <img
                                  className="w-100"
                                  src="/assets/images/episode/thumb-game-1.jpg"
                                  alt=""
                                />
                              </a>
                            </li>
                            <li className="">
                              <a
                                href="https://admin.vividifi.com/thedon/game/"
                                target="_blank"
                                className="w-100"
                              >
                                <img
                                  className="w-100"
                                  src="/assets/images/episode/thumb-game-2.png"
                                  alt=""
                                />
                              </a>
                            </li>
                            <li className="">
                              <a
                                href="https://admin.vividifi.com/vision-champ/game/"
                                target="_blank"
                                className="w-100"
                              >
                                <img
                                  className="w-100"
                                  src="/assets/images/episode/thumb-game-3.jpg"
                                  alt=""
                                />
                              </a>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                      <div id="simulation" className="tab-pane fade">
                        <ul className="video-list">
                          {/* todo pooria */}
                          {!isEmpty(learning)
                            ? learning.data.map((item, index) => {
                                if (item.MediaType == "Document") {
                                  console.log(item);
                                  if (
                                    item.Media[0].indexOf(".pdf") != -1 ||
                                    item.Media[0].indexOf(".webp") != -1 ||
                                    item.Media[0].indexOf(".ppt") != -1
                                  ) {
                                    return (
                                      <li
                                        key={index}
                                        onClick={() => {
                                          handleClickComic(
                                            item._id,
                                            item.Media[0]
                                          );
                                        }}
                                        className="video-thumb video-button videoOpen"
                                        data-video={item.Media[0]}
                                        data-title={item.Title}
                                        data-id={item._id}
                                      >
                                        {(() =>{
                                          if(item.Media[0].indexOf(".pdf")){
                                            return(
                                              <img
                                                src="/assets/images/episode/doc_thumb.png"
                                                alt=""
                                              />
                                            )
                                          }else if(item.Media[0].indexOf(".ppt")){
                                            return(
                                              <img
                                                src="/assets/images/episode/ppt_video_thumb.png"
                                                alt=""
                                              />
                                            )
                                          }else{
                                            return(
                                              <img
                                                src="/assets/images/episode/video_thumb.png"
                                                alt=""
                                              />
                                            )
                                          }
                                        })()}
                                        
                                        <span>{item.Title}</span>
                                        <i className="fa fa-chevron-right"></i>
                                      </li>
                                      // <a
                                      //   key={index}
                                      //   target="_blank"
                                      //   href={`https://docs.google.com/gview?url=${item.Media[0]}`}
                                      // >
                                      //   <li
                                      //     className="showDocumentBtn"
                                      //     data-urlDoc={item.Media[0]}
                                      //     data-id={item.id}
                                      //   >
                                      //     <img
                                      //       src="/assets/images/episode/doc_thumb.png"
                                      //       alt=""
                                      //     />
                                      //     <span>{item.Title}</span>
                                      //     <i className="fa fa-chevron-right"></i>
                                      //   </li>
                                      // </a>
                                    );
                                  } else {
                                    return (
                                      <li
                                        key={index}
                                        onClick={() => {
                                          handleOpenVideo(
                                            item._id,
                                            item.Media[0]
                                          );
                                        }}
                                        className="video-thumb video-button videoOpen"
                                        data-video={item.Media[0]}
                                        data-title={item.Title}
                                        data-id={item._id}
                                      >
                                        <img
                                          src="/assets/images/episode/video_thumb.png"
                                          alt=""
                                        />
                                        <span>{item.Title}</span>
                                        <i className="fa fa-chevron-right"></i>
                                      </li>
                                    );
                                  }
                                }
                              })
                            : null}
                          {/* todo pooria */}
                        </ul>
                      </div>
                      <div id="comics" className="tab-pane fade">
                        <div className="comics-content">
                          <ul id="allComics">
                            {!isEmpty(learning)
                              ? learning.data.map((item, index) => {
                                  if (
                                    item.MediaType == "comics" ||
                                    item.MediaType == "comic" ||
                                    item.MediaType == "Comic"
                                  ) {
                                    if (item.Media[0].indexOf(".pdf") != -1) {
                                      return (
                                        <li
                                          key={index}
                                          className="comic-view"
                                          data-id={item._id}
                                        >
                                          <img
                                            className="w-100"
                                            height="200px"
                                            src={item.Banner[0]}
                                            alt=""
                                          />
                                          <button
                                            onClick={() => {
                                              handleClickComic(
                                                item._id,
                                                item.Media[0],
                                                false
                                              );
                                            }}
                                            className="comic-button"
                                            data-id={item._id}
                                          >
                                            Read{" "}
                                            <i className="fa fa-arrow-right"></i>
                                          </button>
                                        </li>
                                        // <li
                                        //   key={index}
                                        //   className="comic-view"
                                        //   data-id={item._id}
                                        // >
                                        //   <img
                                        //     className="w-100"
                                        //     height="200px"
                                        //     src={item.Banner[0]}
                                        //     alt=""
                                        //   />
                                        //   <a
                                        //     href={`https://docs.google.com/gview?url=${item.Media[0]}`}
                                        //     className="comic-button"
                                        //     style={{
                                        //       position: "absolute",
                                        //       right: 20,
                                        //       background:
                                        //         "linear-gradient(90deg, rgba(252, 44, 104, 1) 0%, rgba(255, 89, 63, 1) 60% )",
                                        //       border: "none",
                                        //       padding: "8px 40px",
                                        //       borderRadius: 40,
                                        //       color: "#fff",
                                        //     }}
                                        //     data-id={item._id}
                                        //   >
                                        //     Read{" "}
                                        //     <i className="fa fa-arrow-right"></i>
                                        //   </a>
                                        // </li>
                                      );
                                    } else {
                                      return (
                                        <li
                                          key={index}
                                          className="comic-view"
                                          data-id={item._id}
                                        >
                                          <img
                                            className="w-100"
                                            height="200px"
                                            src={item.Banner[0]}
                                            alt=""
                                          />
                                          <button
                                            onClick={() => {
                                              handleClickComic(item._id);
                                            }}
                                            className="comic-button"
                                            data-id={item._id}
                                          >
                                            Read{" "}
                                            <i className="fa fa-arrow-right"></i>
                                          </button>
                                        </li>
                                      );
                                    }
                                  }
                                })
                              : null}
                          </ul>
                        </div>
                      </div>

                      <div id="dictonary" className="tab-pane fade">
                        <div className="dictonary-content">
                          <div className="headline">
                            <h6>
                              A Collection of words, phrases, and industry
                              jargon.
                            </h6>
                            <p>
                              Click on any word to find its meaning and context
                            </p>
                          </div>
                          <ul>
                            {!isEmpty(singleSeries)
                              ? singleSeries.data.Dictionary.split("\n").map(
                                  (item, index) => {
                                    return (
                                      <li key={index} data-id={item._id}>
                                        <div className="title dictonary-thumb">
                                          {item}
                                          <i className="fa fa-chevron-up d-none"></i>
                                        </div>
                                        <div className="content d-none">
                                          <div className="thumb">
                                            <img
                                              src="/assets/images/episode/dictionary-thumb.jpg"
                                              alt=""
                                            />
                                          </div>
                                          <p>
                                            {
                                              singleSeries.data.DictionaryDescription.split(
                                                "\n"
                                              )[index]
                                            }
                                          </p>
                                        </div>
                                      </li>
                                    );
                                  }
                                )
                              : null}
                          </ul>
                        </div>
                      </div>

                      <div id="howTo" className="tab-pane fade">
                        <div className="howToContent">

                        </div>
                        <div className="howToBody">
                          {HowToArray.map((item,index) =>
                          
                            <div className="HT-card">
                              <div className="HT-cardHeader">
                                <div className="HT-cardHeaderText">
                                  {item.Title}
                                </div>
                                <div className="HT-cardHeaderIcon">
                                  <img src="/assets/images/arrowDownWhite.svg" alt="" />
                                </div>
                              </div>
                              <div className="HT-cardBody">
                                <div className="HT-cardBox">
                                  <div className="HT-cardBoxText">
                                  {item.Title}
                                  </div>
                                  <div className="HT-cardBoxImage">
                                    <img src={item.Image[0]} alt="" />
                                  </div>
                                </div>
                                <div className="HT-cardBox1">
                                    <div className="HT-cardtabsBox">
                                      <div className="HT-cardtabsCard active" data-target="HowToContent">How to</div>
                                      <div className="HT-cardtabsCard" data-target="HowNotToContent">How not to</div>
                                    </div>
                                    <div className="HT-cardtabsContent">
                                      <div className="HT-cardtabsContentbox HowToContent active">
                                        <div className="HT-howToTab">
                                          <div className="HT-howToTabText">
                                            {item.Description}
                                          </div>
                                          <div className="HT-howToTabIcon" onClick={() => speak({ text: `${item.Description}` })}>
                                            <img src="/assets/images/speaker.png" alt="" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="HT-cardtabsContentbox HowNotToContent">
                                      <div className="HT-howToTab">
                                          <div className="HT-howToTabText">
                                            {item.DescriptionNot}
                                          </div>
                                          <div className="HT-howToTabIcon" onClick={() => speak({ text: `${item.DescriptionNot}` })}>
                                            <img src="/assets/images/speaker.png" alt="" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      <div id="info" className="tab-pane fade">
                        <ul className="info-list">
                          {!isEmpty(learning)
                            ? learning.data.map((item, index) => {
                                if (item.MediaType == "infographics") {
                                  mainComicsArray.push(item);
                                  return (
                                    <li
                                      onClick={() => {
                                        handleClickInfo(item._id);
                                      }}
                                      className="info-thumb info-button"
                                      data-id={item._id}
                                      key={index}
                                    >
                                      <img
                                        src="/assets/images/episode/infographics_thumb.png"
                                        alt=""
                                      />
                                      <span>{item.Title}</span>
                                      <i className="fa fa-chevron-right"></i>
                                    </li>
                                  );
                                }
                              })
                            : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      <div className="video-page-wrapper sticky-wrapper" id="video-page">
        <div
          className="back"
          onClick={() => {
            history.goBack();
          }}
        >
          <i className="fa fa-arrow-left video-button"></i>
        </div>
        <div className="title" id="videoPageTitle"></div>
        <div className="video-player">
          <div className="close-wrapper video-button">
            <i className="fa fa-times"></i>
          </div>
          <video src="/assets/images/video.mp4" controls id="videoItem"></video>
        </div>
        <div className="description">
          In order to attempt quiz, you need to finish watching above video.
          This will help you in achieving higher scores.
        </div>
        <button
          onClick={() => {
            handleTakeQuiz();
          }}
          className="quiz-button"
        >
          Take Quiz <i className="fa fa-arrow-right"></i>
        </button>
      </div>
      <div className="infograph-page-wrapper sticky-wrapper">
        <div
          className="back"
          onClick={() => {
            history.goBack();
          }}
        >
          <i className="fa fa-arrow-left info-button"></i>
        </div>
        <div className="title">Infographic</div>
        <div
          onClick={() => {
            handleQuitQuiz();
          }}
          className="close-wrapper info-button"
        >
          <i className="fa fa-times"></i>
        </div>
        <div className="image-box infoImage">
          <div className="loaderForImage">
            <img src="/assets/images/vividifi_Loader.gif" alt="#" />
          </div>
          <img src="" alt="" />
        </div>
        <div className="text-center">
          <button
            onClick={() => {
              handleTakeQuiz();
            }}
            className="quiz-button"
          >
            Take Quiz <i className="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="game-page-wrapper sticky-wrapper">
        <div
          className="back"
          onClick={() => {
            history.goBack();
          }}
        >
          <i className="fa fa-arrow-left game-button"></i>
        </div>
        <div className="title">Game - Don Don</div>
        <div className="image-box">
          <img src="/assets/images/episode/game.png" alt="" />
        </div>
        <div className="description">
          Play and complete the game level to get rewards and more.
        </div>
        <button className="play-button">
          Play game <i className="fa fa-arrow-right"></i>
        </button>
      </div>
      <div className="comic-page-wrapper sticky-wrapper" id="comicPage">
        <div
          className="back"
          onClick={() => {
            history.goBack();
          }}
        >
          <i className="fa fa-arrow-left comic-button"></i>
        </div>
        <div className="title">Learning through Stories</div>
        <div
          onClick={() => handleQuitQuiz()}
          className="close-wrapper comic-button"
        >
          <i className="fa fa-times"></i>
        </div>
        <div className="swiper comicPageSwiper">
          <button className="comicPrev">
            <i className="fa fa-chevron-left"></i>
          </button>
          <button className="comicNext">
            <i className="fa fa-chevron-right"></i>
          </button>
          <div
            className={`swiper-wrapper ${showSliderBeforeQuez ? "" : "d-none"}`}
          >
            <Swiper
              className="comicPageSwiper"
              modules={[Navigation,Lazy, A11y]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              lazy={true}
              navigation={{
                nextEl: ".comicPrev",
                prevEl: ".comicNext",
              }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {learning?.data?.map((item, index) => {
                if (item.MediaType == "comics") {
                  if (selectedIdBox == item._id) {
                      return item.Media.map((comicImageSh,_index) => (
                        <>
                          {comicImageSh.split(',').map((showImage,index1) => 
                            <SwiperSlide className="swiper-lazy" key={index1}>
                              <div className="swiper-slide">
                                <div className="image-box">
                                  <img src={showImage} alt="" />
                                </div>
                              </div>
                            </SwiperSlide>
                          )}
                        </>

                      ));
                  }
                }
              })}
            </Swiper>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => {
              handleTakeQuiz();
            }}
            className="quiz-button"
          >
            Take Quiz <i className="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="quiz-page-wrapper sticky-wrapper">
        <div className="back">
          
        

          {!isEmpty(quiz) ? 
          
            <>
            
              {/* <div className="col-md-userScoreInQuiz">1200</div>
              <div className="quizProgressBar">
                  <div className="QPB-title">
                    <span> Question </span>
                    <span> {}/{} </span>
                  </div>
                  <div className="QPB-pr">

                  </div>
              </div>
              <div className="quizTimeCountdown">
                <Countdown date={Date.now() + (QuizMaxTime * 1000)} renderer={rendererCountDown} />
              </div> */}
            
            </>
          :
          null}

          <button
            onClick={() => {
              handleQuitQuiz();
            }}
            className="close-wrapper quit-quiz-button"
          >
            Quit<i className="fa fa-times"></i>
          </button>


          

        </div>
        <div className="start-quiz-wrapper">
          <div className="quiz-box QBox">
            <h2>Quiz</h2>
            <div className="tagline">Test yourself on-the-go!</div>
            <div className="score">
              <img src="/assets/images/episode/quiz/question-bg.png" alt="" />
              <span>{NoOfQuiz}</span>
            </div>
            <h4>No. of question</h4>
            <div className="button-wrapper">
              <button
                onClick={() => {
                  startQuizClick();
                }}
                className="start-quiz-button quiz-question-button"
              >
                Start
              </button>
              <button
                onClick={() => {
                  handleOpenVideo(
                    videoData.id,
                    videoData.video,
                    "quiz-page-wrapper"
                  );
                }}
                className="quiz-button"
              >
                Watch Video Again
              </button>
            </div>
          </div>
        </div>
        <div className="quiz-options-wrapper d-none">
          <h2>Quiz</h2>
          <div className="quiz-box text-center showQuizQu">
            {!isEmpty(quiz) ? (
              <>
                <h4
                  style={{ marginTop: 50, marginBottom: 15 }}
                  className="tagline"
                >
                  {!isEmpty(quiz[NoIndexOfQuiz].Description) ? quiz[NoIndexOfQuiz].Description : null}
                </h4>
                {!isEmpty(quiz[NoIndexOfQuiz].Title) ? (
                  <h4>{quiz[NoIndexOfQuiz].Title}</h4>
                ) : null}

                {!isEmpty(quiz[0].Banner) ? (
                  <div style={{ marginTop: 20 }} className="">
                    <img
                      className="quizImageBox"
                      src={!isEmpty(quiz[NoIndexOfQuiz].Banner) ? quiz[NoIndexOfQuiz].Banner : ""}
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
                    />
                    <span className="checkmark">{quiz[NoIndexOfQuiz].Option1}</span>
                  </label>
                  <label className="col-md-6 px-1 option">
                    <input
                      className="quizOpIn"
                      type="radio"
                      value="2"
                      name="option1"
                    />
                    <span className="checkmark">{quiz[NoIndexOfQuiz].Option2}</span>
                  </label>
                  <label className="col-md-6 px-1 option">
                    <input
                      className="quizOpIn"
                      type="radio"
                      value="3"
                      name="option1"
                    />
                    <span className="checkmark">{quiz[NoIndexOfQuiz].Option3}</span>
                  </label>
                  <label className="col-md-6 px-1 option">
                    <input
                      className="quizOpIn"
                      type="radio"
                      value="4"
                      name="option1"
                    />
                    <span className="checkmark">{quiz[NoIndexOfQuiz].Option4}</span>
                  </label>
                </div>
                <button
                  className="quiz-question-button checkAnswerbtn"
                  disabled
                >
                  Submit
                </button>
              </>
            ) : null}
          </div>
          <div className="quiz-result-wrapper success d-none">
            <div className="quiz-box text-center">
              {!isEmpty(quiz) ? (
                <>
                  <h3>
                    {quiz[0].CorrectOption == answer
                      ? "Congratulations ! You Won"
                      : "uh oh! Better Luck Next Time"}
                  </h3>
                  <p>
                    {quiz[0].CorrectOption == answer
                      ? "You have successfully completed this assessment. Your score is as below"
                      : "You were not able to complete this assessment"}
                  </p>
                </>
              ) : null}

              <div className="score">
                <img src="/assets/images/episode/quiz/score.png" alt="" />
                <span>650</span>
              </div>
              <h4>YOUR SCORE</h4>
              <div className="question-result-wrapper">
                <div className="question-result total">
                  <div className="title">
                    <img src="/assets/images/episode/quiz/score.png" alt="" />
                    <span>{NoOfQuiz}</span>
                  </div>
                  <div className="description">
                    <span></span>
                    <h6>No. of question</h6>
                  </div>
                </div>
                <div className="question-result correct">
                  <div className="title">
                    <img src="/assets/images/episode/quiz/score.png" alt="" />
                    <span>5</span>
                  </div>
                  <div className="description">
                    <span></span>
                    <h6>correct</h6>
                  </div>
                </div>
                <div className="question-result incorrect">
                  <div className="title">
                    <img src="/assets/images/episode/quiz/score.png" alt="" />
                    <span>15</span>
                  </div>
                  <div className="description">
                    <span></span>
                    <h6>incorrect</h6>
                  </div>
                </div>
              </div>

              <div className="button-wrapper">
                <button
                  onClick={() => {
                    startQuizClick();
                  }}
                  className="start-quiz-button quiz-result-button"
                >
                  Try Again
                </button>
                <button className="quiz-response-button ">
                  Review Responses
                </button>
                <button
                  onClick={() => {
                    // startQuizClick();
                    handleGoToEp();
                  }}
                  className="quiz-button start-quiz-button quiz-result-button"
                >
                  Home
                </button>
              </div>

              {(NoIndexOfQuiz == (NoOfQuiz - 1 )) ? null :
              <div className="button-wrapper" style={{marginTop:15}}>
                <button
                  onClick={() => {
     
                    handleGoToNextQuestion();
                  }}
                  className="quiz-button start-quiz-button quiz-result-button"
                >
                  Next Question
                </button>
              </div>
              
              }

            </div>
          </div>
          <div className="quiz-response-wrapper d-none">
            <div className="quiz-box">
              <button className="close-box quiz-response-button">
                <i className="fa fa-times"></i>
              </button>
              {/* <h2>Potential water loss varies with?</h2> */}
              <div className="option-wrapper">
                {/* {console.log("answer", answer)}
                {!isEmpty(quiz)
                  ? console.log(quiz[0].CorrectOption == answer)
                  : null} */}
                {!isEmpty(quiz) ? (
                  <>
                    <label
                      className={`option ${
                        answer == 1
                          ? quiz[0].CorrectOption == answer
                            ? "correct"
                            : "incorrect"
                          : ""
                      } ${quiz[0].CorrectOption == 1 ? "correct" : ""}`}
                    >
                      <span className="checkmark">{quiz[0].Option1}</span>
                    </label>
                    <label
                      className={`option ${
                        answer == 2
                          ? quiz[0].CorrectOption == answer
                            ? "correct"
                            : "incorrect"
                          : ""
                      } ${quiz[0].CorrectOption == 2 ? "correct" : ""}`}
                    >
                      <span className="checkmark">{quiz[0].Option2}</span>
                    </label>
                    <label
                      className={`option ${
                        answer == 3
                          ? quiz[0].CorrectOption == answer
                            ? "correct"
                            : "incorrect"
                          : ""
                      } ${quiz[0].CorrectOption == 3 ? "correct" : ""}`}
                    >
                      <span className="checkmark">{quiz[0].Option3}</span>
                    </label>
                    <label
                      className={`option ${
                        answer == 4
                          ? quiz[0].CorrectOption == answer
                            ? "correct"
                            : "incorrect"
                          : ""
                      } ${quiz[0].CorrectOption == 4 ? "correct" : ""}`}
                    >
                      <span className="checkmark">{quiz[0].Option4}</span>
                    </label>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="quit-quiz-wrappper">
            <div className="quiz-box">
              <p>Do you really want to quit?</p>
              <div className="button-wrapper">
                <button
                  onClick={() => {
                    handleQuitQuiz();
                  }}
                  className="quit-quiz-button quiz-button"
                >
                  Yes
                </button>
                <button className="quit-quiz-button">No</button>
              </div>
            </div>
          </div>
        </div>

        <div className="siteModalMain">
          <div className="closeModalBtn">&times;</div>
          <div className="siteModalBox"></div>
        </div>
      </div>
      <div className="howToShowPreviewMain">
        <div className="HTSP-exitBtn">
          &times;
        </div>
        <img src="" alt="" />
      </div>
    </div>
  );
};
export default Episode;
