"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from 'next/image';


export default function OrderDetailPage() {
  const { id } = useParams(); // URL: /orders/[id]
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
  const token = localStorage.getItem("adminToken");

        const res = await fetch(`http://localhost:4000/api/v1/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");

        setOrder(data.order);
      } catch (err) {
        console.error("Failed to load order:", err);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (!order) return <div className="p-6">Loading order details...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Status:</strong> <span className="text-yellow-600 font-medium">{order.orderStatus}</span></p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {order.products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {order.products.map((product, index) => {
              const item = product.productId;
              return (
                <div key={index} className="border p-4 rounded shadow">
                  <Image
                    src={item?.images?.[0] || "/placeholder.jpg"}
                    alt={item?.title || "Product Image"}
                    width={300}
                    height={160}
                    className="object-contain rounded mb-2 w-full h-40"
                  />

                  <h3 className="text-lg font-semibold">{item?.title || "Untitled Product"}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item?.description || "No description available."}</p>
                  <p className="text-gray-800 font-medium">Price: ₹{item?.price || "N/A"}</p>
                  <p className="text-gray-600 text-sm">Quantity: {product?.quantity || 1}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this order.</p>
        )}
      </div>
    </div>
  );
}
