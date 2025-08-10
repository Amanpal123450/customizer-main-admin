"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 🎉 Easter Egg: Motivational messages for developers
const EASTER_EGG_MESSAGES = [
  "✨ Another subcategory, another step toward world domination!",
  "🚀 You're basically a category wizard at this point!",
  "🎯 Plot twist: This subcategory might just change everything!",
  "⚡ Warning: Creating subcategories may cause sudden urges to organize your entire life",
  "🌟 Fun fact: 73% of successful businesses started with a well-organized subcategory",
  "🎪 Breaking news: Local developer creates subcategory, productivity increases by 200%!",
  "🔥 This subcategory is brought to you by caffeine and pure determination",
  "🎨 Picasso had his Blue Period, you have your Subcategory Period",
  "🏆 Achievement unlocked: Master of Digital Organization!",
  "🌈 Every subcategory is a small act of rebellion against chaos"
];

// 🎭 Easter Egg: Random loading messages
const LOADING_MESSAGES = [
  "Consulting the category gods...",
  "Organizing digital chaos...",
  "Summoning subcategory magic...",
  "Teaching pixels to behave...",
  "Bribing the database...",
  "Convincing APIs to cooperate..."
];

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

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSubId, setActiveSubId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();

  // 🎉 Modal form state
  const [title, setTitle] = useState("");
  const [images, setimages] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [easterEggMessage, setEasterEggMessage] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/showAllCategory",
        );
        const data = await res.json();

        const foundCategory = data.data.find((cat) => cat._id === id);
        console.log(data);

        if (foundCategory) {
          setCategory(foundCategory);
          setSubCategories(foundCategory.subCategory || []);
          setCategories(data.data || []); // Store all categories for modal

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

  // 🎭 Easter Egg: Cycle through loading messages
  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSubmitting]);

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
      showToast("Successfully deleted subcategory!");
    }
  }

  const handleSubCategoryClick = (subId) => {
    setActiveSubId(subId);
    const sub = subCategories.find((s) => s._id === subId);
    setProducts(sub?.products || []);
  };

  const handleAllClick = () => {
    setActiveSubId(null);
    const allProducts = subCategories.flatMap((s) => s.products || []);
    setProducts(allProducts);
  };

  // 🎉 Modal handlers
  const openModal = () => {
    setShowModal(true);
    // Easter Egg: Random motivational message
    setEasterEggMessage(EASTER_EGG_MESSAGES[Math.floor(Math.random() * EASTER_EGG_MESSAGES.length)]);
    setLoadingMessage(LOADING_MESSAGES[0]);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setimages(null);
    setPreview(null);
    setEasterEggMessage("");
    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimages(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!images) {
      showToast("Please upload a images image.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", id); // Use current category ID
    formData.append("images", images);

    try {
      // 🎭 Easter Egg: Add some dramatic pause
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch("https://e-com-customizer.onrender.com/api/v1/createSubCategory", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        showToast(result.message || "❌ Failed to create subcategory.");
        setIsSubmitting(false);
        return;
      }

      showToast("🎉 Subcategory created successfully! " + easterEggMessage);
      setIsSubmitting(false);
      closeModal();

      // Refresh the page data
      window.location.reload();
    } catch (err) {
      console.error("Create Subcategory Failed:", err);
      showToast("Something went wrong. The internet gremlins are at it again! 🤖");
      setIsSubmitting(false);
    }
  };

  if (!category) return <div className="p-6 text-center">
    <p className="text-lg">Loading category data...</p>
    <p className="text-sm text-gray-500 mt-2">🔮 Consulting the digital oracle...</p>
  </div>;

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold capitalize">{category.title}</h1>
          <Image
            src={category.images}
            alt={category.title}
            width={240}
            height={240}
            className="mx-auto h-60 w-60 rounded object-cover shadow"
          />
        </div>

        <div className="flex justify-between items-start">
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
                  className={`rounded px-4 py-2 ${activeSubId === sub._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                    }`}
                  onClick={() => handleSubCategoryClick(sub._id)}
                >
                  {sub.title}
                </button>
              </li>
            ))}



            {/* 🎉 Easter Egg: Add New Subcategory Button */}

          </ul>


          <div className="mt-4 flex items-center justify-center gap-4">
            {activeSubId && (
              <>
                <Link href={`/edit_subcategories/${activeSubId}`}>
                  <FiEdit2
                    className="cursor-pointer text-gray-600 transition hover:text-blue-600"
                    title="Edit Subcategory"
                    size={20}
                  />
                </Link>

                <FiTrash2
                  onClick={() => handleDelete(activeSubId)}
                  className="cursor-pointer text-gray-600 transition hover:text-red-600"
                  title="Delete Subcategory"
                  size={20}
                />

              </>
            )}
            <button
              onClick={openModal}
              className="rounded px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors items-center flex gap-2"
              title="Create new subcategory magic! ✨"
            >
              <FiPlus size={16} />
              New Sub
            </button>
          </div>

        </div>

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
                    src={product.images?.[0]}
                    alt={product.title}
                    width={300}
                    height={160}
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

      {/* 🎉 Easter Egg Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2">Create New Subcategory</h2>
              <p className="text-sm text-purple-600 italic">{easterEggMessage}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subcategory Name (make it epic! 🚀)"
                className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />

              <div>
                <label className="block font-medium mb-1">images Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
                {preview && (
                  <Image
                    src={preview}
                    alt="images Preview"
                    width={96}
                    height={96}
                    className="mt-2 h-24 w-24 rounded object-cover mx-auto"
                  />
                )}
              </div>

              {isSubmitting && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600 mt-2">{loadingMessage}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Magic..." : "Create ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}