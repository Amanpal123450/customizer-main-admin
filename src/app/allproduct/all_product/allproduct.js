"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://ecomm-backend-7g4k.onrender.com/api/v1/totalProduct");
      const data = await res.json();
      console.log(data)
      setProducts(data.AllProduct);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  fetchProducts();
}, []);


  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`https://ecomm-backend-7g4k.onrender.com/api/v1/deleteProduct/${id}`, { method: "DELETE" }); // You need to implement this API
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <Link
        href="/product"
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Product
      </Link>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">SubCategory ID</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-2">
                  <img
                    src={product.thumbnail?.[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2">{product.title}</td>
                <td className="p-2">{product.description}</td>
                <td className="p-2">₹{product.price}</td>
                <td className="p-2">{product.quantity}</td>
                <td className="p-2">{product.subCategory}</td>
                <td className="p-2 space-x-3">
                  <Link
                    href={`/edit_product/${product._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
