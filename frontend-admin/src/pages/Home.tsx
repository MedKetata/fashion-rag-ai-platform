import type { JSX } from 'react';

const Home = (): JSX.Element => {
  return (
      <div className="h-full flex flex-col text-white overflow-y-auto">
        {/* HERO SECTION */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 bg-gradient-to-br from-slate-900 to-slate-800">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Style
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8">
            AI-powered fashion assistant that understands your taste and finds
            exactly what you need.
          </p>

          <button className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl text-lg transition">
            Try the AI Assistant
          </button>
        </section>

        {/* FEATURES SECTION */}
        <section className="px-6 py-10 bg-slate-950">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
                Smart Recommendations
              </h3>

              <p className="text-slate-400">
                Our AI analyzes your preferences and suggests products tailored to
                your style.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
                Instant Search
              </h3>

              <p className="text-slate-400">
                Find exactly what you're looking for with intelligent semantic
                search.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
                Personalized Experience
              </h3>

              <p className="text-slate-400">
                Your fashion assistant adapts to your taste over time.
              </p>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Home;