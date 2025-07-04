import React from 'react';
import HotelCard from '../Components/HotelCard.jsx'; // Assuming this path is correct

const HomePage = ({ hotels, onReviewClick, onViewReviewsClick, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                    <p className="text-xl text-gray-700">Loading hotels and restaurants...</p>
                    <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                    <h2 className="text-4xl font-extrabold text-red-700 mb-4">Error Loading Data</h2>
                    <p className="text-xl text-red-600 mb-6">Failed to fetch hotels: {error}</p>
                    <p className="text-gray-600 mb-8">
                        Please ensure your backend server is running and accessible from this domain.
                    </p>
                </div>
            </div>
        );
    }

    // Defensive check: Ensure hotels is an array before attempting to use it
    const hotelsToRender = Array.isArray(hotels) ? hotels : [];

    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                Discover Hotels & Restaurants
            </h1>

            {hotelsToRender.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotelsToRender.map(hotel => (
                        <HotelCard
                            key={hotel._id}
                            hotel={hotel}
                            onReviewClick={onReviewClick}
                            onViewReviewsClick={onViewReviewsClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
                    <p className="text-center text-gray-600 text-lg mb-4">No hotels or restaurants available yet.</p>
                    <p className="text-center text-gray-500 text-md">
                        The admin might not have added any entries, or there might be a temporary issue.
                    </p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
