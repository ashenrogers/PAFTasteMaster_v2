import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Space, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, FileImageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";

// Modern color scheme
const themeColors = {
  primary: "#4CAF50", // Basil green for primary actions
  secondary: "#81C784", // Fresh green for secondary elements
  accent: "#FFEB3B", // Lemon yellow for highlights and accents
  background: "#F1F8E9", // Light mint background
  surface: "#2E7D32", // Dark green surface for content areas
  cardBg: "#FFFFFF", // White background for recipe cards
  textPrimary: "#212121", // Dark gray for primary text
  textSecondary: "#424242", // Medium gray for secondary text
  border: "#C8E6C9", // Light green border
  hover: "#388E3C", // Deeper green for hover states
  danger: "#D32F2F", // Red for warnings/errors
  success: "#2E7D32", // Dark green for success states
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)", // Green gradient
}

const { Title, Text } = Typography;
const uploader = new UploadFileService();

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };
      await PostService.createPost(body);
      state.posts = await PostService.getPosts();
      message.success("Recipe shared successfully");
      state.createPostModalOpened = false;
      form.resetFields();
      setImage("");
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to share recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (info) => {
    if (info.file) {
      try {
        setImageUploading(true);
        const fileType = info.file.type.split("/")[0];
        setFileType(fileType);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
        form.setFieldsValue({ mediaLink: url });
        message.success(`${fileType} uploaded successfully`);
      } catch (error) {
        message.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setImageUploading(false);
      }
    } else if (info.file.status === "removed") {
      setImage("");
      form.setFieldsValue({ mediaLink: "" });
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    setImage("");
    state.createPostModalOpened = false;
  };

  const MediaPreview = () => {
    if (!image) return null;
    
    if (fileType === "image") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <img
            src={image}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: 12,
              boxShadow: "0 6px 16px rgba(31, 216, 164, 0.15)"
            }}
          />
        </div>
      );
    }
    
    if (fileType === "video") {
      return (
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <video
            controls
            src={image}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: 12,
              boxShadow: "0 6px 16px rgba(31, 216, 164, 0.15)"
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  // Animation styles for floating vegetables
  const floatingVegetables = {
    position: "absolute",
    zIndex: 0,
    opacity: 0.5,
    animation: "float 15s infinite ease-in-out",
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div 
            style={{ 
              width: 6, 
              height: 24, 
              backgroundColor: themeColors.primary, 
              borderRadius: 3, 
              marginRight: 12 
            }} 
          />
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Share Your Culinary Journey
          </Title>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      visible={state.createPostModalOpened}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "24px", 
        backgroundColor: themeColors.background,
        position: "relative",
        overflow: "hidden" 
      }}
      style={{ 
        borderRadius: 16,
        overflow: "hidden" 
      }}
    >
      {/* Animated vegetable background elements */}
      <div style={{
        ...floatingVegetables,
        top: '10%',
        left: '5%',
        transform: 'rotate(15deg)',
        fontSize: '60px'
      }}>
        🥕
      </div>
      <div style={{
        ...floatingVegetables,
        top: '60%',
        right: '8%',
        transform: 'rotate(-10deg)',
        fontSize: '48px',
        animationDelay: '2s'
      }}>
        🍅
      </div>
      <div style={{
        ...floatingVegetables,
        bottom: '15%',
        left: '12%',
        transform: 'rotate(25deg)',
        fontSize: '40px',
        animationDelay: '3.5s'
      }}>
        🥦
      </div>
      <div style={{
        ...floatingVegetables,
        top: '30%',
        right: '10%',
        transform: 'rotate(-5deg)',
        fontSize: '52px',
        animationDelay: '1.5s'
      }}>
        🌿
      </div>
      <div style={{
        ...floatingVegetables,
        bottom: '10%',
        right: '20%',
        transform: 'rotate(10deg)',
        fontSize: '45px',
        animationDelay: '4s'
      }}>
        🍄
      </div>

      {/* Style for the animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(10px, 15px) rotate(5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
        `}
      </style>

      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
        <Form.Item
          name="contentDescription"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>What's cooking today?</span>}
          rules={[
            { required: true, message: "Please share your culinary creation" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Share your recipe, cooking tips, or food adventure with the TASTEMASTER community..."
            style={{ 
              borderRadius: 12, 
              border: `1px solid ${themeColors.border}`,
              backgroundColor: themeColors.cardBg,
              padding: "12px 16px",
              fontSize: "15px"
            }}
          />
        </Form.Item>
        
        <Form.Item
          name="mediaLink"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Add Food Photography</span>}
          rules={[{ required: true, message: "Please upload an image or video of your delicious creation" }]}
        >
          <div style={{ 
            backgroundColor: themeColors.surface, 
            padding: "20px", 
            borderRadius: 12,
            border: `1px dashed ${themeColors.border}`,
            textAlign: "center"
          }}>
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button 
                icon={<UploadOutlined />}
                disabled={imageUploading}
                style={{
                  borderRadius: 10,
                  background: themeColors.gradient,
                  borderColor: "transparent",
                  color: "white",
                  height: "42px",
                  padding: "0 24px",
                  fontSize: "15px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(31, 216, 164, 0.25)"
                }}
              >
                {imageUploading ? "Uploading..." : "Upload Your Dish"}
              </Button>
            </Upload>
            <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
              Show off your culinary masterpiece, ingredients, or cooking process
            </Text>
          </div>
        </Form.Item>
        
        {imageUploading && (
          <div style={{ 
            textAlign: "center", 
            margin: "16px 0", 
            padding: "12px", 
            backgroundColor: themeColors.surface, 
            borderRadius: 8 
          }}>
            <Text type="secondary">Plating your masterpiece...</Text>
          </div>
        )}
        
        <MediaPreview />
        
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{
                borderRadius: 10,
                height: "40px",
                padding: "0 20px"
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={imageUploading || !image}
              style={{
                background: themeColors.gradient,
                borderColor: "transparent",
                borderRadius: 10,
                height: "40px",
                padding: "0 24px",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(31, 216, 164, 0.25)"
              }}
            >
              {loading ? "Sharing..." : "Share Recipe"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;