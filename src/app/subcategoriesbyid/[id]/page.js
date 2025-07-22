"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/showAllCategory",
        );
        const data = await res.json();

        // Find the category matching the current ID
        const foundCategory = data.data.find((cat) => cat._id === id);
        console.log(data);

        if (foundCategory) {
          setCategory(foundCategory);
          setSubCategories(foundCategory.subCategory || []);

          // Default: show all products from all subcategories
          const allProducts = foundCategory.subCategory.flatMap(
            (sub) => sub.products || [],
          );
          setProducts(allProducts);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
      }
    };

    if (id) fetchCategoryData();
  }, [id]);

  async function handleDelete(id) {
    const res = await fetch(
      `https://e-com-customizer.onrender.com/api/v1/deleteSubCategory/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await res.json();

    console.log(data);
    if (res.ok) {
      router.push("/categories");

      alert("successfuly SubCategory Delete ");
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
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold capitalize">{category.title}</h1>
        <Image
          src={category.images}
          alt={category.title}
          width={240} // w-60 = 60 × 4 = 240px
          height={240} // h-60 = 60 × 4 = 240px
          className="mx-auto h-60 w-60 rounded object-cover shadow"
        />
      </div>

      <div className="flex justify-between">
        <ul className="flex list-none flex-wrap justify-center gap-3">
          <li>
            <button
              className={`rounded px-4 py-2 ${!activeSubId ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={handleAllClick}
            >
              All
            </button>
          </li>

          {subCategories.map((sub) => (
            <li key={sub._id} className="flex items-center gap-2">
              <button
                className={`rounded px-4 py-2 ${
                  activeSubId === sub._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleSubCategoryClick(sub._id)}
              >
                {sub.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-center gap-4">
          {activeSubId && (
            <>
              {/* 📝 Edit Icon wrapped in Link */}
              <Link href={`/edit_subcategories/${activeSubId}`}>
                <FiEdit2
                  className="cursor-pointer text-gray-600 transition hover:text-blue-600"
                  title="Edit Subcategory"
                  size={20}
                />
              </Link>

              {/* 🗑️ Delete Icon with onClick */}
              <FiTrash2
                onClick={() => handleDelete(activeSubId)}
                className="cursor-pointer text-gray-600 transition hover:text-red-600"
                title="Delete Subcategory"
                size={20}
              />
            </>
          )}
        </div>
      </div>

      {/* ✅ Product Grid */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded border bg-white p-4 shadow"
              >
                <Image
                  src={product.thumbnail?.[0]}
                  alt={product.title}
                  width={300} // example value
                  height={160} // h-40 = 160px
                  className="mb-2 h-40 w-full rounded object-contain"
                />
                <h3 className="text-lg font-bold">{product.title}</h3>
                <p className="mb-1 text-sm text-gray-600">
                  {product.description}
                </p>
                <p className="font-semibold text-blue-600">
                  ₹{product.price?.toLocaleString()}
                </p>
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
