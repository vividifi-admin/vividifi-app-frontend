import React, { useEffect , useState } from "react";
import { BrowserRouter, Switch, Route, Redirect , useLocation} from "react-router-dom";
import $ from 'jquery';
import Auth from "./components/layouts/Auth";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';



const App = () => {

  const location = useLocation();

  const [LoadingState,setLoadingState] = useState(true)


  useEffect(()=>{

    // console.log(location)

    setLoadingState(true);

    $('html, body').animate({
      scrollTop: 0
    }, 1000);
    // console.log("object1");

    
    $(window).ready(function(){
      setTimeout(() => {
        setLoadingState(false);
      }, 2500);
      console.log("object");
    })

    // window.addEventListener('DOMContentLoaded', (event) => {
    //   console.log('DOM fully loaded and parsed');
    // });
  },[location]);

  return (
    <>
    {LoadingState ? 
    
    <>
      <div className="loadingMainBox">
        <div className="loadingBox">
          <img src="/assets/images/vividifi_Loader.gif" />
        </div>
      </div>
    </> 
    
    : null}
      <Switch>
        <Route path="/" render={(props) => <Auth {...props} />} />
      </Switch>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
export default App;
