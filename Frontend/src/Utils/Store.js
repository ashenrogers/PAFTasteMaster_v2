import { proxy } from "valtio";

const state = proxy({
  currentUser: null,
  profileModalOpend: false,
  createWorkoutStatusModalOpened: false,
  storyCards: [],
  workoutStoryOpen: false,
  selectedWorkoutStory: null,
  createPostModalOpened: false,
  posts: [],
  users: [],
  selectedPost: null,
  updatePostModalOpened: false,
  activeIndex: 0,
  CreateMealPlanModalOpened: false,
  MealPlans: [],
  editMealPlanOpened: false,
  selectedMealPlan: null,
  SkillShares: [],
  createSkillShareOpened: false,
  updateSkillShareOpened: false,
  seletedSkillShareToUpdate: null,
  selectedUserProfile: null,
  friendProfileModalOpened: false,
});

export default state;
