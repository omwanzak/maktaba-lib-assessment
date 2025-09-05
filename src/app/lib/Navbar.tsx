import Link from "next/link";
import { useAuth } from "../../lib/AuthContext";

export default function Navbar({ onSearch }: { onSearch?: (query: string) => void }) {
  const { user, logout } = useAuth();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black text-white shadow">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl">Maktaba</span>
        <button className="ml-4" aria-label="Search" onClick={() => onSearch && onSearch("")}> 
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <button onClick={logout} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">Logout</button>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">Login</Link>
        )}
      </div>
    </nav>
  );
}
