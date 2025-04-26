// MealPlanService.js

import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

class MealPlanService {
  async getAllMealPlans() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/MealPlans`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch Learning Progresss");
    }
  }

  async getMealPlanById(id) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/MealPlans/${id}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch Learning Progress");
    }
  }

  async CreateMealPlanModal(MealPlanData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post(
        `${BASE_URL}/MealPlans`,
        MealPlanData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create Learning Progress");
    }
  }

  async updateMealPlan(id, MealPlanData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.put(
        `${BASE_URL}/MealPlans/${id}`,
        MealPlanData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update Learning Progress");
    }
  }

  async deleteMealPlan(id) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${BASE_URL}/MealPlans/${id}`, config);
    } catch (error) {
      throw new Error("Failed to delete Learning Progress");
    }
  }
}

export default new MealPlanService();
