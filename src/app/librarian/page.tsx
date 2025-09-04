"use client";
import { useEffect, useState } from "react";
import { useAuth, useAuthGuard } from "../../lib/AuthContext";
import { mockApi } from "../../lib/utils/mockApi";
import { useRouter } from "next/navigation";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";

// Types
interface Book {
  id: number;
  title: string;
  author: string;
  totalQuantity: number;
  availableQuantity: number;
}
interface Request {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  requestDate: string;
  approvedBy: number | null;
  user?: any;
  book?: any;
}

export default function LibrarianDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAllowed = useAuthGuard(["librarian"]);

  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAllowed) router.replace("/login");
  }, [isAllowed, router]);

  const fetchData = async () => {
    setLoading(true);
    const [reqs, bks] = await Promise.all([
      mockApi.getPendingRequests(),
      mockApi.getBooks()
    ]);
    setPendingRequests(reqs);
    setBooks(bks);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [message]);

  const handleApprove = async (requestId: number) => {
    setActionLoading(true);
    setMessage(null);
    try {
      await mockApi.approveRequest(requestId, user!.id);
      setMessage("Request approved!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId: number) => {
    setActionLoading(true);
    setMessage(null);
    try {
      await mockApi.rejectRequest(requestId);
      setMessage("Request rejected.");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

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
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Librarian Dashboard</h1>
            <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
          </div>
          <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
          {loading ? (
            <div className="text-gray-500">Loading requests...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-gray-500">No pending requests.</div>
          ) : (
            <table className="w-full mb-6 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Book</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.user?.name}</td>
                    <td className="p-2">{r.book?.title}</td>
                    <td className="p-2">{r.requestDate}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-400"
                        disabled={actionLoading || r.book?.availableQuantity < 1}
                        onClick={() => handleApprove(r.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded disabled:bg-gray-400"
                        disabled={actionLoading}
                        onClick={() => handleReject(r.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {message && (
            <div className={`mb-4 p-2 rounded ${message.includes("approved") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
