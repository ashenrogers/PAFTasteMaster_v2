import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  
  return (
    <header className="header">
      <nav>
        <div className="nav__header">
          <div className="nav__logomain">
            <Link to="#">
              <img src="/assets/TASTEMASTER.svg" alt="logo" />
            </Link>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
        <ul className="nav__links" id="nav-links">
          <li className="link">
            <Link to="/">Contact Us</Link>
          </li>
          <li className="link">
            <Link to="#browse-recipes">Discover Recipes</Link>
          </li>
          <li className="link">
            <Link
              to="/community"
              onClick={() => {
                if (!localStorage.getItem("userId")) {
                  setIsAuthModalOpened(true); // Open the authentication modal if not logged in
                }
              }}
            >
              Share Your Culinary Journey
            </Link>
          </li>
          <li className="link">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the community page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Join with Taste Master
            </button>
          </li>
        </ul>
      </nav>
      <div className="section__container header__container" id="home">
        <div>
          <img src="/assets/TASTEMASTERhd.svg" alt="header" />
        </div>
        <div className="header__content">
          <h4>Learn Techniques & Connect</h4>
          <h1 className="section__header">Elevate Your Culinary Journey!</h1>
          <p>
            Master cooking techniques, connect with food enthusiasts, and access personalized recipes. Join with Taste Master and achieve your culinary goals with our supportive community.
          </p>
          <div className="header__btn">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the community page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Start Your Culinary Adventure
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;