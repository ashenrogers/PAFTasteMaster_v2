import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const uploader = new UploadFileService();

// Theme colors from the first component
const themeColors = {
  primary: "#4CAF50", // Basil green for primary actions
  secondary: "#81C784", // Fresh green for secondary elements
  accent: "#FFEB3B", // Lemon yellow for highlights and accents
  background: "#F1F8E9", // Light mint background
  surface: "#FFFFFF", // White surface for content areas
  cardBg: "#FFFFFF", // White background for recipe cards
  textPrimary: "#212121", // Dark gray for primary text
  textSecondary: "#424242", // Medium gray for secondary text
  border: "#C8E6C9", // Light green border
  hover: "#388E3C", // Deeper green for hover states
  danger: "#D32F2F", // Red for warnings/errors
  success: "#2E7D32", // Dark green for success states
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)", // Green gradient
}

const CreateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleSubmit = async () => {
  setLoading(true);
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const values = await form.validateFields();
  
      const payload = {
        ...values,
        userId: snap.currentUser?.uid,
        mediaUrls: mediaFiles.map(({ url }) => url),
        mediaTypes: mediaFiles.map(({ type }) => type),
      };
  
      await SkillShareService.createSkillShare(payload);
  
      state.SkillShares = await SkillShareService.getAllSkillShares();
  
      // Reset the form and close the modal
      form.resetFields();
      setMediaFiles([]);
      state.createSkillShareOpened = false;
  
    } catch (error) {
      console.error('Failed to create Skill Share:', error);
    } finally {
      setLoading(false);
    }
  };
  
};


  // Use a custom file input instead of Ant's Upload component to avoid duplication issues
  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've selected ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      // Reset the file input
      e.target.value = null;
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 30);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMediaFile = (uid) => {
    setMediaFiles(prev => prev.filter(file => file.uid !== uid));
  };

  const renderMediaPreview = () => {
    return (
      <div style={{ marginBottom: 16 }}>
        <Text style={{ color: themeColors.textPrimary, fontWeight: 500, display: "block", marginBottom: 12 }}>
          Media Files ({mediaFiles.length}/3):
        </Text>
        <Row gutter={[16, 16]}>
          {mediaFiles.map(file => (
            <Col key={file.uid} span={8}>
              <div style={{ position: 'relative' }}>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(31, 216, 164, 0.15)"
                    }}
                  />
                ) : (
                  <video 
                    src={file.url} 
                    controls
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(31, 216, 164, 0.15)"
                    }}
                  />
                )}
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeMediaFile(file.uid)}
                  style={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 8,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // Custom drop zone instead of using Ant's Dragger
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadingMedia || mediaFiles.length >= 3) return;
    
    const files = Array.from(e.dataTransfer.files);
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've dropped ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        // Check if file is image or video
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`File "${file.name}" is not an image or video.`);
          return null;
        }
        
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
    }
  };

  // Animation styles for floating elements
  const floatingElements = {
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
            Share Your Culinary Skills
          </Title>
        </div>
      }
      open={snap.createSkillShareOpened}
      footer={null}
      onCancel={() => {
        state.createSkillShareOpened = false;
        form.resetFields();
        setMediaFiles([]);
      }}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "24px", 
        backgroundColor: themeColors.background,
        position: "relative",
        overflow: "hidden",
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
      style={{ 
        borderRadius: 16,
        overflow: "hidden" 
      }}
    >
      {/* Animated food elements background */}
      <div style={{
        ...floatingElements,
        top: '10%',
        left: '5%',
        transform: 'rotate(15deg)',
        fontSize: '60px'
      }}>
        🍳
      </div>
      <div style={{
        ...floatingElements,
        top: '60%',
        right: '8%',
        transform: 'rotate(-10deg)',
        fontSize: '48px',
        animationDelay: '2s'
      }}>
        🔪
      </div>
      <div style={{
        ...floatingElements,
        bottom: '15%',
        left: '12%',
        transform: 'rotate(25deg)',
        fontSize: '40px',
        animationDelay: '3.5s'
      }}>
        👨‍🍳
      </div>
      <div style={{
        ...floatingElements,
        top: '30%',
        right: '10%',
        transform: 'rotate(-5deg)',
        fontSize: '52px',
        animationDelay: '1.5s'
      }}>
        🍽️
      </div>
      <div style={{
        ...floatingElements,
        bottom: '10%',
        right: '20%',
        transform: 'rotate(10deg)',
        fontSize: '45px',
        animationDelay: '4s'
      }}>
        🥄
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
          name="mealDetails"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Share Your Expertise</span>}
          rules={[{ required: true, message: "Please tell us about your culinary skills" }]}
        >
          <Input.TextArea 
            placeholder="Share your culinary techniques, cooking tips, or special skills with the TASTEMASTER community..."
            rows={4}
            style={{ 
              borderRadius: 12, 
              border: `1px solid ${themeColors.border}`,
              backgroundColor: themeColors.cardBg,
              padding: "12px 16px",
              fontSize: "15px"
            }}
          />
        </Form.Item>
        
        {mediaFiles.length > 0 && renderMediaPreview()}
        
        {uploadingMedia && 
          <div style={{ 
            textAlign: "center", 
            margin: "16px 0", 
            padding: "12px", 
            backgroundColor: themeColors.surface, 
            borderRadius: 8,
            color: themeColors.secondary
          }}>
            <Text type="secondary">Preparing your media...</Text>
          </div>
        }
        
        <Form.Item
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Media Showcase (up to 3 photos or videos, videos max 30 sec)</span>}
          rules={[{ required: mediaFiles.length === 0, message: "Please upload at least one media file" }]}
        >
          <div 
            style={{ 
              border: `2px dashed ${themeColors.border}`, 
              borderRadius: 12, 
              padding: '24px', 
              textAlign: 'center',
              background: themeColors.surface,
              cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer',
              position: 'relative'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p><InboxOutlined style={{ fontSize: '48px', color: themeColors.primary }} /></p>
            <p style={{ margin: '8px 0', color: themeColors.textPrimary, fontWeight: 500 }}>
              Click or drag files to this area to upload
            </p>
            <p style={{ color: themeColors.textSecondary }}>
              {mediaFiles.length >= 3 ? 
                "Maximum number of files reached" : 
                `Select up to ${3 - mediaFiles.length} files at once. Supports images and videos.`}
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInputChange}
              disabled={mediaFiles.length >= 3 || uploadingMedia}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer'
              }}
            />
          </div>
        </Form.Item>
        
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={() => {
                state.createSkillShareOpened = false;
                form.resetFields();
                setMediaFiles([]);
              }}
              style={{
                borderRadius: 10,
                height: "40px",
                padding: "0 20px",
                marginRight: 12
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              disabled={mediaFiles.length === 0 || uploadingMedia}
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
              {loading ? "Sharing..." : "Share Skill"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSkillShareModal;