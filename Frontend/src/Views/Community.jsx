import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/community.css";
import CenterSection from "../Components/Community/CenterSection";
import UserProfileModal from "../Components/Modals/UserProfileModal";
import CreateStoryModal from "../Components/Modals/CreateStoryModal";
import WorkoutStory from "../Components/Modals/UpdateStory";
import StoryService from "../Services/StoryService";
import state from "../Utils/Store";
import { useSnapshot } from "valtio";
import CreatePostModal from "../Components/Modals/CreatePostModal";
import UserService from "../Services/UserService";
import UploadPostModal from "../Components/Modals/UploadPostModal";
import CreateMealPlanModal from "../Components/Modals/CreateMealPlanModal";
import MealPlanService from "../Services/MealPlanService";
import EditMealPlanModal from "../Components/Modals/EditMealPlanModal";
import UpdateSkillShareModal from "../Components/Modals/UpdateSkillShareModal";
import CreateSkillShareModal from "../Components/Modals/CreateSkillShareModal";
import SkillShareService from "../Services/SkillShareService";
import FriendProfileModal from "../Components/Modals/FriendProfileModal";
import { message } from "antd";

const Community = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);

  const getWorkoutStories = async () => {
    try {
      const response = await StoryService.getAllWorkoutStories();
      state.storyCards = response;
    } catch (error) {
      console.log("Failed to fetch workout stories", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await UserService.getProfiles();
      state.users = response;
    } catch (error) {
      console.log("Failed to fetch users", error);
    }
  };

  const getMealPlans = async () => {
    try {
      const response = await MealPlanService.getAllMealPlans();
      state.MealPlans = response;
    } catch (error) {
      console.log("Failed to fetch Learning Progresss ", error);
    }
  };

  const getSkillShares = async () => {
    try {
      const response = await SkillShareService.getAllSkillShares();
      state.SkillShares = response;
    } catch (error) {
      console.log("Failed to fetch Skill Shares", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      UserService.getProfile()
        .then((response) => {
          state.currentUser = response;
          message.success("Welcome");
        })
        .catch(() => {
          message.error("Failed to fetch user profile");
        });
    }
    getAllUsers().then(() => {
      getWorkoutStories();
      getMealPlans();
      getSkillShares();
    });
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <header className="">
        <nav>
          <div className="nav__header">
            <div className="nav__logo">
              <Link to="/">
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
              <Link to="#browse-skills">Discover Recipes</Link>
            </li>
            <li className="link">
              <Link
                to="/community"
                onClick={() => {
                  if (!localStorage.getItem("userId")) {
                    setIsAuthModalOpened(true); // Open authentication modal if not logged in
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
                    navigate("/"); // Navigate to the community page
                  } else {
                    setIsAuthModalOpened(true); // Open authentication modal
                  }
                }}
                className="btn"
              >
              TASTEMASTER Home 
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="main">
        <CenterSection />
      </div>

      <UserProfileModal />
      <CreateStoryModal />
      <CreateMealPlanModal />
      <CreateSkillShareModal />
      {snap.selectedWorkoutStory && <WorkoutStory />}
      <CreatePostModal />
      {snap.selectedPost && <UploadPostModal />}
      {snap.selectedMealPlan && <EditMealPlanModal />}
      {snap.seletedSkillShareToUpdate && <UpdateSkillShareModal />}
      {snap.selectedUserProfile && <FriendProfileModal />}
    </div>
  );
};

export default Community;
