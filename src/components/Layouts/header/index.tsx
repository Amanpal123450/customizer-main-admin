"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-4 shadow-sm border-b dark:bg-gray-dark dark:border-stroke-dark md:px-6 lg:px-8">
      
      {/* Sidebar Toggle on Mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden border p-2 rounded-md dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A]"
        >
          <MenuIcon className="w-5 h-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {isMobile && (
          <Link href="/" className="ml-2 max-[430px]:hidden">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
              className="block"
            />
          </Link>
        )}

        {/* Page Title */}
        <div className="hidden xl:block">
          <h1 className="text-lg font-semibold text-dark dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Next.js Admin Dashboard Solution
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Optional Search Input */}
        <div className="relative hidden md:block">
          <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full border bg-gray-100 dark:bg-dark-2 dark:text-white dark:border-dark-3 outline-none focus:ring-1 focus:ring-primary"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <ThemeToggleSwitch />
        <Notification />
        <UserInfo />
      </div>
    </header>
  );
}
