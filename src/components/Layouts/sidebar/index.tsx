"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }

            // Break the loop
            return true;
          }
        });
      });
    });
  }, [pathname,expandedItems]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[220px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-300 ease-out dark:border-gray-800 dark:bg-gray-900",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className=" border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <Link
                href={"/"}
                onClick={() => isMobile && toggleSidebar()}
                className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white"
              >
                <Logo  />
                <span>Brand</span>
              </Link>

              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <span className="sr-only">Close Menu</span>
                  <ArrowLeftIcon className="size-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6 shadow-[30px]">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-8">
                <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <item.icon
                                className="size-5 shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                                aria-hidden="true"
                              />

                              <span className="flex-1 text-left text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                                {item.title}
                              </span>

                              <ChevronUp
                                className={cn(
                                  "size-4 shrink-0 text-gray-500 transition-transform duration-200",
                                  expandedItems.includes(item.title) 
                                    ? "rotate-0" 
                                    : "rotate-180",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-8 mt-2 space-y-1 border-l border-gray-200 pl-4 dark:border-gray-700"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                      className={cn(
                                        "block rounded-md px-3 py-2 text-sm transition-colors",
                                        pathname === subItem.url
                                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                      )}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                  item.title.toLowerCase().split(" ").join("-");

                            return (
                              <MenuItem
                                className={cn(
                                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                  pathname === href
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                )}
                                as="link"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  className={cn(
                                    "size-5 shrink-0 transition-colors",
                                    pathname === href
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                                  )}
                                  aria-hidden="true"
                                />

                                <span className="flex-1 text-left">
                                  {item.title}
                                </span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          {/* Footer */}
          
        </div>
      </aside>
    </>
  );
}