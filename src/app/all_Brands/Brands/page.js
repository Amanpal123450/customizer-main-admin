"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Upload,
} from "lucide-react";
import Image from "next/image";
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


export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
 
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    thumbnail: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const filteredData = brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase()) &&
        (status === "All" ||
          (status === "Active" && brand.active) ||
          (status === "Inactive" && !brand.active)),
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  }, [search, status, brands]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("thumbnail", file);
  };

 const handleAddUnit = async () => {
  const formData = new FormData();
  formData.append("name", form.name);

  formData.append("metaTitle", form.metaTitle);
  formData.append("metaDescription", form.metaDescription);
  formData.append("keywords", form.keywords);
  formData.append("thumbnail", form.thumbnail); // binary file

  try {
    const res = await fetch("https://e-com-customizer.onrender.com/api/v1/createBrand", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      showToast("✅ Brand added: " + data.name);
    }
  } catch (err) {
    console.error(err);
    showToast("❌ Network error");
  }
};


  const handleUpdateUnit = async (id) => {
    console.log("sdcs");

    const formData = new FormData();
  formData.append("name", form.name);

  formData.append("metaTitle", form.metaTitle);
  formData.append("metaDescription", form.metaDescription);
  formData.append("keywords", form.keywords);
  formData.append("thumbnail", form.thumbnail);
    try {
      const res = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/brand/${editId}`,
        {
          method: "PUT",

          body:formData,
        },
      );

      const data = await res.json();
      console.log(data);
      closeModal();
      // fetchUnits();

      if (res.ok) {
        showToast("Unit updated successfully!");
        setModalOpen(false);
        fetchUnits(); // call to refresh the unit list
      }
    } catch (error) {
      console.error("Error updating unit:", error);
      showToast("Something went wrong!");
    }
  };

  useEffect(() => {
    async function GetAllvariation() {
      const res = await fetch(
        "https://e-com-customizer.onrender.com/api/v1/totalBrands",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();
      console.log(result)
      console.log(result);
      setBrands(result); 
      setFiltered(result);
    }

    GetAllvariation();
  }, []);

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast("Brand name is required");
      return;
    }

    if (editing) {
      setBrands(
        brands.map((b) => (b.id === editing.id ? { ...b, ...form } : b)),
      );
    } else {
      const newBrand = {
        id: Date.now(),
        name: form.name,
        logo:
          form.logo ||
          `https://ui-avatars.com/api/?name=${form.name}&background=6366f1&color=fff`,
        active: form.active,
        sortOrder: form.sortOrder,
      };
      setBrands([...brands, newBrand]);
    }
    closeModal();
  };

  const openAddModal = () => {
    setForm({ name: form.name, active: form.active });
    setEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (unit) => {
    console.log(unit)
    setForm({ name: unit.name, active: unit.active });
    setEditId(unit);
    setEditing(true);
    setModalOpen(true);
  };

  const openModal = (brand) => {
    setEditing(brand || null);
    setForm({
      name: brand?.name || "",
      logo: brand?.logo || "",
      active: brand?.active ?? true,
      sortOrder: brand?.sortOrder || brands.length + 1,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ name: "", active: true, logo: "", sortOrder: 0 });
  };

  const handleDelete = async (id) => {
    console.log(id)
  if (!confirm("Are you sure you want to delete this brand?")) return;

  try {
    const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/brand/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (res.ok) {
      showToast("✅ Brand deleted successfully!");
      setBrands(brands.filter((b) => b._id !== id)); // Make sure you're using _id not id
    } else {
      showToast("❌ Failed to delete brand: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    showToast("❌ Network error: " + error.message);
  }
};


const toggleStatus = async (id) => {
  try {
    const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/brand/toggle/${id}`, {
      method: "PUT",
    });

    const data = await res.json();
    console.log("Toggle response:", data);

    if (res.ok) {
      // Update frontend state after successful toggle
      setBrands(
        brands.map((b) =>
          b._id === id ? { ...b, active: !b.active } : b
        )
      );
    } else {
      showToast(data.message || "Failed to toggle status.");
    }
  } catch (error) {
    console.error("Error toggling status:", error);
    showToast("Something went wrong!");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Brand Management
              </h1>
              <nav className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>/</span>
                <span>Products</span>
                <span>/</span>
                <span className="font-medium text-indigo-600">Brands</span>
              </nav>
            </div>
            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-indigo-700"
            >
              <Plus size={20} />
              Add New Brand
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Brands</p>
                <p className="text-2xl font-bold text-gray-900">
                  {brands.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <div className="h-6 w-6 rounded bg-indigo-600"></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Brands</p>
                <p className="text-2xl font-bold text-green-600">
                  {brands.filter((b) => b.active).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <div className="h-6 w-6 rounded-full bg-green-600"></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Brands</p>
                <p className="text-2xl font-bold text-red-600">
                  {brands.filter((b) => !b.active).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <div className="h-6 w-6 rounded-full bg-red-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search brands by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="min-w-[150px] appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-8 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sort Order
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.length > 0 ? (
                  paginatedData.map((brand, index) => (
                    <tr
                      key={brand._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              
                              src={
                                brand.logoUrl ||
                                `https://ui-avatars.com/api/?name=${brand.name}&background=6366f1&color=fff`
                              }
                              alt={brand.name}
                              width={50}
                              height={50}
                              className="h-full w-full object-contain "
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${brand.name}&background=6366f1&color=fff`;
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {brand.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => toggleStatus(brand._id)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          style={{
                            backgroundColor: brand.active
                              ? "#10b981"
                              : "#d1d5db",
                          }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              brand.active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`ml-3 text-sm font-medium ${brand.active ? "text-green-600" : "text-red-600"}`}
                        >
                          {brand.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {brand.sortOrder || 0}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(brand._id) }
                            className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                            title="Edit Brand"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(brand._id) }
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                            title="Delete Brand"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                          <Search size={24} className="text-gray-400" />
                        </div>
                        <p className="text-lg font-medium">No brands found</p>
                        <p className="text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filtered.length)} of{" "}
                  {filtered.length} brands
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                          currentPage === i + 1
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>

          <div className="z-10 my-10 max-h-[90vh] w-full max-w-md transform overflow-y-auto rounded-xl bg-white shadow-2xl transition-all">
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editing ? "Edit Brand" : "Add New Brand"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {editing
                  ? "Update brand information"
                  : "Create a new brand entry"}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 p-6">
              {/* Brand Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Brand Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Logo URL */}
              {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={form.logo}
                onChange={e => setForm({ ...form, logo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate logo</p>
            </div> */}

              {/* Sort Order */}
              {/* <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: +e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div> */}

              {/* Meta Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <input
                  type="text"
                  placeholder="Type meta title"
                  value={form.metaTitle}
                  onChange={(e) =>
                    setForm({ ...form, metaTitle: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  placeholder="Type meta description"
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm({ ...form, metaDescription: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  placeholder="example, brand, ecommerce"
                  value={form.keywords}
                  onChange={(e) =>
                    setForm({ ...form, keywords: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Comma separated keywords for SEO
                </p>
              </div>

              {/* Thumbnail Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setForm({ ...form, thumbnail: e.target.files[0] });
                }}
              />

              {/* Active Toggle */}
              {/* <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    form.active ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <label className="text-sm font-medium text-gray-700">
                  Brand is {form.active ? "active" : "inactive"}
                </label>
              </div> */}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  editing ? handleUpdateUnit(form) : handleAddUnit(form)
                }
                className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {editing ? "Update Brand" : "Create Brand"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
