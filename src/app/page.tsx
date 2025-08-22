import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-xl w-full bg-white rounded shadow p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700">Maktaba Library System</h1>
        <Link href="/login">
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
