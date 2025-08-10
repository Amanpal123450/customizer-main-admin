"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faEdit,
  faTrash,
  faPlus,
  faImage,
  faSearch,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  // All hooks at the top
  const [products, setProducts] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [discounts, setDiscounts] = useState([]);
  const [discountLookup, setDiscountLookup] = useState({});
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Get token from localStorage (with error handling)
  useEffect(() => {
    try {
      const t = localStorage.getItem("adminToken");
      setToken(t);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setToken("");
    }
  }, []);

  // Redirect if no token
  useEffect(() => {
    if (token === null) return; // Wait for token to be set
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // Set current page to 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDropdown = event.target.closest("[data-dropdown]");
      const isToggleButton = event.target.closest("[data-dropdown-toggle]");
      if (!isInsideDropdown && !isToggleButton) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/totalProduct");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const productsList = data.AllProduct || data.products || [];
        setProducts(Array.isArray(productsList) ? productsList.reverse() : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        showToast("Failed to fetch products", "error");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Fetch discounts
  useEffect(() => {
    async function fetchDiscounts() {
      if (!token) return;

      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/discounts");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const discountArray = Array.isArray(data?.data) ? data.data : [];
        setDiscounts(discountArray);
        
        const lookup = {};
        discountArray.forEach(discount => {
          if (discount.product && discount.discountValue) {
            lookup[discount.product] = discount.discountValue;
          }
        });
        setDiscountLookup(lookup);
      } catch (e) {
        console.error("Failed to fetch discounts", e);
        showToast("Failed to fetch discounts", "error");
        setDiscounts([]);
        setDiscountLookup({});
      }
    }
    fetchDiscounts();
  }, [token]);

  // Toast notification function
  const showToast = (message, type = "info") => {
    // Simple console log for now - can be replaced with actual toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In a real app, you'd use react-hot-toast or similar
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Confirmation dialog
  const confirmDialog = (message) => {
    return new Promise((resolve) => {
      const result = window.confirm(message);
      resolve(result);
    });
  };

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Page change handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (product.title || "").toLowerCase().includes(searchLower) ||
      (product.description || "").toLowerCase().includes(searchLower) ||
      (product.subCategory?.title || "").toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Early returns only after all hooks
  if (token === null) return null;
  if (!token) return null;

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Handle edge case where totalPages is 1 or 0
    if (totalPages <= 1) return [1];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates and ensure proper order
    return [...new Set(rangeWithDots)];
  };

  // Calculate discounted price
  const getDiscountedPrice = (originalPrice, productId) => {
    const discountPercentage = discountLookup[productId] || 0;
    if (discountPercentage > 0 && originalPrice) {
      const discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);
      return Math.max(0, discountedPrice); // Ensure price doesn't go negative
    }
    return originalPrice || 0;
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        showToast("Authentication token not found", "error");
        return;
      }

      const confirmed = await confirmDialog("Are you sure you want to delete this product?");
      if (!confirmed) return;

      const response = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/deleteProduct/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setOpenDropdownId(null);
        showToast("Product deleted successfully", "success");
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || "Failed to delete product", "error");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Error deleting product", "error");
    }
  };

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      showToast("No data to export.", "info");
      return;
    }

    try {
      const headers = ["Title", "Description", "Price", "Discounted Price", "Discount %", "Stock", "SubCategory"];
      const rows = filteredProducts.map((product) => {
        const discountPercentage = discountLookup[product._id] || 0;
        const discountedPrice = getDiscountedPrice(product.price, product._id);

        return [
          `"${(product.title || "").replace(/"/g, '""')}"`,
          `"${(product.description || "").replace(/"/g, '""')}"`,
          product.price || 0,
          discountedPrice.toFixed(2),
          `${discountPercentage}%`,
          product.quantity || 0,
          `"${(product.subCategory?.title || "").replace(/"/g, '""')}"`,
        ];
      });

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast("CSV exported successfully", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Failed to export CSV", "error");
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded bg-gray-200 dark:bg-gray-800"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Framer Motion Variants
  const productRowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, type: "spring", stiffness: 80 },
    }),
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
  };

  return (
    <div className="overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 shadow-lg">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-white">All Products</h1>
          <Link
            href="/product"
            className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-900 px-4 py-2 font-medium text-blue-600 shadow-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="text-sm" />
              Add Product
            </motion.span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between border-b bg-gray-50 dark:bg-gray-800 p-6">
        <div className="relative max-w-md flex-1">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            type="button"
            disabled={filteredProducts.length === 0}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-3 text-white transition-colors hover:bg-gray-700"
          >
            <Printer className="h-4 w-4" />
            Print
          </motion.button>
        </div>
      </div>

      {/* Products Count */}
      <div className="border-b bg-gray-50 dark:bg-gray-800 px-6 py-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}-
          {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
          {filteredProducts.length} products
          {products.length !== filteredProducts.length &&
            ` (filtered from ${products.length} total)`}
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Image
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Product Details
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Price
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Stock
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Category
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Discount
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => {
                const discountPercentage = discountLookup[product._id] || 0;
                const discountedPrice = getDiscountedPrice(product.price, product._id);
                const hasDiscount = discountPercentage > 0;

                return (
                  <motion.tr
                    key={product._id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={productRowVariants}
                    className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {/* Image */}
                    <td className="px-4 py-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title || "Product image"}
                            width={64}
                            height={64}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div className={`${product.images?.[0] ? 'hidden' : 'flex'} h-full w-full items-center justify-center`}>
                          <FontAwesomeIcon
                            icon={faImage}
                            className="text-xl text-gray-400"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Product Details */}
                    <td className="px-4 py-4 max-w-xs">
                      <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
                        {truncateText(product.title, 30)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {truncateText(product.description, 60)}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <span className="text-lg font-semibold text-green-600">
                              ₹{discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price?.toLocaleString() || "N/A"}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-green-600">
                            ₹{product.price?.toLocaleString() || "N/A"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (product.quantity || 0) > 10
                            ? "bg-green-100 text-green-800"
                            : (product.quantity || 0) > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity || 0} units
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {product.subCategory?.title || "No Category"}
                      </span>
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start">
                        <span
                          className={`text-sm font-semibold ${
                            hasDiscount ? "text-purple-600" : "text-gray-500"
                          }`}
                        >
                          {discountPercentage}%
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-green-600 font-medium">
                            Save ₹{((product.price || 0) - discountedPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="relative px-4 py-4 text-center">
                      <button
                        onClick={() => toggleDropdown(product._id)}
                        data-dropdown-toggle
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Toggle actions menu"
                      >
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdownId === product._id && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={dropdownVariants}
                            className="absolute right-0 top-12 z-30 w-32 rounded-lg border bg-white dark:bg-gray-800 shadow-lg"
                            data-dropdown
                          >
                            <Link
                              href={`/edit_product/${product._id}`}
                              className="flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm text-blue-600 transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-gray-700"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-xs" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="flex w-full items-center gap-2 border-t px-4 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-gray-700"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs" />
                              Delete
                            </button>
                            <Link
                              className="flex items-center gap-2 rounded-b-lg border-t px-4 py-2 text-sm text-green-600 transition-colors duration-150 hover:bg-green-50 dark:hover:bg-gray-700"
                              href={`/discount/${product._id}`}
                            >
                              <FontAwesomeIcon icon={faTag} className="text-xs" />
                              Discount
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-4xl text-gray-400"
                    />
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "No products found matching your search."
                        : "No products found."}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t bg-gray-50 dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <nav className="flex items-center gap-1">
              {/* Previous Button */}
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400"
                    : "border border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
                }`}
              >
                Previous
              </motion.button>

              {/* Page Numbers */}
              {getPaginationNumbers().map((pageNumber, index) => (
                <span key={index}>
                  {pageNumber === "..." ? (
                    <span className="px-3 py-1 text-gray-400">...</span>
                  ) : (
                    <motion.button
                      onClick={() => handlePageChange(pageNumber)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {pageNumber}
                    </motion.button>
                  )}
                </span>
              ))}

              {/* Next Button */}
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400"
                    : "border border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
                }`}
              >
                Next
              </motion.button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}