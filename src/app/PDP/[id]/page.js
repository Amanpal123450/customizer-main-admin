"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function AdminProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/v1/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product || null);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg text-red-600 font-semibold mb-2">{error || "Product not found."}</p>
        <button onClick={() => router.back()} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
          <ArrowLeft className="w-5 h-5 text-blue-600" />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Product Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image src={product.images[0]} alt={product.title} width={400} height={400} className="object-contain w-full h-full" />
            ) : (
              <span className="text-gray-400 text-6xl">🖼️</span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            {product.images && product.images.length > 1 && product.images.map((img, idx) => (
              <Image key={idx} src={img} alt={product.title + idx} width={60} height={60} className="object-cover w-16 h-16 rounded-lg border border-gray-200" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-1">{product.title}</h2>
            <p className="text-gray-600 text-base mb-2">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Category: {product.subCategory?.title || "N/A"}</span>
              <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Brand: {product.brand || "N/A"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-green-600">₹{product.price?.toLocaleString() || "N/A"}</span>
              {product.discount && product.discount > 0 && (
                <span className="text-lg font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">{product.discount}% OFF</span>
              )}
              {product.oldPrice && (
                <span className="text-base text-gray-400 line-through">₹{product.oldPrice?.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${product.quantity > 10 ? "bg-green-100 text-green-800" : product.quantity > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{product.quantity > 10 ? "In Stock" : product.quantity > 0 ? "Low Stock" : "Out of Stock"} ({product.quantity || 0})</span>
              <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">SKU: {product.sku || product._id}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Product Details</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
              <li><strong>Category:</strong> {product.subCategory?.title || "N/A"}</li>
              <li><strong>Brand:</strong> {product.brand || "N/A"}</li>
              <li><strong>SKU:</strong> {product.sku || product._id}</li>
              <li><strong>Quantity:</strong> {product.quantity || 0}</li>
              <li><strong>Price:</strong> ₹{product.price?.toLocaleString() || "N/A"}</li>
              <li><strong>Discount:</strong> {product.discount ? product.discount + "%" : "0%"}</li>
              <li><strong>Status:</strong> {product.quantity > 0 ? "Active" : "Inactive"}</li>
              <li><strong>Created At:</strong> {product.createdAt ? new Date(product.createdAt).toLocaleString() : "N/A"}</li>
              <li><strong>Updated At:</strong> {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "N/A"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
