"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { confirmDialog } from "@/components/ui/confirm";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subcategories</h1>
      <Link href="/admin/new_subcategories" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Subcategory
      </Link>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((s) => (
            <tr key={s._id}>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.categoryName || s.categoryId}</td>
              <td className="p-2 space-x-2">
                <Link href={`/admin/edit_subcategories${s._id}`} className="text-blue-600">Edit</Link>
                <button onClick={() => handleDelete(s._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
