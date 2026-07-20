"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiSquaresFour, PiArmchair, PiSignOut } from "react-icons/pi";
import Logo from "@/components/Logo";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: PiSquaresFour },
  { name: "Products", href: "/admin/products", icon: PiArmchair },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <div className="scale-90">
            <Logo isDarkText={false} />
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <p className="font-secondary text-[10px] font-bold tracking-widest uppercase text-white/40 mb-4 px-4">
            Menu
          </p>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-[13px] font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gold/20 text-gold shadow-[0_0_15px_rgba(217,182,110,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`text-xl ${isActive ? "text-gold" : ""}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <PiSignOut className="text-xl" />
            Exit to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen bg-[#FDFBF7]">
        {children}
      </main>
    </div>
  );
}
