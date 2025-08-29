"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
// import { title } from "process";

export default function EditSubcategoryPage() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "" });
  
  const router = useRouter();



  const handleSubmit = async (e) => {
    e.preventDefault();
      const payload = {
    title: form.title, 
  };
   const res= await fetch(`https://backend-customizer.onrender.com/api/v1/updateSubCategory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

     if(res.ok){
       router.push("/categories");

  toast.success("Successfully updated the sub category")
     }
  };

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
  <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Subcategory</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Subcategory Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">-- Select --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Subcategory
          </button>
        </form>
      </div>
    </div>
  );
}
