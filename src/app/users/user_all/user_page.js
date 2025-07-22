"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://e-com-customizer.onrender.com/api/v1/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data)
        if (!res.ok) throw new Error(data.message || "Failed to fetch users");

        const filteredUsers = (data.data || []).filter(
          (user) => user.role === "User"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://e-com-customizer.onrender.com/api/v1/deleteUser/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete user");

      alert("✅ User deleted successfully!");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete user.");
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Manage Users
        </h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-semibold text-gray-700">
            <tr>
              <th className="border-b px-6 py-3">Name</th>
              <th className="border-b px-6 py-3">Email</th>
              <th className="border-b px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="transition hover:bg-gray-50">
                  <td className="border-b px-6 py-4 text-gray-800">
                    {`${user.firstName || ""} ${user.lastName || ""}`}
                  </td>
                  <td className="border-b px-6 py-4 text-gray-800">
                    {user.email}
                  </td>
                  <td className="relative border-b px-6 py-4 text-center dropdown-container">
                    <button onClick={() => toggleDropdown(user._id)}>
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="text-lg text-gray-600 hover:text-black"
                      />
                    </button>

                    {openDropdownId === user._id && (
                      <div className="absolute right-4 top-0 z-20 w-28 rounded border bg-white shadow-md">
                        <Link
                          href={`/edit_user/${user._id}`}
                          className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="block w-full border-t px-4 py-2 text-center text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
