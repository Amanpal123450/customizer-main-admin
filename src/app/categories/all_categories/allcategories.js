"use client";

import { useEffect, useState } from "react";
import { confirmDialog } from "@/components/ui/confirm";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
const { useRouter } = require("next/navigation");

import {
  faEllipsisVertical,
  faPlus,
  faEdit,
  faTrash,
  faImage,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import "toastify-js/src/toastify.css";
import Toastify from "toastify-js";


const showToast = (text, type = "success") => {
  Toastify({
    text,
    duration: 3000,
    gravity: "top",
    position: "right",
    close: true,
    backgroundColor: type === "success" ? "#4BB543" : "#FF3E3E", // green or red
  }).showToast();
};

export default function CategoriesPage1() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
const  router = useRouter();
  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };


  // Always filter categories when categories or searchTerm changes
  useEffect(() => {
    const search = (searchTerm || "").trim().toLowerCase();
    let filtered;
    if (!search) {
      filtered = categories;
    } else {
      filtered = categories.filter((cat) =>
        ((cat.title || "") + " " + (cat.description || "")).toLowerCase().includes(search)
      );
    }
    // Sort alphabetically by title
    filtered = [...filtered].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/showAllCategory",
        );

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        const categoryData = data.data || [];
        setCategories(categoryData);
        setFilteredCategories(categoryData);
        setError(null);
        console.log(data)
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
    const token = localStorage.getItem("adminToken");
    if (!token) {
      showToast("Authentication required. Please login first.");
      router.push('/login')
      return;
    }

    const confirmed = await confirmDialog("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      // Fetch product and subcategory counts before deleting
      const [prodRes, subRes] = await Promise.all([
        fetch(`https://e-com-customizer.onrender.com/api/v1/getProductsByCategoryId/${id}`),
        fetch(`https://e-com-customizer.onrender.com/api/v1/fetchAllSubCategoryOfCategory/${id}`)
      ]);
      const prodData = await prodRes.json();
      const subData = await subRes.json();
      const productCount = Array.isArray(prodData.products) ? prodData.products.length : 0;
      const subCatCount = Array.isArray(subData.data) ? subData.data.length : 0;

      const res = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/deleteCategory/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.ok) {
        showToast(`Category deleted. It had ${productCount} product(s) and ${subCatCount} subcategory(ies).`, "success");
        const updatedCategories = categories.filter((c) => c._id !== id);
        setCategories(updatedCategories);
        // Re-apply filter after delete
        const search = (searchTerm || "").trim().toLowerCase();
        let filtered;
        if (!search) {
          filtered = updatedCategories;
        } else {
          filtered = updatedCategories.filter((cat) =>
            ((cat.title || "") + " " + (cat.description || "")).toLowerCase().includes(search)
          );
        }
        filtered = [...filtered].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        setFilteredCategories(filtered);
      } else {
        showToast(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete category. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center font-medium text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm">
          <div className="border-gray-200 dark:border-gray-700 px-6 py-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">Categories</h1>
                <p className="mt-1 text-blue-400 dark:text-blue-300">
                  Manage your product categories • {filteredCategories.length}{" "}
                  of {categories.length} categories
                </p>
              </div>
              <Link
                href="/new_categories"
                className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-4 py-2 font-medium text-blue-600 dark:text-blue-400 shadow-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faPlus} className="text-sm" />
                Add Category
              </Link>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="relative max-w-md flex-1">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-10 pr-4 text-black dark:text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {filteredCategories.length}{" "}
                  {filteredCategories.length === 1 ? "category" : "categories"}
                </span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <FontAwesomeIcon icon={faFilter} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Filter</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredCategories.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-6 text-8xl text-gray-300 dark:text-gray-700">📂</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {searchTerm ? "No categories found" : "No categories yet"}
                </h3>
                <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? `No categories match "${searchTerm}". Try adjusting your search.`
                    : "Get started by creating your first category to organize your products."}
                </p>
                {!searchTerm && (
                  <Link
                    href="/new_categories"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                    Create First Category
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-400 hover:shadow-lg"
                  >
                    {/* 🔥 overflow-hidden removed above in this div */}
                    <Link href={`/subcategoriesbyid/${cat._id}`}>
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        {cat.images ? (
                          <Image
                            src={cat.images}
                            alt={cat.title}
                            width={300}
                            height={200}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                          style={{ display: cat.images ? "none" : "flex" }}
                        >
                          <FontAwesomeIcon
                            icon={faImage}
                            className="text-3xl"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
                      </div>
                    </Link>

                    <div className="p-4 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {cat.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Category</p>
                        </div>

                        <div className="dropdown-container relative">
                          <button
                            onClick={() => toggleDropdown(cat._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                          >
                            <FontAwesomeIcon
                              icon={faEllipsisVertical}
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            />
                          </button>

                          {openDropdownId === cat._id && (
                            <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-10 z-30 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 shadow-lg duration-200">
                              <Link
                                href={`/edit_categories/${cat._id}`}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="w-4 text-blue-600 dark:text-blue-400"
                                />
                                Edit
                              </Link>
                              <hr className="my-1 border-gray-100 dark:border-gray-700" />
                              <button
                                onClick={async () => {
                                  // Prevent multiple modals
                                  if (window.__confirmDialogOpen) return;
                                  window.__confirmDialogOpen = true;
                                  await handleDelete(cat._id);
                                  setOpenDropdownId(null);
                                  window.__confirmDialogOpen = false;
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 transition-colors hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="w-4 text-red-500 dark:text-red-400"
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
