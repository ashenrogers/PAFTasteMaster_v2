package com.example.pafbackend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String commentText;
    private Date timestamp;

    public Comment() {}

    public Comment(String id, String postId, String userId, String commentText, Date timestamp) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.commentText = commentText;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Formats the timestamp to a human-readable string.
     */
    public String getFormattedTimestamp() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(timestamp);
    }

    /**
     * Converts the Comment object to a string representation.
     */
    @Override
    public String toString() {
        return "Comment{" +
                "id='" + id + '\'' +
                ", postId='" + postId + '\'' +
                ", userId='" + userId + '\'' +
                ", commentText='" + commentText + '\'' +
                ", timestamp=" + getFormattedTimestamp() +
                '}';
    }

    /**
     * Compares this Comment object to another object.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Comment comment = (Comment) o;
        return Objects.equals(id, comment.id) &&
                Objects.equals(postId, comment.postId) &&
                Objects.equals(userId, comment.userId) &&
                Objects.equals(commentText, comment.commentText) &&
                Objects.equals(timestamp, comment.timestamp);
    }

    /**
     * Generates a hash code for the Comment object.
     */
    @Override
    public int hashCode() {
        return Objects.hash(id, postId, userId, commentText, timestamp);
    }

    // Additional method to check if a comment is recent (within the last 24 hours)
    public boolean isRecent() {
        long currentTime = System.currentTimeMillis();
        long timeDifference = currentTime - timestamp.getTime();
        long oneDayInMillis = 24 * 60 * 60 * 1000;
        return timeDifference <= oneDayInMillis;
    }
}
