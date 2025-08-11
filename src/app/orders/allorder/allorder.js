"use client";


import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import axios from 'axios'
import "jspdf-autotable"; // 
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  X,
  Check,
  Truck,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  FileText,
  Printer,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";
import { toast } from "@/components/ui/toast";

const showToast = (text, type = "success") => {
  toast({
    text,
    duration: 3000,
    type,
  });
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    dateRange: { start: "", end: "" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  // const [alluser,setAllUser] =useState();

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        " https://e-com-customizer.onrender.com/api/v1/orders/all-orders",
      );
      const data = await response.json();
      console.log(data);
      // Mock data structure if API returns different format
      // const mockOrders = data.orders || [
      //   {
      //     _id: "ORD001",
      //     customerName: "Rahul Sharma",
      //     customerEmail: "rahul@example.com",
      //     orderDate: "2025-01-20",
      //     paymentStatus: "Paid",
      //     paymentMethod: "Razorpay",
      //     totalAmount: 2499,
      //     orderStatus: "Shipped",
      //     paymentId: "pay_123456789",
      //     phone: "+91 9876543210",
      //     shippingAddress: "B-123, Sector 15, Noida, UP 201301",
      //     billingAddress: "B-123, Sector 15, Noida, UP 201301",
      //     products: [
      //       {
      //         image: "https://via.placeholder.com/80",
      //         name: "Premium T-Shirt",
      //         variant: "Size: L, Color: Blue",
      //         quantity: 2,
      //         price: 999,
      //         subtotal: 1998,
      //       },
      //       {
      //         image: "https://via.placeholder.com/80",
      //         name: "Cotton Jeans",
      //         variant: "Size: 32, Color: Black",
      //         quantity: 1,
      //         price: 1499,
      //         subtotal: 1499,
      //       },
      //     ],
      //     subtotal: 3497,
      //     shippingCharges: 99,
      //     tax: 349,
      //     discount: 200,
      //     couponApplied: "SAVE200",
      //     statusTimeline: [
      //       { status: "Pending", date: "2025-01-20 10:00 AM", completed: true },
      //       {
      //         status: "Confirmed",
      //         date: "2025-01-20 11:30 AM",
      //         completed: true,
      //       },
      //       { status: "Shipped", date: "2025-01-21 02:00 PM", completed: true },
      //       { status: "Out for Delivery", date: "", completed: false },
      //       { status: "Delivered", date: "", completed: false },
      //     ],
      //   },
      //   {
      //     _id: "ORD002",  
      //     customerName: "Priya Singh",
      //     customerEmail: "priya@example.com",
      //     orderDate: "2025-01-19",
      //     paymentStatus: "Pending",
      //     paymentMethod: "COD",
      //     totalAmount: 1299,
      //     orderStatus: "Processing",
      //     paymentId: null,
      //     phone: "+91 8765432109",
      //     shippingAddress: "A-456, Model Town, Delhi 110009",
      //     billingAddress: "A-456, Model Town, Delhi 110009",
      //     products: [
      //       {
      //         image: "https://via.placeholder.com/80",
      //         name: "Casual Shirt",
      //         variant: "Size: M, Color: White",
      //         quantity: 1,
      //         price: 1299,
      //         subtotal: 1299,
      //       },
      //     ],
      //     subtotal: 1299,
      //     shippingCharges: 0,
      //     tax: 130,
      //     discount: 130,
      //     couponApplied: null,
      //     statusTimeline: [
      //       { status: "Pending", date: "2025-01-19 03:00 PM", completed: true },
      //       { status: "Confirmed", date: "", completed: false },
      //       { status: "Shipped", date: "", completed: false },
      //       { status: "Out for Delivery", date: "", completed: false },
      //       { status: "Delivered", date: "", completed: false },
      //     ],
      // ];
      // ];

  setOrders(Array.isArray(data.orders) ? [...data.orders].reverse() : []);
      console.log(data)
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Use mock data on error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on current filters
  const filteredOrders = orders.filter((order) => {
    const search = filters.search?.toLowerCase().trim() || "";

    const matchesSearch =
      !search ||
      order._id?.toLowerCase().includes(search) ||
      order.customerName?.toLowerCase().includes(search) ||
      order.userId?.firstName?.toLowerCase().includes(search) ||
      order.userId?.lastName?.toLowerCase().includes(search) ||
      order.userId?.email?.toLowerCase().includes(search) ||
      new Date(order.createdAt).toLocaleDateString("en-IN").includes(search) ||
      order.products?.some((product) =>
        product.title?.toLowerCase().includes(search)
      );

    const matchesStatus =
      !filters.status || order.orderStatus === filters.status;

    const matchesPaymentStatus =
      !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;

    const matchesPaymentMethod =
      !filters.paymentMethod || order.paymentMethod === filters.paymentMethod;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPaymentStatus &&
      matchesPaymentMethod
    );
  });


  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


  // useEffect(()=>{

  //   const GetUser = async () => {
  //     const token =localStorage.getItem("tokenn");
  //       try {
  //         const res = await fetch(
  //           ` https://e-com-customizer.onrender.com/api/v1/orders/all-orders`,{

  //              method: "GET",
  //         headers: {
  //           Authorization: Bearer ${token},
  //         },
  //           }
  //         );
  //         const data = await res.json();
  //         setAllUser(data?.data); // adjust based on your API response

  //         console.log(data.data);
  //       } catch (error) {
  //         console.error("Error fetching user:", error);
  //       }
  //     };

  //     GetUser();

  // },[])
  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Confirmed: "bg-green-100 text-green-800",
      Shipped: "bg-purple-100 text-purple-800",
      "Out for Delivery": "bg-orange-100 text-orange-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Returned: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Action handlers
  // import axios from "axios";

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log("Updating order status:", orderId, newStatus);


      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

  const token = localStorage.getItem("adminToken");

      const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/ordersStatus/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      
      console.log("order data", data);

      const data = await res.json();

      if (data.success) {
        console.log("Order updated successfully", data.order);
      } else {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };



  const handleRefund = (orderId) => {
    // Handle refund logic
    showToast(`Refund initiated for order ${orderId}`, "info");
  };

  const handlePrintInvoice = (order) => {
    // Handle print invoice
    window.print();
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    // Order Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`User ID: ${order.userId}`, 14, 36);
    doc.text(`Order Status: ${order.orderStatus}`, 14, 42);
    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, 48);
    doc.text(
      `Shipping Address: ${order.shippingAddress || "N/A"}`,
      14,
      54
    );

    // Table Data
    const products = order.products.map((p, index) => [
      index + 1,
      p.product?.title || "Product",
      p.quantity,
      `₹${p.price}`,
      `₹${p.price * p.quantity}`,
    ]);

    // Products Table
    autoTable(doc, {
      startY: 60,
      head: [["#", "Product", "Qty", "Unit Price", "Total"]],
      body: products,
    });

    // Footer message
    // const finalY = doc.lastAutoTable?.finalY || 70;
    // doc.text("Thank you for your purchase!", 14, finalY + 10);

    // Save PDF
    doc.save(`invoice_${order._id}.pdf`);
  };

  const exportOrders = (format) => {
    console.log("dssf")
    if (!format) return;

    // Example orders array — replace with actual data from your API or state
    const orders = [
      {
        _id: "ORDER123",
        orderStatus: "Pending",
        createdAt: "2025-07-18T09:03:54.643Z",
        products: [
          {
            title: "I Phone 12 pro max",
            price: 10000,
            quantity: 7,
            color: "Blue",
          },
        ],
      },
      // Add more orders if needed
    ];

    // CSV header
    const headers = [
      "Order ID",
      "Order Status",
      "Created At",
      "Product Title",
      "Price",
      "Quantity",
      "Color",
    ];

    // Build CSV rows
    const rows = format.flatMap((order) =>
      order.products.map((product) => [
        order._id,
        order.orderStatus,
        new Date(order.createdAt).toLocaleString(),
        product.title,
        product.price,
        product.quantity,
        product.color,
      ])
    );

    // Convert to CSV string
    const csvContent =
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //  const [user, setUser] = useState();

  const OrderModal = ({ selectedOrder, onClose }) => {
   const [order, setOrder1] = useState(null);
 console.log(selectedOrder)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/orders/${selectedOrder}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setOrder1(data.order);
        console.log("Fetched order:", data);

         if (Array.isArray(data) && data.length > 0) {
        setOrder1(data[0]);
        console.log("Fetched single order:", data[0]);
      } else {
        console.log("No order found for this ID.");
      }
      } catch (error) {
        console.log("Error fetching order:", error.message);
      }
    };

    if (selectedOrder) {
      fetchOrder();
    }
  }, [selectedOrder]);

  if (!order) return <div>Loading order...</div>;


    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
          <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
            <h2 className="text-2xl font-bold">Order Details - {order._id}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8 p-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-5 w-5" />
                  Order Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Order ID:</span> {order._id}
                  </p>
                  <p>
                    <span className="font-medium">Order Date:</span>{" "}
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-sm ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  {order.paymentId && (
                    <p>
                      <span className="font-medium">Payment ID:</span>{" "}
                      {order.paymentId}
                    </p>
                  )}
                  {order.couponApplied && (
                    <p>
                      <span className="font-medium">Coupon Applied:</span>{" "}
                      {order.couponApplied}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.userId
                      ? `${order.userId?.firstName}, ${order.userId?.lastName}`
                      : "Loading..."}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {order.userId?.email || "Loading..."}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.userId?.phoneNumber || "Loading..."}
                  </p>
                  <p>
                    <span className="font-medium">Shipping Address:</span>{" "}
                    {order.shippingAddress.address}, {order.shippingAddress.state}, {order.shippingAddress.city} ,{order.shippingAddress.pincode} ,{order.shippingAddress.country}
                  </p>
                  <p>
                    <span className="font-medium">Billing Address:</span>{" "}
                    {order.billingAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </h3>
              <div className="space-y-3">
                {order.statusTimeline?.map((timeline, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${timeline.completed
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                        }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${timeline.completed ? "text-green-700" : "text-gray-500"}`}
                      >
                        {timeline.status}
                      </p>
                      {timeline.date && (
                        <p className="text-sm text-gray-500">{timeline.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Products</h3>
              <div className="space-y-4">
               {Array.isArray(order.products) && order.products.length > 0 ? (
  order.products.map((product, index) => (
    <div
      key={index}
      className="flex items-center gap-4 rounded-lg border p-4"
    >
      <Image
        src={product?.images?.[0] || "/placeholder.jpg"}
        alt={product?.title || "Product Image"}
        width={64}
        height={64}
        className="h-16 w-16 rounded object-contain"
      />
      <div className="flex-1">
        <h4 className="font-medium">{product?.title || "No Title"}</h4>
        <p className="text-sm text-gray-600">{product?.variant || "N/A"}</p>
        <p className="text-sm">Quantity: {product?.quantity || 0}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">₹{product?.price?.toFixed(2) || "0.00"}</p>
        <p className="text-sm text-gray-600">
          Subtotal: ₹{product?.subtotal?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  ))
) : (
  <p>No products found in this order.</p>
)}

              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
              <div className="ml-auto max-w-md space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingCharges}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.tax}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 border-t pt-6">
              {/* <button
                onClick={() => handleStatusUpdate(order._id, "Shipped")}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Truck className="h-4 w-4" />
                Mark as Shipped
              </button> */}
              {/* <button
                onClick={() => handleStatusUpdate(order._id, "Delivered")}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                Mark as Delivered
              </button> */}
              {/* <button
                onClick={() => handleRefund(order._id)}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Issue Refund
              </button> */}
              <button
                onClick={() => handlePrintInvoice(order)}
                className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>
              <button
                onClick={() => handleDownloadInvoice(order)}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
  <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.length}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {orders.filter((o) => o.orderStatus === "Pending").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Shipped Orders
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {orders.filter((o) => o.orderStatus === "Shipped").length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹
                  {orders
                    .reduce((sum, order) => sum + order.totalAmount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
  <div className="mb-6 rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={filters.search.trim()}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            <select
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={filters.paymentStatus}
              onChange={(e) =>
                setFilters({ ...filters, paymentStatus: e.target.value })
              }
            >
              <option value="">Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={filters.paymentMethod}
              onChange={(e) =>
                setFilters({ ...filters, paymentMethod: e.target.value })
              }
            >
              <option value="">Payment Method</option>
              <option value="Razorpay">Razorpay</option>
              <option value="COD">COD</option>
              <option value="Stripe">Stripe</option>
            </select>

      <div className="flex gap-2">
              <button
                onClick={() => exportOrders(currentOrders)}
                className="flex items-center gap-2 rounded-lg bg-green-600 dark:bg-green-700 px-4 py-2 text-white hover:bg-green-700 dark:hover:bg-green-800"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
  <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order._id}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                          >
                            {/* {order.paymentStatus} */}
                            {order.paymentMethod}
                          </span>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">

                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order._id);
                              setShowOrderModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <select
                            className="rounded border border-gray-300 px-2 py-1 text-xs"
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstOrder + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastOrder, filteredOrders.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredOrders.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${currentPage === i + 1
                          ? "z-10 border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                          : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && (
        <OrderModal
          selectedOrder={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;