import type { JSX } from 'react';

type NewsItem = {
  title: string;
  description: string;
  date: string;
};

const news: NewsItem[] = [
  {
    title: 'AI Fashion Trends 2026',
    description:
        'Discover how artificial intelligence is reshaping the fashion industry.',
    date: 'March 2026',
  },
  {
    title: 'How RAG Improves Product Search',
    description:
        'Learn how Retrieval-Augmented Generation enhances semantic fashion search.',
    date: 'February 2026',
  },
  {
    title: 'Personalized Shopping Experience',
    description: 'How AI assistants adapt to user style preferences over time.',
    date: 'January 2026',
  },
];

const News = (): JSX.Element => {
  return (
      <div className="h-full overflow-y-auto bg-slate-950 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto min-h-full flex flex-col justify-center">
          {/* HERO */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-500">
              Latest News
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto">
              Stay updated with our AI innovations and fashion technology insights.
            </p>
          </div>

          {/* ARTICLES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {news.map((article, index) => (
                <div
                    key={index}
                    className="bg-slate-900 p-6 rounded-2xl shadow-xl hover:scale-105 transition duration-300"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-purple-400">
                    {article.title}
                  </h3>

                  <p className="text-slate-400 mb-4">{article.description}</p>

                  <span className="text-sm text-slate-500">{article.date}</span>

                  <div className="mt-6">
                    <button className="text-purple-400 hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default News;