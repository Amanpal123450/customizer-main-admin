"use client";

import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export function OverviewCardsGroup() {
  const [data, setData] = useState({
    views: { value: 0 },
    profit: { value: 0 },
    products: { value: 0 },
    users: { value: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try { 
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        console.log(result);

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch dashboard data");
        }

        setData({
          views: { value: result.data.totalOrders || 0 },
          profit: { value: result.data.totalRevenue || 0 },
          products: { value: result.data.totalProducts || 0 },
          users: { value: result.data.totalUsers || 0 },
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Enhanced card data with colors and trends
  const cardConfigs = [
    {
      label: "Total Orders",
      value: compactFormat(data.views.value),
      Icon: icons.Views,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-blue-600",
      description: "Orders received",
    },
    {
      label: "Total Revenue",
      value: "₹" + compactFormat(data.profit.value),
      Icon: icons.Profit,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
      description: "Revenue generated",
    },
    {
      label: "Total Products",
      value: compactFormat(data.products.value),
      Icon: icons.Product,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-purple-600",
      description: "Products listed",
    },
    {
      label: "Total Users",
      value: compactFormat(data.users.value),
      Icon: icons.Users,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-orange-600",
      description: "Registered users",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 mt-6">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">Failed to load dashboard data</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 mt-6">
      {cardConfigs.map((config, index) => (
        <div
          key={index}
          className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
        >
          {/* Background Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          {/* Card Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${config.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <config.Icon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${config.changeColor} bg-white px-2 py-1 rounded-full border`}>
                  Live
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {config.value}
                </h3>
                <div className={`flex items-center gap-1 ${config.changeColor}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">{config.label}</p>
                <p className="text-xs text-gray-500">{config.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
}