"use client";
import { useEffect, useState } from "react";
import { useAuth, useAuthGuard } from "../../lib/AuthContext";
import { mockApi } from "../../lib/utils/mockApi";
import { useRouter } from "next/navigation";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";

interface Book {
  id: number;
  title: string;
  author: string;
  totalQuantity: number;
  availableQuantity: number;
}
interface BookLog {
  id: number;
  userId: number;
  bookId: number;
  action: string;
  date: string;
  approvedBy: number;
  user?: any;
  book?: any;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAllowed = useAuthGuard(["admin"]);

  const [stats, setStats] = useState<{ totalBooks: number; totalAvailable: number; totalBorrowed: number } | null>(null);
  const [bookLogs, setBookLogs] = useState<BookLog[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAllowed) router.replace("/login");
  }, [isAllowed, router]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [statsData, logs, bks] = await Promise.all([
        mockApi.getDashboardStats(),
        mockApi.getBookLogs(),
        mockApi.getBooks()
      ]);
      setStats(statsData);
      setBookLogs(logs);
      setBooks(bks);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Get all currently borrowed books
  const borrowedBooks = books.filter(b => b.totalQuantity > b.availableQuantity);

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{
        backgroundImage: 'url(/books-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded shadow p-4 text-center">
                  <div className="font-semibold">Total Books</div>
                  <div className="text-2xl font-bold">{stats?.totalBooks}</div>
                </div>
                <div className="bg-white rounded shadow p-4 text-center">
                  <div className="font-semibold">Borrowed Books</div>
                  <div className="text-2xl font-bold">{stats?.totalBorrowed}</div>
                </div>
                <div className="bg-white rounded shadow p-4 text-center">
                  <div className="font-semibold">Available Books</div>
                  <div className="text-2xl font-bold">{stats?.totalAvailable}</div>
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-2">Book Movement History</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">User</th>
                      <th className="p-2 text-left">Book</th>
                      <th className="p-2 text-left">Action</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookLogs.map(log => (
                      <tr key={log.id} className="border-t">
                        <td className="p-2">{log.user?.name}</td>
                        <td className="p-2">{log.book?.title}</td>
                        <td className="p-2 capitalize">{log.action}</td>
                        <td className="p-2">{log.date}</td>
                        <td className="p-2">{log.approvedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className="text-lg font-semibold mb-2">Currently Borrowed Books</h2>
              {borrowedBooks.length === 0 ? (
                <div className="text-gray-500">No books currently borrowed.</div>
              ) : (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Title</th>
                      <th className="p-2 text-left">Author</th>
                      <th className="p-2 text-left">Borrowed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedBooks.map(b => (
                      <tr key={b.id} className="border-t">
                        <td className="p-2">{b.title}</td>
                        <td className="p-2">{b.author}</td>
                        <td className="p-2">{b.totalQuantity - b.availableQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
