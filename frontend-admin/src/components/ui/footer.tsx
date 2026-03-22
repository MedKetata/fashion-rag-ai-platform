import type { JSX } from 'react';
import { Link } from 'react-router-dom';

type FooterLink = {
  label: string;
  path: string;
};

const quickLinks: FooterLink[] = [
  { label: 'Home', path: '/home' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },

];

const Footer = (): JSX.Element => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {/* BRAND */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Fashion RAG AI</h3>

          <p className="text-sm text-slate-400">
            AI-powered fashion assistant using semantic search, vector retrieval
            and intelligent recommendations.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>

          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="hover:text-purple-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>

          <p className="text-sm text-slate-400">Email: support@fashionrag.ai</p>

          <p className="text-sm text-slate-400 mt-2">
            Powered by FastAPI, FAISS & LLM
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Fashion RAG AI — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
