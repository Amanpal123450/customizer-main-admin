'use client';

import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { CSVLink } from 'react-csv';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
  const token= localStorage.getItem("adminToken");
    try {
      const res= await fetch("http://localhost:4000/api/v1/payment/fetchAllPayments",{

        method:"GET",
        headers:{
    
             Authorization: `Bearer ${token}`,
        }
      })
      const data= await res.json();
      console.log(data)
      setPayments(data.allPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const queryMatch =
      payment.stripe_payment_intent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = filterStatus === '' || payment.status === filterStatus;
    const methodMatch = filterMethod === '' || payment.payment_method === filterMethod;

    return queryMatch && statusMatch && methodMatch;
  });

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const totalAmount = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSuccess = filteredPayments.filter(p => p.status === 'succeeded').length;
  const totalFailed = filteredPayments.filter(p => p.status === 'failed').length;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">💳 Total Payments: {filteredPayments.length}</div>
        <div className="bg-green-100 p-4 shadow rounded">✅ Success: {totalSuccess}</div>
        <div className="bg-red-100 p-4 shadow rounded">❌ Failed: {totalFailed}</div>
        <div className="bg-yellow-100 p-4 shadow rounded">💰 Revenue: ₹{(totalAmount / 100).toFixed(2)}</div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by Order ID or Email"
          className="border p-2 rounded w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          onChange={(e) => setFilterMethod(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Methods</option>
          <option value="stripe">Stripe</option>
          <option value="razorpay">Razorpay</option>
        </select>

        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="succeeded">Succeeded</option>
          <option value="failed">Failed</option>
        </select>

        <CSVLink
          data={filteredPayments}
          filename="payment-history.csv"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </CSVLink>

        <button
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Method</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment, index) => (
              <tr key={payment._id} className="text-center">
                <td className="p-2 border">{indexOfFirstPayment + index + 1}</td>
                <td className="p-2 border">{payment.stripe_payment_intent_id}</td>
                <td className="p-2 border">{payment.user.firstName} {payment.user.lastName}<br />{payment.user.email}</td>
                <td className="p-2 border">₹{(payment.amount / 100).toFixed(2)}</td>
                <td className="p-2 border">{payment.payment_method}</td>
                <td className="p-2 border">{payment.status}</td>
                <td className="p-2 border">{new Date(payment.createdAt).toLocaleString()}</td>
                <td className="p-2 border">
                  <button
                    className="bg-indigo-500 text-white px-2 py-1 rounded"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 my-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <p><strong>Order ID:</strong> {selectedPayment.stripe_payment_intent_id}</p>
            <p><strong>User:</strong> {selectedPayment.user.firstName} {selectedPayment.user.lastName} ({selectedPayment.user.email})</p>
            <p><strong>Method:</strong> {selectedPayment.payment_method}</p>
            <p><strong>Status:</strong> {selectedPayment.status}</p>
            <p><strong>Amount:</strong> ₹{(selectedPayment.amount / 100).toFixed(2)}</p>
            <p><strong>Currency:</strong> {selectedPayment.currency}</p>
            <p><strong>Time:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedPayment(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
