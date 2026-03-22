import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

function PhoenixMonitoring() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const openPhoenix = () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setLoading(true);

      const phoenixUrl =
          import.meta.env.VITE_NGINX_URL +
          import.meta.env.VITE_PHOENIX_PATH;

      window.open(phoenixUrl, "_blank", "noopener,noreferrer");
      toast.success("Opening Phoenix Monitoring");
    } catch {
      toast.error("Failed to open monitoring");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="h-full bg-slate-950 text-white p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Phoenix Monitoring</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
              onClick={openPhoenix}
              disabled={loading}
              className="bg-purple-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Opening..." : "Open Phoenix"}
          </button>

          <button
              onClick={() => navigate("/admin")}
              className="bg-gray-700 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
  );
}

export default PhoenixMonitoring;