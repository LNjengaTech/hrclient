import React, { useState } from 'react';

const ReviewForm = ({ hotel, onGoBack, onSubmitReview }) => {
    const [rating, setRating] = useState(0);
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
                    <div className={`p-3 mb-4 rounded-md text-center ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                            Rating (1-5 Stars)
                        </label>
                        <input
                            type="number"
                            id="rating"
                            min="1"
                            max="5"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
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
