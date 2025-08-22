import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-xl w-full bg-white rounded shadow p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to Maktaba</h1>
        <p className="mb-6 text-gray-700 text-lg">
          Maktaba is a modern book lending system for libraries, built with Next.js and Tailwind CSS. Easily manage book requests, approvals, and library activity for readers, librarians, and admins.
        </p>
        <ul className="mb-6 text-left text-gray-600 list-disc list-inside">
          <li>Role-based dashboards for Readers, Librarians, and Admins</li>
          <li>Request and borrow books online</li>
          <li>Track book movement and library stats</li>
          <li>Clean, responsive design</li>
        </ul>
        <Link href="/login">
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
