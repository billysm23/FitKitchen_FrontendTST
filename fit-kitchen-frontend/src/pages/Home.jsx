import { Activity, ChefHat, ClipboardList, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Welcome to FitKitchen! 👋
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your personalized catering system
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {currentUser ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Account Information
              </h3>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {currentUser.username}
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {currentUser.email}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Getting Started
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-1 lg:grid-cols-4">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Complete Your Profile</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your health information and dietary preferences to get personalized recommendations.
                  </p>
                  <Link
                    to="/profile"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Profile
                  </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Health Assessment</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete your health assessment to receive tailored meal plans.
                  </p>
                  <Link
                    to="/assessment"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Start Assessment
                  </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Browse Menu</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Explore our curated selection of healthy and delicious meals.
                  </p>
                  <Link
                    to="/menu"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-purple-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    View Menu
                  </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mb-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Order History</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    View your past orders and reorder your favorite meals.
                  </p>
                  <Link
                    to="/orders"
                    className="mt-4 inline-flex items-center rounded-md border border-transparent bg-orange-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Quick Stats
              </h3>
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">Active Meal Plan</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">Standard Plan</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">Next Delivery</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">Tomorrow, 10 AM</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">Dietary Goals</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">2 of 3 Complete</dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              Get Started with FitKitchen
            </h3>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              Join FitKitchen today to receive personalized meal plans tailored to your health goals and dietary preferences.
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up now
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Link>
            </div>
            
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4 mx-auto">
                  <Activity className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Personalized Plans</h4>
                <p className="text-gray-500">
                  Get meal plans customized to your health goals and dietary requirements.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4 mx-auto">
                  <ChefHat className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Expert Chefs</h4>
                <p className="text-gray-500">
                  Enjoy meals prepared by professional chefs using fresh, quality ingredients.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4 mx-auto">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Convenient Delivery</h4>
                <p className="text-gray-500">
                  Regular delivery of fresh, healthy meals right to your doorstep.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}