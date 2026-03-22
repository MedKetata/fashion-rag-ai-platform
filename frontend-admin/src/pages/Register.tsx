import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { JSX } from "react";
import { registerUser } from "../services/authservice";

const Register = (): JSX.Element => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password
    };

    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed");
    }
  };

  return (
      <div className="h-full flex items-center justify-center bg-slate-950 text-white overflow-y-auto">
        <form
            onSubmit={handleRegister}
            className="bg-slate-900 p-10 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">
            Register
          </h2>

          <input
              type="text"
              placeholder="First name"
              className="w-full mb-4 p-3 rounded-lg bg-slate-800"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
          />

          <input
              type="text"
              placeholder="Last name"
              className="w-full mb-4 p-3 rounded-lg bg-slate-800"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
          />

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
            Register
          </button>

          <p className="text-center mt-4 text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
  );
};

export default Register;