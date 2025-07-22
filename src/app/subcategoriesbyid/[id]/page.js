"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
// import { useRouter } from "next/router";
import {useRouter } from "next/navigation";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSubId, setActiveSubId] = useState(null);
    const router = useRouter();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch("https://e-com-customizer.onrender.com/api/v1/showAllCategory");
        const data = await res.json();

        // Find the category matching the current ID
        const foundCategory = data.data.find((cat) => cat._id === id);
    console.log(data)

        if (foundCategory) {
          setCategory(foundCategory);
          setSubCategories(foundCategory.subCategory || []);
         
          // Default: show all products from all subcategories
          const allProducts = foundCategory.subCategory.flatMap((sub) => sub.products || []);
          setProducts(allProducts);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };

    if (id) fetchCategoryData();
  }, [id]);


async  function handleDelete(id){
     const res= await fetch(`https://e-com-customizer.onrender.com/api/v1/deleteSubCategory/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

     const data = await res.json();

     console.log(data);
     if(res.ok){
       router.push("/categories");

       alert("successfuly SubCategory Delete ")
     }
  }

  const handleSubCategoryClick = (subId) => {
    setActiveSubId(subId);
    
    const sub = subCategories.find((s) => s._id === subId);
    setProducts(sub?.products || []);
  };
  // console.log(activeSubId);

  const handleAllClick = () => {
    setActiveSubId(null);
    const allProducts = subCategories.flatMap((s) => s.products || []);
    setProducts(allProducts);
  };

  if (!category) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
 
      <div className="text-center">
        <h1 className="text-3xl font-bold capitalize mb-2">{category.title}</h1>
        <img
          src={category.images}
          alt={category.title}
          className="mx-auto w-60 h-60 object-cover rounded shadow"
        />
      </div>

   <div className="flex justify-between">
     <ul className="flex flex-wrap justify-center gap-3 list-none">
  <li>
    <button
      className={`px-4 py-2 rounded ${!activeSubId ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      onClick={handleAllClick}
    >
      All
    </button>
  </li>

  {subCategories.map((sub) => (
    <li key={sub._id} className="flex items-center gap-2">
      <button
        className={`px-4 py-2 rounded ${
          activeSubId === sub._id ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleSubCategoryClick(sub._id)}
      >
        {sub.title}
      </button>

     
    </li>
    
  ))}
  
</ul>
<div className="flex items-center justify-center gap-4 mt-4">
  {activeSubId && (
    <>
      {/* 📝 Edit Icon wrapped in Link */}
      <Link href={`/edit_subcategories/${activeSubId}`}>
        <FiEdit2
          className="text-gray-600 hover:text-blue-600 cursor-pointer transition"
          title="Edit Subcategory"
          size={20}
        />
      </Link>

      {/* 🗑️ Delete Icon with onClick */}
      <FiTrash2
        onClick={() => handleDelete(activeSubId)}
        className="text-gray-600 hover:text-red-600 cursor-pointer transition"
        title="Delete Subcategory"
        size={20}
      />
    </>
  )}
</div>

      </div>


      {/* ✅ Product Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border p-4 rounded shadow bg-white">
                <img
                  src={product.thumbnail?.[0]}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-2 rounded"
                />
                <h3 className="font-bold text-lg">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{product.description}</p>
                <p className="text-blue-600 font-semibold">₹{product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found for this subcategory.</p>
        )}
      </div>
    </div>
  );
}
