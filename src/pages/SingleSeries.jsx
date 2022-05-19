import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSeries, getSingleSeries } from "../store/actions/series";
import { getSeasen } from "../store/actions/seasons";
import { Link, useParams, useHistory, NavLink } from "react-router-dom";
import { isEmpty } from "lodash";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import $ from "jquery";
import { getUser } from "../services/getClinet";
const SingleSeries = () => {
  let currentSeason = {};
  const singleSeries = useSelector((state) => state.singleSeries);
  const series = useSelector((state) => state.series);
  const seasen = useSelector((state) => state.seasen);
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const [tagline, setTagline] = useState();
  const [criteriaTitle, SetCriteriaTitle] = useState();
  const [linkTo, setLinkTo] = useState();
  const [seasenHolding, setSeasenHolding] = useState();
  const [UserDetail,setUserDetail] = useState({});
  const [LoadingPage,setLoadingPage] = useState(true);


  const history = useHistory();

  const openDropDown = (e,number) => {
    let target
    if(number == 1){
      target = e.target
        .closest(".profile-wrapper")
        .querySelector(".dropdown-content");
        
      }else{
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
    if (id) {
      if (isEmpty(singleSeries)) {
        dispatch(getSingleSeries(id));
        dispatch(getSeries());
      }
    }
  }, [singleSeries]);
  useEffect(() => {
    if (id) {
      if (isEmpty(seasen)) {
        console.log(seasen);
        dispatch(getSeasen(id));
        $("#bannerImage").attr("src", "assets/images/alt.jpg");
        $(".series-detail").fadeIn();
      } else {
        setLoadingPage(false);
        if(seasen?.data?.length > 0){

          currentSeason = seasen?.data[0];
          $("#bannerImage").attr("src", seasen?.data[0].Banner[0]);
          $("#bannerImage").fadeIn();
          setLearningButton(seasen?.data[0]._id);
        }
        SetCriteriaTitle(currentSeason.Title);
        setTagline(currentSeason.Description);
        setSeasenHolding(currentSeason);
        $(".series-detail").fadeIn();
        $("#more_series_div").fadeIn();
      }
    }
  }, [seasen]);
  useEffect(() => {
    dispatch(getSingleSeries(id));
    dispatch(getSeries());
    dispatch(getSeasen(id));
  }, [id]);
  function setLearningButton(seasonId = null) {
    setLinkTo(`/season/${seasonId}/${id}`);
  }
  const handleMoz = (e, key, img) => {
    document.querySelectorAll(".season").forEach((el) => {
      el.classList.remove("active");
    });
    e.target.closest(".season").classList.add("active");
    $("#bannerImage").attr("src", img);
    const season = seasen.data.find((item) => item._id === key);
    SetCriteriaTitle(season.Title);
    setTagline(season.Description);
    setLearningButton(season._id);
    console.log(season);
    setSeasenHolding(season);
  };
  const handleCompetency = () => {
    document.querySelectorAll(".options-wrapper .option").forEach((el) => {
      el.classList.remove("active");
    });
    document.querySelector(".competency").classList.add("active");
    SetCriteriaTitle("Competency");
    setTagline(seasenHolding.Competency);
  };
  const handleLearning = () => {
    console.log(seasenHolding);
    document.querySelectorAll(".options-wrapper .option").forEach((el) => {
      el.classList.remove("active");
    });
    document.querySelector(".learning").classList.add("active");
    SetCriteriaTitle("Learning Outcomes");
    setTagline(seasenHolding.LearningOutcomes);
  };
  const handleTakeaway = () => {
    document.querySelectorAll(".options-wrapper .option").forEach((el) => {
      el.classList.remove("active");
    });
    document.querySelector(".takeaway").classList.add("active");
    SetCriteriaTitle("Badges you can earn");
    setTagline(seasenHolding.TakeAway);
  };
  const handleCompletion = () => {
    console.log(seasenHolding);
    document.querySelectorAll(".options-wrapper .option").forEach((el) => {
      el.classList.remove("active");
    });
    document.querySelector(".completion").classList.add("active");
    SetCriteriaTitle("Completion Criteria");
    setTagline(seasenHolding.CompletionCriteria);
  };

  
  const handleGetUserInfo = async () =>{
    const {data} = await getUser(localStorage.getItem('user_id'));
    let dataUser = data.data;
    setUserDetail(dataUser);
  }

  useEffect(() =>{
    handleGetUserInfo()
  },[])

  return (
    <>
      <section className="main-wrapper inner-wrapper">

        {seasen?.data?.length > 0 ? 
        

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
                <li>
                  <i className="fa fa-chevron-right"></i>
                </li>
                <li className="active">
                  <a href="">
                    {!isEmpty(singleSeries) ? singleSeries?.data.Title : null}
                  </a>
                </li>
                <li className="active">
                  <i className="fa fa-chevron-right"></i>
                </li>
              </ul>
              <div className="profile-box">
                <div className="notification-wrapper position-relative">
                  <button
                    onClick={(e) => {
                      openDropDown(e,2);
                    }}
                  className="notifications dropdown-button">
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
                    openDropDown(e,1);
                  }}
                  className="profile dropdown-button">
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
                    <li className="text-primary">
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
              <li className="active">
                <a href="#">
                  {!isEmpty(singleSeries) ? singleSeries?.data.Title : null}
                </a>
              </li>
              <li className="active">
                <i className="fa fa-chevron-right"></i>
              </li>
            </ul>
            <section className="series-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-6">
                    <img
                      style={{ display: "none" }}
                      className="w-100"
                      src=""
                      alt=""
                      id="bannerImage"
                    />
                    <div className="series-detail" style={{ display: "none" }}>
                      <div className="title">
                        <span className="series-detailColor">Seasons For : </span>
                        <span>
                          {!isEmpty(singleSeries)
                            ? singleSeries?.data?.Title
                            : null}
                        </span>
                      </div>
                      <div className="seasons-list" id="allSeason">
                        {!isEmpty(seasen) ? (
                          seasen.data.map((item, index) => {
                            return (
                              <div
                                onClick={(e) => {
                                  handleMoz(e, item._id, item.Banner[0]);
                                }}
                                key={index}
                                className={`season ${
                                  index + 1 === 1 ? "active" : ""
                                }`}
                                data-season={item._id}
                              >
                                <div className="tagline">Season {index + 1}</div>
                                <div className="thumb">
                                  <img
                                    src={item.Banner[0]}
                                    alt=""
                                    className="seasonImage"
                                  />
                                </div>
                                <div className="name">{item.Title}</div>
                              </div>
                            );
                          })
                        ) : (
                          <span style={{ color: "#fff" }}>
                            Exciting seasons for this series coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="completion-criteria">
                      <h4 className="criteria-title">{criteriaTitle}</h4>
                      <p className="criteria-tagline">{tagline}</p>
                      <div className="options-wrapper">
                        <div
                          onClick={() => {
                            handleCompetency();
                          }}
                          className="option competency"
                        >
                          <img
                            src="/assets/images/series/competency.png"
                            alt=""
                          />
                        </div>
                        <div
                          onClick={() => {
                            handleLearning();
                          }}
                          className="option learning"
                        >
                          <img src="/assets/images/series/learning.png" alt="" />
                        </div>
                        <div
                          onClick={() => {
                            handleTakeaway();
                          }}
                          className="option takeaway"
                        >
                          <img src="/assets/images/series/take-away.png" alt="" />
                        </div>
                        <div
                          onClick={() => {
                            handleCompletion();
                          }}
                          className="option completion"
                        >
                          <img
                            src="/assets/images/series/completion.png"
                            alt=""
                          />
                        </div>
                      </div>
                      {linkTo != undefined ? (
                        <Link to={linkTo}>
                          <button>
                            Learning <i className="fa fa-arrow-right"></i>
                          </button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div
                      className="more-series-wrapper"
                      id="more_series_div"
                      style={{ display: "none" }}
                    >
                      <div className="title">
                        More Series for you
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
                          <SwiperSlide>
                            <div key={index} className="swiper-slide">
                              <div className="series">
                                <div className="thumbnail">
                                  <img src={item.Banner[0]} alt="" />
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
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
      
      
        :

            <>
              {LoadingPage ? 
                <div className="d-flex justify-content-center align-items-center mt-5">
                <p className="text-uppercase font-weight-bold" style={{color:"#fff"}}>
                  Please Wait for loading Data
                </p>
              </div>
              :
              
                <div className="d-flex justify-content-center align-items-center mt-5">
                  <p className="text-uppercase font-weight-bold" style={{color:"#fff"}}>
                    This Series hasn't any Seasons
                  </p>
                </div>
              }
            </>
        }

      </section>
    </>
  );
};
export default SingleSeries;
