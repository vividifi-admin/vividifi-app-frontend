import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navigation, Pagination, Scrollbar, A11y , Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Chart } from "react-google-charts";
import axios from "axios";
import $ from 'jquery';
import Select , {components} from 'react-select';
import AsyncSelect from 'react-select/async';

import Navbar from "../../components/layouts/includes/Navbar";
import config from "../../services/config.json";
import { getSeries } from "../../services/getSeries";
import { getUser } from "../../services/getClinet";
import { getAssessmentAnswers } from "../../services/getQuiz";

// import CustomSelectProps from '../../components/utiles/customSelect';

const DashboardPage = () => {
    const clinet = useSelector((state) => state.clinet);
    const history = useHistory();
    const [toggleNav, setToggleNav] = useState("");
    const [searchText, setSearchText] = useState("");

    const [UesrData,setUserData] = useState({});
    const [UesrAnswerData,setUesrAnswerData] = useState({});
    const [LeaderBoard,setLeaderBoard] = useState([]);
    const [SeriesList,setSeriesList] = useState([]);

    const userId = localStorage.getItem("user_id");
    const clientId = localStorage.getItem("client_id");
    

    const [ChartData,setChartData] = useState([]);
    
    const [SesonData,setSesonData] = useState([]);
    const [SeriesData,setSeriesData] = useState([]);
    const [AnswerData,setAnswerData] = useState([]);

    const [EpisodeArray,setEpisodeArray] = useState([]);
    const [EpisodeDetailArray,setEpisodeDetailArray] = useState([]);

    const [ClientRecommended,setClientRecommended] = useState({});

    const [UserDetail,setUserDetail] = useState({});

    const [AnswerArr,setAnswerArr] = useState([]);

    const [AnsUserPoint,setAnsUserPoint] = useState(0);
    const [AnsTotalPoint,setAnsTotalPoint] = useState(0);


    const dispatch = useDispatch();

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? '#fff' : '#fff',
          backgroundColor: state.isDisabled
          ? '#160b2b'
          : state.isSelected
          ? "#35275a"
          : state.isFocused
          ? '#35275a'
          : '#160b2b',
          zIndex:99999
        }),
        control: () => ({
            // none of react-select's styles are passed to <Control />
            display:'flex',
            borderRadius: '15px',
            backgroundColor:'rgba(0,0,0,.2)',
            color:"#fff",
            padding:10
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color:'#fff',
        }),
        indicatorSeparator: (provided, state) => ({
            ...provided,
            display : 'none'
        }),
        dropdownIndicator:(provided, state) => ({
            ...provided,
            color:'#fff'
        })
    }



    const chartOptions = {
        legend: "bottom",
        pieHole: 0.4,
        tooltip: { isHtml: true },
        colors: [
          "#004586",
          "#7E0021",
          "#579D1C",
          "#FFD320",
          "#FF420E",
          "#83CAFF",
        ],
        backgroundColor: "#150c2b",
    };

    const handleGetUserData = () =>{
        // Get Score and Badges
        axios({
            url:`${config.api}/api/user/${userId}`,
            method:'get'
        }).then((res) =>{
            let user = res.data.data;
            // console.log(user);
            setUserData(user);
        }).catch((err)=>{
            console.log(err);
        });

        // Get Answers
        axios({
            url:`${config.api}/api/answer/${userId}`,
            method:'get'
        }).then((res) =>{
            let userAnswer = res.data.data;
            let helpAnswer = [];
            console.log(userAnswer);
            helpAnswer.push(["Videos", "Hours per Day"]);
            $.each(userAnswer,function( key, value ) {
                helpAnswer.push([key,value.length])
            });
            // console.log(helpAnswer);
            setChartData(helpAnswer);
            // setUesrAnswerData(userAnswer);
        }).catch((err)=>{
            console.log(err);
        });

        // Get Leader
        axios({
            url:`${config.api}/api/leader?limit=5`,
            method:'get'
        }).then((res) =>{
            let leader = res.data;
            // console.log(leader);
            setLeaderBoard(leader);
        }).catch((err)=>{
            console.log(err);
        });
    }

    // useEffect(() => {
    //     if (_.isEmpty(clinet)) {
    //         dispatch(getClient(localStorage.getItem("client_id")));
    //     }
    // }, [clinet]);

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

    

    const loadOptionsSeson = (id) => {
        axios({
            url:`${config.api}/api/season/series/${id}`,
            method:'GET'
        }).then((res)=>{
            var helpArr = [];
            
            for (let i = 0; i < res.data.data.length; i++) {
                const element = res.data.data[i];
                helpArr.push({label:element.Title,value:element._id})
            }
            setSesonData(helpArr);
        })
    };

    const handleGetAllSeries = () =>{
        axios({
            url:`${config.api}/api/series/client/${localStorage.getItem("client_id")}`,
            method:'GET'
        }).then((res)=>{
            var helpArr = [];
            
            for (let i = 0; i < res.data.data.length; i++) {
                const element = res.data.data[i];
                helpArr.push({label:element.Title,value:element._id})
            }
            setSeriesData(helpArr);
            // var test = [
            //     { value: 'ALL', label: 'ALL' },
            //     { value: 'UPCOMING', label: 'UPCOMING' },
            //     { value: 'WIN', label: 'WIN' },
            //     { value: 'LOSS', label: 'LOSS' },
            // ]
            // setSeriesData([
            //     { value: 'ALL', label: 'ALL' },
            //     { value: 'UPCOMING', label: 'UPCOMING' },
            //     { value: 'WIN', label: 'WIN' },
            //     { value: 'LOSS', label: 'LOSS' },
            // ]);
            // return test
        })
    }

    const handleLoadEpOfSeason = async (id) =>{
        var epArr = [];
        var epDetailArray = [];
        

        await axios({
            url:`${config.api}/api/episode/season/${id}`,
            method:'GET'
        }).then((res)=>{
            setEpisodeArray(res.data.data);
            epArr = res.data.data;
        });
        
        for (let i = 0; i < epArr.length; i++) {
            const element = epArr[i];
            await axios({
                url:`${config.api}/api/leader/episode/${element._id}/${userId}`,
                method:'GET'
            }).then((res)=>{
                console.log(res.data);
                epDetailArray.push(res.data);
            })
        }
        console.log(epDetailArray);

        setEpisodeDetailArray(epDetailArray);
   
    }

    const Control11 = ({ children, ...props }) => (
        <components.Control {...props}>
            <span>
            tese   jj 
            </span>
          {children}
        </components.Control>
    );

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

    const handleGetUserInfo = async () =>{
        const {data} = await getUser(localStorage.getItem('user_id'));
        let dataUser = data.data;
        setUserDetail(dataUser);
    }

    const handleGetAnswersDetail = async () =>{
        const {data} = await getAssessmentAnswers(localStorage.getItem('user_id'));
        setAnswerArr(data.data);
        var helpArr = [];
        let jj = 0;
            
        for (let i = 0; i < data.data.quiz.length; i++) {
            const element = data.data.quiz[i];
            if(element.assId){
                helpArr.push({label:element.assId.Name,value:element.assId._id,index:i});
            }
        }
        setAnswerData(helpArr);
        
    }

    const handlechangeAnswer = (indexanswer) =>{
        let totalAns = 0;
        
        for (let i = 0; i < AnswerArr.quiz[indexanswer].assId.Quiz.length; i++) {
                const element = AnswerArr.quiz[indexanswer].assId.Quiz[i];
                totalAns += parseInt(element.point)
        }

        // setAnsTotalPoint(AnswerArr.quiz[indexanswer].assId.Point);
        setAnsTotalPoint(totalAns);
        setAnsUserPoint(AnswerArr.quiz[indexanswer].score);
    }
    
    
    useEffect(()=>{
        handleGetUserData();
        handleGetAllSeries();
        handleGetRecommended();
        handleGetUserInfo();
        handleGetAnswersDetail();
    },[]);

    // useEffect(() => {
    //     if (_.isEmpty(series)) {
        //   dispatch(getSeries());
    //     } else {
    //         setSeriesList(series.data)

        
    //     }
        
    //   }, [series]);

    return (
        <>
            <section className="main-wrapper">
                <Navbar toggleNav={toggleNav} />
                <div className={`page-content transition ${toggleNav}`}>
                    {/* <!-- HEADER --> */}
                    <header>
                        <button
                            onClick={handleToggleNav}
                            className="toggle-box"
                        >
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
                                        <a href="#">
                                            This is a sample notification text.
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            This is a sample notification text.
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            This is a sample notification text.
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            This is a sample notification text.
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            This is a sample notification text.
                                        </a>
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

                    <div className="container-fluid mt-3">
                        <div className="row">
                            {/* <!-- BREADCRUMB --> */}
                            <div className="col-md-5">
                                <ul className="bread-crumb mb-0">
                                    <li className="active">
                                        <a href="#">User Dashboard</a>
                                    </li>
                                    <li>
                                        <i className="fa fa-chevron-right text-secondary"></i>
                                    </li>
                                </ul>
                                <h4>Overall</h4>
                            </div>
                            {/* <!-- OVERALL DETAILS --> */}
                            <div className="col-md-7 d-none">
                                <div className="overall-details">
                                    <select>
                                        <option value="">Overall</option>
                                        <option value="">Overall</option>
                                        <option value="">Overall</option>
                                    </select>
                                    <select>
                                        <option value="">Episode 1</option>
                                        <option value="">Episode 2</option>
                                        <option value="">Episode 3</option>
                                    </select>
                                    <button>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- DASHBOARD WRAPPER --> */}
                    <section className="dashboard-wrapper">
                        <div className="container-fluid">
                            <div className="row pb-3 mb-3">
                                <div className="col-md-12">
                                    <div className="row m-0">
                                        <div className="col-lg-4 pr-2">
                                            <div className="card-wrapper score-wrapper">
                                                <NavLink to='/leader-board'>
                                                    <div className="row m-0">
                                                        <div className="col-md-12 mt-1 mb-5 score-wrapper-title">
                                                            Welcome
                                                        </div>
                                                        <div className="col-md-4 userImage">
                                                            <img src="/assets/images/header/profile-pic.png" alt="" />
                                                        </div>
                                                        <div className="col-md-8 pl-4">
                                                            <h2 className="UD-userNameText">{UesrData.fullName}</h2>
                                                            <h5 className="UD-textGrayColor my-3">Your Rank</h5>
                                                            <div className="UD-userRank"> #00 </div>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </div>
                                        <div className="col-md-8 p-0 pl-lg-8">
                                            <div className="card-wrapper recommended-wrapper">
                                                <h5>Recommended for you</h5>
                                                <span className="view-all">
                                                    View All
                                                    <img
                                                        className="ml-2"
                                                        src="assets/images/dashboard/preview.png"
                                                        alt=""
                                                    />
                                                </span>

                                                <Swiper
                                                    className="episodeGameSwiper overflow-hidden mt-3 recommededSliderDash"
                                                    modules={[Navigation,Pagination, A11y , Autoplay]}
                                                    spaceBetween={15}
                                                    slidesPerView= {1.4}
                                                    loop={true}
                                                    autoplay= {{
                                                        delay: 2500,
                                                        disableOnInteraction: false,
                                                    }}
                                                    navigation={{
                                                        nextEl: ".right",
                                                        prevEl: ".left",
                                                    }}
                                                    pagination= {{
                                                        el: ".episode-game-pagination",
                                                        clickable: true,
                                                        renderBullet: function (index, className) {
                                                        return '<span class="' + className + '"></span>';
                                                        },
                                                    }}
                                                    onSlideChange={() =>{}}
                                                    onSwiper={(swiper) =>{}}
                                                >

                                                    {_.isEmpty(ClientRecommended)? 
                                                        <>
                                                            <div className="noRecTitle">
                                                                You Haven't any Recommended
                                                            </div>
                                                        </>
                                                    :
                                                        <>

                                                        {ClientRecommended?.Banner?.map((Banner,index) => 
                                                        
                                                            <SwiperSlide>
                                                               
                                                                        {ClientRecommended?.Link?.length >0 ?
                                                        
                                                                            <a href={ClientRecommended?.Link[index]}>
                                                                                <img
                                                                                    src={Banner}
                                                                                    alt=""
                                                                                />
                                                                            </a>
                                                                        
                                                                        :null}
                                                                    
                                                            </SwiperSlide>
                                                        )}
                                                        </>
                                                    }

   
                                                    {/* <div className="episode-game-pagination"></div> */}

                                                </Swiper>
                                            </div>
                                        </div>
                                        {/* <div className="col-lg-8">
                                            <div className="card-wrapper completion-wrapper">
                                                <h5>Overall Completion</h5>
                                                <div className="progress-bar-wrapper">
                                                    <div className="progress-wrapper">
                                                        <div
                                                            className="progress"
                                                            style={{
                                                                width: `${UesrData.overall_completion}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span>{UesrData.overall_completion}%</span>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    
                                </div>

                                <div className="col-md-12 p-3 card-wrapper yourScoreMainBox">

                                    <div className="mb-4 YSMB-header">
                                        <div className="UD-textGrayColor YSMB-headerTitle">
                                            Your Score is based on 
                                        </div>
                                    </div>

                                    <div className="YSMB-body">
                                        <div className="row mx-0 YSMB-bodySecton">
                                            <div className="col-md-8 pr-3 mb-3">

                                                {/* <CustomSelectProps /> */}
                                                
                                                <div className="mb-3">

                                                    <Select 
                                                        styles={customStyles}
                                                        options={SeriesData} 
                                                        components={{ Control11 }}
                                                        onChange={(e) => loadOptionsSeson(e.value)}
                                                        // defaultValue={defaultOption} 
                                                        placeholder="Select Series" 
                                                    />
                                                </div>
                                                <div>
                                                    <Select 
                                                        styles={customStyles}
                                                        options={SesonData} 
                                                        components={{ Control11 }}
                                                        onChange={(e) => handleLoadEpOfSeason(e.value)}
                                                        // defaultValue={defaultOption} 
                                                        placeholder="Select Season" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 pl-3 userOverallSection">
                                                <div className="userOverallMainBox">
                                                    <div className="col-9">
                                                        Your overall score based on your activates so far
                                                    </div>
                                                    <div  className="col-1">:</div>
                                                    <div className="col-2"> {UesrData.score} </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row px-5 mx-0 mt-3 DU-episodeMainResultBox">

                                            {EpisodeDetailArray.length > 0 ? 
                                                <>
                                                
                                                    <div className="dash-next">
                                                        <i className="fa fa-chevron-right"></i>
                                                    </div>
                                                    <div className="dash-prev">
                                                        <i className="fa fa-chevron-left"></i>
                                                    </div>
                                                
                                                    <Swiper
                                                    className="comicPageSwiper"
                                                    modules={[Navigation, A11y]}
                                                    spaceBetween={15}
                                                    slidesPerView={2}
                                                    loop={true}
                                                    navigation={{
                                                        nextEl: ".dash-next",
                                                        prevEl: ".dash-prev",
                                                    }}
                                                    onSlideChange={() => console.log("slide change")}
                                                    onSwiper={(swiper) => console.log(swiper)}
                                                    >

                                                        {EpisodeDetailArray?.map((ep,index) =>    
                                                            <SwiperSlide>

                                                                <div className="DU-ER-card">
                                                                    <div className="DU-ER-cardIndex"> Episode {index + 1} </div>
                                                                    <div className="DU-ER-cardTitle"> {EpisodeArray[index].Title} </div>
                                                                    <div className="DU-ER-cardResultmain">
                                                                        <div className="col-md-4 DU-ER-cardResultBadge">
                                                                            <div className="DU-ER-cardResultBadgeImg">
                                                                                <img src="/assets/images/dashboard/badge.png" alt="#" />
                                                                                <div className="DU-ER-cardResultBadgeImgD">
                                                                                    <div>
                                                                                        {ep.correct_answers.length == 0 ? 0 : 
                                                                                            <>
                                                                                                {(() =>{
                                                                                                    let epScore = 0;

                                                                                                    for (let i = 0; i < ep.correct_answers.length; i++) {
                                                                                                        const element = ep.correct_answers[i];
                                                                                                        epScore += element.score;
                                                                                                    }
                                                                                                    return epScore;
                                                                                                })()}
                                                                                            </>
                                                                                        
                                                                                        }
                                                                                    </div>
                                                                                    <div>POINTS</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="DU-ER-cardResultBadgeText">Total Score</div>
                                                                        </div>
                                                                        <div className="col-md-8 DU-ER-cardResultDetail">
                                                                            <div className="DU-ER-cardResultDetailCard">
                                                                                <div>Total Quizzes</div>
                                                                                <div>{ep.quiz_total}</div>
                                                                            </div>
                                                                            <div className="DU-ER-cardResultDetailCard">
                                                                                <div>Total Attempted Quizzes</div>
                                                                                <div>{ep.answered_quiz}</div>
                                                                            </div>
                                                                            <div className="DU-ER-cardResultDetailCard">
                                                                                <div>Correct</div>
                                                                                <div>{ep.correct_answers.length}</div>
                                                                            </div>
                                                                            <div className="DU-ER-cardResultDetailCard">
                                                                                <div>Incorrect</div>
                                                                                <div>{ep.wrong_answers}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </SwiperSlide>  
                                                        )}

                                                    </Swiper>
                                                
                                                </>
                                            
                                            :
                                                <>
                                                <div className="DU-episodeMainResultBoxMainText">

                                                    {EpisodeArray.length > 0 ? 
                                                        'Please Wait To load Your Data' 
                                                    :
                                                        "Please select Series And Season"
                                                    }
                                                </div>
                                                </>
                                            }

                                        </div>


                                    </div>

                                </div>

                                <div className="col-md-7 card-wrapper badges-wrapper">
                                        <h5>Badges You Have achieved So Far</h5>

                                        <div className="col-md-12 px-0 d-flex mt-4">

                                            <div className="col-sm-3">
                                                <div className="badgesTitleMain"> Current Badge </div>
                                                <div className="px-3 badgeCurrentImage">
                                                    <div className="badge">
                                                        <img
                                                            className="w-100"
                                                            src="assets/images/dashboard/badge.png"
                                                            alt=""
                                                        />
                                                        {UesrData?.badges?.length >0 ?
                                                        
                                                            <img
                                                                className="thumb"
                                                                src={UesrData?.badges[0]}
                                                                alt=""
                                                            />
                                                        
                                                        :
                                                            <img
                                                                className="thumb"
                                                                src="/assets/images/dashboard/badge-thumb-5.png"
                                                                alt=""
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-9 px-3 ">
                                                <div className="badgesTitleMain">
                                                    <div>Badges you have earned so far </div>
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
                                                    className="earnedBadgeSwiper overflow-hidden"
                                                    modules={[Navigation, A11y]}
                                                    spaceBetween={0}
                                                    loop={false}
                                                    navigation={{
                                                        nextEl: ".left",
                                                        prevEl: ".right",
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
                                                    onSlideChange={() =>{}}
                                                    onSwiper={(swiper) =>{}}
                                                >

                                                    {UesrData?.badges?.map((badge,index) =>
                                                    
                                                        
                                                        <SwiperSlide>
                                                            <div className="badge">
                                                                <img
                                                                    className="w-100"
                                                                    src="assets/images/dashboard/badge.png"
                                                                    alt=""
                                                                />
                                                                <img
                                                                    className="thumb"
                                                                    src={badge}
                                                                    alt=""
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    
                                                    )}

                                                    {UesrData?.badges?.length < 8 ? 
                                                    
                                                    <>
                                                        {Array.from(Array((8 - UesrData?.badges.length)), (e, i) => {
                                                            return (
                                                                <SwiperSlide>
                                                                    <div className="badge">
                                                                        <img
                                                                            className="w-100"
                                                                            src="assets/images/dashboard/empty-badge.png"
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                </SwiperSlide>
                                                            )
                                                        })}
                                                    </>
                                                    
                                                    :null}

                                                </Swiper>

                                            </div>

                                        </div>
                                    </div>

                                <div className="col-md-5 p-0 pl-lg-3">
                                    <div className="card-wrapper organization-wrapper">
                                        <h5>Organization Leaderboard</h5>
                                        <NavLink to='/leader-board'>

                                            <span className="enhance">
                                                Want to enhance your position?
                                                <img
                                                    className="ml-2"
                                                    src="assets/images/dashboard/preview.png"
                                                    alt=""
                                                />
                                            </span>
                                        </NavLink>
                                        <ul>

                                            {LeaderBoard.map((leader,index) =>

                                                <li className={leader._id == userId ? "activeLeaderBoard" : null}>
                                                    <span className="rank">{index + 1 }</span>
                                                    <img
                                                        src="assets/images/dashboard/thumb.png"
                                                        alt=""
                                                    />
                                                    <p>{leader.fullName}</p>
                                                    <span className="score">
                                                        {leader.score}
                                                    </span>
                                                </li>

                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                             <div className="row mb-3">
                                <div className="col-md-4 p-0 pl-lg-3 mb-3">
                                    <div className="card-wrapper organization-wrapper">
                                        <h5 className="mb-4">Your Pre-Assessment Score</h5>
                                        <div className="mb-4">
                                            <Select 
                                                styles={customStyles}
                                                options={AnswerData} 
                                                components={{ Control11 }}
                                                onChange={(e) => handlechangeAnswer(e.index)}
                                                // defaultValue={defaultOption} 
                                                placeholder="Pre Assessment" 
                                            />
                                        </div>
                                        
                                        <div className="preAssScoreBox">
                                            <img
                                                className="w-100"
                                                src="assets/images/dashboard/badge.png"
                                                alt=""
                                            />
                                            <div className="preAssScore">
                                                <span>{AnsUserPoint}</span>
                                                <span> / </span>
                                                <span>{AnsTotalPoint}</span>
                                                <div className="preAssScoreText">Points</div>
                                            </div>
                                            
                                        </div>

                                      
                                    </div>
                                </div>
                                <div className="col-md-4 p-0 pl-lg-3 mb-3">
                                    <div className="card-wrapper organization-wrapper">
                                        <h5 className="mb-4">Your Game Scores</h5>
                                        <div className="mb-4">
                                            <Select 
                                                styles={customStyles}
                                                // options={AnswerData} 
                                                components={{ Control11 }}
                                                onChange={(e) => handlechangeAnswer(e.index)}
                                                // defaultValue={defaultOption} 
                                                placeholder="game Label" 
                                            />
                                        </div>
                                        
                                        <div className="preAssScoreBox">
                                            <img
                                                className="w-100"
                                                src="assets/images/dashboard/badge.png"
                                                alt=""
                                            />
                                            <div className="preAssScore">
                                                <span>200</span>
                                                <span> / </span>
                                                <span>500</span>
                                                <div className="preAssScoreText">Points</div>
                                            </div>
                                            
                                        </div>

                                      
                                    </div>
                                </div>
                             </div>

                            {/* <div className="row">
                                <div className="col-md-7">
                                    <div className="card-wrapper activity-wrapper pb-0">
                                        <h5>Activity Count</h5>

                                        <div id="donutchart">
                                            {ChartData.length > 0 ? 
                                            
                                                <Chart
                                                    id="donutchart"
                                                    chartType="PieChart"
                                                    data={ChartData}
                                                    loader={<div>Loading Chart</div>}
                                                    options={chartOptions}
                                                    width="100%"
                                                    height="400px"
                                                    legendToggle
                                                />
                                            
                                            :null}
                                        </div>

                                    </div>
                                </div>
                                
                            </div> */}
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
};

export default DashboardPage;
