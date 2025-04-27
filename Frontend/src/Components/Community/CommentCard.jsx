// Importing necessary hooks and components
import React, { useEffect, useState } from "react";
import { List, Avatar, Button, Space } from "antd"; // Added Button and Space from Ant Design
import axios from "axios";

// Importing services and constants
import UserService from "../../Services/UserService";
import { BASE_URL } from "../../constants";

// Importing state management
import state from "../../Utils/Store";

// Defining the CommentCard component
const CommentCard = ({ comment }) => {
  // Local state to store user data
  const [userData, setUserData] = useState();

  // Function to fetch user data
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

  // Fetch user data on mount or when comment id changes
  useEffect(() => {
    fetchUserData();
  }, [comment.id]);

  // If user data is not loaded yet, return nothing
  if (!userData) {
    return null;
  }

  // Handler functions for button actions
  const handleLike = () => {
    console.log("Liked comment:", comment.id);
    // You can add like logic here
  };

  const handleReply = () => {
    console.log("Reply to comment:", comment.id);
    // You can add reply logic here (like opening a reply box)
  };

  // Render the comment card
  return (
    <List.Item key={comment.id}>
      {/* Main container for the comment */}
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Changed to column to have text and buttons vertically
          width: "100%",
          marginBottom: 8,
          gap: 8,
        }}
      >
        {/* User Info and Comment */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
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

        {/* Buttons for actions */}
        <Space>
          <Button type="primary" size="small" onClick={handleLike}>
            Like
          </Button>
          <Button type="default" size="small" onClick={handleReply}>
            Reply
          </Button>
        </Space>
      </div>
    </List.Item>
  );
};

// Exporting the component
export default CommentCard;
