"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, login, loading, error } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regEmail || !regPassword || !regName) {
      setRegError("All fields are required");
      return;
    }
    // Replace with your registration logic
    // await register(regEmail, regPassword, regName);
    setRegError("Registration is not implemented in demo.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'url(/tranquil-bibliophytes-haven.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
        filter: 'grayscale(1)',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Maktaba {showRegister ? "Register" : "Login"}</h1>
        <div className="flex justify-center mb-4 gap-4">
          <button
            className={`px-4 py-2 rounded font-semibold border ${!showRegister ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setShowRegister(false)}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold border ${showRegister ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
        {!showRegister ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black bg-white text-black"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black bg-white text-black"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {formError && <div className="text-red-500 text-sm">{formError}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white rounded font-semibold hover:bg-white hover:text-black border border-black transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black bg-white text-black"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black bg-white text-black"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black bg-white text-black"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
              />
            </div>
            {regError && <div className="text-red-500 text-sm">{regError}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white rounded font-semibold hover:bg-white hover:text-black border border-black transition-colors duration-300"
            >
              Register
            </button>
          </form>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
}


//Reader: reader@maktaba.com / reader123
//Librarian: librarian@maktaba.com / librarian123
//Admin: admin@maktaba.com / admin123
