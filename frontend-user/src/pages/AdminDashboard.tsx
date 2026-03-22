import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import ModelModal from "../components/ui/ModelModal";
import CostModal from "../components/ui/CostModal";

const AdminDashboard = (): JSX.Element => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [modelModalOpen, setModelModalOpen] = useState(false);
    const [costModalOpen, setCostModalOpen] = useState(false);

    return (
        <div className="h-full flex flex-col bg-slate-950 text-white p-10 overflow-y-auto">
            <h1 className="text-4xl font-bold mb-6 text-purple-400">
                Admin Dashboard
            </h1>

            <p className="text-lg mb-8">
                Welcome {user?.first_name} {user?.last_name}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* MODEL COST */}
                <div
                    onClick={() => setCostModalOpen(true)}
                    className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800"
                >
                    <h2 className="text-xl font-semibold mb-2">Models costs</h2>
                    <p>Manage models costs</p>
                </div>

                {/* OLLAMA MODELS */}
                <div
                    onClick={() => setModelModalOpen(true)}
                    className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800"
                >
                    <h2 className="text-xl font-semibold mb-2">AI Models</h2>
                    <p>Manage Ollama models</p>
                </div>

                {/* PHOENIX */}
                <div
                    onClick={() => navigate("/admin/phoenix")}
                    className="bg-slate-900 p-6 rounded-xl cursor-pointer hover:bg-slate-800"
                >
                    <h2 className="text-xl font-semibold mb-2">System Monitoring</h2>
                    <p>Phoenix observability</p>
                </div>
            </div>

            {modelModalOpen && (
                <ModelModal onClose={() => setModelModalOpen(false)} />
            )}

            {costModalOpen && (
                <CostModal onClose={() => setCostModalOpen(false)} />
            )}
        </div>
    );
};

export default AdminDashboard;