import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from "react-router-dom";


const Navbar = ({ toggleNav }) => {
  return (
    <aside className={`side-bar transition ${toggleNav}`}>
      <div className="logo-box">
        <div className="logo-lg">
          <img src="assets/images/logo.png" alt="" />
        </div>
        <div className="logo-sm">
          <img src="assets/images/favicon.png" alt="" />
        </div>
      </div>
      <ul className="menu">
        <li className="active">
          <NavLink to="/home" activeClassName="active">
            <i className="fa fa-home"></i>
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <a href="#">
            <i className="fa fa-sticky-note"></i>
            <span>Series for you</span>
          </a>
        </li>
        <li>
          <NavLink to='/dashboard' activeClassName="active">
            <i className="fa fa-th-large"></i>
            <span>User Dashboard</span>
          </NavLink>
        </li>
        <li>
          <a href="#">
          <FontAwesomeIcon icon={faCommentAlt} />
            <span>Updates</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};
export default Navbar;
