import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import axios from "axios";
import UserService from "../../Services/UserService";
import { BASE_URL } from "../../constants";
import state from "../../Utils/Store";

const CommentCard = ({ comment }) => {
  const [userData, setUserData] = useState();

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const result = await UserService.getProfileById(comment.userId);
      const result2 = await axios.get(`${BASE_URL}/users/${result.userId}`, config);

      setUserData({ ...result2.data, ...result });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [comment.id]);

  if (!userData) {
    return null;
  }

  return (
    <List.Item key={comment.id}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
          gap: 16,
          width: "100%",
        }}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={userData.image}
              onClick={() => {
                state.selectedUserProfile = userData;
                state.friendProfileModalOpened = true;
              }}
              style={{ cursor: "pointer" }}
            />
          }
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>{comment.commentText}</h4>
        </div>
      </div>
    </List.Item>
  );
};

export default CommentCard;
