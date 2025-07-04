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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://ecomm-backend-7g4k.onrender.com/api/v1/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        console.log(result)

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
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Orders"
        data={{
          ...data.views,
          value: compactFormat(data.views.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Revenue"
        data={{
          ...data.profit,
          value: "$" + compactFormat(data.profit.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Products"
        data={{
          ...data.products,
          value: compactFormat(data.products.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Users"
        data={{
          ...data.users,
          value: compactFormat(data.users.value),
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
