import React from 'react';

// HotelCard Component
const HotelCard = ({ hotel, onReviewClick, onViewReviewsClick }) => {
    // Defensive check: If hotel prop is undefined or null, render nothing or a placeholder
    if (!hotel) {
        console.warn("HotelCard received an undefined or null hotel prop.");
        return null; // Or return a simple div indicating missing data
    }

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="w-full h-48 object-cover object-center rounded-t-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/CCCCCC/333333?text=Image+Not+Found"; }}
            />
            <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{hotel.location}</p>
                <div className="flex justify-between space-x-3">
                    <button
                        onClick={() => onReviewClick(hotel._id)} // Use _id from MongoDB
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Review
                    </button>
                    <button
                        onClick={() => onViewReviewsClick(hotel._id)} // Use _id from MongoDB
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    >
                        View Reviews
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
