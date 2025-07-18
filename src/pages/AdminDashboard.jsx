import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // Import Recharts components

const AdminDashboard = ({ username, onLogout, onGoBack, onHotelsUpdated, API_BASE_URL }) => { // Added API_BASE_URL prop
    const [overallAnalytics, setOverallAnalytics] = useState(null);
    const [reviewsPerHotel, setReviewsPerHotel] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [hotels, setHotels] = useState([]); // State to manage hotels for admin view
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
    const [analyticsError, setAnalyticsError] = useState(null);

    // State for Hotel Management Modal/Form
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [currentHotel, setCurrentHotel] = useState(null); // Hotel being edited, null for adding new
    const [hotelForm, setHotelForm] = useState({
        name: '',
        location: '',
        description: '',
        imageUrl: ''
    });
    const [hotelMessage, setHotelMessage] = useState(''); // Message for hotel add/edit/delete operations
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for custom confirm modal
    const [hotelToDelete, setHotelToDelete] = useState(null); // State to store hotel ID for deletion

    // --- Helper to get the JWT token from localStorage ---
    const getToken = () => {
        const storedUser = localStorage.getItem('dummyUser');
        if (storedUser) {
            try {
                const parsedData = JSON.parse(storedUser);
                console.log("getToken: Parsed data from localStorage:", parsedData); // Log parsed data
                if (parsedData.token) {
                    console.log("getToken: Token found and returning.");
                    return parsedData.token;
                } else {
                    console.warn("getToken: 'token' property not found in localStorage data. Stored data:", parsedData);
                    return null;
                }
            } catch (e) {
                console.error("getToken: Failed to parse token from localStorage:", e);
                return null;
            }
        }
        console.log("getToken: No 'dummyUser' found in localStorage.");
        return null;
    };

    // --- Fetch Analytics and Hotels ---
    const fetchAdminData = useCallback(async () => {
        console.log("fetchAdminData: Starting fetch for admin data...");
        setIsLoadingAnalytics(true);
        setAnalyticsError(null);

        const token = getToken();
        console.log("fetchAdminData: Token retrieved:", token ? "Exists (length: " + token.length + ")" : "Does NOT exist"); // Log token presence and length

        if (!token) {
            setAnalyticsError('Authentication required. Please log in as an admin.');
            setIsLoadingAnalytics(false);
            console.error("fetchAdminData: No token found, stopping fetch.");
            return;
        }

        try {
            // Fetch Overall Analytics
            console.log(`fetchAdminData: Fetching overall analytics from ${API_BASE_URL}/api/analytics/overall`);
            const overallRes = await fetch(`${API_BASE_URL}/api/analytics/overall`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("fetchAdminData: Overall analytics response status:", overallRes.status);
            const overallData = await overallRes.json();
            if (!overallRes.ok) {
                console.error("fetchAdminData: Overall analytics fetch failed with data:", overallData);
                throw new Error(overallData.message || 'Failed to fetch overall analytics');
            }
            setOverallAnalytics(overallData);

            // Fetch Reviews Per Hotel
            console.log(`fetchAdminData: Fetching reviews per hotel from ${API_BASE_URL}/api/analytics/reviews-per-hotel`);
            const rphRes = await fetch(`${API_BASE_URL}/api/analytics/reviews-per-hotel`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("fetchAdminData: Reviews per hotel response status:", rphRes.status);
            const rphData = await rphRes.json();
            if (!rphRes.ok) {
                console.error("fetchAdminData: Reviews per hotel fetch failed with data:", rphData);
                throw new Error(rphData.message || 'Failed to fetch reviews per hotel');
            }
            setReviewsPerHotel(rphData);

            // Fetch Recent Reviews
            console.log(`fetchAdminData: Fetching recent reviews from ${API_BASE_URL}/api/analytics/recent-reviews`);
            const rrRes = await fetch(`${API_BASE_URL}/api/analytics/recent-reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("fetchAdminData: Recent reviews response status:", rrRes.status);
            const rrData = await rrRes.json();
            if (!rrRes.ok) {
                console.error("fetchAdminData: Recent reviews fetch failed with data:", rrData);
                throw new Error(rrData.message || 'Failed to fetch recent reviews');
            }
            setRecentReviews(rrData);

            // Fetch all hotels for management
            console.log(`fetchAdminData: Fetching hotels for management from ${API_BASE_URL}/api/hotels`);
            const hotelsRes = await fetch(`${API_BASE_URL}/api/hotels`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("fetchAdminData: Hotels for management response status:", hotelsRes.status);
            const hotelsData = await hotelsRes.json();
            if (!hotelsRes.ok) {
                console.error("fetchAdminData: Hotels for management fetch failed with data:", hotelsData);
                throw new Error(hotelsData.message || 'Failed to fetch hotels for management');
            }
            setHotels(hotelsData);


        } catch (err) {
            console.error('fetchAdminData: Error during fetch:', err);
            setAnalyticsError(`Failed to load analytics: ${err.message}. Please ensure your backend server is running and you have admin privileges.`);
            // If fetching fails due to auth, prompt logout
            if (err.message.includes('Authentication required') || err.message.includes('Invalid or expired token') || err.message.includes('Access denied')) {
                 alert("Your session has expired or you do not have admin privileges. Please log in again.");
                 onLogout(); // Force logout
            }
        } finally {
            setIsLoadingAnalytics(false);
            console.log("fetchAdminData: Fetch process completed.");
        }
    }, [API_BASE_URL, onLogout]); // Added API_BASE_URL to dependencies, removed onGoBack from here to prevent immediate redirect on error

    useEffect(() => {
        console.log("AdminDashboard useEffect: Calling fetchAdminData.");
        fetchAdminData();
    }, [fetchAdminData]);


    // --- Hotel Management Handlers (unchanged, but adding console logs for consistency) ---

    const openAddHotelModal = () => {
        console.log("openAddHotelModal: Opening add hotel modal.");
        setCurrentHotel(null);
        setHotelForm({ name: '', location: '', description: '', imageUrl: '' });
        setHotelMessage('');
        setIsHotelModalOpen(true);
    };

    const openEditHotelModal = (hotel) => {
        console.log("openEditHotelModal: Opening edit hotel modal for:", hotel.name);
        setCurrentHotel(hotel);
        setHotelForm({
            name: hotel.name,
            location: hotel.location,
            description: hotel.description || '',
            imageUrl: hotel.imageUrl || ''
        });
        setHotelMessage('');
        setIsHotelModalOpen(true);
    };

    const closeHotelModal = () => {
        console.log("closeHotelModal: Closing hotel modal.");
        setIsHotelModalOpen(false);
        setCurrentHotel(null);
        setHotelForm({ name: '', location: '', description: '', imageUrl: '' });
        setHotelMessage('');
    };

    const handleHotelFormChange = (e) => {
        const { name, value } = e.target;
        setHotelForm(prev => ({ ...prev, [name]: value }));
        console.log(`handleHotelFormChange: ${name} changed to ${value}`);
    };

    const handleSubmitHotel = async (e) => {
        e.preventDefault();
        setHotelMessage('');
        console.log("handleSubmitHotel: Submitting hotel form.");

        const token = getToken(); // Get token via helper function
        console.log("handleSubmitHotel: Token retrieved:", token ? "Exists" : "Does NOT exist");

        if (!token) {
            setHotelMessage('Authentication token missing. Please log in again.');
            console.error("handleSubmitHotel: No token found, stopping submission.");
            return;
        }

        try {
            let response;
            let method;
            let url;

            if (currentHotel) { // Editing existing hotel
                method = 'PUT';
                url = `${API_BASE_URL}/api/hotels/${currentHotel._id}`;
                console.log(`handleSubmitHotel: Editing hotel at ${url}`);
            } else { // Adding new hotel
                method = 'POST';
                url = `${API_BASE_URL}/api/hotels`;
                console.log(`handleSubmitHotel: Adding new hotel at ${url}`);
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(hotelForm)
            });

            const data = await response.json();
            console.log("handleSubmitHotel: Response status:", response.status, "Data:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to perform operation');
            }

            setHotelMessage(data.message);
            onHotelsUpdated(); // Notify App.jsx to refresh hotel list
            await fetchAdminData(); // Re-fetch all admin data including updated hotel list
            closeHotelModal();
            console.log("handleSubmitHotel: Hotel operation successful.");

        } catch (err) {
            console.error('handleSubmitHotel: Hotel operation error:', err);
            setHotelMessage(`Error: ${err.message}`);
            if (err.message.includes('Authentication required') || err.message.includes('Invalid or expired token') || err.message.includes('Access denied')) {
                 alert("Your session has expired or you do not have admin privileges. Please log in again.");
                 onLogout(); // Force logout
            }
        }
    };

    // Function to open the custom confirmation modal
    const confirmDeleteHotel = (hotelId) => {
        console.log("confirmDeleteHotel: Confirming deletion for hotel ID:", hotelId);
        setHotelToDelete(hotelId);
        setShowConfirmModal(true);
    };

    // Function to handle the actual deletion after confirmation
    const handleDeleteHotel = async () => {
        setShowConfirmModal(false); // Close the modal
        setHotelMessage('');
        console.log("handleDeleteHotel: Deleting hotel with ID:", hotelToDelete);
        const token = getToken(); // Get token via helper function
        console.log("handleDeleteHotel: Token retrieved:", token ? "Exists" : "Does NOT exist");

        if (!token) {
            setHotelMessage('Authentication token missing. Please log in again.');
            console.error("handleDeleteHotel: No token found, stopping deletion.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log("handleDeleteHotel: Response status:", response.status, "Data:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete hotel');
            }

            setHotelMessage(data.message);
            onHotelsUpdated(); // Notify App.jsx to refresh hotel list
            await fetchAdminData(); // Re-fetch all admin data

        } catch (err) {
            console.error('handleDeleteHotel: Hotel deletion error:', err);
            setHotelMessage(`Error: ${err.message}`);
            if (err.message.includes('Authentication required') || err.message.includes('Invalid or expired token') || err.message.includes('Access denied')) {
                 alert("Your session has expired or you do not have admin privileges. Please log in again.");
                 onLogout(); // Force logout
            }
        } finally {
            setHotelToDelete(null); // Clear the hotel to delete state
        }
    };


    // --- Render Logic ---

    if (isLoadingAnalytics) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                    <p className="text-xl text-gray-700">Loading analytics data...</p>
                    <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (analyticsError) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                    <h2 className="text-4xl font-extrabold text-red-700 mb-4">Error</h2>
                    <p className="text-xl text-red-600 mb-6">Failed to load analytics: {analyticsError}</p>
                    <p className="text-gray-600 mb-8">
                        Please ensure you are logged in as an administrator and your backend server is running.
                    </p>
                    <button
                        onClick={onGoBack}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Go back
                    </button>
                    <button
                        onClick={onLogout}
                        className="mt-4 ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-4xl font-extrabold text-indigo-700 mb-4 text-center">Admin Dashboard</h2>
                <p className="text-xl text-gray-700 mb-6 text-center">Welcome, <span className="font-semibold">{username}</span>!</p>

                {/* Overall Analytics Section */}
                {overallAnalytics && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">Overall Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
                                <p className="text-3xl font-bold text-blue-700">{overallAnalytics.totalHotels}</p>
                                <p className="text-gray-600">Total Hotels</p>
                            </div>
                            <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
                                <p className="text-3xl font-bold text-blue-700">{overallAnalytics.totalUsers}</p>
                                <p className="text-gray-600">Total Users</p>
                            </div>
                            <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
                                <p className="text-3xl font-bold text-blue-700">{overallAnalytics.totalReviews}</p>
                                <p className="text-gray-600">Total Reviews</p>
                            </div>
                            <div className="p-4 bg-blue-100 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h3>
                                <p className="text-4xl font-bold text-blue-600">{overallAnalytics.averageRating}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hotel Management Section */}
                <div className="mb-8 p-6 bg-yellow-50 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-yellow-800 mb-4">Manage Hotels</h3>
                    <button
                        onClick={openAddHotelModal}
                        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        Add New Hotel
                    </button>
                    {hotelMessage && (
                        <div className={`p-3 mb-4 rounded-md text-center ${hotelMessage.includes('Error') || hotelMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {hotelMessage}
                        </div>
                    )}
                    {hotels.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-sm">
                                <thead className="bg-yellow-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotels.map((hotel, index) => (
                                        <tr key={hotel._id} className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}>
                                            <td className="py-3 px-4 text-gray-800">{hotel.name}</td>
                                            <td className="py-3 px-4 text-gray-800">{hotel.location}</td>
                                            <td className="py-3 px-4 text-gray-800 flex space-x-2">
                                                <button
                                                    onClick={() => openEditHotelModal(hotel)}
                                                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold py-1 px-3 rounded-full transition-colors duration-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteHotel(hotel._id)} // Use custom confirm
                                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-full transition-colors duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600">No hotels added yet. Add one above!</p>
                    )}
                </div>


                {/* Reviews Per Hotel - CHART & TABLE */}
                <div className="mb-8 p-6 bg-green-50 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-green-800 mb-4">Reviews per Hotel</h3>
                    {reviewsPerHotel.length > 0 ? (
                        <>
                            <h4 className="text-xl font-semibold text-gray-700 mb-3">Review Counts Chart</h4>
                            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={reviewsPerHotel}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hotelName" angle={-45} textAnchor="end" height={80} interval={0} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="reviewCount" fill="#8884d8" name="Review Count" />
                                        <Bar dataKey="averageRating" fill="#82ca9d" name="Average Rating" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <h4 className="text-xl font-semibold text-gray-700 mb-3 mt-6">Review Counts Table</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow-sm">
                                    <thead className="bg-green-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Hotel Name</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Review Count</th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Avg. Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviewsPerHotel.map((data, index) => (
                                            <tr key={data.hotelId} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                                                <td className="py-3 px-4 text-gray-800">{data.hotelName}</td>
                                                <td className="py-3 px-4 text-gray-800">{data.reviewCount}</td>
                                                <td className="py-3 px-4 text-gray-800">{data.averageRating}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600">No review data available per hotel to display charts.</p>
                    )}
                </div>

                {/* Recent Reviews */}
                <div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">Recent Reviews</h3>
                    {recentReviews.length > 0 ? (
                        <div className="space-y-4">
                            {recentReviews.map(review => (
                                <div key={review._id} className="p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                                    <p className="font-semibold text-gray-800">
                                        "{review.comment}"
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        - {review.userName} (Rating: {review.rating}/5) for {review.hotel?.name} on {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No recent reviews available.</p>
                    )}
                </div>

                <div className="mt-8 text-center space-x-4">
                    <button
                        onClick={onLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Logout
                    </button>
                    <button
                        onClick={onGoBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        &larr; Go back to Home
                    </button>
                </div>
            </div>

            {/* Hotel Add/Edit Modal */}
            {isHotelModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative">
                        <button
                            onClick={closeHotelModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            {currentHotel ? 'Edit Hotel' : 'Add New Hotel'}
                        </h2>
                        {hotelMessage && (
                            <div className={`p-3 mb-4 rounded-md text-center ${hotelMessage.includes('Error') || hotelMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {hotelMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmitHotel} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    placeholder="Hotel/Restaurant Name"
                                    value={hotelForm.name}
                                    onChange={handleHotelFormChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    placeholder="City, Country"
                                    value={hotelForm.location}
                                    onChange={handleHotelFormChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 resize-y"
                                    placeholder="Brief description of the hotel/restaurant"
                                    value={hotelForm.description}
                                    onChange={handleHotelFormChange}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                    value={hotelForm.imageUrl}
                                    onChange={handleHotelFormChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
                            >
                                {currentHotel ? 'Update Hotel' : 'Add Hotel'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Modal for Deletion */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm text-center relative">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this hotel and all its reviews? This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDeleteHotel}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
