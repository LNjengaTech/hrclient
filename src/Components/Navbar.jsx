import React from 'react';

const Navbar = ({ isLoggedIn, username, onLogin, onLogout, onUserClick, onNavigateHome, onSearch }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-center">
                {/* Top Row (Mobile) / Left Section (Desktop) */}
                <div className="flex justify-between items-center w-full md:w-auto mb-2 md:mb-0">
                    {/* Logo/App Name */}
                    <button onClick={onNavigateHome} className="text-white text-3xl font-extrabold tracking-tight hover:text-blue-100 transition-colors duration-200">
                        RatingApp
                    </button>

                    {/* Auth/User Section (Mobile: moves to right of title, Desktop: stays right) */}
                    <div className="flex items-center space-x-4 md:hidden ml-4"> {/* Only show on mobile */}
                        {isLoggedIn ? (
                            <button
                                onClick={onUserClick}
                                className="text-white text-lg font-medium hover:text-blue-100 transition-colors duration-200"
                            >
                                Hello, <span className="font-semibold">{username}</span>!
                            </button>
                        ) : (
                            <button
                                onClick={onLogin}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Bar - Full width on mobile, inline on desktop */}
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-inner w-full md:w-auto md:flex-grow md:mx-4 mt-2 md:mt-0">
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        className="flex-grow outline-none text-gray-800 px-3 py-1 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>

                {/* Auth/User Section (Desktop only - hidden on mobile as it's in the top row) */}
                <div className="hidden md:flex items-center space-x-4"> {/* Hidden on mobile */}
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={onUserClick} // This will trigger navigation to AdminDashboard or UserAccount
                                className="text-white text-lg font-medium hover:text-blue-100 transition-colors duration-200"
                            >
                                Hello, <span className="font-semibold">{username}</span>!
                            </button>
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onLogin}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
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
