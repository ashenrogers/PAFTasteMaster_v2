import React, { useState } from "react";
import { Card, Button, Row, Col, Typography, Space, Divider, Tag, Tooltip, Progress } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import { 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined, 
  AimOutlined, 
  BookOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import MealPlanService from "../../Services/MealPlanService";

const { Title, Text, Paragraph } = Typography;

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


const MealPlanCard = ({ plan }) => {
  const snap = useSnapshot(state);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate progress percentage based on completed items or default value
  const progressPercentage = plan.completedItems ? 
    Math.round((plan.completedItems / plan.totalItems) * 100) : 25; // Example default
  
  const deletePlan = async () => {
    try {
      setDeleteLoading(true);
      await MealPlanService.deleteMealPlan(plan.id);
      state.MealPlans = await MealPlanService.getAllMealPlans();
    } catch (error) {
      console.error("Failed to delete Meal Plan:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleActionClick = (action) => {
    // Handle the specific action (meal, workout, completion)
    console.log(`Selected action: ${action}`);
    // Implement your action logic here
  };

  const getStatusWithActions = () => {
    let statusTag;
    if (progressPercentage === 100) {
      statusTag = <Tag color={themeColors.success}>Completed</Tag>;
    } else if (progressPercentage >= 70) {
      statusTag = <Tag color="#fa8c16">Almost Done</Tag>;
    } else if (progressPercentage >= 30) {
      statusTag = <Tag color={themeColors.primary}>In Progress</Tag>;
    } else {
    }

    return (
      <Space>
        
   
        
        <Space size={4}>
          <Button 
            type="text" 
            size="small" 
            icon={<BookOutlined />} 
            onClick={() => handleActionClick('meal')}
            style={{ 
              padding: "0 6px", 
              color: themeColors.primary,
              borderRadius: 4,
              fontSize: "12px"
            }}
          >
            Meal
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<TrophyOutlined />} 
            onClick={() => handleActionClick('workout')}
            style={{ 
              padding: "0 6px", 
              color: themeColors.primary,
              borderRadius: 4,
              fontSize: "12px"
            }}
          >
            Workout
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<CheckCircleOutlined />} 
            onClick={() => handleActionClick('completion')}
            style={{ 
              padding: "0 6px", 
              color: themeColors.success,
              borderRadius: 4,
              fontSize: "12px"
            }}
          >
            Complete
          </Button>
        </Space>
      </Space>
    );
  };

  return (
    <Card
      style={{
        width: "100%",
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isHovered 
          ? "0 8px 16px rgba(32, 201, 151, 0.15)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        border: `1px solid ${isHovered ? themeColors.secondary : themeColors.border}`,
        background: themeColors.cardBg
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      bodyStyle={{ padding: 0 }}
    >
      {/* Modern Top Bar Design */}
      <div style={{
        position: "relative",
        padding: "20px",
        backgroundColor: themeColors.cardBg,
        overflow: "hidden"
      }}>
        {/* Left side accent */}
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          background: themeColors.primary
        }} />
        
        {/* Top ribbon */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "100px",
          height: "4px",
          background: themeColors.accent
        }} />
        
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={2}>
              <Title level={4} style={{ 
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                color: themeColors.textPrimary,
                paddingLeft: "12px"
              }}>
                {plan.planName}
              </Title>
              
              <div style={{ paddingLeft: "12px" }}>
                {getStatusWithActions()}
              </div>
            </Space>
          </Col>
          
          <Col>
            <Space direction="vertical" size={2} align="end">
              <Text style={{ fontSize: 14 }}>
                <span style={{ color: themeColors.textSecondary }}>Progress: </span>
                <span style={{ color: themeColors.primary, fontWeight: 600 }}>{progressPercentage}%</span>
              </Text>
              
              <Tooltip title="Last Updated">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {plan.lastUpdated || "2 days ago"}
                </Text>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </div>
      
      {/* Progress indicator */}
      <div style={{ height: "6px", background: "#f0f0f0" }}>
        <div 
          style={{ 
            height: "100%", 
            width: `${progressPercentage}%`, 
            background: themeColors.primary,
            transition: "width 0.5s ease-in-out"
          }} 
        />
      </div>

      {/* Main Content Section */}
      <div style={{ padding: "16px 20px", background: themeColors.background }}>
        <Row gutter={[16, 20]}>
          {/* Description Section */}
          <Col span={24}>
            <div style={{ 
              background: themeColors.cardBg, 
              padding: "12px 16px", 
              borderRadius: 8,
              borderLeft: `3px solid ${themeColors.secondary}`
            }}>
              <Text strong style={{ 
                fontSize: 14, 
                color: themeColors.primary,
                display: "block",
                marginBottom: 8
              }}>
                <InfoCircleOutlined style={{ marginRight: 6 }} />
                Description
              </Text>
              <Paragraph 
                style={{ 
                  fontSize: 13,
                  color: themeColors.textPrimary,
                  lineHeight: "1.5",
                  marginBottom: 0
                }}
              >
                {plan.description}
              </Paragraph>
            </div>
          </Col>
          
          {/* Meal Details Section */}
          <Col xs={24} md={12}>
            <div style={{ 
              background: themeColors.cardBg, 
              padding: "12px 16px", 
              borderRadius: 8,
              height: "100%",
              borderLeft: `3px solid ${themeColors.primary}`
            }}>
              <Text strong style={{ 
                fontSize: 14, 
                color: themeColors.primary,
                display: "block",
                marginBottom: 8
              }}>
                <BookOutlined style={{ marginRight: 6 }} />
                Meal Details
              </Text>
              <Paragraph 
                style={{ 
                  fontSize: 13,
                  color: themeColors.textPrimary,
                  lineHeight: "1.5",
                  marginBottom: 0
                }}
              >
                {plan.goal || "Your meal details and nutrition information will appear here."}
              </Paragraph>
            </div>
          </Col>
          
          {/* Workout Schedule Section */}
          <Col xs={24} md={12}>
            <div style={{ 
              background: themeColors.cardBg, 
              padding: "12px 16px", 
              borderRadius: 8,
              height: "100%",
              borderLeft: `3px solid ${themeColors.accent}`
            }}>
              <Text strong style={{ 
                fontSize: 14, 
                color: themeColors.primary,
                display: "block",
                marginBottom: 8
              }}>
                <AimOutlined style={{ marginRight: 6 }} />
                Workout Schedule
              </Text>
              <Row gutter={[8, 8]}>
                {(plan.routines ? plan.routines.split(',') : []).map((workout, index) => (
                  <Col key={index}>
                    <Tag 
                      color={
                        index % 3 === 0 ? themeColors.primary : 
                        index % 3 === 1 ? themeColors.secondary : 
                        themeColors.accent
                      } 
                      style={{ 
                        borderRadius: 4, 
                        padding: "3px 10px", 
                        fontSize: 12,
                        border: "none"
                      }}
                    >
                      {workout.trim()}
                    </Tag>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
          
          {/* Actions Section */}
          <Col span={24}>
            <Divider style={{ margin: "4px 0 12px 0", borderColor: themeColors.border }} />
            
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    icon={<ShareAltOutlined />}
                    style={{ 
                      borderRadius: 6
                    }}
                    onClick={() => {
                      // Share functionality
                    }}
                  >
                    Share Plan
                  </Button>
                </Space>
              </Col>
              
              {snap.currentUser?.uid === plan.userId && (
                <Col>
                  <Space>
                    <Tooltip title="Edit">
                      <Button
                        onClick={() => {
                          state.selectedMealPlan = plan;
                          state.editMealPlanOpened = true;
                        }}
                        type="primary"
                        icon={<EditOutlined />}
                        style={{ 
                          background: themeColors.primary, 
                          borderColor: themeColors.primary,
                          borderRadius: 6
                        }}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        onClick={() => deletePlan()}
                        loading={deleteLoading}
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        style={{ 
                          borderRadius: 6,
                          background: themeColors.danger,
                          borderColor: themeColors.danger
                        }}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  </Space>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default MealPlanCard;