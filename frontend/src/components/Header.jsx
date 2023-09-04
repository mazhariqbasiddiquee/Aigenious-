import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import ButtonOutline from "./ButtonOutline";
import logo from "./images/logo.png";

const Header = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [scrollActive, setScrollActive] = useState(false);
  const [token, setToken] = useState(""); // Store the token from local storage
  const [userName, setUserName] = useState(""); // Store the user's name from local storage

  
  useEffect(() => {
    // Check if the token is available in local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    // Check if the user's name is available in local storage
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [token]);


  const handleLogout = () => {
    // Remove the token and name from local storage and state
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken("");
    setUserName("");
  };

  return (
    <>
      <header
        className={
          "fixed top-0 w-full  z-30 bg-white-500 transition-all " +
          (scrollActive ? " shadow-md pt-0" : " pt-2")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-20 mx-auto grid grid-flow-col py-0 sm:py-2">
          <div className="col-start-1 col-end-2 flex items-center">
            <Link to="/">
              <img className="h-12 w-auto" src={logo} alt="" />
            </Link>
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-black-500  items-center">
            {/* ... Your navigation links ... */}
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            {token ? ( // If token is available, show Logout and user's name
              <>
                <span className="text-black-600 mx-2 sm:mx-4 capitalize tracking-wide hover:text-orange-500 transition-all">
                  {userName}
                </span>
                <ButtonOutline onClick={handleLogout}>Logout</ButtonOutline>
              </>
            ) : (
              <>
                <Link to="/login">
                  <span className="text-black-600 mx-2 sm:mx-4 capitalize tracking-wide hover:text-orange-500 transition-all">
                    Sign In
                  </span>
                </Link>
                <Link to="/signup">
                  <ButtonOutline>Sign Up</ButtonOutline>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      {/* Mobile Navigation */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
        <div className="bg-white-500 sm:px-3">
          <ul className="flex w-full justify-center items-center text-black-500">
            {/* ... Your mobile navigation links ... */}
          </ul>
        </div>
      </nav>
      {/* End Mobile Navigation */}
    </>
  );
};

export default Header;
