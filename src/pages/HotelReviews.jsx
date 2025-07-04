import React, { useState, useEffect } from 'react';

// HotelReviews component
const HotelReviews = ({ hotel, onGoBack }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!hotel || !hotel._id) {
                setReviewsError('No hotel selected to fetch reviews.');
                setIsLoadingReviews(false);
                return;
            }

            try {
                setIsLoadingReviews(true);
                setReviewsError(null);
                const response = await fetch(`http://localhost:5000/api/reviews/${hotel._id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setReviewsError(err.message);
            } finally {
                setIsLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [hotel]); // Re-fetch reviews if the hotel changes

    if (!hotel) {
        return (
            <div className="min-h-[calc(100vh-6rem)] bg-gray-100 p-4 flex items-center justify-center">
                <p className="text-xl text-gray-700">No hotel selected. Please go back and choose a hotel.</p>
                <button
                    onClick={onGoBack}
                    className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                >
                    &larr; Go back
                </button>
            </div>
        );
    }

    if (isLoadingReviews) {
        return (
            <div className="min-h-[calc(100vh-6rem)] bg-gray-100 p-4 text-center flex flex-col items-center justify-center">
                <p className="text-xl text-gray-700">Loading reviews for {hotel.name}...</p>
                <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        );
    }

    if (reviewsError) {
        return (
            <div className="min-h-[calc(100vh-6rem)] bg-gray-100 p-4 text-center flex flex-col items-center justify-center">
                <p className="text-xl text-red-600">Error loading reviews: {reviewsError}</p>
                <p className="text-gray-600">Please ensure the backend is running and the hotel ID is valid.</p>
                <button
                    onClick={onGoBack}
                    className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                >
                    &larr; Go back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-gray-100 p-4">
            <div className="container mx-auto bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Reviews for <span className="text-indigo-600">{hotel.name}</span>
                </h2>

                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex items-center mb-2">
                                    <p className="font-semibold text-lg text-gray-800 mr-2">{review.userName}</p>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${
                                                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{review.comment}</p>
                                <p className="text-gray-500 text-sm">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No reviews yet for {hotel.name}. Be the first to review!</p>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={onGoBack}
                        className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                    >
                        &larr; Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelReviews;
