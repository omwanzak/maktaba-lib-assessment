import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  await prisma.user.createMany({
    data: [
  { name: "Samantha Wayne", email: "reader@maktaba.com", role: "reader", password: "reader123", borrowingLimit: 3, currentBorrowed: 0 },
      { name: "Sandra Nyambura", email: "librarian@maktaba.com", role: "librarian", password: "librarian123" },
      { name: "Maureen Chepkorir", email: "admin@maktaba.com", role: "admin", password: "admin123" }
    ]
  });

  // Seed Books
  await prisma.book.createMany({
    data: [
      { title: "Clean Code", author: "Robert Martin", totalQuantity: 3, availableQuantity: 2 },
      { title: "React Handbook", author: "Flavio Copes", totalQuantity: 2, availableQuantity: 0 },
      { title: "You Don't Know JS", author: "Kyle Simpson", totalQuantity: 4, availableQuantity: 3 },
      { title: "JavaScript: The Good Parts", author: "Douglas Crockford", totalQuantity: 2, availableQuantity: 2 },
      { title: "Eloquent JavaScript", author: "Marijn Haverbeke", totalQuantity: 3, availableQuantity: 1 },
      { title: "Refactoring", author: "Martin Fowler", totalQuantity: 2, availableQuantity: 2 },
      { title: "Design Patterns", author: "Erich Gamma", totalQuantity: 2, availableQuantity: 2 },
      { title: "Introduction to Algorithms", author: "Thomas H. Cormen", totalQuantity: 3, availableQuantity: 3 },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt", totalQuantity: 2, availableQuantity: 1 },
      { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", totalQuantity: 2, availableQuantity: 2 },
      { title: "Python Crash Course", author: "Eric Matthes", totalQuantity: 2, availableQuantity: 2 },
      { title: "Effective Java", author: "Joshua Bloch", totalQuantity: 2, availableQuantity: 2 },
      { title: "Head First Design Patterns", author: "Eric Freeman", totalQuantity: 2, availableQuantity: 2 },
      { title: "Algorithms", author: "Robert Sedgewick", totalQuantity: 2, availableQuantity: 2 },
      { title: "Deep Work", author: "Cal Newport", totalQuantity: 2, availableQuantity: 2 },
      { title: "Atomic Habits", author: "James Clear", totalQuantity: 2, availableQuantity: 2 },
      { title: "The Art of Computer Programming", author: "Donald Knuth", totalQuantity: 2, availableQuantity: 2 },
      { title: "Grokking Algorithms", author: "Aditya Bhargava", totalQuantity: 2, availableQuantity: 2 },
      { title: "The Mythical Man-Month", author: "Frederick Brooks", totalQuantity: 2, availableQuantity: 2 },
      { title: "Code Complete", author: "Steve McConnell", totalQuantity: 2, availableQuantity: 2 }
    ]
  });

  // Optionally, seed Requests and BookLogs here if you want initial data
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
