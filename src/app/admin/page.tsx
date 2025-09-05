"use client";
import { useEffect, useState } from "react";
import { useAuth, useAuthGuard } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/shared/Navbar";
import Footer from "../lib/Footer";
import { ArrowUp, ArrowDown, PlusCircle, Trash2 } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  totalQuantity: number;
  availableQuantity: number;
  damagedQuantity: number;
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
interface Category {
  id: number;
  name: string;
}

interface AdminStats {
  totalBooks: number;
  totalBorrowed: number;
  totalAvailable: number;
  totalDamaged: number;
  mostRequestedBook: { title: string; author: string; requests: number } | null;
  categoryWithMostBooks: { name: string; count: number } | null;
  categoryWithLeastBooks: { name: string; count: number } | null;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAllowed = useAuthGuard(["admin"]);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookLogs, setBookLogs] = useState<BookLog[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [bookToAdd, setBookToAdd] = useState({
    title: '',
    author: '',
    totalQuantity: 1,
    availableQuantity: 1,
    damagedQuantity: 0,
    categoryIds: [] as number[],
  });

  useEffect(() => {
    if (!isAllowed) router.replace("/login");
  }, [isAllowed, router]);

  async function fetchData() {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!user || !token) { // Check if user and token are available
      setLoading(false);
      return;
    }
    const [statsData, logs, bksResponse, cats] = await Promise.all([
      fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/admin/book-logs', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/reader/books', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/categories', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ]);
    setStats(statsData);
    setBookLogs(logs);
    setBooks(bksResponse.books);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateCategory = async () => {
    const token = localStorage.getItem('token');
    await fetch('/api/categories/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory("");
    fetchData();
  };

  const handleDeleteCategory = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/categories/delete/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    fetchData();
  };

  const handleOpenAddBookModal = (categoryId: number) => {
    setBookToAdd(prev => ({ ...prev, categoryIds: [categoryId] }));
    setShowAddBookModal(true);
  };

  const handleAddBook = async () => {
    const token = localStorage.getItem('token');
    await fetch('/api/books/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(bookToAdd),
    });
    setShowAddBookModal(false);
    setBookToAdd({
      title: '',
      author: '',
      totalQuantity: 1,
      availableQuantity: 1,
      damagedQuantity: 0,
      categoryIds: [] as number[],
    });
    fetchData();
  };

  // Get all currently borrowed books
  const borrowedBooks = books.filter(b => b.totalQuantity > b.availableQuantity);
  const damagedBooks = books.filter(b => b.damagedQuantity > 0);

  // Determine trend for borrowed books (simple comparison)
  const borrowedTrendIcon = stats && stats.totalBorrowed > (stats.totalBooks - stats.totalAvailable) ? <ArrowUp className="text-green-500" /> : <ArrowDown className="text-red-500" />;

  return (
    <div
      className="min-h-screen bg-gray-200 flex flex-col"
    >
  <Navbar />
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin</h1>
              <p className="text-lg text-gray-700">Welcome, <span className="font-bold text-blue-700">{user?.name}</span></p>
            </div>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"> {/* Changed to md:grid-cols-4 and reduced gap/mb */}
                <div className="bg-white rounded-xl shadow-lg p-4 text-center"> {/* Reduced padding */}
                  <div className="font-semibold text-gray-700 text-sm">Total Books</div> {/* Reduced font size */}
                  <div className="text-2xl font-extrabold text-blue-700">{stats?.totalBooks}</div> {/* Reduced font size */}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center"> {/* Reduced padding */}
                  <div className="font-semibold text-gray-700 text-sm">Borrowed Books {borrowedTrendIcon}</div> {/* Reduced font size */}
                  <div className="text-2xl font-extrabold text-blue-700">{stats?.totalBorrowed}</div> {/* Reduced font size */}
                  {stats?.mostRequestedBook && (
                    <div className="text-xs text-gray-600 mt-1">
                      Most Requested: {stats.mostRequestedBook.title} by {stats.mostRequestedBook.author} ({stats.mostRequestedBook.requests} requests)
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center"> {/* Reduced padding */}
                  <div className="font-semibold text-gray-700 text-sm">Available Books</div> {/* Reduced font size */}
                  <div className="text-2xl font-extrabold text-blue-700">{stats?.totalAvailable}</div> {/* Reduced font size */}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center"> {/* Reduced padding */}
                  <div className="font-semibold text-gray-700 text-sm">Damaged Books</div> {/* Reduced font size */}
                  <div className="text-2xl font-extrabold text-red-700">{stats?.totalDamaged}</div> {/* Reduced font size */}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="font-semibold text-gray-700">Category with Most Books</div>
                  <div className="text-xl font-extrabold text-blue-700">{stats?.categoryWithMostBooks?.name}</div>
                  <div className="text-sm text-gray-600">({stats?.categoryWithMostBooks?.count} books)</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="font-semibold text-gray-700">Category with Least Books</div>
                  <div className="text-xl font-extrabold text-blue-700">{stats?.categoryWithLeastBooks?.name}</div>
                  <div className="text-sm text-gray-600">({stats?.categoryWithLeastBooks?.count} books)</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"> {/* New grid container for side-by-side */}
                <div className="bg-white rounded-xl shadow-lg p-6"> {/* Damaged Books section */}
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Damaged Books</h2>
                  <div className="text-3xl font-extrabold text-red-700 mb-4">{stats?.totalDamaged}</div>
                  {damagedBooks.length === 0 ? (
                    <div className="text-gray-500">No damaged books.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border rounded-lg overflow-hidden bg-white">
                        <thead>
                          <tr className="bg-red-100">
                            <th className="p-3 text-left font-semibold text-gray-700">Title</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Author</th>
                            <th className="p-3 text-left font-semibold text-gray-700">Damaged Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {damagedBooks.map(b => (
                            <tr key={b.id} className="border-t hover:bg-red-50 transition">
                              <td className="p-3">{b.title}</td>
                              <td className="p-3">{b.author}</td>
                              <td className="p-3">{b.damagedQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6"> {/* Category Management section */}
                  <h2 className="text-xl font-bold mb-3 text-gray-800">Category Management</h2>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="border rounded p-1.5 flex-grow focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="New category name"
                    />
                    <button
                      onClick={handleCreateCategory}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out text-sm"
                    >
                      Add Category
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg overflow-hidden bg-white">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="p-2 text-left font-semibold text-gray-700 text-sm">Category Name</th>
                          <th className="p-2 text-left font-semibold text-gray-700 text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(cat => (
                          <tr key={cat.id} className="border-t hover:bg-blue-50 transition">
                            <td className="p-2 text-sm">{cat.name}</td>
                            <td className="p-2 flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-150 ease-in-out flex items-center justify-center"
                                title="Delete Category"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button
                                onClick={() => handleOpenAddBookModal(cat.id)}
                                className="p-1.5 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-150 ease-in-out flex items-center justify-center"
                                title="Add Book to Category"
                              >
                                <PlusCircle size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-black" onClick={() => setShowAddBookModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Book</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddBook(); }}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookToAdd.title}
                  onChange={(e) => setBookToAdd({ ...bookToAdd, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  id="author"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookToAdd.author}
                  onChange={(e) => setBookToAdd({ ...bookToAdd, author: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700">Total Quantity</label>
                <input
                  type="number"
                  id="totalQuantity"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookToAdd.totalQuantity}
                  onChange={(e) => setBookToAdd({ ...bookToAdd, totalQuantity: parseInt(e.target.value, 10) })}
                  min="1"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="availableQuantity" className="block text-sm font-medium text-gray-700">Available Quantity</label>
                <input
                  type="number"
                  id="availableQuantity"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookToAdd.availableQuantity}
                  onChange={(e) => setBookToAdd({ ...bookToAdd, availableQuantity: parseInt(e.target.value, 10) })}
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="damagedQuantity" className="block text-sm font-medium text-gray-700">Damaged Quantity</label>
                <input
                  type="number"
                  id="damagedQuantity"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookToAdd.damagedQuantity}
                  onChange={(e) => setBookToAdd({ ...bookToAdd, damagedQuantity: parseInt(e.target.value, 10) })}
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={bookToAdd.categoryIds[0] || ''}
                  onChange={(e) => setBookToAdd({ ...bookToAdd, categoryIds: [parseInt(e.target.value, 10)] })}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}