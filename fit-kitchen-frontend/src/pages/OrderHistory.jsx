import { Calendar, ChevronLeft, ChevronRight, FileText, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ordersPerPage = 5;

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get('/api/meal-plan/history', {
                params: {
                    limit: ordersPerPage,
                    offset: (page - 1) * ordersPerPage
                }
            });

            if (response.success) {
                setOrders(response.data);
                const total = response.total || response.data.length;
                const calculatedTotalPages = Math.max(1, Math.ceil(total / ordersPerPage));
                setTotalPages(calculatedTotalPages);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load order history');
            toast.error('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            case 'active':
                return 'status-active';
            default:
                return '';
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await api.put(`/api/meal-plan/${orderId}/status`, { 
                status: newStatus
            });
    
            if (response.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
                toast.success(`Order successfully marked as ${newStatus}`);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const renderPagination = () => {
        return (
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <FileText size={48} />
                <p>{error}</p>
                <button onClick={() => fetchOrders(currentPage)}>
                    Try Again
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="empty-container">
                <ShoppingBag size={48} />
                <p>No orders found</p>
            </div>
        );
    }

    return (
        <div className="order-history-container">
            <div className="order-history-header">
                <h1 className="order-history-title">Order History</h1>
                <p className="order-history-subtitle">
                    View and track your past meal plan orders
                </p>
            </div>

            <div className="order-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <div className="order-card-title-row">
                                <div>
                                    <h3 className="order-type">
                                        {order.plan_type.replace('_', ' ').charAt(0).toUpperCase() + 
                                        order.plan_type.slice(1)} Plan
                                    </h3>
                                    <div className="order-meta">
                                        <span className="order-date">
                                            <Calendar size={16} />
                                            {formatDate(order.created_at)}
                                        </span>
                                        <span className={`order-status ${getStatusClass(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        {order.status === 'active' && (
                                            <div className="order-actions">
                                                <button 
                                                    className="complete-button"
                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                >
                                                    Mark as Complete
                                                </button>
                                                <button 
                                                    className="cancel-button"
                                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="order-calories">
                                    <p className="calories-label">Total Calories</p>
                                    <p className="calories-value">
                                        {order.nutrition_summary.planned.calories} kcal
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="order-content">
                            <h4 className="menu-section-title">Selected Menus</h4>
                            <div className="menu-grid">
                                {order.menus.map((menu) => (
                                    <div key={menu.id} className="menu-item">
                                        {menu.image_url ? (
                                            <img
                                                src={menu.image_url}
                                                alt={menu.name}
                                                className="order-menu-image"
                                            />
                                        ) : (
                                            <div className="order-menu-image">
                                                <ShoppingBag size={24} />
                                            </div>
                                        )}
                                        <div className="menu-details">
                                            <h5 className="menu-name">{menu.name}</h5>
                                            <div className="menu-meta">
                                                <span>{menu.calories_per_serving} kcal</span>
                                                <span>{menu.protein_per_serving}g protein</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="nutrition-grid">
                                <div className="nutrition-item">
                                    <label>Protein:</label>
                                    <p className="value">
                                        {order.nutrition_summary.planned.protein}g
                                    </p>
                                </div>
                                <div className="nutrition-item">
                                    <label>Carbs:</label>
                                    <p className="value">
                                        {order.nutrition_summary.planned.carbs}g
                                    </p>
                                </div>
                                <div className="nutrition-item">
                                    <label>Fats:</label>
                                    <p className="value">
                                        {order.nutrition_summary.planned.fats}g
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            {renderPagination()}
        </div>
    );
};

export default OrderHistory;