import React, { useState } from 'react';

// AuthPage component
const AuthPage = ({ onLoginSuccess, onGoBack, API_BASE_URL }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Only for register
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        if (isLoginMode) {
            // --- REAL LOGIN API CALL ---
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage('Login successful!');
                    // Pass the full data object { token, user: {...} }
                    onLoginSuccess(data);
                } else {
                    setMessage(`Login failed: ${data.message || 'Server error'}`);
                }
            } catch (error) {
                console.error("Login API call failed:", error);
                setMessage(`Login failed: Network error or server unreachable.`);
            } finally {
                setIsLoading(false);
            }
        } else {
            // --- REAL REGISTER API CALL ---
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(`Registration successful for ${username}! Please log in.`);
                    setIsLoginMode(true);
                    setEmail('');
                    setPassword('');
                    setUsername('');
                } else {
                    setMessage(`Registration failed: ${data.message || 'Server error'}`);
                }
            } catch (error) {
                console.error("Register API call failed:", error);
                setMessage(`Registration failed: Network error or server unreachable.`);
            } finally {
                setIsLoading(false);
            }
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 transform hover:scale-105"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : (isLoginMode ? 'Login' : 'Register')}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setMessage('');
                                setEmail('');
                                setPassword('');
                                setUsername('');
                            }}
                            className="text-blue-500 hover:text-blue-700 font-semibold focus:outline-none"
                            disabled={isLoading}
                        >
                            {isLoginMode ? 'Register here' : 'Login here'}
                        </button>
                    </p>
                    <button
                        onClick={onGoBack}
                        className="mt-4 text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                        disabled={isLoading}
                    >
                        &larr; Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
