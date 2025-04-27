import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import MealPlanService from "../../Services/MealPlanService";
import { EditOutlined, CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";

// Modern color scheme - matching the recipe post modal
const themeColors = {
  primary: "#4CAF50", // Basil green for primary actions
  secondary: "#81C784", // Fresh green for secondary elements
  accent: "#FFEB3B", // Lemon yellow for highlights and accents
  background: "#F1F8E9", // Light mint background
  surface: "#FFFFFF", // White surface for content areas
  cardBg: "#FFFFFF", // White background for cards
  textPrimary: "#212121", // Dark gray for primary text
  textSecondary: "#424242", // Medium gray for secondary text
  border: "#C8E6C9", // Light green border
  hover: "#388E3C", // Deeper green for hover states
  danger: "#D32F2F", // Red for warnings/errors
  success: "#2E7D32", // Dark green for success states
  gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)", // Green gradient
}

const { Title, Text } = Typography;

const CreateMealPlanModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Meal Plan data object
      const mealPlanData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await MealPlanService.createMealPlan(mealPlanData);
      state.MealPlans = await MealPlanService.getAllMealPlans();
      
      message.success("Meal plan created successfully!");
      form.resetFields();
      state.CreateMealPlanModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to create meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    state.CreateMealPlanModalOpened = false;
  };

  // Animation styles for floating food elements
  const floatingElements = {
    position: "absolute",
    zIndex: 0,
    opacity: 0.5,
    animation: "float 15s infinite ease-in-out",
  };

  // Section heading style
  const sectionHeadingStyle = {
    display: "flex", 
    alignItems: "center", 
    marginBottom: 12,
    marginTop: 24
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
            Create Nutrition Plan
          </Title>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      open={snap.CreateMealPlanModalOpened}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{ 
        padding: "24px", 
        backgroundColor: themeColors.background,
        position: "relative",
        overflow: "hidden",
        maxHeight: '70vh',
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
        🥗
      </div>
      <div style={{
        ...floatingElements,
        top: '60%',
        right: '8%',
        transform: 'rotate(-10deg)',
        fontSize: '48px',
        animationDelay: '2s'
      }}>
        🍎
      </div>
      <div style={{
        ...floatingElements,
        bottom: '15%',
        left: '12%',
        transform: 'rotate(25deg)',
        fontSize: '40px',
        animationDelay: '3.5s'
      }}>
        🥑
      </div>
      <div style={{
        ...floatingElements,
        top: '30%',
        right: '10%',
        transform: 'rotate(-5deg)',
        fontSize: '52px',
        animationDelay: '1.5s'
      }}>
        🍇
      </div>
      <div style={{
        ...floatingElements,
        bottom: '10%',
        right: '20%',
        transform: 'rotate(10deg)',
        fontSize: '45px',
        animationDelay: '4s'
      }}>
        🥩
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
        {/* Plan Details Section */}
        <div style={sectionHeadingStyle}>
          <EditOutlined style={{ fontSize: 18, marginRight: 8, color: themeColors.primary }} />
          <Title level={5} style={{ margin: 0, color: themeColors.primary }}>
            Plan Details
          </Title>
        </div>
        
        <Form.Item
          name="planName"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Plan Name</span>}
          rules={[{ required: true, message: "Please add a plan name" }]}
        >
          <Input 
  placeholder="E.g., Muscle Building Plan, Weight Loss Nutrition" 
  style={{ 
    borderRadius: 16, // Increased border radius for a more modern, rounded look
    border: `1px solid ${themeColors.primary}`, // Updated to primary theme color for consistency
    backgroundColor: themeColors.surface, // Lighter background color for subtle contrast
    padding: "12px 18px", // Increased padding for better input area space
    fontSize: "14px", // Slightly reduced font size for a more compact appearance
    color: themeColors.textPrimary, // Ensure the text color matches your theme's primary text color
    transition: "all 0.3s ease", // Smooth transition for focus or hover states
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow effect for a bit of depth
  }}
/>

        </Form.Item>
        
        <Form.Item
          name="description"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Description</span>}
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea 
  placeholder="Describe your nutrition goals, dietary preferences, and any restrictions" 
  rows={4} // Increased the row count for a bit more space
  style={{ 
    borderRadius: 16, // Increased border radius for a smoother, more modern feel
    border: `1px solid ${themeColors.primary}`, // Changed border color to primary theme color
    backgroundColor: themeColors.surface, // Lighter background color for subtle contrast
    padding: "12px 18px", // Increased padding for better input area space
    fontSize: "14px", // Slightly reduced font size for a more compact look
    color: themeColors.textPrimary, // Ensure the text color matches the primary theme
    transition: "all 0.3s ease", // Smooth transition for focus state
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow effect for added depth
  }}
/>
        </Form.Item>

        {/* Nutrition Information Section */}
        <div style={sectionHeadingStyle}>
          <InfoCircleOutlined style={{ fontSize: 18, marginRight: 8, color: themeColors.primary }} />
          <Title level={5} style={{ margin: 0, color: themeColors.primary }}>
            Nutrition Information
          </Title>
        </div>
        
        <Form.Item
          name="goal"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Meal Details</span>}
          rules={[{ required: true, message: "Please enter meal details" }]}
        >
          <Input.TextArea 
            placeholder="List your daily macros, meal timing, calorie targets, and specific foods to include" 
            style={{ 
              borderRadius: 12, 
              border: `1px solid ${themeColors.border}`,
              backgroundColor: themeColors.cardBg,
              padding: "10px 16px",
              fontSize: "15px"
            }}
            rows={3}
          />
        </Form.Item>

        {/* Workout Schedule Section */}
        <div style={sectionHeadingStyle}>
          <CalendarOutlined style={{ fontSize: 18, marginRight: 8, color: themeColors.primary }} />
          <Title level={5} style={{ margin: 0, color: themeColors.primary }}>
            Workout Schedule
          </Title>
        </div>
        
        <Form.Item
          name="routines"
          label={<span style={{ color: themeColors.textPrimary, fontWeight: 500 }}>Weekly Routine</span>}
          rules={[{ required: true, message: "Please enter workout schedule" }]}
        >
          <Input.TextArea 
            placeholder="E.g., Monday: HIIT & Protein-rich meals, Wednesday: Strength & Complex carbs, Friday: Yoga & Recovery nutrition" 
            rows={3}
            style={{ 
              borderRadius: 12, 
              border: `1px solid ${themeColors.border}`,
              backgroundColor: themeColors.cardBg,
              padding: "10px 16px",
              fontSize: "15px"
            }}
          />
        </Form.Item>
        
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
              {loading ? "Creating..." : "Create Nutrition Plan"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMealPlanModal;