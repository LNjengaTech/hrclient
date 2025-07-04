import React, { useState } from 'react';

// ReviewForm component
const ReviewForm = ({ hotel, onGoBack, onSubmitReview }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => { // Made async to allow awaiting onSubmitReview
        e.preventDefault();
        setMessage('');

        // Defensive check: Ensure hotel and hotel._id are available before proceeding
        if (!hotel || !hotel._id) {
            setMessage('Error: Hotel information is missing. Please go back and select a hotel.');
            console.error("ReviewForm: hotel or hotel._id is undefined during submission.");
            return;
        }

        if (rating === 0) {
            setMessage('Please select a rating.');
            return;
        }
        if (!comment.trim()) {
            setMessage('Please write a comment.');
            return;
        }

        // Call the onSubmitReview prop, which will handle the actual API call in App.jsx
        // Await it to get the result and update message accordingly
        const success = await onSubmitReview({ hotelId: hotel._id, rating, comment });

        if (success) {
            setMessage('Review submitted successfully!');
            setRating(0);
            setComment('');
        } else {
            setMessage('Failed to submit review. Please try again.'); // Message updated based on onSubmitReview result
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Write a Review for <span className="text-blue-600">{hotel ? hotel.name : 'Unknown Hotel'}</span>
                </h2>
                {message && (
                    <div className={`p-3 mb-4 rounded-md text-center ${message.includes('Failed') || message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Rating
                        </label>
                        <div className="flex justify-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-10 h-10 cursor-pointer transition-colors duration-200 ${
                                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => setRating(star)}
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                            Your Comment
                        </label>
                        <textarea
                            id="comment"
                            rows="5"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 resize-y"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
                    >
                        Submit Review
                    </button>
                </form>
                <div className="mt-6 text-center">
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

export default ReviewForm;
