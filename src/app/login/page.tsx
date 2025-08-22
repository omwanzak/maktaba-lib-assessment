"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, login, loading, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "reader") router.replace("/reader");
      else if (user.role === "librarian") router.replace("/librarian");
      else if (user.role === "admin") router.replace("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Maktaba Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {(formError || error) && (
            <div className="text-red-500 text-sm">{formError || error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-xs text-gray-500">
          <div><strong>Reader:</strong> reader@maktaba.com / reader123</div>
          <div><strong>Librarian:</strong> librarian@maktaba.com / librarian123</div>
          <div><strong>Admin:</strong> admin@maktaba.com / admin123</div>
        </div>
      </div>
    </div>
  );
}
