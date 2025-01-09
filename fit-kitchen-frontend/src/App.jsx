import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthCallback from './component/AuthCallback.jsx';
import Layout from './component/Layout.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import About from './pages/About.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import EditProfile from './pages/EditProfile.jsx';
import HealthAssessment from './pages/HealthAssessment.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MealPlan from './pages/MealPlan.jsx';
import MenuSelection from './pages/MenuSelection.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return children;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (currentUser) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            theme: {
                                primary: '#4CAF50',
                                secondary: '#FFF',
                            },
                        },
                        error: {
                            duration: 4000,
                            theme: {
                                primary: '#F44336',
                                secondary: '#FFF',
                            },
                        },
                    }}
                />
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Home />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/health-assessment"
                        element={
                            <ProtectedRoute>
                                <HealthAssessment />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Profile />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile/edit"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <EditProfile />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile/change-password"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ChangePassword />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/meal-plan"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <MealPlan />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/menu-selection/:plan_type"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <MenuSelection />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/order-history"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <OrderHistory />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Oauth Callback Routes */}
                    <Route
                        path="/auth/callback"
                        element={
                            <AuthCallback />
                        }
                    />

                    {/* Mixed Routes */}
                    <Route
                        path="/about"
                        element={
                            <Layout>
                                <About />
                            </Layout>
                        }
                    />
                    <Route path="/coming-soon" element={<ComingSoon />} />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;