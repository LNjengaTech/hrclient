const UserAccount = ({ username, onLogout, onGoBack }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
                <h2 className="text-4xl font-extrabold text-blue-700 mb-4">My Account</h2>
                <p className="text-xl text-gray-700 mb-6">Welcome, <span className="font-semibold">{username}</span>!</p>
                <p className="text-gray-600 mb-8">
                    This is your personal account page.
                    You can view your past reviews, update your profile, etc.
                    (Content will be added here later.)
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => alert("Viewing my reviews (not yet implemented).")}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        View My Reviews
                    </button>
                    <button
                        onClick={() => alert("Updating profile (not yet implemented).")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Logout
                    </button>
                    <button
                        onClick={onGoBack}
                        className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                    >
                        &larr; Go back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAccount;