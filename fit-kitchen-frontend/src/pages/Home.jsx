import { Activity, ChefHat, ClipboardList, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

export default function Home() {
  const { currentUser } = useAuth();

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
                <h4 className="feature-title">Complete Your Profile</h4>
                <p className="feature-description">
                  Add your health information and dietary preferences.
                </p>
                <Link to="/profile" className="feature-button button-blue">
                  Update Profile
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
                <Link to="/assessment" className="feature-button button-green">
                  Start Assessment
                </Link>
              </div>

              <div className="feature-card">
                <div className="icon-wrapper icon-purple">
                  <ChefHat />
                </div>
                <h4 className="feature-title">Browse Menu</h4>
                <p className="feature-description">
                  Explore our curated selection of healthy and delicious meals.
                </p>
                <Link to="/menu" className="feature-button button-purple">
                  View Menu
                </Link>
              </div>

              <div className="feature-card">
                <div className="icon-wrapper icon-orange">
                  <ShoppingBag />
                </div>
                <h4 className="feature-title">Order History</h4>
                <p className="feature-description">
                  View your past orders and reorder your favorite meals.
                </p>
                <Link to="/orders" className="feature-button button-orange">
                  View Orders
                </Link>
              </div>
            </div>
          </div>

          <div className="quick-stats">
            <h3 className="section-title">Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Active Meal Plan</div>
                <div className="stat-value">Standard Plan</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Next Delivery</div>
                <div className="stat-value">Tomorrow, 10 AM</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Dietary Goals</div>
                <div className="stat-value">2 of 3 Complete</div>
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
            <Link to="/register" className="feature-button button-blue">
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