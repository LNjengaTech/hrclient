import React from 'react';
import HotelCard from '../Components/HotelCard.jsx'; // Ensure this path is correct for your setup

// HomePage now accepts navigation functions and loading/error states as props
// It no longer manages its own search term, relying on the 'hotels' prop (which is 'displayedHotels' from App.jsx)
const HomePage = ({ hotels, onReviewClick, onViewReviewsClick, isLoading, error }) => {

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-8 text-center">
                <p className="text-xl text-gray-700">Loading hotels and restaurants...</p>
                <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8 text-center">
                <p className="text-xl text-red-600">Error loading data: {error}</p>
                <p className="text-gray-600">Please ensure your backend server is running and accessible.</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Hotels & Restaurants in Mombasa
            </h1>
            {/* The search input is now handled by the Navbar component. */}
            {/* This section previously contained the local search input, now removed. */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.length > 0 ? (
                    hotels.map((hotel) => ( // Use 'hotels' directly, as it's already filtered by App.jsx
                        <HotelCard
                            key={hotel._id} // Use _id from MongoDB
                            hotel={hotel}
                            onReviewClick={onReviewClick} // Pass down the navigation prop
                            onViewReviewsClick={onViewReviewsClick} // Pass down the navigation prop
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600 text-lg">No hotels or restaurants found matching your search.</p>
                )}
            </div>
        </main>
    );
};

export default HomePage;
