import React, { useState } from 'react';

const ReviewForm = ({ hotel, onGoBack, onSubmitReview }) => {
    const [rating, setRating] = useState(0); // State for the selected rating (number 1-5)
    const [hoverRating, setHoverRating] = useState(0); // State for visual hover effect
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Ensure hotel object is available
    if (!hotel) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Error: Hotel Not Found</h2>
                    <p className="text-gray-700 mb-6">
                        Could not load hotel details for review. Please go back and select a hotel.
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        // Validate rating is selected
        if (rating === 0) {
            setMessage('Please select a star rating.');
            setIsSubmitting(false);
            return;
        }

        const reviewData = {
            hotel: hotel._id, // Send hotel ID
            rating: parseInt(rating), // Ensure rating is an integer
            comment,
        };

        console.log("ReviewForm: Preparing to submit reviewData:", reviewData); // Debug log
        console.log("ReviewForm: Hotel prop:", hotel); // Debug log

        const success = await onSubmitReview(reviewData); // Call the prop function from App.jsx

        if (success) {
            // App.jsx handles success message and navigation back to home
        } else {
            setMessage('Failed to submit review. Please try again.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Review: {hotel.name}
                </h2>
                {message && (
                    <div className={`p-3 mb-4 rounded-md text-center ${message.includes('Failed') || message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                            Your Rating
                        </label>
                        <div className="flex justify-center space-x-1 mb-4"
                             onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map((starValue) => (
                                <svg
                                    key={starValue}
                                    className={`h-10 w-10 cursor-pointer transition-colors duration-200
                                                ${(hoverRating || rating) >= starValue ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHoverRating(starValue)}
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.73c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                            Your Review
                        </label>
                        <textarea
                            id="comment"
                            rows="5"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 resize-y"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            disabled={isSubmitting}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={onGoBack}
                        className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                        disabled={isSubmitting}
                    >
                        &larr; Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
