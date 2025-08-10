"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "@/components/ui/toast";
import { confirmDialog } from "@/components/ui/confirm";



export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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
        const token = localStorage.getItem("adminToken");
        if (!token) {
          router.push('/login');
          return null;
        }

        const res = await fetch(
          "http://localhost:4000/api/v1/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
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
  }, [router]);

  // Delete user

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog("Are you sure you want to delete this user?");
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `http://localhost:4000/api/v1/deleteUser/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete user");

  toast.success("User deleted successfully!");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
  toast.error("Failed to delete user.");
    }
  };

  // Helper to normalize strings: trim, collapse spaces, lowercase
  function normalize(str) {
    return (str || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  // Filter users based on normalized search term
  const filteredUsers = users.filter((user) => {
    const search = normalize(searchTerm);
    if (!search) return true;
    const name = normalize(`${user.firstName || ""} ${user.lastName || ""}`);
    const email = normalize(user.email);
    return name.includes(search) || email.includes(search);
  });

  return (
  <div className="rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Manage Users
        </h1>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 mb-2"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left font-semibold text-gray-700 dark:text-gray-200">
            <tr>
              <th className="border-b px-6 py-3">Name</th>
              <th className="border-b px-6 py-3">Email</th>
              <th className="border-b px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="border-b px-6 py-4 text-gray-800 dark:text-gray-100">
                    {`${user.firstName || ""} ${user.lastName || ""}`}
                  </td>
                  <td className="border-b px-6 py-4 text-gray-800 dark:text-gray-100">
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
                      <div className="absolute right-4 top-0 z-20 w-28 rounded border bg-white dark:bg-gray-900 shadow-md dark:border-gray-700">
                        <Link
                          href={`/edit_user/${user._id}`}
                          className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="block w-full border-t px-4 py-2 text-center text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                <td colSpan="3" className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
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
