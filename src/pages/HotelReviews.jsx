import React, { useState, useEffect, useCallback } from 'react';

const HotelReviews = ({ hotel, onGoBack }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Base URL for backend API - IMPORTANT: Keep this in sync with App.jsx
    const API_BASE_URL = 'https://hrbackend-6tqe.onrender.com';

    const fetchReviews = useCallback(async () => {
        console.log("HotelReviews: fetchReviews called."); // Debug log
        if (!hotel || !hotel._id) {
            console.error("HotelReviews: Hotel information missing (hotel or hotel._id is undefined). Hotel prop:", hotel); // Debug log
            setError("Hotel information missing to fetch reviews.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const reviewFetchUrl = `${API_BASE_URL}/api/reviews/hotel/${hotel._id}`;
        console.log("HotelReviews: Attempting to fetch reviews from URL:", reviewFetchUrl); // Debug log

        try {
            const response = await fetch(reviewFetchUrl);
            console.log("HotelReviews: Fetch response status:", response.status); // Debug log

            // Check if the response is JSON before parsing
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log("HotelReviews: Fetched reviews data:", data); // Debug log

                if (!response.ok) {
                    console.error("HotelReviews: Fetch failed with data:", data); // Debug log
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }
                setReviews(data);
            } else {
                const text = await response.text();
                console.error("HotelReviews: Server did not return JSON. Response text:", text); // Debug log
                throw new Error(`Server did not return JSON. Response: ${text.substring(0, 100)}...`);
            }
        } catch (err) {
            console.error("HotelReviews: Error fetching reviews:", err); // Debug log
            setError(`Failed to load reviews: ${err.message}`);
            setReviews([]);
        } finally {
            setIsLoading(false);
            console.log("HotelReviews: Fetch process completed."); // Debug log
        }
    }, [hotel, API_BASE_URL]); // Dependencies for useCallback

    useEffect(() => {
        console.log("HotelReviews useEffect: Calling fetchReviews."); // Debug log
        fetchReviews();
    }, [fetchReviews]); // Run when fetchReviews changes

    if (!hotel) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Error: Hotel Not Selected</h2>
                    <p className="text-gray-700 mb-6">
                        No hotel was selected to view reviews. Please go back to the home page.
                    </p>
                    <button
                        onClick={onGoBack}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
                    >
                        &larr; Go back
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                    <p className="text-xl text-gray-700">Loading reviews for {hotel.name}...</p>
                    <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                    <h2 className="text-4xl font-extrabold text-red-700 mb-4">Error</h2>
                    <p className="text-xl text-red-600 mb-6">Failed to load reviews: {error}</p>
                    <p className="text-gray-600">Please try again later.</p>
                    <button
                        onClick={onGoBack}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
                    >
                        &larr; Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-[calc(100vh-6rem)]">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Reviews for {hotel.name}</h1>
                <p className="text-lg text-gray-700 mb-8 text-center">{hotel.location}</p>

                {reviews.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg shadow-inner">
                        <p className="text-xl text-gray-600">No reviews yet for {hotel.name}. Be the first to add one!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {review.userName}
                                    </p>
                                    <div className="text-yellow-500 font-bold text-xl">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-3">{review.comment}</p>
                                <p className="text-sm text-gray-500">
                                    Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={onGoBack}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        &larr; Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelReviews;
