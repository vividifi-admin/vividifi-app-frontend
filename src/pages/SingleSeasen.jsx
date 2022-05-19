import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useHistory, NavLink } from "react-router-dom";
import { isEmpty } from "lodash";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import $ from "jquery";
import { getSingleSeasen } from "../store/actions/seasons";
import { clearEpisode, getEpisode } from "../store/actions/episode";
import { getSeasen } from "../store/actions/seasons";
import { getLearning as learn } from "../store/actions/learning";
import { getLearning } from "../services/getLearning";
import config from "../services/config.json";
import { getUser } from "../services/getClinet";

const SingleSeasen = () => {
  const seasen = useSelector((state) => state.seasen);
  const singleSeasen = useSelector((state) => state.singleSeasen);
  const episode = useSelector((state) => state.episode);
  const learning = useSelector((state) => state.learning);
  const [UserDetail,setUserDetail] = useState({});

  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const { seasonId, seriesId } = params;
  const [linkTo, setLinkTo] = useState();
  // console.log("singleSeasen", singleSeasen);
  // console.log("seasonId", seasonId);
  useEffect(() => {
    console.log(seasonId);
    if (seasonId) {
      // if (isEmpty(singleSeasen)) {
        dispatch(getSingleSeasen(seasonId));
        dispatch(getSeasen(seriesId));
        dispatch(getEpisode(seasonId));
      // }
    }else{
      console.log("into")
      dispatch(getSeasen());
    }
  }, [seasonId]);


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

  useEffect(() => {
    if (seasonId) {
      if (isEmpty(singleSeasen)) {
        dispatch(getSingleSeasen(seasonId));
      }
      $("#seasonTitle").html(singleSeasen?.data?.Title);
      $("#seasonDesc").html(singleSeasen?.data?.Description);
      $("#completionCriteria").html(
        singleSeasen?.data?.CompletionCriteria + " POINTS"
      );
      $("#LearningDuration").html(singleSeasen?.data?.TakeAway + "2 HOURS");
      $(".bread-crumb .active").text(singleSeasen?.data?.Title);
    }
    $.ajax({
      url: `${config.api}/api/series/${seriesId}`,
      method: "GET",
      success: function (response) {
        const series = response.data;
        $("#series_name").text(series.Title);
      },
      error: (e) => {
        console.log("Error!" + e.responseJSON.message);
      },
    });
  }, [singleSeasen]);
  useEffect(async () => {
    if (seasonId) {
      if (isEmpty(episode)) {
        dispatch(getEpisode(seasonId));
      } else {
        $("#episodeDescription").html(
          !isEmpty(episode) ? episode.data[0].Description : ""
        );
        $("#selectedImage").attr("src", episode.data[0].Banner[0]).fadeIn();
        $("#episodeTitle").html(!isEmpty(episode) ? episode.data[0].Title : "");
        $(".season-description").fadeIn();
        setEpisodeButton(!isEmpty(episode) ? episode.data[0]._id : null);
        if (episode.data[0]._id) {
          const { data, success } = await getLearning(episode.data[0]._id);
          dispatch(learn(data));
        }
        $("#seasonEpisodes").fadeIn();
      }
    }
  }, [episode]);

  useEffect(() => {
    if (seriesId) {
      if (isEmpty(seasen)) {
        dispatch(getSeasen(seriesId));
      }
    }
    $(".seasonSwiper").fadeIn();
  }, [seasen]);
  useEffect(() => {
    let comicCount = 0;
    let videoCount = 0;
    let infoGraphicsCount = 0;
    let documentCount = 0;
    let gamesCount = 0;
    if (learning?.data?.length > 0)
      learning.data.forEach((item) => {
        if (
          item.MediaType === "comics" ||
          item.MediaType === "comic" ||
          item.MediaType === "Comic"
        ) {
          comicCount++;
        } else if (item.MediaType === "videos") {
          videoCount++;
        } else if (item.MediaType === "infographics") {
          infoGraphicsCount++;
        } else if (item.MediaType === "Document") {
          documentCount++;
        }
      });
    $("#comicCount").html(comicCount);
    $("#videosCount").html(videoCount);
    $("#infoGraphicsCount").html(infoGraphicsCount);
    $("#docsCount").html(documentCount);
    $("#quizzCount").html(!isEmpty(learning) ? learning.data.length : 0);
  }, [learning]);


  const handleClickEpisode = async (e, img, key) => {
    // console.log();
    $(e.target.closest(".episode")).parent().children('.loadingEpData').fadeIn(400);
    $("#selectedImage").attr("src", img);
    const findEpisode = episode.data.find((ep) => ep._id === key);
    $("#episodeDescription").html(findEpisode.Description);
    $("#episodeTitle").html(findEpisode.Title);
    $(".season-description").fadeIn();
    // setEpisodeButton(key);
    if (key) {
      const { data } = await getLearning(key);
      dispatch(learn(data));
    }
    document.querySelectorAll(".episode").forEach((el) => {
      el.classList.remove("active");
      $(el).children(".enterEpisodeButton").hide(400);
    });
    // console.log($(e.target.closest(".episode")).parent().children(".enterEpisodeButton"));
    e.target.closest(".episode").classList.add('active')
    $(e.target.closest(".episode")).children(".enterEpisodeButton").css('display','block');
    $(e.target.closest(".episode")).parent().children('.loadingEpData').fadeOut(400);
  };


  const setEpisodeButton = (episodeId) => {
    setLinkTo(`/episode/${episodeId}/${seasonId}/${seriesId}`);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("client_id");
    history.replace("/login");
  };

  const handleGetUserInfo = async () =>{
    const {data} = await getUser(localStorage.getItem('user_id'));
    let dataUser = data.data;
    setUserDetail(dataUser);
  }


  
  useEffect(() => {
    return () => {
      dispatch(clearEpisode());
    };
  }, []);

  
  useEffect(() => {
    console.log("seasonId");
    if (seasonId) {
      // if (isEmpty(singleSeasen)) {
        dispatch(getSingleSeasen(seasonId));
        dispatch(getSeasen(seriesId));
        dispatch(getEpisode(seasonId));
      // }
    }else{
      console.log("into")
      dispatch(getSeasen());
    }
    handleGetUserInfo()
  }, []);

  return (
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
            //   history.go(-1);
            // }}
            >
              <a id="series_name" href={`/series/${seriesId}`}></a>
            </li>
            <li>
              <i className="fa fa-chevron-right"></i>
            </li>
            <li className="active">
              <a href="#"></a>
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
            <div
              onClick={(e) => {
                openDropDown(e, 1);
              }}
              className="profile-wrapper position-relative"
            >
              <button className="profile dropdown-button">
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
                <li onClick={() => {
                      handleLogOut();
                    }}
                    className="text-primary">
                  <a href="#">logout</a>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <ul className="bread-crumb mobile-crumb">
          <li>
            <a href="home.html">Home</a>
          </li>
          <li>
            <i className="fa fa-chevron-right"></i>
          </li>
          <li>
            <a href="series.html">Series</a>
          </li>
          <li>
            <i className="fa fa-chevron-right"></i>
          </li>
          <li>
            <a href="series.html">ABE & Farm Sector</a>
          </li>
          <li>
            <i className="fa fa-chevron-right"></i>
          </li>
          <li className="active">
            <a href="#">Season 1</a>
          </li>
          <li className="active">
            <i className="fa fa-chevron-right"></i>
          </li>
        </ul>
        <section className="season-wrapper">
          <div className="container-fluid">
            <div className="row flex-sm-row-reverse">
              <div className="col-lg-9">
                <div className="season-detail-wrapper">
                  <div className="season-time-frame-wrapper">
                    <div className="season-time-frame">
                      Season Completion Criteria
                      <span className="detail" id="completionCriteria"></span>
                    </div>
                    <div className="season-time-frame">
                      Season's learning duration
                      <span className="detail" id="LearningDuration"></span>
                    </div>
                  </div>
                  <div className="season-detail">
                    <h4 id="seasonTitle"></h4>
                    <h1 id="seasonDesc"></h1>
                  </div>
                  <div className="seasonRpTitle">
                    Episodes for this season : 
                  </div>
                  <div className="season-episodes">
                    <button className="episode-prev">
                      <i className="fa fa-chevron-left"></i>
                    </button>
                    <button className="episode-next">
                      <i className="fa fa-chevron-right"></i>
                    </button>
                    <Swiper
                      className="swiper seasonEpisodeSwiper"
                      modules={[Navigation, A11y]}
                      spaceBetween={0}
                      loop={false}
                      navigation={{
                        nextEl: ".episode-next",
                        prevEl: ".episode-prev",
                      }}
                      breakpoints={{
                        640: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 6,
                          spaceBetween: 40,
                        },
                        1024: {
                          slidesPerView: 8,
                          spaceBetween: 0,
                        },
                      }}
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      {!isEmpty(episode)
                        ? episode?.data.map((item, index) => (
                            <SwiperSlide>
                              <div
                                onClick={(e) => {
                                  handleClickEpisode(
                                    e,
                                    item.Banner[0],
                                    item._id
                                  );
                                }}
                                key={index}
                                className="swiper-slide"
                              >

                                <div className="loadingEpData">

                                </div>

                                <div
                                  className={`episode ${
                                    index + 1 === 1 ? "active" : ""
                                  }`}
                                  data-episode={item._id}
                                >
                                  <div className="thumbnail">
                                    <img
                                      className="w-100"
                                      src={item.Banner[0]}
                                      alt=""
                                    />
                                  </div>
                                  <div className="tagline">{item.Title}</div>
                                  <Link
                                    to={`/episode/${item._id}/${seasonId}/${seriesId}`}
                                    className={"enterEpisodeButton"}
                                    style={index + 1 == 1 ? {display:'block'}:{} }
                                  >
                                    Enter  <i className="fa fa-arrow-right"></i>
                                  </Link>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))
                        : null}
                    </Swiper>
                  </div>

                  <div
                    className="episode-learning-item"
                    style={{ marginTop: "2%" }}
                  >
                    <h3>Learning Genre Count :</h3>
                    <div
                      className="episode-learining"
                      style={{ justifyContent: "left" }}
                    >
                      <div className="episode-learining-detail">
                        <div className="episode-item-wrapper">
                          <div className="episode-item">
                            <img
                              src="/assets/images/season/episode-item.png"
                              alt=""
                            />
                            <span id="comicCount">0</span>
                          </div>
                          <p>Comics</p>
                        </div>
                        <div className="episode-item-wrapper">
                          <div className="episode-item">
                            <img
                              src="/assets/images/season/episode-item.png"
                              alt=""
                            />
                            <span id="videosCount">0</span>
                          </div>
                          <p>Videos</p>
                        </div>
                        <div className="episode-item-wrapper">
                          <div className="episode-item">
                            <img
                              src="/assets/images/season/episode-item.png"
                              alt=""
                            />
                            <span id="gamesCount">0</span>
                          </div>
                          <p>Games</p>
                        </div>
                        <div className="episode-item-wrapper">
                          <div className="episode-item">
                            <img
                              src="/assets/images/season/episode-item.png"
                              alt=""
                            />
                            <span id="quizzCount">0</span>
                          </div>
                          <p>Quizzes</p>
                        </div>
                        <div className="episode-item-wrapper">
                          <div className="episode-item">
                            <img
                              src="/assets/images/season/episode-item.png"
                              alt=""
                            />
                            <span id="infoGraphicsCount">0</span>
                          </div>
                          <p>Inforgraphics</p>
                        </div>
                        <div className="episode-item-wrapper">
                          <div className="episode-item">
                            <img
                              src="/assets/images/season/episode-item.png"
                              alt=""
                            />
                            <span id="docsCount">0</span>
                          </div>
                          <p>PPT / Docs</p>
                        </div>
                      </div>
                      <div className="enter-episode d-none">
                        {!isEmpty(linkTo) ? (
                          <Link
                            to={linkTo}
                            style={{ float: "right" }}
                            id="enterEpisodeButton"
                          >
                            Enter  <i className="fa fa-arrow-right"></i>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3"
                style={{ textAlign: "center", paddingTop: "5%" }}
              >
                <div className="season-title">
                  <img
                    src=""
                    style={{ display: "none" }}
                    alt=""
                    id="selectedImage"
                  />
                </div>

                <br />

                <div className="season-description" style={{ display: "none" }}>
                  <h4 id="episodeTitle"></h4>
                  <p
                    id="episodeDescription"
                    style={{ padding: "0 10%", color: "#fff" }}
                  ></p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="more-season-wrapper">
                  <div className="title">
                    More Seasons
                    <div className="pagination setShowNav">
                      <Link to={"/all-season/"+seriesId}>View All</Link>
                      <button className="left">
                        <i className="fa fa-chevron-left"></i>
                      </button>
                      <button className="right">
                        <i className="fa fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>

                  <Swiper
                    className="seasonSwiper"
                    modules={[Navigation, A11y]}
                    spaceBetween={0}
                    loop={false}
                    navigation={{
                      nextEl: ".right",
                      prevEl: ".left",
                    }}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                      },
                      1024: {
                        slidesPerView: 6,
                        spaceBetween: 0,
                      },
                    }}
                    onSlideChange={() => console.log("slide change")}
                    onSwiper={(swiper) => console.log(swiper)}
                  >
                    {!isEmpty(seasen)
                      ? seasen.data.map((item, index) => {
                          if (item._id != seasonId) {
                            return (
                              <SwiperSlide>
                                <div key={index} className="swiper-slide">
                                  <Link to={`/season/${item._id}/${seriesId}`}>
                                    <div className="season">
                                      <div className="tagline">
                                        {item.Title}
                                      </div>
                                      <div className="thumbnail">
                                        <img
                                          className="w-100"
                                          src={item.Banner[0]}
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              </SwiperSlide>
                            );
                          }
                        })
                      : null}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
export default SingleSeasen;
