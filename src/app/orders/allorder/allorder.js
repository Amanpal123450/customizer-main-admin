"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/orders/all-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
           console.log(data)
            // console.log(data.orders[0].)
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">shippingAddress</th>
              <th className="p-3 border-b">Total (₹)</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
         <tbody>
  {orders.length > 0 ? (
    orders.map((o, i) => (
      <tr key={o._id} className="hover:bg-gray-50 transition">
        <td className="p-3 border-b">
          <Link
            href={`/orderbyid/${o._id}`}
            className="text-blue-600 hover:underline"
          >
            {o._id}
          </Link>
        </td>
        <td className="p-3 border-b">{o.shippingAddress || "N/A"}</td>
        <td className="p-3 border-b">₹{o.totalAmount?.toLocaleString()}</td>
        <td className="p-3 border-b">{o.orderStatus}</td>
        <td className="p-3 border-b text-center">
          <Link
            href={`/admin/edit_order/${o._id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="p-6 text-center text-gray-500">
        No orders found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
