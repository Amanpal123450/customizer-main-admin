"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faEdit,
  faTrash,
  faImage,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

export default function CategoriesPage1() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        cat.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        const categoryData = data.data || [];
        setCategories(categoryData);
        setFilteredCategories(categoryData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please login first.");
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/deleteCategory/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Category deleted successfully");
          const updatedCategories = categories.filter((c) => c._id !== id);
          setCategories(updatedCategories);
          setFilteredCategories(
            updatedCategories.filter((cat) =>
              cat.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        } else {
          alert(data.message || "Failed to delete category");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-medium">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200">
          <div className=" border-gray-200 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold  text-black">Categories</h1>
                <p className="text-blue-400 mt-1 ">
                  Manage your product categories • {filteredCategories.length} of{" "}
                  {categories.length} categories
                </p>
              </div>
              <Link
                href="/new_categories"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-600 px-4 py-2 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-md"
              >
                <FontAwesomeIcon icon={faPlus} className="text-sm" />
                Add Category
              </Link>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {filteredCategories.length}{" "}
                  {filteredCategories.length === 1 ? "category" : "categories"}
                </span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Filter</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-300 text-8xl mb-6">📂</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No categories found" : "No categories yet"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? `No categories match "${searchTerm}". Try adjusting your search.`
                    : "Get started by creating your first category to organize your products."}
                </p>
                {!searchTerm && (
                  <Link
                    href="/new_categories"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    Create First Category
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="group relative bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  >
                    {/* 🔥 overflow-hidden removed above in this div */}
                    <Link href={`/subcategoriesbyid/${cat._id}`}>
                      <div className="aspect-video relative overflow-hidden bg-gray-100 rounded-lg">
                        {cat.images ? (
                          <img
                            src={cat.images}
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 "
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50"
                          style={{ display: cat.images ? "none" : "flex" }}
                        >
                          <FontAwesomeIcon icon={faImage} className="text-3xl" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {cat.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">Category</p>
                        </div>

                        <div className="relative dropdown-container">
                          <button
                            onClick={() => toggleDropdown(cat._id)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <FontAwesomeIcon
                              icon={faEllipsisVertical}
                              className="text-gray-500 hover:text-gray-700"
                            />
                          </button>

                          {openDropdownId === cat._id && (
                            <div className="absolute right-0 top-10 z-30 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                              <Link
                                href={`/edit_categories/${cat._id}`}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="text-blue-600 w-4"
                                />
                                Edit
                              </Link>
                              <hr className="my-1 border-gray-100" />
                              <button
                                onClick={() => {
                                  handleDelete(cat._id);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="text-red-500 w-4"
                                />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
