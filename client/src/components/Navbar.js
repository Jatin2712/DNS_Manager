import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../components/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
// import "../../node_modules/react-tooltip/dist/react-tooltip.css";
// import ReactTooltip from 'react-tooltip';

function Navbar({ isAuthenticated, logout }) {
  const location = useLocation();

  return (
    <div className="navBar">
      <nav className="navbar navbar-expand-sm">
        <ul className="nav-ul">
          {isAuthenticated ? (
            <>
              <li className="li-nav">
                <Link
                  to="/dns-table"
                  className={`nav-link ${
                    location.pathname === "/dns-table" ? "active" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="li-nav">
                <Link
                  to="/add-dns"
                  className={`nav-link ${
                    location.pathname === "/add-dns" ? "active" : ""
                  }`}
                >
                  Add DNS Record
                </Link>
              </li>
              <li className="li-nav">
                <button className="button-nav" onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </li>
              {/* <li className="li-nav">
                <button className="button-nav" onClick={logout} data-tip data-for="logoutTooltip" >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </li>
              <ReactTooltip id="logoutTooltip" place="right" effect="solid">
                Logout
              </ReactTooltip> */}
            </>
          ) : (
            <>
              <li className="li-nav">
                <Link
                  to="/register"
                  className={`nav-link ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                >
                  Register
                </Link>
              </li>
              <li className="li-nav">
                <Link
                  to="/login"
                  className={`nav-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
