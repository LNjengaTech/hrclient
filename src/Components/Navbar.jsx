import React from 'react';

const Navbar = ({ isLoggedIn, username, onLogin, onLogout, onUserClick, onNavigateHome, onSearch }) => {
    return (
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg rounded-b-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div
                    className="text-white text-3xl font-extrabold cursor-pointer transition-transform transform hover:scale-105"
                    onClick={onNavigateHome}
                >
                    RatingApp
                </div>

                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-full bg-blue-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 w-48 hover:w-64"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <svg
                        className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                </div>

                {/* Login/User Display */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="flex items-center space-x-2">
                            <span
                                className="text-white font-semibold text-lg cursor-pointer hover:text-blue-200 transition-colors"
                                onClick={onUserClick}
                            >
                                Hello, {username}!
                            </span>
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLogin}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
