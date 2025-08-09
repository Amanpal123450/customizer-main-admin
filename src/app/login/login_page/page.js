"use client"
import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';


const AdminLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();


    React.useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/login');
        } else {
            router.push('/dashboard');
        }
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Extra validation before sending request
            if (!formData.email || !formData.password) {
                setError('All fields are required');
                setIsLoading(false);
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }

            const response = await fetch('https://e-com-customizer.onrender.com/api/v1/adminLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (data.success) {
            
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', data.user._id);
                setSuccess('Login successful! Redirecting...');


                // Simulate redirect after success
                setTimeout(() => {
                    console.log('Token stored:', data.token);
                    console.log('User data:', data.user);
                    // Here you would typically redirect to the admin dashboard
                    router.push('/');
                }, 1500);

            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, Satoshi, sans-serif' }}>
         {   /* Left side - Background Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
                        opacity: 0.85
                    }}  
                ></div>
                <div className="relative z-10 flex flex-col backdrop-blur-xl justify-center items-center text-black p-12 bg-transparent bg-opacity-40 h-full w-full">
                    <div className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">DesignTailor</div>
                    <div className="text-2xl font-semibold opacity-90 text-center">
                        Welcome to the Admin Panel<br />
                        <span className="text-lg font-medium">Please login to manage your store</span>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center mb-6 lg:hidden">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                            </div>
                            <span className="text-2xl font-bold text-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">DesignTailor</span>
                        </div>

                        <h2 className="text-3xl font-extrabold text-black mb-2">Login</h2>
                        <div className="flex items-center text-sm">
                            <span className="text-black mr-1">Don't have an account?</span>
                            <button className="text-blue-600  cursor-pointer hover:text-blue-700 font-medium">
                                Contact Administrator
                            </button>
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-black" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="admin@designtailor.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-black" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-black hover:text-black" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-black hover:text-black" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-black">
                                    Keep me signed in
                                </label>
                            </div>

                            <button
                                type="button"
                                className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
                                disabled={isLoading}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            onClick={handleSubmit}
                            className="w-full flex justify-center cursor-pointer py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-black">
                            © Made with love by Team <span className="text-blue-600 font-medium">DesignTailor</span>
                        </p>
                    </div>

                    {/* Release Info */}
                  
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;