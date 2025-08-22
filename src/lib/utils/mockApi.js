// src/lib/utils/mockApi.js

// Mock API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
let users = [
  { id: 1, name: "Pamela Abaki", email: "reader@maktaba.com", role: "reader", borrowingLimit: 3, currentBorrowed: 0 },
  { id: 2, name: "Sandra Nyambura", email: "librarian@maktaba.com", role: "librarian" },
  { id: 3, name: "Maureen Chepkorir", email: "admin@maktaba.com", role: "admin" }
];

let books = [
  { id: 1, title: "Clean Code", author: "Robert Martin", totalQuantity: 3, availableQuantity: 2 },
  { id: 2, title: "React Handbook", author: "Flavio Copes", totalQuantity: 2, availableQuantity: 0 },
  { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", totalQuantity: 4, availableQuantity: 3 },
  { id: 4, title: "JavaScript: The Good Parts", author: "Douglas Crockford", totalQuantity: 2, availableQuantity: 2 },
  { id: 5, title: "Eloquent JavaScript", author: "Marijn Haverbeke", totalQuantity: 3, availableQuantity: 1 },
  { id: 6, title: "Refactoring", author: "Martin Fowler", totalQuantity: 2, availableQuantity: 2 },
  { id: 7, title: "Design Patterns", author: "Erich Gamma", totalQuantity: 2, availableQuantity: 2 },
  { id: 8, title: "Introduction to Algorithms", author: "Thomas H. Cormen", totalQuantity: 3, availableQuantity: 3 },
  { id: 9, title: "The Pragmatic Programmer", author: "Andrew Hunt", totalQuantity: 2, availableQuantity: 1 },
  { id: 10, title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", totalQuantity: 2, availableQuantity: 2 },
  { id: 11, title: "Python Crash Course", author: "Eric Matthes", totalQuantity: 2, availableQuantity: 2 },
  { id: 12, title: "Effective Java", author: "Joshua Bloch", totalQuantity: 2, availableQuantity: 2 },
  { id: 13, title: "Head First Design Patterns", author: "Eric Freeman", totalQuantity: 2, availableQuantity: 2 },
  { id: 14, title: "Algorithms", author: "Robert Sedgewick", totalQuantity: 2, availableQuantity: 2 },
  { id: 15, title: "Deep Work", author: "Cal Newport", totalQuantity: 2, availableQuantity: 2 },
  { id: 16, title: "Atomic Habits", author: "James Clear", totalQuantity: 2, availableQuantity: 2 },
  { id: 17, title: "The Art of Computer Programming", author: "Donald Knuth", totalQuantity: 2, availableQuantity: 2 },
  { id: 18, title: "Grokking Algorithms", author: "Aditya Bhargava", totalQuantity: 2, availableQuantity: 2 },
  { id: 19, title: "The Mythical Man-Month", author: "Frederick Brooks", totalQuantity: 2, availableQuantity: 2 },
  { id: 20, title: "Code Complete", author: "Steve McConnell", totalQuantity: 2, availableQuantity: 2 }
];

let requests = [
  { id: 1, userId: 1, bookId: 1, status: "pending", requestDate: "2025-08-20", approvedBy: null },
  { id: 2, userId: 1, bookId: 2, status: "approved", requestDate: "2025-08-19", approvedBy: 2 }
];

let bookLogs = [
  { id: 1, userId: 1, bookId: 1, action: "borrowed", date: "2025-08-19", approvedBy: 2 },
  { id: 2, userId: 1, bookId: 3, action: "returned", date: "2025-08-18", approvedBy: 2 }
];

export const mockApi = {
  login: async (email, password) => {
    await delay(700);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("User not found");
    if (
      (user.role === "reader" && password !== "reader123") ||
      (user.role === "librarian" && password !== "librarian123") ||
      (user.role === "admin" && password !== "admin123")
    ) {
      throw new Error("Invalid password");
    }
    return user;
  },
  getBooks: async () => {
    await delay(500);
    return books;
  },
  getUserRequests: async (userId) => {
    await delay(500);
    return requests.filter(r => r.userId === userId);
  },
  requestBook: async (userId, bookId) => {
    await delay(700);
    const user = users.find(u => u.id === userId);
    const book = books.find(b => b.id === bookId);
    if (!user || !book) throw new Error("User or Book not found");
    if (book.availableQuantity < 1) throw new Error("Book not available");
    if (requests.some(r => r.userId === userId && r.bookId === bookId && r.status === "pending")) {
      throw new Error("Already requested this book");
    }
    if (user.role === "reader" && user.currentBorrowed >= user.borrowingLimit) {
      throw new Error("Borrowing limit reached");
    }
    const newRequest = {
      id: requests.length + 1,
      userId,
      bookId,
      status: "pending",
      requestDate: new Date().toISOString().slice(0, 10),
      approvedBy: null
    };
    requests.push(newRequest);
    return newRequest;
  },
  getPendingRequests: async () => {
    await delay(600);
    return requests.filter(r => r.status === "pending").map(r => ({
      ...r,
      user: users.find(u => u.id === r.userId),
      book: books.find(b => b.id === r.bookId)
    }));
  },
  approveRequest: async (requestId, librarianId) => {
    await delay(700);
    const req = requests.find(r => r.id === requestId);
    if (!req || req.status !== "pending") throw new Error("Request not found or already processed");
    const book = books.find(b => b.id === req.bookId);
    if (!book || book.availableQuantity < 1) throw new Error("Book not available");
    book.availableQuantity -= 1;
    req.status = "approved";
    req.approvedBy = librarianId;
    const user = users.find(u => u.id === req.userId);
    if (user.role === "reader") user.currentBorrowed = (user.currentBorrowed || 0) + 1;
    bookLogs.push({
      id: bookLogs.length + 1,
      userId: req.userId,
      bookId: req.bookId,
      action: "borrowed",
      date: new Date().toISOString().slice(0, 10),
      approvedBy: librarianId
    });
    return req;
  },
  rejectRequest: async (requestId) => {
    await delay(500);
    const req = requests.find(r => r.id === requestId);
    if (!req || req.status !== "pending") throw new Error("Request not found or already processed");
    req.status = "rejected";
    return req;
  },
  getBookLogs: async () => {
    await delay(500);
    return bookLogs.map(log => ({
      ...log,
      user: users.find(u => u.id === log.userId),
      book: books.find(b => b.id === log.bookId)
    }));
  },
  getDashboardStats: async () => {
    await delay(500);
    const totalBooks = books.reduce((sum, b) => sum + b.totalQuantity, 0);
    const totalAvailable = books.reduce((sum, b) => sum + b.availableQuantity, 0);
    const totalBorrowed = totalBooks - totalAvailable;
    return { totalBooks, totalAvailable, totalBorrowed };
  }
};
