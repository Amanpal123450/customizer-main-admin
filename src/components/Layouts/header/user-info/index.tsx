"use client";

import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "Guest User",
    email: "guest@example.com",
    profilePhoto: "/images/user/user-03.png",
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("Admin_ID");
      
      if (!token || !userId) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const res = await fetch(
          `https://e-com-customizer.onrender.com/api/v1/getAdminById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        console.log(result);
        if (res.ok && result.data) {
          const admin = result.data;
          setUserData({
            name: `${admin.firstName || "Admin"} ${admin.lastName || ""}`.trim(),
            email: admin.email || "admin@example.com",
            profilePhoto: admin.thumbnail || "/images/user/user-03.png",
          });
        } else {
          console.error("Failed to load admin:", result.message);
          // If token is invalid, clear storage and set as logged out
          if (res.status === 401) {
            localStorage.clear();
            setIsLoggedIn(false);
          }
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
        // Network error, but keep user as logged in if token exists
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsOpen(false);
    router.push("/login");
  };

  const handleLogin = () => {
    setIsOpen(false);
    router.push("/login");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="hidden lg:block">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded-lg p-2 outline-none ring-primary ring-offset-2 focus-visible:ring-2 dark:ring-offset-gray-dark transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
        <span className="sr-only">My Account</span>
        <figure className="flex items-center gap-3">
          <div className="relative">
            {userData.profilePhoto && userData.profilePhoto !== "/images/user/user-03.png" ? (
              <Image
                src={userData.profilePhoto}
                className="size-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                alt={`Avatar of ${userData.name}`}
                width={40}
                height={40}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-700"
              style={{ display: userData.profilePhoto && userData.profilePhoto !== "/images/user/user-03.png" ? 'none' : 'flex' }}
            >
              {getInitials(userData.name)}
            </div>
            {isLoggedIn && (
              <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            )}
          </div>
          <figcaption className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300 max-lg:sr-only">
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">{userData.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isLoggedIn ? "Admin" : "Guest"}
              </span>
            </div>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "ml-2 size-4 rotate-180 transition-transform duration-200",
                isOpen && "rotate-0"
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 min-w-[280px] rounded-xl overflow-hidden"
        align="end"
      >
        {isLoggedIn ? (
          <>
            {/* User Profile Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
              <figure className="flex items-center gap-3">
                <div className="relative">
                  {userData.profilePhoto && userData.profilePhoto !== "/images/user/user-03.png" ? (
                    <Image
                      src={userData.profilePhoto}
                      className="size-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                      alt={`Avatar for ${userData.name}`}
                      width={48}
                      height={48}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-gray-700 shadow-sm"
                    style={{ display: userData.profilePhoto && userData.profilePhoto !== "/images/user/user-03.png" ? 'none' : 'flex' }}
                  >
                    {getInitials(userData.name)}
                  </div>
                  {/* <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div> */}
                </div>
                <figcaption className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">{userData.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{userData.email}</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">● Online</div>
                </figcaption>
              </figure>
            </div>

            <div className="py-2">
              <div className="px-2 space-y-1">
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="size-4" />
                  <span>View Profile</span>
                </Link>

                <Link
                  href="/pages/settings"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <SettingsIcon className="size-4" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <hr className="my-2 border-gray-200 dark:border-gray-600" />

              <div className="px-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                >
                  <LogOutIcon className="size-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Guest User Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4">
              <figure className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white dark:border-gray-700 shadow-sm">
                  {getInitials(userData.name)}
                </div>
                <figcaption className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white">Guest User</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Not logged in</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">● Offline</div>
                </figcaption>
              </figure>
            </div>

            <div className="p-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Sign in to access your account and manage your data
                </p>
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  <LogOutIcon className="size-4 rotate-180" />
                  <span>Sign In</span>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Don t have an account?{" "}
                  <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </>
        )}
      </DropdownContent>
    </Dropdown>
  );
}