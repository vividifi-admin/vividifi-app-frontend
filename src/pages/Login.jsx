import React, { useEffect, useState } from "react";
import { loginUser } from "../services/loginService";
import { useLocation, Route, Switch, useHistory , Link } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y , Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import $ from 'jquery';
import { toast } from "react-toastify";


const Login = () => {
  //Component Style
  //******************
  const spanStyle = { color: "red", display: "block", marginTop: 20 };
  //Define State
  //******************
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  let history = useHistory();
  //Define Function
  //******************

  const handleLogin = async () => {
    $('.login-btn').text("Loggin in...")
    try {
      const { status, data } = await loginUser(userName, password);
      if (status === 200) {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user._id);
        localStorage.setItem("client_id", data.user.Client);
        const wrapper = document.querySelector(".ready-to-go-wrapper");
        wrapper.classList.add("active");
      $('.login-btn').text("Sign in")
      toast.success(data.message)

      }
    } catch (error) {
      $('.login-btn').text("Sign in");
      toast.error(error.response.data.message)
      console.log(error.response);
    }
  };
  const handleChangeRoute = () => {
    history.push("/home");
  };
  return (
    <>
      <section className="auth-wrapper login-wrapper">
        <div className="auth-box">
          <h2 className="title">Login</h2>
          <p className="tagline">
            {/* Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor. */}
          </p>
          <div className="input-box">
            <input
              type="text"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={userName}
              placeholder="Username"
              id="username"
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              placeholder="Password"
              id="password"
            />
          </div>
          <div className="forget-password">
            <a href="forgetpassword.html">Forgot Password?</a>
          </div>
          <button
            onClick={() => {
              handleLogin();
            }}
            className="login-btn"
          >
            Sign in
          </button>
          <span id="message_error" style={spanStyle}></span>
          <div class="box-footer">
            Don't have an account? <Link to="/signUp" class="text-primary"> Sign Up</Link>
          </div>
        </div>
      </section>
      <section className="ready-to-go-wrapper">
        <div className="ready-to-go">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <div className="ready-detail">
                  <div className="logo-box">
                    <img
                      src="assets/images/dark-logo.png"
                      className="w-100"
                      alt=""
                    />
                  </div>
                  <h2>Welcome Onboard!</h2>
                  <h3>
                    Ready to
                    <span>
                    <Swiper
                      className="readySwiper"
                      modules={[Navigation,Pagination, A11y , Autoplay]}
                      spaceBetween={0}
                      slidesPerView= {1}
                      loop={true}
                      autoplay= {{
                          delay: 2500,
                          disableOnInteraction: false,
                      }}
                    
                      onSlideChange={() =>{}}
                      onSwiper={(swiper) =>{}}
                  >
                    <SwiperSlide>
                      Learn?
                    </SwiperSlide>
                    <SwiperSlide>
                      Compete?
                    </SwiperSlide>
                    <SwiperSlide>
                      Play?
                    </SwiperSlide>
                    <SwiperSlide>
                      Watch?
                    </SwiperSlide>
                  
                </Swiper>
                      {/* <div className="swiper readySwiper">
                        <div className="swiper-wrapper">
                          <div className="swiper-slide">Learn?</div>
                          <div className="swiper-slide">Compete?</div>
                          <div className="swiper-slide">Play?</div>
                          <div className="swiper-slide">Watch?</div>
                        </div>
                      </div> */}
                    </span>
                  </h3>
                  <a>
                    <button
                      onClick={() => handleChangeRoute()}
                      id="submitButton"
                    >
                      Dive Right In <i className="fa fa-arrow-right"></i>
                    </button>
                  </a>
                </div>
              </div>
              <div className="col-md-6">
                <div className="ready-thumb-wrapper">
                <Swiper
                      className="readySwiper"
                      modules={[Navigation,Pagination, A11y , Autoplay]}
                      spaceBetween={0}
                      slidesPerView= {1}
                      loop={true}
                      autoplay= {{
                          delay: 2500,
                          disableOnInteraction: false,
                      }}
                    
                      pagination= {{
                          el: ".ready-thumb-pagination",
                          clickable: true,
                          renderBullet: function (index, className) {
                            return `<span class="${className}"></span>`;
                          },
                      }}
                      onSlideChange={() =>{}}
                      onSwiper={(swiper) =>{}}
                  >
                    <SwiperSlide>
                      <div className="ready-thumb">
                        <img
                          className="w-100"
                          src="assets/images/ready-to-go/thumb-1.png"
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="ready-thumb">
                        <img
                          className="w-100"
                          src="assets/images/ready-to-go/thumb-2.png"
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="ready-thumb">
                        <img
                          className="w-100"
                          src="assets/images/ready-to-go/thumb-3.png"
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="ready-thumb">
                        <img
                          className="w-100"
                          src="assets/images/ready-to-go/thumb-4.png"
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                  
                    <div className="ready-thumb-pagination"></div>
                </Swiper>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Login;
