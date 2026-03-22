import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getCurrentUser } from "../services/authservice";
import type { JSX } from "react";
import { useAuth } from "../context/useAuth";

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser(email, password);

      const user = await getCurrentUser();

      login(user);

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
      <div className="h-full flex items-center justify-center bg-slate-950 text-white overflow-y-auto">
        <form
            onSubmit={handleLogin}
            className="bg-slate-900 p-10 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">
            Login
          </h2>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 rounded-lg bg-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />

          <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 rounded-lg bg-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />

          <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition"
          >
            Login
          </button>

          <p className="text-center mt-4 text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
  );
};

export default Login;