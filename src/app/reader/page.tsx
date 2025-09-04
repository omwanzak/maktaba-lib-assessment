"use client";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
  totalQuantity: number;
  availableQuantity: number;
  categories: { category: Category }[];
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
import { useRouter } from "next/navigation";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";
import SideNavbar from "../lib/SideNavbar";

export default function ReaderDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // 10 books per page
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  const isAllowed = useAuthGuard(["reader"]);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    async function fetchBooks() {
      setLoadingBooks(true);
      const token = localStorage.getItem('token');
      if (!user || !token) { // Check if user and token are available
        setLoadingBooks(false);
        return;
      }
      let url = `/api/reader/books?page=${currentPage}&pageSize=${pageSize}`;
      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }
      if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
      }
      try {
        console.log("Fetching books from URL:", url); // Log the URL
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalBooks / pageSize));
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // Optionally set an error message to display in the UI
      } finally {
        setLoadingBooks(false);
      }
    }
    fetchBooks();
  }, [selectedCategory, currentPage, pageSize, user, searchTerm]);

  useEffect(() => {
    async function fetchCategories() {
      const token = localStorage.getItem('token');
      if (!user || !token) { // Check if user and token are available
        return;
      }
      try {
        const data = await fetch('/api/categories', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, [user]);

  useEffect(() => {
    async function fetchRequests() {
      setLoadingRequests(true);
      if (user) {
        const token = localStorage.getItem('token');
        if (!token) { // Check if token is available
          setLoadingRequests(false);
          return;
        }
        try {
          const data = await fetch(`/api/reader/user-requests/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());
          setRequests(data);
        } catch (error) {
          console.error("Failed to fetch requests:", error);
        } finally {
          setLoadingRequests(false);
        }
      }
    }
    fetchRequests();
  }, [user, message]);


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
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/reader/request-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id, bookId }),
      });
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
          <div className="relative flex items-center"> {/* This div now contains both search and other buttons */}
            <input
              type="text"
              className="px-3 py-1 rounded border text-black bg-white focus:outline-none"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ minWidth: 180 }}
            />
          </div>
          <button
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
            onClick={() => setShowAccount(true)}
          >
            Account
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">Logout</button>
        </div>
  
      </nav>
      {/* Account Modal */}

      {showAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-black" onClick={() => setShowAccount(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {user?.name || "N/A"}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {user?.email || "N/A"}</div>
            <div className="mb-2"><span className="font-semibold">Role:</span> {user?.role || "N/A"}</div>
            <div className="mb-2"><span className="font-semibold">Books Borrowed:</span> {user?.currentBorrowed !== undefined ? user.currentBorrowed : "N/A"}</div>
            <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">Logout</button>
          </div>
        </div>
      )}
  <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 relative z-10">
  <aside className="w-full md:w-64 bg-transparent rounded-xl shadow-lg p-6 mb-6 md:mb-0 md:mr-6">
          <SideNavbar categories={categories} onSelectCategory={(catId) => { setSelectedCategory(catId); setCurrentPage(1); }} />
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
                      <th className="p-3 text-left font-semibold text-gray-700">Categories</th>
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
                          <td className="p-3">{book.categories.map(c => c.category.name).join(', ')}</td>
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
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-l-lg disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-r-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
            {message && (
              <div className={`mt-4 mb-4 p-2 rounded-lg font-semibold ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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
