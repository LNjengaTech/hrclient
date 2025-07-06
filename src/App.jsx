import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Components/Navbar.jsx';
import HomePage from './pages/Homepage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserAccount from './pages/UserAccount.jsx';
import ReviewForm from './pages/ReviewForm.jsx';
import HotelReviews from './pages/HotelReviews.jsx';

// Main App component
const App = () => {
    // State to manage user login status and user information
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // To distinguish admin for redirection
    const [currentPage, setCurrentPage] = useState('home'); // State for simple routing
    const [selectedHotelId, setSelectedHotelId] = useState(null); // State to store selected hotel ID

    const [hotels, setHotels] = useState([]); // Initialize as empty array, data will be fetched
    const [isLoading, setIsLoading] = useState(true); // Loading state for hotels
    const [error, setError] = useState(null); // Error state for hotels fetch

    // State for Toast Notifications
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'

    // Base URL for backend API - *** IMPORTANT: THIS MUST BE YOUR RENDER BACKEND URL ***
    const API_BASE_URL = 'https://hrbackend-6tqe.onrender.com'; // Confirmed Render Backend URL

    // Function to display a toast message
    const displayToast = useCallback((message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);

        // Automatically hide toast after 3 seconds
        const timer = setTimeout(() => {
            setShowToast(false);
            setToastMessage('');
            setToastType('success'); // Reset to default
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer if component unmounts or toast changes
    }, []);


    // Function to fetch hotels from backend (for HomePage)
    const fetchHotels = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/hotels`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setHotels(data);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Failed to fetch hotels:", err);
            setError(err.message);
            setHotels([]); // Ensure hotels is an empty array on error
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    // Effect to fetch hotels and check login status on component mount
    useEffect(() => {
        fetchHotels(); // Initial fetch of hotels for the homepage

        // Check login status from local storage
        const storedUser = localStorage.getItem('dummyUser');
        if (storedUser) {
            try {
                const parsedData = JSON.parse(storedUser);
                const { user } = parsedData; // Destructure 'user' from parsedData

                // Ensure 'user' is not null/undefined before accessing its properties
                if (user && user.username) {
                    setIsLoggedIn(true);
                    setUsername(user.username);
                    setIsAdmin(user.isAdmin || false); // Default to false if not explicitly set
                } else {
                    console.error("Stored user data is incomplete or malformed (missing user object or username).", parsedData);
                    localStorage.removeItem('dummyUser'); // Clear invalid data
                    setIsLoggedIn(false);
                    setUsername('');
                    setIsAdmin(false);
                }
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
                localStorage.removeItem('dummyUser'); // Clear invalid data
                setIsLoggedIn(false);
                setUsername('');
                setIsAdmin(false);
            }
        }
    }, [fetchHotels]);

    // Function to handle login success from AuthPage
    const handleLoginSuccess = (loginData) => {
        // loginData is expected to be { message: "...", token: "...", user: { id, username, email, isAdmin } }
        localStorage.setItem('dummyUser', JSON.stringify(loginData)); // Store the entire object

        if (loginData && loginData.user) {
            setIsLoggedIn(true);
            setUsername(loginData.user.username);
            setIsAdmin(loginData.user.isAdmin);
            setCurrentPage('home'); // Redirect to home after login
            console.log("User logged in (real backend auth).");
            displayToast('Logged in successfully!', 'success'); // Toast for login success
        } else {
            console.error("Login data from AuthPage is missing 'user' object:", loginData);
            displayToast("Login failed due to incomplete user data. Please try again.", 'error'); // Toast for login error
            setIsLoggedIn(false);
            setUsername('');
            setIsAdmin(false);
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('dummyUser');
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
        setCurrentPage('home'); // Redirect to home after logout
        console.log("User logged out.");
        displayToast('Logged out successfully!', 'success'); // Toast for logout
    };

    // Function to handle redirection for username click (e.g., to Admin Dashboard or User Account)
    const handleUserClick = () => {
        if (isAdmin) {
            setCurrentPage('admin-dashboard');
        } else {
            setCurrentPage('user-account');
        }
    };

    // Function to navigate to login/register page
    const handleLoginNavigate = () => {
        setCurrentPage('auth');
    };

    // Function to navigate back to home
    const handleGoBack = () => {
        setCurrentPage('home');
        setSelectedHotelId(null); // Clear selected hotel when going back to home
    };

    // Function to navigate to ReviewForm page
    const handleNavigateToReviewForm = (hotelId) => {
        const hotelToReview = hotels.find(h => h._id === hotelId);
        if (!hotelToReview) {
            displayToast('Error: Hotel not found for review. Please try again.', 'error'); // Toast for hotel not found
            console.error('Attempted to navigate to review form for non-existent hotelId:', hotelId);
            return;
        }

        if (!isLoggedIn) {
            displayToast('Please log in to write a review.', 'error'); // Toast for not logged in
            setCurrentPage('auth');
            return;
        }
        setSelectedHotelId(hotelId);
        setCurrentPage('review-form');
    };

    // Function to navigate to HotelReviews page
    const handleNavigateToHotelReviews = (hotelId) => {
        const hotelToViewReviews = hotels.find(h => h._id === hotelId);
        if (!hotelToViewReviews) {
            displayToast('Error: Hotel not found to view reviews. Please try again.', 'error'); // Toast for hotel not found
            console.error('Attempted to navigate to view reviews for non-existent hotelId:', hotelId);
            return;
        }
        setSelectedHotelId(hotelId);
        setCurrentPage('hotel-reviews');
    };

    // Function to handle review submission (sends to backend)
    const handleSubmitReview = async (reviewData) => {
        console.log("App.jsx: handleSubmitReview received reviewData:", reviewData); // Debug log

        const storedUser = localStorage.getItem('dummyUser');
        if (!storedUser) {
            console.error("App.jsx: No user data found for review submission.");
            displayToast("You must be logged in to submit a review.", 'error'); // Toast for not logged in
            return false;
        }
        const { token, user } = JSON.parse(storedUser);
        console.log("App.jsx: Parsed token for review submission:", token ? "Exists" : "Does NOT exist"); // Debug log
        console.log("App.jsx: Parsed user for review submission:", user); // Debug log

        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send JWT token
                },
                body: JSON.stringify(reviewData)
            });

            // Check if the response is JSON before parsing
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log("App.jsx: Review submission response data:", data); // Debug log

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to submit review');
                }

                console.log("Review submitted successfully:", data.review);
                displayToast("Review submitted successfully! Thank you for your feedback.", 'success'); // Toast for success
                setCurrentPage('home');
                return true;
            } else {
                const text = await response.text();
                console.error("App.jsx: Server did not return JSON. Response text:", text); // Debug log
                throw new Error(`Server did not return JSON. Response: ${text.substring(0, 100)}...`);
            }
        } catch (err) {
            console.error("App.jsx: Error submitting review:", err);
            displayToast(`Error submitting review: ${err.message}. Please try again.`, 'error'); // Toast for error
            return false;
        }
    };

    // Callback to trigger a refresh of hotels list in App.jsx (e.g., after admin adds/edits a hotel)
    const handleHotelsUpdated = () => {
        fetchHotels();
    };

    // Dummy search functionality
    const handleSearch = (term) => {
        console.log("Search term from Navbar:", term);
    };

    // Find the currently selected hotel object
    const currentHotel = selectedHotelId ? hotels.find(h => h._id === selectedHotelId) : null;

    // Render the current page based on currentPage state
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <HomePage
                        hotels={hotels}
                        onReviewClick={handleNavigateToReviewForm}
                        onViewReviewsClick={handleNavigateToHotelReviews}
                        isLoading={isLoading}
                        error={error}
                    />
                );
            case 'auth':
                return <AuthPage onLoginSuccess={handleLoginSuccess} onGoBack={handleGoBack} API_BASE_URL={API_BASE_URL} />;
            case 'admin-dashboard':
                return (
                    <AdminDashboard
                        username={username}
                        onLogout={handleLogout}
                        onGoBack={handleGoBack}
                        onHotelsUpdated={handleHotelsUpdated}
                        API_BASE_URL={API_BASE_URL} // Pass API_BASE_URL to AdminDashboard
                    />
                );
            case 'user-account':
                return <UserAccount username={username} onLogout={handleLogout} onGoBack={handleGoBack} />;
            case 'review-form':
                return <ReviewForm hotel={currentHotel} onGoBack={handleGoBack} onSubmitReview={handleSubmitReview} />;
            case 'hotel-reviews':
                return <HotelReviews hotel={currentHotel} onGoBack={handleGoBack} />;
            default:
                return (
                    <HomePage
                        hotels={hotels}
                        onReviewClick={handleNavigateToReviewForm}
                        onViewReviewsClick={handleNavigateToHotelReviews}
                        isLoading={isLoading}
                        error={error}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            {/* Tailwind CSS CDN script - IMPORTANT for styling */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Inter font for a modern look */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                /* Custom scrollbar for better aesthetics if content overflows */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                `}
            </style>

            <Navbar
                isLoggedIn={isLoggedIn}
                username={username}
                onLogin={handleLoginNavigate}
                onLogout={handleLogout}
                onUserClick={handleUserClick}
                onNavigateHome={() => setCurrentPage('home')}
                onSearch={handleSearch}
            />

            {renderPage()}

            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 transition-transform transform ${
                    toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                } translate-y-0 opacity-100`}>
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default App;
