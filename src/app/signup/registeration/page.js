"use client";
import { useEffect, useState } from "react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.captchaInput !== captchaCode) {
      alert("Captcha does not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://e-com-customizer.onrender.com/api/v1/signup", {
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
        alert("Signup successful!");
        
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sign Up</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className={inputClass} />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className={inputClass} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={inputClass} />
          <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className={inputClass} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className={inputClass} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className={inputClass} />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className={inputClass} />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required className={inputClass} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className={inputClass} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required className={inputClass} />
          <input name="addressLine" placeholder="Address Line (optional)" value={formData.addressLine} onChange={handleChange} className={inputClass} />
          <input name="favouriteGame" placeholder="Favourite Game" value={formData.favouriteGame} onChange={handleChange} required className={inputClass} />

          {/* Captcha */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Captcha</label>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold bg-gray-200 px-4 py-2 rounded">{captchaCode}</div>
              <input name="captchaInput" placeholder="Enter Captcha" value={formData.captchaInput} onChange={handleChange} required className={inputClass + " flex-1"} />
              <button type="button" onClick={refreshCaptcha} className="text-sm text-blue-600 hover:underline">Refresh</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="col-span-1 md:col-span-2 w-full bg-blue-600 text-white py-2 rounded font-semibold mt-4">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signup;
