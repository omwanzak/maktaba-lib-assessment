"use client";
import Link from "next/link";
import { useAuth } from "../../lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";

type NavbarProps = {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
};

export default function Navbar({ onSearch, showSearch = false }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const getNavLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case "admin":
        return (
          <div className="flex gap-4">
            <Link href="/admin" className={`hover:text-gray-300 ${pathname === "/admin" ? "text-blue-400" : ""}`}>
              Dashboard
            </Link>
            <Link href="/admin/books" className={`hover:text-gray-300 ${pathname === "/admin/books" ? "text-blue-400" : ""}`}>
              Manage Books
            </Link>
            <Link href="/admin/users" className={`hover:text-gray-300 ${pathname === "/admin/users" ? "text-blue-400" : ""}`}>
              Manage Users
            </Link>
          </div>
        );
      case "librarian":
        return (
          <div className="flex gap-4">
            <Link href="/librarian" className={`hover:text-gray-300 ${pathname === "/librarian" ? "text-blue-400" : ""}`}>
              Dashboard
            </Link>
            <Link href="/librarian/requests" className={`hover:text-gray-300 ${pathname === "/librarian/requests" ? "text-blue-400" : ""}`}>
              Book Requests
            </Link>
          </div>
        );
      case "reader":
        return (
          <div className="flex gap-4">
            <Link href="/reader" className={`hover:text-gray-300 ${pathname === "/reader" ? "text-blue-400" : ""}`}>
              Browse Books
            </Link>
            <Link href="/reader/my-books" className={`hover:text-gray-300 ${pathname === "/reader/my-books" ? "text-blue-400" : ""}`}>
              My Books
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black text-white shadow">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl">Maktaba</Link>
        {getNavLinks()}
      </div>
      
      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
