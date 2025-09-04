import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const readerPassword = await bcrypt.hash('reader123', 10);
  const librarianPassword = await bcrypt.hash('librarian123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Samantha Wayne',
      email: 'reader@maktaba.com',
      role: 'reader',
      password: readerPassword,
      borrowingLimit: 3,
      currentBorrowed: 1,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Sandra Nyambura',
      email: 'librarian@maktaba.com',
      role: 'librarian',
      password: librarianPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Maureen Chepkorir',
      email: 'admin@maktaba.com',
      role: 'admin',
      password: adminPassword,
    },
  });

  // Seed Categories
  const psychology = await prisma.category.create({ data: { name: 'Psychology' } });
  const scienceFiction = await prisma.category.create({ data: { name: 'Science Fiction' } });
  const history = await prisma.category.create({ data: { name: 'History' } });
  const romance = await prisma.category.create({ data: { name: 'Romance' } });
  const technology = await prisma.category.create({ data: { name: 'Technology' } });
  const childrens = await prisma.category.create({ data: { name: "Children's" } });
  const mystery = await prisma.category.create({ data: { name: 'Mystery' } });

  // Seed Books
  const books = [
    // Psychology
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', categoryId: psychology.id },
    { title: 'Man\'s Search for Meaning', author: 'Viktor E. Frankl', categoryId: psychology.id },
    { title: 'The Power of Habit', author: 'Charles Duhigg', categoryId: psychology.id },
    { title: 'Quiet: The Power of Introverts in a World That Can\'t Stop Talking', author: 'Susan Cain', categoryId: psychology.id },
    { title: 'Daring Greatly', author: 'Brené Brown', categoryId: psychology.id },
    { title: 'Mindset: The New Psychology of Success', author: 'Carol S. Dweck', categoryId: psychology.id },
    { title: 'Influence: The Psychology of Persuasion', author: 'Robert B. Cialdini', categoryId: psychology.id },
    { title: 'Blink: The Power of Thinking Without Thinking', author: 'Malcolm Gladwell', categoryId: psychology.id },
    { title: 'Predictably Irrational', author: 'Dan Ariely', categoryId: psychology.id },
    { title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', categoryId: psychology.id },

    // Science Fiction
    { title: 'Dune', author: 'Frank Herbert', categoryId: scienceFiction.id },
    { title: 'Ender\'s Game', author: 'Orson Scott Card', categoryId: scienceFiction.id },
    { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', categoryId: scienceFiction.id },
    { title: 'Foundation', author: 'Isaac Asimov', categoryId: scienceFiction.id },
    { title: 'Neuromancer', author: 'William Gibson', categoryId: scienceFiction.id },
    { title: 'Snow Crash', author: 'Neal Stephenson', categoryId: scienceFiction.id },
    { title: 'Hyperion', author: 'Dan Simmons', categoryId: scienceFiction.id },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', categoryId: scienceFiction.id },
    { title: 'A Canticle for Leibowitz', author: 'Walter M. Miller Jr.', categoryId: scienceFiction.id },
    { title: 'The Martian', author: 'Andy Weir', categoryId: scienceFiction.id },

    // History
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', categoryId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', categoryId: history.id },
    { title: 'The Wright Brothers', author: 'David McCullough', categoryId: history.id },
    { title: '1776', author: 'David McCullough', categoryId: history.id },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', categoryId: history.id },
    { title: 'A People\'s History of the United States', author: 'Howard Zinn', categoryId: history.id },
    { title: 'The Rise and Fall of the Third Reich', author: 'William L. Shirer', categoryId: history.id },
    { title: 'The Guns of August', author: 'Barbara W. Tuchman', categoryId: history.id },
    { title: 'The Crusades: The Authoritative History of the War for the Holy Land', author: 'Thomas Asbridge', categoryId: history.id },
    { title: 'The Six Wives of Henry VIII', author: 'Alison Weir', categoryId: history.id },

    // Romance
    { title: 'Pride and Prejudice', author: 'Jane Austen', categoryId: romance.id },
    { title: 'Outlander', author: 'Diana Gabaldon', categoryId: romance.id },
    { title: 'The Notebook', author: 'Nicholas Sparks', categoryId: romance.id },
    { title: 'Me Before You', author: 'Jojo Moyes', categoryId: romance.id },
    { title: 'The Hating Game', author: 'Sally Thorne', categoryId: romance.id },
    { title: 'Eleanor Oliphant Is Completely Fine', author: 'Gail Honeyman', categoryId: romance.id },
    { title: 'The Rosie Project', author: 'Graeme Simsion', categoryId: romance.id },
    { title: 'Red, White & Royal Blue', author: 'Casey McQuiston', categoryId: romance.id },
    { title: 'The Kiss Quotient', author: 'Helen Hoang', categoryId: romance.id },
    { title: 'Vision in White', author: 'Nora Roberts', categoryId: romance.id },

    // Technology
    { title: 'The Innovators', author: 'Walter Isaacson', categoryId: technology.id },
    { title: 'Steve Jobs', author: 'Walter Isaacson', categoryId: technology.id },
    { title: 'Zero to One', author: 'Peter Thiel', categoryId: technology.id },
    { title: 'The Lean Startup', author: 'Eric Ries', categoryId: technology.id },
    { title: 'Hooked: How to Build Habit-Forming Products', author: 'Nir Eyal', categoryId: technology.id },
    { title: 'The Phoenix Project', author: 'Gene Kim', categoryId: technology.id },
    { title: 'Clean Code', author: 'Robert C. Martin', categoryId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', categoryId: technology.id },
    { title: 'Don\'t Make Me Think', author: 'Steve Krug', categoryId: technology.id },
    { title: 'The Design of Everyday Things', author: 'Don Norman', categoryId: technology.id },

    // Children\'s
    { title: 'The Very Hungry Caterpillar', author: 'Eric Carle', categoryId: childrens.id },
    { title: 'Where the Wild Things Are', author: 'Maurice Sendak', categoryId: childrens.id },
    { title: 'Goodnight Moon', author: 'Margaret Wise Brown', categoryId: childrens.id },
    { title: 'The Cat in the Hat', author: 'Dr. Seuss', categoryId: childrens.id },
    { title: 'Charlotte\'s Web', author: 'E.B. White', categoryId: childrens.id },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', categoryId: childrens.id },
    { title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', categoryId: childrens.id },
    { title: 'The Giving Tree', author: 'Shel Silverstein', categoryId: childrens.id },
    { title: 'Matilda', author: 'Roald Dahl', categoryId: childrens.id },
    { title: 'The Tale of Peter Rabbit', author: 'Beatrix Potter', categoryId: childrens.id },

    // Mystery
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', categoryId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', categoryId: mystery.id },
    { title: 'The Silent Patient', author: 'Alex Michaelides', categoryId: mystery.id },
    { title: 'And Then There Were None', author: 'Agatha Christie', categoryId: mystery.id },
    { title: 'The Da Vinci Code', author: 'Dan Brown', categoryId: mystery.id },
    { title: 'The Woman in Cabin 10', author: 'Ruth Ware', categoryId: mystery.id },
    { title: 'Big Little Lies', author: 'Liane Moriarty', categoryId: mystery.id },
    { title: 'In the Woods', author: 'Tana French', categoryId: mystery.id },
    { title: 'The Guest List', author: 'Lucy Fokley', categoryId: mystery.id },
    { title: 'The Thursday Murder Club', author: 'Richard Osman', categoryId: mystery.id },
  ];

  for (const book of books) {
    const totalQuantity = Math.floor(Math.random() * 5) + 1;
    const availableQuantity = Math.floor(Math.random() * totalQuantity) + 1; // Ensure available <= total
    const damagedQuantity = Math.floor(Math.random() * (totalQuantity - availableQuantity + 1)); // Ensure damaged <= total - available

    const createdBook = await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        totalQuantity: totalQuantity,
        availableQuantity: availableQuantity,
        damagedQuantity: damagedQuantity,
      }
    });
    await prisma.categoriesOnBooks.create({
      data: {
        bookId: createdBook.id,
        categoryId: book.categoryId
      }
    });
  }

  // Seed Requests
  const allBooks = await prisma.book.findMany();
  await prisma.request.create({
    data: {
      userId: user1.id,
      bookId: allBooks[0].id,
      status: 'approved',
      requestDate: new Date(),
      approvedBy: user2.id,
    },
  });

  await prisma.request.create({
    data: {
      userId: user1.id,
      bookId: allBooks[1].id,
      status: 'pending',
      requestDate: new Date(),
    },
  });

  // Seed BookLogs
  await prisma.bookLog.create({
    data: {
      userId: user1.id,
      bookId: allBooks[0].id,
      action: 'borrow',
      date: new Date(),
      approvedBy: user2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });