"use client";
import { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  totalQuantity: number;
  availableQuantity: number;
};

type Request = {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  requestDate: string;
  approvedBy: number | null;
};
import { useAuth, useAuthGuard } from "../../lib/AuthContext";
import { mockApi } from "../../lib/utils/mockApi";
import { useRouter } from "next/navigation";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";
import SideNavbar from "../lib/SideNavbar";
  // Removed duplicate import of useState
// Removed duplicate import of useState

export default function ReaderDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  const isAllowed = useAuthGuard(["reader"]);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    async function fetchBooks() {
      setLoadingBooks(true);
      const data = await mockApi.getBooks();
      setBooks(data);
      setLoadingBooks(false);
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    async function fetchRequests() {
      setLoadingRequests(true);
      if (user) {
        const data = await mockApi.getUserRequests(user.id);
        setRequests(data);
      }
      setLoadingRequests(false);
    }
    fetchRequests();
  }, [user, message]);


  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Helper variables and functions
  const borrowingLimit = 3;
  const borrowedCount = user?.currentBorrowed || 0;
  const requestedBookIds = requests.filter(r => r.status === "pending" || r.status === "approved").map(r => r.bookId);

  const handleRequestBook = async (bookId: number) => {
    if (!user) {
      setMessage("You must be logged in to request a book.");
      return;
    }
    setRequesting(true);
    setMessage(null);
    try {
      await mockApi.requestBook(user.id, bookId);
      setMessage("Request submitted successfully!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setRequesting(false);
    }
  };


  return (
    <div
      className="min-h-screen bg-gray-200 flex flex-col"
    >
      {/* Top Navbar with Account button */}
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-black text-white shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl">Maktaba</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
              onClick={() => setShowSearch(s => !s)}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            {showSearch && (
              <input
                type="text"
                className="ml-2 px-3 py-1 rounded border text-black bg-white focus:outline-none"
                placeholder="Search anything..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
                style={{ minWidth: 180 }}
              />
            )}
          </div>
          <button
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
            onClick={() => setShowAccount(true)}
          >
            Account
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">Logout</button>
        </div>
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
      </nav>
      {/* Account Modal */}
      {showAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-black" onClick={() => setShowAccount(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {user?.name}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {user?.email}</div>
            <div className="mb-2"><span className="font-semibold">Role:</span> {user?.role}</div>
            {/* Subscription field commented out until User type is updated */}
            <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Logout</button>
          </div>
        </div>
      )}
  <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 relative z-10">
  <aside className="w-full md:w-64 bg-transparent rounded-xl shadow-lg p-6 mb-6 md:mb-0 md:mr-6">
          <SideNavbar />
        </aside>
        <section className="flex-1">
          <div className="bg-transparent rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
              <h1 className="text-3xl font-extrabold text-gray-900">Welcome, <span className="text-blue-700">{user?.name}</span></h1>
            </div>
            <div className="mb-4 flex gap-4">
              <div className="bg-blue-50 rounded-lg shadow p-4 flex-1 border border-blue-100">
                <div className="font-semibold text-blue-900">Borrowing Limit</div>
                <div className="text-lg font-bold text-blue-700">{borrowedCount} / {borrowingLimit}</div>
                {borrowedCount >= borrowingLimit && (
                  <div className="mt-2 text-red-600 text-sm font-semibold">
                    You have exceeded your borrowing limit of {borrowingLimit} books.
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Available Books</h2>
            {loadingBooks ? (
              <div className="text-gray-500">Loading books...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full mb-6 border rounded-lg overflow-hidden bg-white">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-3 text-left font-semibold text-gray-700">Title</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Author</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Available</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books
                      .filter(b => b.availableQuantity > 0)
                      .filter(b =>
                        searchTerm.trim() === ""
                          ? true
                          : (
                              b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              b.author.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                      )
                      .map(book => (
                        <tr key={book.id} className="border-t hover:bg-blue-50 transition">
                          <td className="p-3">{book.title}</td>
                          <td className="p-3">{book.author}</td>
                          <td className="p-3">{book.availableQuantity}</td>
                          <td className="p-3">
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 disabled:bg-gray-400 transition"
                              disabled={
                                requesting ||
                                requestedBookIds.includes(book.id) ||
                                borrowedCount >= borrowingLimit ||
                                !user
                              }
                              onClick={() => handleRequestBook(book.id)}
                            >
                              {requestedBookIds.includes(book.id)
                                ? "Requested"
                                : borrowedCount >= borrowingLimit
                                ? "Limit Reached"
                                : "Request Book"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            {message && (
              <div className={`mb-4 p-2 rounded-lg font-semibold ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Requests</h2>
            {loadingRequests ? (
              <div className="text-gray-500">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="text-gray-500">No requests yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg overflow-hidden bg-white">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-3 text-left font-semibold text-gray-700">Book</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(r => {
                      const book = books.find(b => b.id === r.bookId);
                      return (
                        <tr key={r.id} className="border-t hover:bg-blue-50 transition">
                          <td className="p-3">{book?.title}</td>
                          <td className="p-3 capitalize">{r.status}</td>
                          <td className="p-3">{r.requestDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
