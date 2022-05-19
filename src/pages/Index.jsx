import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Index = () => {
  const [userLogin,setUserLogin] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem('token')){
      setUserLogin(true);
    }
  },[])

  return (
    <>
      <section className="welcome">
        <div className="logo-box">
          <img src="assets/images/logo.png" alt="Vividifi" />
        </div>
        <div className="tagline">Anytime, Anywhere, Gamified Learning</div>
        <button>
          {userLogin? 
          <a href="/home">
            Let's Go <i className="fa fa-arrow-right"></i>
          </a>
          :
          <Link to="/login">
            Let's Go <i className="fa fa-arrow-right"></i>
          </Link>
          }
        </button>
      </section>
    </>
  );
};
export default Index;
