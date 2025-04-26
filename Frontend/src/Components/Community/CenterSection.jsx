import React, { useEffect } from "react";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import MealPlanBox from "./MealPlanBox";
import MealPlanCard from "./MealPlanCard";
import CreaetSkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";
import { Tabs, Avatar, Row } from "antd";

const { TabPane } = Tabs;

const tabStyles = {
  nav: {
    backgroundColor: "#f0fdf4",
    borderRadius: "8px",
    padding: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.06)"
  },
  tab: {
    fontWeight: 600,
    fontSize: "16px",
    color: "#2f855a",
    padding: "10px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease"
  },
  tabActive: {
    backgroundColor: "#86efac",
    color: "#065f46",
    borderRadius: "6px"
  }
};

const CenterSection = () => {
  const snap = useSnapshot(state);

  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);

  return (
    <div
      className="center"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px"
      }}
    >
      <nav>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600
          }}
        >
          <img
            style={{ maxHeight: 60 }}
            src="/assets/TASTEMASTER.svg"
            alt="logo"
          />
          TASTEMASTER
        </div>
        <Avatar
          style={{
            cursor: "pointer",
            border: "5px solid rgb(223, 27, 86)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
          onClick={() => {
            state.profileModalOpend = true;
          }}
          size={60}
          src={snap.currentUser?.image}
        />
      </nav>

      <StoryBox />

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "16px"
        }}
      >
        <NotificationsDropdown />

        <Tabs
          defaultActiveKey="1"
          centered
          tabBarStyle={{ ...tabStyles.nav, marginBottom: "16px" }}
          renderTabBar={(props, DefaultTabBar) => (
            <DefaultTabBar {...props}>
              {(node) =>
                React.cloneElement(node, {
                  style: {
                    ...tabStyles.tab,
                    ...(props.activeKey === node.key ? tabStyles.tabActive : {})
                  }
                })
              }
            </DefaultTabBar>
          )}
        >
          <TabPane tab="🍳 Comment & Feedback" key="1">
            <MyPost />
            <div>
              {snap.posts.map((post) => (
                <FriendsPost key={post?.id} post={post} />
              ))}
            </div>
          </TabPane>

          <TabPane tab="🥗 Meal Plan" key="2">
            <MealPlanBox />
            <div>
              {snap.MealPlans.map((plan) => (
                <MealPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabPane>

          <TabPane tab="👨‍🍳 SkillShare" key="3">
            <CreaetSkillShareBox />
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              {snap.SkillShares.map((plan) => (
                <SkillShareCard key={plan.id} plan={plan} />
              ))}
            </Row>
          </TabPane>

          <TabPane tab="🧑‍🤝‍🧑 Friends" key="4">
            <FriendsSection />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CenterSection;
