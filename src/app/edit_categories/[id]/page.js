"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditSubCategory() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch subcategory details
  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    // try {
    //   if (id) {
    //     const res = await fetch(`https://ecomm-backend-7g4k.onrender.com/api/v1/getSubCategory/${id}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });

    //     const data = await res.json();
    //     const sub = data.subCategory;
    //     console.log(sub);

    //     setTitle(sub.title || "");
    //     setCategoryId(sub.category || "");
    //     setThumbnail(sub.thumbnail?.[0] || "");
    //   }

    //   // Fetch categories
    //   const catRes = await fetch("https://ecomm-backend-7g4k.onrender.com/api/v1/showAllCategory");
    //   const catData = await catRes.json();
    //   setCategories(catData.data || []);
    // } catch (err) {
    //   console.error("Error fetching data:", err);
    // }
  };

  fetchData();
}, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  
 const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
setCategoryId(id)
  // 🔥 Prepare form data
  const formData = new FormData();
  formData.append("title", title);
  // formData.append("categoryId", categoryId);

  if (imageFile) {
    formData.append("thumbnail", imageFile); // 👈 this is important
  }

  try {
    const res = await fetch(
      `https://e-com-customizer.onrender.com/api/v1/updateCategory/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ no content-type here for FormData
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update");
      return;
    }

    alert("✅ SubCategory updated successfully");
    router.push("/categories");
  } catch (err) {
    console.error("Update error:", err);
    alert("Something went wrong.");
  }
};


  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 shadow-md rounded">
      <h1 className="text-2xl font-semibold mb-6">Edit SubCategory</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          >
            {/* <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))} */}
          {/* </select>
        </div> */} 

       {/* <div>
          <label className="mb-1 block font-medium">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded border px-4 py-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 w-32 rounded object-cover"
            />
          )}
        </div> */}


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update SubCategory
        </button>
      </form>
    </div>
  );
}
