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
  // const [users, setUsers] = useState<any[]>([]);
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin</h1>
              <p className="text-lg text-gray-700">Welcome, <span className="font-bold text-blue-700">{user?.name}</span></p>
            </div>
            {/* <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="font-semibold text-gray-700 mb-2">Quick Actions</div>
              <button onClick={logout} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Logout</button>
            </div> */}
          </div>
          {loading ? (
            <div className="text-gray-500">Loading dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="font-semibold text-gray-700">Total Books</div>
                  <div className="text-3xl font-extrabold text-blue-700">{stats?.totalBooks}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="font-semibold text-gray-700">Borrowed Books</div>
                  <div className="text-3xl font-extrabold text-blue-700">{stats?.totalBorrowed}</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="font-semibold text-gray-700">Available Books</div>
                  <div className="text-3xl font-extrabold text-blue-700">{stats?.totalAvailable}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Book Movement History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border rounded-lg overflow-hidden bg-white">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="p-3 text-left font-semibold text-gray-700">User</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Book</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Action</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                        <th className="p-3 text-left font-semibold text-gray-700">Approved By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookLogs.map(log => (
                        <tr key={log.id} className="border-t hover:bg-blue-50 transition">
                          <td className="p-3">{log.user?.name}</td>
                          <td className="p-3">{log.book?.title}</td>
                          <td className="p-3 capitalize">{log.action}</td>
                          <td className="p-3">{log.date}</td>
                          <td className="p-3">ID-{log.approvedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Currently Borrowed Books</h2>
                {borrowedBooks.length === 0 ? (
                  <div className="text-gray-500">No books currently borrowed.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg overflow-hidden bg-white">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="p-3 text-left font-semibold text-gray-700">Title</th>
                          <th className="p-3 text-left font-semibold text-gray-700">Author</th>
                          <th className="p-3 text-left font-semibold text-gray-700">Borrowed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {borrowedBooks.map(b => (
                          <tr key={b.id} className="border-t hover:bg-blue-50 transition">
                            <td className="p-3">{b.title}</td>
                            <td className="p-3">{b.author}</td>
                            <td className="p-3">{b.totalQuantity - b.availableQuantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
