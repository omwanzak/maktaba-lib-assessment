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

export default function ReaderDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAllowed = useAuthGuard(["reader"]);

  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAllowed) router.replace("/login");
  }, [isAllowed, router]);

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

  const handleRequestBook = async (bookId: number) => {
    setRequesting(true);
    setMessage(null);
    try {
      await mockApi.requestBook(user!.id, bookId);
      setMessage("Request submitted successfully!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setRequesting(false);
    }
  };

  const borrowedCount = user?.currentBorrowed || 0;
  const borrowingLimit = user?.borrowingLimit || 0;

  const requestedBookIds = requests.filter(r => r.status === "pending" || r.status === "approved").map(r => r.bookId);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="bg-white rounded shadow p-4 flex-1">
            <div className="font-semibold">Borrowing Limit</div>
            <div>{borrowedCount} / {borrowingLimit}</div>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-2">Available Books</h2>
        {loadingBooks ? (
          <div className="text-gray-500">Loading books...</div>
        ) : (
          <table className="w-full mb-6 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Author</th>
                <th className="p-2 text-left">Available</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.filter(b => b.availableQuantity > 0).map(book => (
                <tr key={book.id} className="border-t">
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.availableQuantity}</td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
                      disabled={
                        requesting ||
                        requestedBookIds.includes(book.id) ||
                        borrowedCount >= borrowingLimit
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
        )}
        {message && (
          <div className={`mb-4 p-2 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        <h2 className="text-lg font-semibold mb-2">Your Requests</h2>
        {loadingRequests ? (
          <div className="text-gray-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-gray-500">No requests yet.</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Book</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const book = books.find(b => b.id === r.bookId);
                return (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{book?.title}</td>
                    <td className="p-2 capitalize">{r.status}</td>
                    <td className="p-2">{r.requestDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
