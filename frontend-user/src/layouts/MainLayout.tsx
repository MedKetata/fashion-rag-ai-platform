import type { JSX } from 'react';
import { Outlet, Link } from 'react-router-dom';

import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';

import { useAuth } from "../context/useAuth"

const MainLayout = (): JSX.Element => {

  const { user } = useAuth();

  return (

    <div className="min-h-screen flex flex-col bg-slate-950 text-white">

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN CONTENT */}

      <main className="flex-1 p-6 overflow-hidden">
        <Outlet />
      </main>

      {/* FOOTER */}

        {user?.role === "ADMIN" ? (
            <footer className="bg-slate-900 px-6 py-4 text-white">
                <div className="flex justify-center gap-6">
                    <Link to="/admin" className="hover:text-purple-400">
                        Dashboard
                    </Link>
                    <Link to="/admin/phoenix" className="hover:text-purple-400">
                        Monitoring
                    </Link>
                </div>
            </footer>
        ) : (
            <Footer />
        )}

      {/* CHATBOT seulement pour USER */}

      {user?.role !== "ADMIN" && (
        <ChatbotWidget />
      )}

    </div>

  );

};

export default MainLayout;