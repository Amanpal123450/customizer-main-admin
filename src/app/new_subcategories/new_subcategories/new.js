"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';


export default function NewSubcategoryPage() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // ✅ Fetch all categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("Please upload a thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", categoryId);
    formData.append("thumbnail", thumbnail); 

    try {
      const res = await fetch("https://e-com-customizer.onrender.com/api/v1/createSubCategory", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "❌ Failed to create subcategory.");
        return;
      }

      alert("✅ Subcategory created successfully!");
      router.push("categories");
    } catch (err) {
      console.error("Create Subcategory Failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8 space-y-4"
    >
      <h1 className="text-xl font-bold text-center mb-4">Create New Subcategory</h1>

      <input
        type="text"
        placeholder="Subcategory Name"
        className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

     <select
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  required
>
  <option value="" disabled>
    Select Category
  </option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.title}
    </option>
  ))}
</select>


      <div>
        <label className="block font-medium mb-1">Thumbnail Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        {preview && (
         <Image
  src={preview}
  alt="Thumbnail Preview"
  width={96} // w-24 = 24 * 4 = 96px
  height={96} // h-24 = 24 * 4 = 96px
  className="mt-2 h-24 w-24 rounded object-cover"
/>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Create Subcategory
      </button>
    </form>
  );
}
