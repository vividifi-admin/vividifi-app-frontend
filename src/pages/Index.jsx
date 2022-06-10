import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [userLogin,setUserLogin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem('token')){
      setUserLogin(true);
    }
  },[])

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <>
      <section className="welcome">
        {open ? 
        <>
          <span>
            <video src="/assets/howto.mp4" controls id="videoItem" autoPlay={true} style={{display: 'block', margin: '1em auto', width: "80%", height: "calc(.5625 * 80vw)"}} />
            <button onClick={onCloseModal} style={{position: "absolute", top: "10%", zIndex: 20, marginLeft: "80%", padding: 0}} >
            <i className="fa fa-close"></i>&nbsp;
            </button>
          </span>
        </>
        :
          <>
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
            <button onClick={onOpenModal}>
                How To Use ? <i className="fa fa-arrow-right"></i>
            </button>
          </>
        }
      </section>
    </>
  );
};
export default Index;
