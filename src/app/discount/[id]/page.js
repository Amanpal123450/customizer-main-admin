"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Progress Section for Discount
function ProgressSection({ formData }) {
  // New fields for discount creation
  const fields = [
    { name: "discountType", label: "Discount Type" },
    { name: "discountValue", label: "Discount Value" },
    { name: "validFrom", label: "Valid From" },
    { name: "validTo", label: "Valid To" },
    { name: "terms", label: "Terms/Conditions" },
  ];

  const isFilled = (name) => formData[name] && formData[name].toString().trim() !== "";

  return (
    <div className="w-full md:w-72 ml-0 md:ml-8 mt-8 md:mt-0 bg-gray-50 rounded shadow p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-6">Progress</h2>
      <div className="relative flex flex-col items-center pt-2" style={{ minHeight: `${fields.length * 46}px` }}>
        {fields.map((field, idx) => {
          const filled = isFilled(field.name);
          const prevFilled = idx === 0 ? false : isFilled(fields[idx - 1].name);

          return (
            <div key={field.name} className="flex flex-col items-center">
              {/* Connector Line Above */}
              {idx > 0 && (
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    background: prevFilled
                      ? "linear-gradient(to bottom, #4ADE80, #4ADE80)"
                      : "linear-gradient(to bottom, #E5E7EB, #E5E7EB)",
                    height: "28px",
                  }}
                  transition={{ duration: 0.35 }}
                  className="w-1 rounded-full"
                  style={{
                    width: "3px", minHeight: "28px",
                    marginBottom: "0.2rem"
                  }}
                ></motion.div>
              )}
              {/* Bullet/Point */}
              <motion.div
                layout
                initial={false}
                animate={{
                  backgroundColor: filled ? "#bbf7d0" : "#E5E7EB",
                  borderColor: filled ? "#4ADE80" : "#D1D5DB",
                  scale: filled ? 1.14 : 1,
                  boxShadow: filled
                    ? "0 0 0px 6px #bbf7d066"
                    : "0 0 0px 0px transparent",
                }}
                transition={{
                  duration: 0.24,
                  scale: { type: "spring", stiffness: 300, damping: 15 },
                }}
                className={`z-10 border-2 flex items-center justify-center`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "9999px",
                  marginBottom: 8,
                  marginTop: 2,
                }}
              >
                {/* Animated check if filled */}
                <AnimatePresence>
                  {filled && (
                    <motion.svg
                      key="check"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 20 20"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <motion.path
                        d="M6 10.5l3 3 5-5"
                        stroke="#22C55E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2, delay: 0.04 }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* Label */}
              <div style={{ minHeight: "22px", marginBottom: "0.7rem" }}>
                <motion.span
                  layout
                  initial={false}
                  animate={{
                    color: filled ? "#22C55E" : "#6B7280",
                    fontWeight: filled ? 700 : 500,
                    scale: filled ? 1.04 : 1,
                  }}
                  className="ml-2"
                  style={{ fontSize: "1rem", display: "inline-block" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  {field.label}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------
//  MAIN COMPONENT
// ------------------------
export default function CreateDiscount() {
  const router = useRouter();
  const params = useParams();


  const [formData, setFormData] = useState({
    discountType: "",
    discountValue: "",
    validFrom: "",
    validTo: "",
    terms: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [discounts, setDiscounts] = useState([]);

  // ------------------------
  // Handlers
  // ------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ------------------------
  // Submit Handler
  // ------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (
      !formData.discountType || !formData.discountValue ||
      !formData.validFrom || !formData.validTo || !formData.terms
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/discounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: params.id, // product ID from URL
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      router.push("/allproduct"); // Go to product page or elsewhere after creation.
    } catch (err) {
      setError("Error creating discount");
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Discounts.

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/discounts`);
        console.log("Fetching Discounts...");

        if (!res.ok) {
          throw new Error("Failed to fetch discounts");

        }
        const data = await res.json();
        setDiscounts(data.data);
        console.log(data.data)
        console.log("Fetched Discounts:", data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchDiscounts();
  }, [])


  // // compare discount id with product id 
  // const filteredDiscounts = discounts.filter(discount => discount.product === params.id);
  // console.log("Filtered Discounts:", filteredDiscounts);

  // --- Animations
  const formVariant = {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.1, duration: 0.4 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    // Validation
    if (
      !formData.discountType || !formData.discountValue ||
      !formData.validFrom || !formData.validTo || !formData.terms
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/discounts/${filteredDiscounts[0]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: params.id, // product ID from URL
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      router.push("/allproduct"); // Go to product page or elsewhere after creation.
    } catch (err) {
      setError("Error creating discount");
    } finally {
      setLoading(false);
    }
  };

  const filteredDiscounts = discounts.filter(discount => discount.product === params.id);
  console.log("Filtered Discounts:", filteredDiscounts);

  // Issue 2: Add safety checks in deleteDiscount function
  const deleteDiscount = async () => {
    // Check if there are any discounts to delete
    if (!filteredDiscounts || filteredDiscounts.length === 0) {
      setError("No discount found to delete");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://e-com-customizer.onrender.com/api/v1/discounts/${filteredDiscounts[0]._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // Refresh the discounts list after successful deletion
      const updatedDiscounts = discounts.filter(discount => discount._id !== filteredDiscounts[0]._id);
      setDiscounts(updatedDiscounts);

      router.push("/allproduct");
    } catch (err) {
      setError("Error deleting discount");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col md:flex-row mx-auto mt-8 max-w-5xl">
      {/* LEFT: FORM */}
      <div className="flex-1">
        <div className="mx-auto max-w-full rounded bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Create Discount
          </h1>
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl px-8 py-8 max-w-2xl mx-auto"
            variants={formVariant}
            initial="hidden"
            animate="visible"
          >
            {/* Discount Type */}
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">Product</label>
              <input
                type="text"
                value={params.id || ""}
                readOnly
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 cursor-not-allowed"
              />
            </motion.div>
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
              >
                <option value="">Select Type</option>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </motion.div>

            {/* Discount Value */}
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">
                Discount Value {formData.discountType === "percentage" ? "(%)" : formData.discountType === "fixed" ? "(₹)" : ""}
              </label>
              <input
                type="number"
                name="discountValue"
                placeholder="e.g. 10"
                value={formData.discountValue}
                onChange={handleChange}
                required
                min={1}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
              />
            </motion.div>

            {/* Valid From & To */}
            <motion.div variants={itemVariant} className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Valid From</label>
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block font-bold text-gray-800">Valid To</label>
                <input
                  type="date"
                  name="validTo"
                  value={formData.validTo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50"
                />
              </div>
            </motion.div>

            {/* Terms/Conditions */}
            <motion.div variants={itemVariant}>
              <label className="mb-1 block font-bold text-gray-800">Discount Terms/Conditions</label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Eg: Offer valid for first 100 users, Min order ₹500, Will not combine with other offers, etc."
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50 resize-none"
              />
            </motion.div>

            {/* Error Msg */}
            {error && <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >{error}</motion.p>}

            <div className="buttons flex gap-4">


              <motion.button
                variants={itemVariant}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03, }}
                className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white text-lg transition hover:bg-blue-600 shadow-sm"
                style={{ minHeight: 48 }}
              >

                {loading ? "Creating..." : "Create Discount"}
              </motion.button>



              <motion.button
                variants={itemVariant}
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                className="w-full rounded-lg bg-green-500 py-2 font-semibold text-white text-lg transition hover:bg-green-600 shadow-sm"
                style={{ minHeight: 48 }}
              >
                {loading ? "Updating..." : "Update Discount"}
              </motion.button>

              <motion.button
                variants={itemVariant}
                type="button"
                onClick={deleteDiscount}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                className="w-full rounded-lg bg-red-500 py-2 font-semibold text-white text-lg transition hover:bg-red-600 shadow-sm"
                style={{ minHeight: 48 }}
              >
                {loading ? "Deleting..." : "Delete Discount"}
              </motion.button>

            </div>
          </motion.form>

          {/* Display Existing Discounts */}

        </div>
      </div>
      {/* RIGHT: PROGRESS */}
      <ProgressSection formData={formData} />
    </div>
  );
}
