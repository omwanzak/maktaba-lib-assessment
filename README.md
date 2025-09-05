# Maktaba Library Management System

A modern library management system built with Next.js, TypeScript, and Prisma. This system helps libraries manage their book inventory, handle user requests, and streamline the book borrowing process.

## Features

### For Readers
- Browse available books with pagination
- Search books by title or author
- Filter books by categories
- Request books for borrowing
- Track request status
- View personal borrowing history
- Maximum borrowing limit enforcement

### For Librarians
- Approve/reject book requests
- Manage pending requests
- Track book inventory

### For Administrators
- Manage book inventory
- Add/edit book categories
- View library statistics
- Monitor book logs

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT-based auth system

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- SQLite (default database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/omwanzak/maktaba-lib-assessment.git
   cd maktaba-lib-assessment
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  ├── app/                    # Next.js 13 app directory
  │   ├── admin/             # Admin dashboard and features
  │   ├── librarian/         # Librarian dashboard and features
  │   ├── reader/            # Reader dashboard and features
  │   └── api/               # API routes
  ├── components/            # Reusable components
  └── lib/                   # Utilities and shared code
prisma/                      # Database schema and migrations
public/                      # Static files
```

## Database Schema

The application uses Prisma with SQLite and includes the following main models:
- Users (readers, librarians, admins)
- Books
- Categories
- Book Requests
- Book Logs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built as part of a library management system assessment
- Uses modern web development practices and tools
