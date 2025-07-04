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
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Admin",
    email: "admin@example.com",
    profilePhoto: "/images/user/user-03.png",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user");
      if (!token || !userId) return;

      try {
        const res = await fetch(
          `https://ecomm-backend-7g4k.onrender.com/api/v1/getAdminById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (res.ok && result.data) {
          const admin = result.data;
          setUserData({
            name: `${admin.firstName || "Admin"} ${admin.lastName || ""}`,
            email: admin.email || "admin@example.com",
            profilePhoto: admin.thumbnail || "/images/user/user-03.png",
          });
        } else {
          console.error("Failed to load admin:", result.message);
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>
        <figure className="flex items-center gap-3">
          <Image
            src={userData.profilePhoto}
            className="size-12 rounded-full object-cover"
            alt={`Avatar of ${userData.name}`}
            width={48}
            height={48}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{userData.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0"
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={userData.profilePhoto}
            className="size-12 rounded-full object-cover"
            alt={`Avatar for ${userData.name}`}
            width={48}
            height={48}
          />
          <figcaption className="space-y-1 text-base font-medium">
            <div className="text-dark dark:text-white">{userData.name}</div>
            <div className="text-gray-6">{userData.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href="/profile"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon />
            <span className="mr-auto font-medium">View Profile</span>
          </Link>

          <Link
            href="/pages/settings"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <SettingsIcon />
            <span className="mr-auto font-medium">Account Settings</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2">
          <button
            onClick={() => {
              localStorage.clear();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-[#4B5563] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <LogOutIcon />
            <span className="font-medium">Log out</span>
          </button>
        </div>

        <div className="p-2">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-[#4B5563] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <LogOutIcon />
            <span className="font-medium">Login</span>
          </Link>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
