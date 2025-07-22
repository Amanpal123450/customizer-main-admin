"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const generateCaptcha = (length = 6) =>
  Math.random().toString(36).slice(2, 2 + length).toUpperCase();
 
const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    captchaInput: "",
  });
  const router=useRouter();

  const [captchaCode, setCaptchaCode] = useState("");

  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setFormData({ ...formData, captchaInput: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.captchaInput !== captchaCode) {
    alert("Invalid captcha");
    return;
  }

  try {
    const res = await fetch("https://e-com-customizer.onrender.com/api/v1/adminLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.emailOrPhone,
        password: formData.password,
      }),
    });

    const data = await res.json();
    console.log(data.user._id);
    if (!res.ok) {
      alert(data.message || "Login failed!");
      return;
    }
  //  localStorage.setItem("token", data.token);
    alert("Login successful!");

    //  router.push("/admin/dashboard");

    // Optionally save token
    localStorage.setItem("token", data.token);
    localStorage.setItem("Admin_ID", data.user._id);

    // localStorage.setItem("user",data.user._id)
    
    // Redirect or do something next
    router.push("/");
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong while logging in.");
  }
};


  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Login</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="you@example.com / 9876543210"
              value={formData.emailOrPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Captcha
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <div className="text-lg font-bold tracking-widest bg-gray-200 px-4 py-2 rounded select-none text-center sm:w-40">
                {captchaCode}
              </div>
              <input
                type="text"
                name="captchaInput"
                placeholder="Enter captcha"
                value={formData.captchaInput}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="text-blue-600 text-sm hover:underline"
              >
                Refresh
              </button>
            </div>
          </div>

        
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
          >
            Login
          </button>
        </form>

      
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          Don t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up here
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
