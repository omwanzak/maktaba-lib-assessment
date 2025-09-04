
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 animate-fade-in"
      style={{
        backgroundImage: 'url(/cozy-reading-knitting.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        <Image
          src="/home-photo.svg"
          alt="Maktaba Library Black and White"
          width={400}
          height={200}
          className="rounded-xl shadow-lg animate-float"
        />
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Maktaba Library System</h1>
        <section className="bg-white text-black rounded-lg shadow p-6 w-full animate-slide-up">
          <h2 className="text-2xl font-bold mb-2">About Us</h2>
          <p className="text-lg">Maktaba Library System is your gateway to a modern, digital library experience. Discover, borrow, and manage books with ease. Our platform is designed for readers, librarians, and administrators to collaborate and enjoy seamless access to resources.</p>
        </section>
        <Link href="/login">
          <button className="mt-6 px-8 py-4 bg-black text-white border border-white rounded-full font-semibold text-xl hover:bg-white hover:text-black transition-colors duration-300 animate-bounce">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
