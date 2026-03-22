import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

import { landingImages } from "../data/landingImages";

const LandingPage = (): JSX.Element => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>("");

  const fullText = "Fashion RAG AI";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % landingImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let index = 0;

    const typing = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;

      if (index === fullText.length) {
        clearInterval(typing);
      }
    }, 100);

    return () => clearInterval(typing);
  }, []);

  return (
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* BACKGROUND SLIDER */}
        <div className="absolute inset-0">
          {landingImages.map((img, index) => (
              <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                      index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ backgroundImage: `url(${img})` }}
              />
          ))}
        </div>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* TOP NAVBAR */}
          <div className="flex justify-between items-center p-6">
            <h1 className="text-2xl font-bold">Fashion RAG</h1>

            <div className="flex items-center space-x-6">
              <Link to="/login" className="hover:text-purple-400 transition">
                Login
              </Link>

              <Link
                  to="/register"
                  className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Register
              </Link>
            </div>
          </div>

          {/* HERO CONTENT */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {displayedText}
            </h2>

            <p className="text-xl text-slate-300 max-w-2xl">
              Discover intelligent fashion powered by AI, semantic search and
              Retrieval-Augmented Generation.
            </p>
          </div>
        </div>
      </div>
  );
};

export default LandingPage;