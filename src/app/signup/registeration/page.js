"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "User",
    address: "",
    state: "",
    pincode: "",
    addressLine: "",
    city: "",
    favouriteGame: "",
    captchaInput: "",
  });

  const [captchaCode, setCaptchaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const generateCaptcha = (length = 6) =>
    Math.random().toString(36).slice(2, 2 + length).toUpperCase();

  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setFormData((prev) => ({ ...prev, captchaInput: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.favouriteGame.trim()) newErrors.favouriteGame = "Favourite game is required";
    if (!formData.captchaInput.trim()) {
      newErrors.captchaInput = "Enter the captcha";
    } else if (formData.captchaInput !== captchaCode) {
      newErrors.captchaInput = "Captcha does not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.role,
          address: formData.address,
          state: formData.state,
          pincode: formData.pincode,
          addressLine: formData.addressLine,
          city: formData.city,
          favouriteGame: formData.favouriteGame,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErrors({ submit: data.message || "Signup failed. Please try again." });
        refreshCaptcha();
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image (optional, for design match) */}
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
            Welcome!<br />
            <span className="text-lg font-medium">Create your account to get started</span>
          </div>
        </div>
      </div>
      {/* Right side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-6 lg:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold text-black">DesignTailor</span>
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">Sign Up</h2>
            <h2 className="text-3xl font-extrabold text-black mb-2">Sign Up</h2>
            <div className="flex items-center text-sm">
              <span className="text-black mr-1">Already have an account?</span>
              <a href="/login" className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium">Login</a>
            </div>
          </div>
          {/* Error/Success Messages */}
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className={inputClass} />
              {errors.firstName && <div className="text-xs text-red-600 mt-1">{errors.firstName}</div>}
            </div>
            {/* Last Name */}
            <div>
              <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className={inputClass} />
              {errors.lastName && <div className="text-xs text-red-600 mt-1">{errors.lastName}</div>}
            </div>
            {/* Email */}
            <div>
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClass} />
              {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
            </div>
            {/* Phone Number */}
            <div>
              <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
              {errors.phoneNumber && <div className="text-xs text-red-600 mt-1">{errors.phoneNumber}</div>}
            </div>
            {/* Password */}
            <div>
              <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className={inputClass} />
              {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
            </div>
            {/* Confirm Password */}
            <div>
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
              {errors.confirmPassword && <div className="text-xs text-red-600 mt-1">{errors.confirmPassword}</div>}
            </div>
            {/* Address */}
            <div>
              <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className={inputClass} />
              {errors.address && <div className="text-xs text-red-600 mt-1">{errors.address}</div>}
            </div>
            {/* State */}
            <div>
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className={inputClass} />
              {errors.state && <div className="text-xs text-red-600 mt-1">{errors.state}</div>}
            </div>
            {/* City */}
            <div>
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputClass} />
              {errors.city && <div className="text-xs text-red-600 mt-1">{errors.city}</div>}
            </div>
            {/* Pincode */}
            <div>
              <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className={inputClass} />
              {errors.pincode && <div className="text-xs text-red-600 mt-1">{errors.pincode}</div>}
            </div>
            {/* Address Line (optional) */}
            <div>
              <input name="addressLine" placeholder="Address Line (optional)" value={formData.addressLine} onChange={handleChange} className={inputClass} />
            </div>
            {/* Favourite Game */}
            <div>
              <input name="favouriteGame" placeholder="Favourite Game" value={formData.favouriteGame} onChange={handleChange} className={inputClass} />
              {errors.favouriteGame && <div className="text-xs text-red-600 mt-1">{errors.favouriteGame}</div>}
            </div>
            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Captcha</label>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold bg-gray-200 px-4 py-2 rounded">{captchaCode}</div>
                <input name="captchaInput" placeholder="Enter Captcha" value={formData.captchaInput} onChange={handleChange} className={inputClass + " flex-1"} />
                <button type="button" onClick={refreshCaptcha} className="text-sm text-blue-600 hover:underline">Refresh</button>
              </div>
              {errors.captchaInput && <div className="text-xs text-red-600 mt-1">{errors.captchaInput}</div>}
            </div>
            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full flex justify-center cursor-pointer py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
              {loading ? (<><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" /> Creating Account...</>) : "Create Account"}
            </button>
          </form>
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-black">
              © Made with love by Team <span className="text-blue-600 font-medium">DesignTailor</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
