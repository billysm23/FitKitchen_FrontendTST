import { Activity, ChefHat, ClipboardList, Flame, ShoppingBag, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

export default function Home() {
  const { currentUser } = useAuth();
  const [healthProfile, setHealthProfile] = useState(null);
  const [activePlans, setActivePlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch health profile
        const profileResponse = await api.get('/api/profile');
        if (profileResponse.success) {
          setHealthProfile(profileResponse.data.healthAssessment);
        }

        // Fetch active meal plans
        const plansResponse = await api.get('/api/meal-plan/active');
        if (plansResponse.success) {
          setActivePlans(plansResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const calculateGoalProgress = () => {
    if (!healthProfile) return 0;

    const { health_goal, target_weight, weight } = healthProfile;
    
    // If no target weight is set, return 0
    if (!target_weight || !weight) return 0;

    // Calculate progress based on goal type
    switch (health_goal) {
      case 'weight_loss':
        const weightToLose = weight - target_weight;
        const currentLoss = weight - healthProfile.weight;
        return Math.round((currentLoss / weightToLose) * 100);
      
      case 'muscle_gain':
        const weightToGain = target_weight - weight;
        const currentGain = healthProfile.weight - weight;
        return Math.round((currentGain / weightToGain) * 100);
      
      default:
        return 0;
    }
  };

  const calculateRemainingDays = () => {
    if (!healthProfile?.target_weight) return 0;
    
    // Assuming a healthy rate of 0.5-1kg per week
    const weightDifference = Math.abs(healthProfile.weight - healthProfile.target_weight);
    const estimatedWeeks = weightDifference / 0.5;
    return Math.round(estimatedWeeks * 7);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2 className="home-title">Welcome to FitKitchen! 👋</h2>
        <p className="home-subtitle">Your personalized catering system</p>
      </div>

      {currentUser ? (
        <div className="account-section">
          <h3 className="section-title">Account Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Username</div>
              <div className="info-value">{currentUser.username}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Email</div>
              <div className="info-value">{currentUser.email}</div>
            </div>
          </div>

          <div className="getting-started">
            <h3 className="section-title">Getting Started</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="icon-wrapper icon-blue">
                  <ClipboardList />
                </div>
                <h4 className="feature-title">Your Profile</h4>
                <p className="feature-description">
                  View or change your credentials, health information, and dietary preferences.
                </p>
                <Link to="/profile" className="feature-button button-blue">
                  Go to Profile
                </Link>
              </div>

              <div className="feature-card">
                <div className="icon-wrapper icon-green">
                  <Activity />
                </div>
                <h4 className="feature-title">Health Assessment</h4>
                <p className="feature-description">
                  Complete your health assessment to receive tailored meal plans.
                </p>
                <Link to="/health-assessment" className="feature-button button-green">
                  Start Assessment
                </Link>
              </div>

              <div className="feature-card">
                <div className="icon-wrapper icon-purple">
                  <ChefHat />
                </div>
                <h4 className="feature-title">Select Meal Plan and Menus</h4>
                <p className="feature-description">
                  Explore our curated selection of healthy and delicious meals.
                </p>
                <Link to="/meal-plan" className="feature-button button-purple">
                  View Meal Plan
                </Link>
              </div>

              <div className="feature-card">
                <div className="icon-wrapper icon-orange">
                  <ShoppingBag />
                </div>
                <h4 className="feature-title">Order History</h4>
                <p className="feature-description">
                  View your present and past orders, you can reorder your favorite meals.
                </p>
                <Link to="/order-history" className="feature-button button-orange">
                  View Orders
                </Link>
              </div>
            </div>
          </div>
          
          <div className="quick-stats">
              <h3 className="section-title">Quick Stats</h3>
              <div className="stats-grid">
                  <div className="stat-card calories">
                      <div className="stat-label">
                          <Activity size={16} />
                          Daily Calories
                      </div>
                      <div className="stat-value">
                          {healthProfile?.metrics?.final_cal || 0} kcal
                      </div>
                      <div className="stat-meta">
                          <TrendingUp className="trend-icon trend-up" size={14} />
                          On track with your goal
                      </div>
                  </div>

                  <div className="stat-card streak">
                      <div className="stat-label">
                          <Flame size={16} />
                          Meal Plan Streak
                      </div>
                      <div className="stat-value">
                          {activePlans?.length || 0} days
                      </div>
                      <div className="stat-meta">
                          <TrendingUp className="trend-icon trend-up" size={14} />
                          Keep it up!
                      </div>
                  </div>

                  <div className="stat-card goals">
                      <div className="stat-label">
                          <Target size={16} />
                          Goal Progress
                      </div>
                      <div className="stat-value">
                          {calculateGoalProgress()}%
                      </div>
                      <div className="stat-meta">
                          {calculateRemainingDays} days to goal
                      </div>
                  </div>
              </div>
          </div>
        </div>
      ) : (
        <div className="welcome-section">
          <h3 className="section-title">Get Started with FitKitchen</h3>
          <p className="welcome-description">
            Join FitKitchen today to receive personalized meal plans tailored to your health goals.
          </p>
          <div className="auth-buttons">
            <Link to="/register" className="feature-button button-green">
              Sign up
            </Link>
            <Link to="/login" className="feature-button button-outline">
              Sign in
            </Link>
          </div>
          
          <div className="features-overview">
            <div className="feature-card">
              <div className="icon-wrapper icon-blue">
                <Activity />
              </div>
              <h4 className="feature-title">Personalized Plans</h4>
              <p className="feature-description">
                Get meal plans customized to your health goals.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="icon-wrapper icon-green">
                <ChefHat />
              </div>
              <h4 className="feature-title">Expert Chefs</h4>
              <p className="feature-description">
                Enjoy meals prepared by professional chefs.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="icon-wrapper icon-purple">
                <ShoppingBag />
              </div>
              <h4 className="feature-title">Convenient Delivery</h4>
              <p className="feature-description">
                Regular delivery of fresh, healthy meals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}