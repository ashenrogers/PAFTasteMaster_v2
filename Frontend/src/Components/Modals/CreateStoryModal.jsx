import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Tooltip
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CalendarOutlined,
  EditOutlined,
  TagOutlined,
  ExperimentOutlined,
  BulbOutlined,
  PictureOutlined,
  BookOutlined,
  RocketOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

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
const uploader = new UploadFileService();
const { Option } = Select;
const { Text, Title } = Typography;

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "",
    timeDuration: 30,
    intensity: "",
    image: "",
    category: "Beginner"
  });

  // Duration markers for slider
  const durationMarks = {
    0: '0',
    30: '30',
    60: '60',
    90: '90',
    120: '120'
  };

  // Function to get intensity color based on value
  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case "No Efforts": return '#059669';
      case "Mid Efforts": return '#0284C7';
      case "Moderate Efforts": return '#9333EA';
      case "Severe Efforts": return '#F59E0B';
      case "Maximal Efforts": return '#DC2626';
      default: return themeColors.textSecondary;
    }
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            background: themeColors.gradient,
            width: 35,
            height: 35,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <BookOutlined style={{ color: 'white', fontSize: 16 }} />
          </div>
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Create a Learning Plan
          </Title>
        </div>
      }
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      width={800}
      bodyStyle={{ 
        padding: '20px', 
        backgroundColor: themeColors.background,
        borderRadius: '12px'
      }}
      footer={null}
      centered
    >
      <Form 
        form={form} 
        layout="vertical"
      >
        <Card 
          bordered={false} 
          style={{ 
            background: themeColors.cardBg,
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
            marginBottom: '20px'
          }}
        >

          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Form.Item 
                label={
                  <span style={{ display: 'flex', alignItems: 'center', color: themeColors.textPrimary }}>
                    <EditOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Plan Title
                  </span>
                } 
                name="title" 
                rules={[{ required: true, message: 'Please input a title' }]}
              >
                <Input
                  placeholder="Enter your learning plan title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ 
                    borderRadius: '8px', 
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.surface
                  }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={16}>
              <div style={{
                backgroundColor: themeColors.surface,
                borderRadius: '12px',
                padding: '20px',
                height: '100%'
              }}>
                <Title level={5} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: themeColors.primary, 
                  marginBottom: '20px'
                }}>
                  <TagOutlined style={{ marginRight: '8px' }} />
                  Plan Details
                </Title>

                <Form.Item 
                  label="Description" 
                  name="description"
                >
                  <Input.TextArea
                    placeholder="Add some details about this learning plan..."
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    style={{ 
                      borderRadius: '8px', 
                      borderColor: themeColors.border,
                      backgroundColor: 'white'
                    }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      label="Learning Type" 
                      name="exerciseType"
                    >
                      <Input
                        placeholder="e.g. Programming, Language"
                        name="exerciseType"
                        value={formData.exerciseType}
                        onChange={handleInputChange}
                        style={{ 
                          borderRadius: '8px', 
                          borderColor: themeColors.border,
                          backgroundColor: 'white'
                        }}
                        prefix={<TagOutlined style={{ color: themeColors.primary }} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label="Start Date" 
                      name="timestamp"
                    >
                      <DatePicker
                        placeholder="Select date"
                        style={{ 
                          width: "100%", 
                          borderRadius: '8px', 
                          borderColor: themeColors.border,
                          backgroundColor: 'white'
                        }}
                        value={formData.timestamp}
                        onChange={handleDateChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item 
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Study Duration</span>
                      <div style={{
                        background: formData.timeDuration > 60 ? '#FEF2F2' : formData.timeDuration > 30 ? '#FFFBEB' : '#ECFDF5',
                        borderRadius: '20px',
                        padding: '2px 12px',
                        border: `1px solid ${formData.timeDuration > 60 ? '#FCA5A5' : formData.timeDuration > 30 ? '#FCD34D' : '#A7F3D0'}`
                      }}>
                        <Text 
                          strong 
                          style={{ 
                            color: formData.timeDuration > 60 ? '#DC2626' : formData.timeDuration > 30 ? '#D97706' : '#059669',
                            fontSize: '13px'
                          }}
                        >
                          {formData.timeDuration} minutes
                        </Text>
                      </div>
                    </div>
                  }
                  name="timeDuration"
                >
                  <div style={{ 
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${themeColors.border}`,
                  }}>
                    <Slider
                      min={0}
                      max={120}
                      step={5}
                      value={formData.timeDuration}
                      marks={durationMarks}
                      tooltip={{ formatter: value => `${value} min` }}
                      trackStyle={{ backgroundColor: themeColors.primary }}
                      handleStyle={{ borderColor: themeColors.primary }}
                      onChange={(value) => {
                        setFormData({
                          ...formData,
                          timeDuration: value,
                        });
                      }}
                    />
                  </div>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      label="Category" 
                      name="category"
                    >
                      <Select
                        placeholder="Select category"
                        style={{ width: "100%" }}
                        value={formData.category}
                        onChange={handleCategoryChange}
                        dropdownStyle={{ borderRadius: '8px' }}
                      >
                        <Option value="Beginner">
                          <Tag color="green">Beginner</Tag>
                        </Option>
                        <Option value="Intermediate">
                          <Tag color="blue">Intermediate</Tag>
                        </Option>
                        <Option value="Advanced">
                          <Tag color="purple">Advanced</Tag>
                        </Option>
                        <Option value="Expert">
                          <Tag color="red">Expert</Tag>
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label="Difficulty Level" 
                      name="intensity"
                    >
                      <Select
                        placeholder="Select difficulty"
                        style={{ width: "100%" }}
                        value={formData.intensity}
                        onChange={handleIntensityChange}
                      >
                        {["No Efforts", "Mid Efforts", "Moderate Efforts", "Severe Efforts", "Maximal Efforts"].map((level) => (
                          <Option key={level} value={level}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>{level}</span>
                              <FireOutlined style={{ color: getIntensityColor(level) }} />
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={8}>
              <div style={{
                backgroundColor: themeColors.surface, 
                borderRadius: '12px',
                padding: '20px',
                height: '100%'
              }}>
                <Title level={5} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: themeColors.primary, 
                  marginBottom: '20px'
                }}>
                  <PictureOutlined style={{ marginRight: '8px' }} />
                  Plan Visual
                </Title>

                {uploadedImage ? (
                  <div style={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                    marginBottom: '16px',
                    position: 'relative'
                  }}>
                    <img
                      style={{ 
                        width: "100%", 
                        height: "200px",
                        objectFit: 'cover'
                      }}
                      src={uploadedImage}
                      alt="Learning Plan"
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '30px 16px 16px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Upload
                        accept="image/*"
                        onChange={handleFileChange}
                        showUploadList={false}
                        beforeUpload={() => false}
                      >
                        <Button 
                          icon={<UploadOutlined />} 
                          style={{ 
                            borderColor: 'white', 
                            color: 'green',
                            borderRadius: '8px'
                          }}
                        >
                          Change Image
                        </Button>
                      </Upload>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: '200px',
                    border: `2px dashed ${themeColors.border}`,
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white'
                  }}>
                    {imageUploading ? (
                      <Text>Uploading image...</Text>
                    ) : (
                      <Upload
                        accept="image/*"
                        onChange={handleFileChange}
                        showUploadList={false}
                        beforeUpload={() => false}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            background: themeColors.surface,
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                          }}>
                            <PictureOutlined style={{ color: themeColors.primary, fontSize: 24 }} />
                          </div>
                          <div>
                            <Text style={{ fontSize: '14px', color: themeColors.textSecondary }}>
                              Upload an image for your learning plan
                            </Text>
                          </div>
                          <Button
                            type="primary"
                            style={{
                              marginTop: '16px',
                              borderRadius: '8px',
                              background: themeColors.gradient,
                              border: 'none'
                            }}
                          >
                            Select Image
                          </Button>
                        </div>
                      </Upload>
                    )}
                  </div>
                )}
                
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}>
                  <Text style={{ color: themeColors.textSecondary, fontSize: '13px' }}>
                    Adding an image will help you visualize your learning journey and stay motivated throughout the process.
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '20px',
        }}>
          <Button 
            onClick={() => (state.createWorkoutStatusModalOpened = false)}
            style={{
              borderRadius: '8px',
              borderColor: themeColors.border,
              color: themeColors.textSecondary,
              height: '40px'
            }}
          >
            Cancel
          </Button>
          
          <Button
            loading={loading}
            type="primary"
            onClick={handleCreateWorkoutStory}
            style={{
              background: themeColors.gradient,
              borderColor: 'transparent',
              borderRadius: '8px',
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
              minWidth: '140px',
              height: '40px'
            }}
          >
            Create Learning Plan
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateStoryModal;