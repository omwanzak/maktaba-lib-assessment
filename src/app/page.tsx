"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const fullText = "Maktaba Library System is your gateway to a modern, digital library experience. Discover, borrow, and manage books with ease.";
  const words = fullText.split(' ');
  const mainText = words.slice(0, -5).join(' ');
  const animatedWords = words.slice(-5);

  const [visibleWords, setVisibleWords] = useState<string[]>([]);

  useEffect(() => {
    animatedWords.forEach((word, index) => {
      setTimeout(() => {
        setVisibleWords((prev) => [...prev, word]);
      }, 200 * (index + 1)); // Adjust delay as needed
    });
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 animate-fade-in"
      style={{
        backgroundImage: 'url(/top-view-books-arrangement.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
        filter: 'grayscale(40%)', // Add grayscale filter
        position: 'relative', // Needed for absolute positioning of overlay
      }}
    >
      {/* Overlay for opacity */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with 50% opacity
          zIndex: 0, // Ensure it's behind the content
        }}
      ></div>

      <div className="max-w-2xl w-full flex flex-col items-center gap-8 z-10"> {/* z-index to bring content above overlay */}
        <h1 className="text-6xl font-extrabold mb-4 tracking-[0.2em] text-white text-shadow-lg animate-fade-in-scale font-serif">
          Maktaba Library System
        </h1>
        <section className="bg-opacity-20 text-white rounded-lg shadow p-6 w-full animate-slide-up"> 
          <p className="text-lg font-serif leading-relaxed">
            {mainText}{" "}
            {visibleWords.map((word, index) => (
              <span 
                key={index} 
                className="inline-block opacity-0 animate-fade-in-word font-serif"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  background: 'linear-gradient(135deg, #66CCFF 0%, #FF66B2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  padding: '0 4px'
                }}
              >
                {word}{index < visibleWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
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
