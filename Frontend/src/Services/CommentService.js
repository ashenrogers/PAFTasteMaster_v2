import axios from "axios";
import { BASE_URL } from "../constants";
import NotificationService from "./NotificationService";

class CommentService {
  // Helper function to retrieve the access token
  getAuthConfig() {
    const accessToken = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  // Handle errors in a consistent manner
  handleError(error, customMessage) {
    console.error(customMessage, error); // log error for debugging
    throw new Error(customMessage);
  }

  // Create a comment and send a notification
  async createComment(commentData, username, userId) {
    try {
      const config = this.getAuthConfig();
      const response = await axios.post(`${BASE_URL}/comments`, commentData, config);

      if (response.status === 200) {
        try {
          const body = {
            userId: userId,
            message: "You have a new comment",
            description: `Your post was commented on by ${username}`,
          };

          // Send notification after successful comment creation
          await NotificationService.createNotification(body);
        } catch (notificationError) {
          this.handleError(notificationError, "Failed to create notification");
        }
      }

      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to create comment");
    }
  }

  // Get comments by post ID
  async getCommentsByPostId(postId) {
    try {
      const config = this.getAuthConfig();
      const response = await axios.get(`${BASE_URL}/comments/post/${postId}`, config);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to get comments by post ID");
    }
  }

  // Update an existing comment
  async updateComment(commentId, commentData) {
    try {
      const config = this.getAuthConfig();
      const response = await axios.put(`${BASE_URL}/comments/${commentId}`, commentData, config);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to update comment");
    }
  }

  // Delete a comment
  async deleteComment(commentId) {
    try {
      const config = this.getAuthConfig();
      await axios.delete(`${BASE_URL}/comments/${commentId}`, config);
    } catch (error) {
      this.handleError(error, "Failed to delete comment");
    }
  }
}

export default new CommentService();
