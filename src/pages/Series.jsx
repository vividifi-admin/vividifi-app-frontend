import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSeries } from "../store/actions/series";
import { isEmpty } from "lodash";
import { getUser } from "../services/getClinet";
const Series = () => {
  const dispatch = useDispatch();
  const series = useSelector((state) => state.series);
  const history = useHistory();
  const [holding, setHolding] = useState([]);
  const [UserDetail,setUserDetail] = useState({});

  const params = useParams();
  useEffect(() => {}, []);
  useEffect(() => {
    if (isEmpty(series)) {
      dispatch(getSeries());
    } else {
      setHolding(series.data);
      const search = history.location.search.split("=")[1];
      if (holding.length > 0) {
        const dataSearched = holding.filter((item) => {
          return item.Title.indexOf(search) > -1;
        });
        setHolding(dataSearched);
      }
    }
  }, [series]);

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

  useEffect(() =>{
    handleGetUserInfo()
  },[])



  return (
    <>


    
      <section className="main-wrapper">
        <div className={`page-content transition m-0 p-0`}>
          <header className="px-5">
            <button
              onClick={() => {
                history.push("/home");
              }}
              className="back-button ml-3"
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
              <li className="active">
                <Link to="/series">Series</Link>
              </li>
              <li>
                <i className="fa fa-chevron-right"></i>
              </li>
            </ul>
            <div className="profile-box">
              <div className="notification-wrapper position-relative">
                <button className="notifications dropdown-button">
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
                <button className="profile dropdown-button">
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
          <section className="home-wrapper pt-0 pl-5 pr-5 pb-5">
            <div className="container-fluid">
              <div className="row">
                {!isEmpty(holding)
                  ? holding.map((item, index) => (
                      <div key={index} className="col-md-4 p-5">
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
                    ))
                  : null}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};
export default Series;
