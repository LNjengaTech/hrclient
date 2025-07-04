import React, { useState } from 'react';

const AuthPage = ({ onLoginSuccess, onGoBack, API_BASE_URL }) => { // Added API_BASE_URL prop
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Only for register
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => { // Made async
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setIsLoading(true); // Set loading state

        try {
            let url;
            let body;

            if (isLoginMode) {
                url = `${API_BASE_URL}/api/auth/login`;
                body = JSON.stringify({ email, password });
            } else {
                url = `${API_BASE_URL}/api/auth/register`;
                body = JSON.stringify({ username, email, password });
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred.');
            }

            if (isLoginMode) {
                setMessage('Login successful!');
                // Pass the full user data and token from the backend response
                onLoginSuccess(data.user); // data.user contains id, username, email, isAdmin
                // The token is also in data.token, which App.jsx will store in localStorage via onLoginSuccess
            } else {
                setMessage(`Registration successful for ${username}! Please log in.`);
                setIsLoginMode(true); // Switch to login mode after successful registration
                setEmail('');
                setPassword('');
                setUsername('');
            }
        } catch (err) {
            console.error("Auth error:", err);
            setMessage(`${isLoginMode ? 'Login' : 'Registration'} failed: ${err.message}.`);
        } finally {
            setIsLoading(false); // Clear loading state
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {isLoginMode ? 'Login' : 'Register'}
                </h2>
                {message && (
                    <div className={`p-3 mb-4 rounded-md text-center ${message.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                placeholder="Your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isLoginMode}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            placeholder="your@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? (isLoginMode ? 'Logging In...' : 'Registering...') : (isLoginMode ? 'Login' : 'Register')}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setMessage(''); // Clear messages when switching mode
                                setEmail('');
                                setPassword('');
                                setUsername('');
                            }}
                            className="text-blue-500 hover:text-blue-700 font-semibold focus:outline-none"
                        >
                            {isLoginMode ? 'Register here' : 'Login here'}
                        </button>
                    </p>
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

export default AuthPage;
