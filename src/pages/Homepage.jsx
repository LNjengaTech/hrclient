import React, { useState } from 'react';
import HotelCard from '../Components/HotelCard.jsx';
import Hero from '../Components/Hero.jsx';

const HomePage = ({ hotels, onReviewClick, onViewReviewsClick, isLoading, error }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <p className="text-gray-600">Please ensure your backend server is running at http://localhost:5000.</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Hotels & Restaurants in Mombasa
            </h1>
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Search hotels by name..."
                    className="w-full max-w-md p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels.length > 0 ? (
                    filteredHotels.map((hotel) => (
                        <HotelCard
                            key={hotel._id} // Use _id from MongoDB
                            hotel={hotel}
                            onReviewClick={onReviewClick}
                            onViewReviewsClick={onViewReviewsClick}
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
