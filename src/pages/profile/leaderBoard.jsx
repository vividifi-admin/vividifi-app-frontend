import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Chart } from "react-google-charts";
import axios from "axios";

import Navbar from "../../components/layouts/includes/Navbar";
import config from "../../services/config.json";
import { getUser } from "../../services/getClinet";


const LeaderBoardPage = () => {
    const clinet = useSelector((state) => state.clinet);
    const history = useHistory();
    const [toggleNav, setToggleNav] = useState("");
    const [searchText, setSearchText] = useState("");

    const [LeaderBoard,setLeaderBoard] = useState([]);

    const [UserRank,setUserRank] = useState(0);

    const [UserDetail,setUserDetail] = useState({});


    const userId = localStorage.getItem("user_id");

    const [ChartData, setChartData] = useState([
        ["Videos", "Hours per Day"],
        ["Videos", 22],
        ["Games", 10],
        ["Documents", 14],
        ["Infographic Videos", 5],
        ["Infographic", 9],
        ["Comics", 7],
    ]);
    const dispatch = useDispatch();

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

    const handleGetUserData = () =>{
        // Get Leader
        axios({
            url:`${config.api}/api/leader/${localStorage.getItem('client_id')}`,
            method:'get'
        }).then((res) =>{
            let leader = res.data;
            // console.log(leader);

            for (let i = 0; i < leader.length; i++) {
                const element = leader[i];
                if(element._id == userId){
                    setUserRank(i + 1);
                    break;
                }
            }

            setLeaderBoard(leader);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const handleGetUserInfo = async () =>{
        const {data} = await getUser(localStorage.getItem('user_id'));
        let dataUser = data.data;
        setUserDetail(dataUser);
    }

    useEffect(()=>{
        handleGetUserData();
        handleGetUserInfo()
    },[])


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
                            <div className="row">
                                <div className="col-md-7 d-none">
                                    <div className="row m-0">
                                        <div className="col-lg-4">
                                            <div className="card-wrapper score-wrapper">
                                                <h5>Your Total Score</h5>
                                                <h1>75000</h1>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="card-wrapper completion-wrapper">
                                                <h5>Overall Completion</h5>
                                                <div className="progress-bar-wrapper">
                                                    <div className="progress-wrapper">
                                                        <div
                                                            className="progress"
                                                            style={{
                                                                width: "45%",
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span>45%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-wrapper badges-wrapper">
                                        <h5>Badges Earned</h5>

                                        <Swiper
                                            className="earnedBadgeSwiper overflow-hidden"
                                            modules={[Navigation, A11y]}
                                            spaceBetween={0}
                                            loop={false}
                                            navigation={{
                                                nextEl: ".episode-next",
                                                prevEl: ".episode-prev",
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
                                            onSlideChange={() => {}}
                                            onSwiper={(swiper) => {}}
                                        >
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/badge.png"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="thumb"
                                                        src="assets/images/dashboard/badge-thumb-5.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/badge.png"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="thumb"
                                                        src="assets/images/dashboard/badge-thumb-1.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/badge.png"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="thumb"
                                                        src="assets/images/dashboard/badge-thumb-2.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/badge.png"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="thumb"
                                                        src="assets/images/dashboard/badge-thumb-3.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/badge.png"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="thumb"
                                                        src="assets/images/dashboard/badge-thumb-4.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/empty-badge.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/empty-badge.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- BADGE --> */}
                                            <SwiperSlide>
                                                <div className="badge">
                                                    <img
                                                        className="w-100"
                                                        src="assets/images/dashboard/empty-badge.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                </div>
                                <div
                                    class="col-md-8 p-0"
                                    style={{ margin: "2% auto 0" }}
                                >
                                    <div class="card-wrapper organization-wrapper">
                                        <h5>Organization Leaderboard</h5>
                                        <span
                                            class="enhance"
                                            style={{"right": "50px"}}
                                        >
                                            You are here : {UserRank} rd rank
                                        </span>
                                        <ul style={{"position": "relative"}}>

                                            {LeaderBoard.map((leader,index) =>

                                                <li className={leader._id == userId ? "activeLeaderBoard" : null}>
                                                    <span className="rank">{index + 1 }</span>
                                                    <img
                                                        src="assets/images/dashboard/thumb.png"
                                                        alt=""
                                                    />
                                                    <p>{leader.fullName}</p>
                                                    <span className="score2">
                                                        {leader.score}
                                                    </span>
                                                </li>

                                            )}
                      
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="card-wrapper activity-wrapper pb-0 d-none">
                                        <h5>Activity Count</h5>

                                        <div id="donutchart">
                                            <Chart
                                                id="donutchart"
                                                chartType="PieChart"
                                                data={ChartData}
                                                options={chartOptions}
                                                width="100%"
                                                height="400px"
                                                legendToggle
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 p-0 pl-lg-3">
                                    <div className="card-wrapper recommended-wrapper d-none">
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
                                            className="episodeGameSwiper overflow-hidden mt-3"
                                            modules={[
                                                Navigation,
                                                Pagination,
                                                A11y,
                                                Autoplay,
                                            ]}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            loop={true}
                                            autoplay={{
                                                delay: 2500,
                                                disableOnInteraction: false,
                                            }}
                                            navigation={{
                                                nextEl: ".right",
                                                prevEl: ".left",
                                            }}
                                            pagination={{
                                                el: ".episode-game-pagination",
                                                clickable: true,
                                                renderBullet: function (
                                                    index,
                                                    className
                                                ) {
                                                    return (
                                                        '<span class="' +
                                                        className +
                                                        '"></span>'
                                                    );
                                                },
                                            }}
                                            onSlideChange={() => {}}
                                            onSwiper={(swiper) => {}}
                                        >
                                            {/* <!-- GAME --> */}
                                            <SwiperSlide>
                                                <div className="game game-1">
                                                    <div className="content">
                                                        <h2>
                                                            Most Played and
                                                            scored game in your
                                                            group
                                                        </h2>
                                                        <p>Farming</p>
                                                        <button className="game-button">
                                                            Play Now{" "}
                                                            <i className="fa fa-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                    <div className="thumb">
                                                        <img
                                                            src="assets/images/dashboard/tiktok-game.png"
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- GAME --> */}
                                            <SwiperSlide>
                                                <div className="game game-2">
                                                    <div className="content">
                                                        <h2>
                                                            What you missed
                                                            seeing in last
                                                            episode
                                                        </h2>
                                                        <p>ABE Comics</p>
                                                        <button className="game-button">
                                                            Play Now{" "}
                                                            <i className="fa fa-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                    <div className="thumb">
                                                        <img
                                                            src="assets/images/dashboard/comic-game.png"
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- GAME --> */}
                                            <SwiperSlide>
                                                <div className="game game-3">
                                                    <div className="content">
                                                        <h2>
                                                            Most liked by your
                                                            peers
                                                        </h2>
                                                        <p>
                                                            Start farming with
                                                            modern...
                                                        </p>
                                                        <button className="game-button">
                                                            Play Now{" "}
                                                            <i className="fa fa-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                    <div className="thumb">
                                                        <img
                                                            src="assets/images/dashboard/mostliked.png"
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            {/* <!-- GAME --> */}
                                            <SwiperSlide>
                                                <div className="game game-4">
                                                    <div className="content">
                                                        <h2>
                                                            Recently added for
                                                            your viewing
                                                        </h2>
                                                        <p>Farming</p>
                                                        <button className="game-button">
                                                            Play Now{" "}
                                                            <i className="fa fa-arrow-right"></i>
                                                        </button>
                                                    </div>
                                                    <div className="thumb">
                                                        <img
                                                            className="my-4"
                                                            src="assets/images/dashboard/recently.png"
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <div className="episode-game-pagination"></div>
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

export default LeaderBoardPage;
