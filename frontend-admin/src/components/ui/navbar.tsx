import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { User } from "lucide-react";
import type { JSX } from "react";

const Navbar = (): JSX.Element => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <nav className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">

      {/* LOGO */}

      <h1 className="text-lg font-semibold">Fashion AI</h1>

      {/* NAVIGATION */}

      <div className="flex items-center space-x-6">

        {/* USER NAVBAR */}

        {user?.role !== "ADMIN" && (
          <>
            <Link to="/home" className="hover:text-purple-400">Home</Link>
            <Link to="/news" className="hover:text-purple-400">News</Link>
            <Link to="/contact" className="hover:text-purple-400">Contact</Link>
          </>
        )}

        {/* ADMIN NAVBAR */}

        {user?.role === "ADMIN" && (
          <>
            <Link to="/admin" className="hover:text-purple-400">Dashboard</Link>
            <Link to="/admin/phoenix" className="hover:text-purple-400">Monitoring</Link>
            
          </>
        )}

      </div>

      {/* USER INFO */}

      <div className="flex items-center space-x-4">

        {user && (
          <div className="flex items-center space-x-2 text-sm">
            <User size={20} />
            <span>{user.first_name}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300"
        >
          Logout
        </button>

      </div>

    </nav>
  );
};

export default Navbar;