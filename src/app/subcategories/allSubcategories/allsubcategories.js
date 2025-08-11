"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { confirmDialog } from "@/components/ui/confirm";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/subcategories")
      .then((res) => res.json())
      .then(setSubcategories);
  }, []);

  const handleDelete = async (id) => {
  const confirmed = await confirmDialog("Are you sure?");
  if (confirmed) {
      await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
      setSubcategories(subcategories.filter((s) => s._id !== id));
    }
  };

  // Filter subcategories by name or category
  const filteredSubcategories = subcategories.filter((s) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;
    return (
      (s.name || "").toLowerCase().includes(search) ||
      (s.categoryName || s.categoryId || "").toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subcategories</h1>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Link href="/admin/new_subcategories" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">
          Add Subcategory
        </Link>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />
      </div>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubcategories.length > 0 ? (
            filteredSubcategories.map((s) => (
              <tr key={s._id}>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.categoryName || s.categoryId}</td>
                <td className="p-2 space-x-2">
                  <Link href={`/admin/edit_subcategories${s._id}`} className="text-blue-600">Edit</Link>
                  <button onClick={() => handleDelete(s._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">No subcategories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
