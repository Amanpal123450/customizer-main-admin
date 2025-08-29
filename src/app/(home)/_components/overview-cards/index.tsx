"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";


export function OverviewCardsGroup() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  // PDF generation handler
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Dashboard Brief Report', 14, 18);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

    // Section: Today
    doc.setFontSize(14);
    doc.text('Today', 14, 38);
    doc.setFontSize(11);
    doc.text("Today's Orders: N/A", 18, 46); // Placeholder
    doc.text("Current Stock: N/A", 18, 54); // Placeholder

    // Section: Totals
    doc.setFontSize(14);
    doc.text('Totals', 14, 66);
    doc.setFontSize(11);
    const tableColumn = ["Report Type", "Current Value", "Previous Value", "Change (%)"];
    const tableRows = [
      [
        "Total Orders",
        data.views.value,
        data.views.prev,
        ((data.views.prev === 0 ? 100 : ((data.views.value - data.views.prev) / Math.abs(data.views.prev)) * 100)).toFixed(1) + "%"
      ],
      [
        "Total Revenue",
        `₹${data.profit.value}`,
        `₹${data.profit.prev}`,
        ((data.profit.prev === 0 ? 100 : ((data.profit.value - data.profit.prev) / Math.abs(data.profit.prev)) * 100)).toFixed(1) + "%"
      ],
      [
        "Total Products",
        data.products.value,
        data.products.prev,
        ((data.products.prev === 0 ? 100 : ((data.products.value - data.products.prev) / Math.abs(data.products.prev)) * 100)).toFixed(1) + "%"
      ],
      [
        "Total Users",
        data.users.value,
        data.users.prev,
        ((data.users.prev === 0 ? 100 : ((data.users.value - data.users.prev) / Math.abs(data.users.prev)) * 100)).toFixed(1) + "%"
      ],
    ];

    // Table below the 'Totals' section
    // StartY: 70 for spacing
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { font: 'helvetica', fontSize: 11 },
    });

    doc.save(`dashboard-brief-report-${Date.now()}.pdf`);
  };
  // Store both current and previous values for percentage calculation
  const [data, setData] = useState({
    views: { value: 0, prev: 0 },
    profit: { value: 0, prev: 0 },
    products: { value: 0, prev: 0 },
    users: { value: 0, prev: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
// https://backend-customizer.onrender.com/api/v1/admin/dashboard

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        let token: string | null = null;
        if (typeof window !== "undefined") {
          token = localStorage.getItem("adminToken");
        }
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch("https://backend-customizer.onrender.com/api/v1/admin/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        console.log(result);

        if (!res.ok) {
          setError(result.message || "Failed to fetch dashboard data");
          return;
        }

        // Simulate previous values for demo; replace with real API data if available
        setData({
          views: {
            value: result.data.totalOrders || 0,
            prev: result.data.prevTotalOrders || Math.max(0, (result.data.totalOrders || 0) - 10),
          },
          profit: {
            value: result.data.totalRevenue || 0,
            prev: result.data.prevTotalRevenue || Math.max(0, (result.data.totalRevenue || 0) - 1000),
          },
          products: {
            value: result.data.totalProducts || 0,
            prev: result.data.prevTotalProducts || Math.max(0, (result.data.totalProducts || 0) - 5),
          },
          users: {
            value: result.data.totalUsers || 0,
            prev: result.data.prevTotalUsers || Math.max(0, (result.data.totalUsers || 0) - 3),
          },
        });
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        setError(error?.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  // Enhanced card data with colors and trends
  // Helper to calculate percentage change
  function getPercentChange(current: number, prev: number) {
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / Math.abs(prev)) * 100;
  }

  // Helper to calculate progress (simulate as current/max for demo)
  function getProgress(current: number, max: number) {
    if (max === 0) return 0;
    return Math.min(100, Math.round((current / max) * 100));
  }

  // Simulate max values for progress bars (replace with real targets if available)
  const maxValues = {
    views: Math.max(data.views.value, data.views.prev, 100),
    profit: Math.max(data.profit.value, data.profit.prev, 1000),
    products: Math.max(data.products.value, data.products.prev, 50),
    users: Math.max(data.users.value, data.users.prev, 20),
  };

  const cardConfigs = [
    {
      label: "Total Orders",
      value: compactFormat(data.views.value),
      percent: getPercentChange(data.views.value, data.views.prev),
      progress: getProgress(data.views.value, maxValues.views),
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
      percent: getPercentChange(data.profit.value, data.profit.prev),
      progress: getProgress(data.profit.value, maxValues.profit),
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
      percent: getPercentChange(data.products.value, data.products.prev),
      progress: getProgress(data.products.value, maxValues.products),
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
      percent: getPercentChange(data.users.value, data.users.prev),
      progress: getProgress(data.users.value, maxValues.users),
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
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleGeneratePDF}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-transform duration-200"
        >
          Generate PDF Report
        </button>
        {/* Dark mode toggle button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 mt-6">
        {cardConfigs.map((config, index) => (
          <div
            key={index}
            className="group relative bg-white dark:bg-gray-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            {/* Card Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${config.bgColor} dark:bg-gray-900/40 group-hover:scale-110 transition-transform duration-300`}>
                  <config.Icon className={`w-6 h-6 ${config.iconColor} dark:text-white`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium ${config.changeColor} dark:text-white bg-white dark:bg-gray-900/40 px-2 py-1 rounded-full border dark:border-gray-700`}>
                    Live
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {config.value}
                  </h3>
                  <div className={`flex items-center gap-1 ${config.changeColor} dark:text-green-400`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                    <span className="text-sm font-medium">
                      {config.percent >= 0 ? '+' : ''}{config.percent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
                </div>
              </div>

              {/* Progress Bar removed as requested */}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </>
  );
}