import { useEffect, useState } from "react";
import {
  getCurrentModel,
  updateModel,
  searchModels
} from "../../services/systemService";
import toast from "react-hot-toast";
import ModelDetailsModal from "./ModelDetailsModal";

interface Props {
  onClose: () => void;
}

function ModelModal({ onClose }: Props) {
  const [currentModel, setCurrentModel] = useState("");
  const [search, setSearch] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadCurrentModel();
  }, []);

  const loadCurrentModel = async () => {
    try {
      setLoading(true);

      const data = await getCurrentModel();

      setCurrentModel(data.model);
    } catch {
      toast.error("Failed to load current model");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setSearch(value);

    try {
      const results = await searchModels(value);
      setModels(results);
    } catch {
      toast.error("Failed to search models");
    }
  };

  const handleSelect = async (model: string) => {
    if (model === currentModel) return;

    try {
      setLoading(true);

      await updateModel(model);

      setCurrentModel(model);

      toast.success(`Model switched to ${model}`);

      onClose();
    } catch {
      toast.error("Failed to update model");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="bg-slate-900 p-8 rounded-xl w-[500px]">
          <h2 className="text-2xl mb-2">Manage Ollama Model</h2>

          <p className="text-sm text-gray-400 mb-4">
            Model change is temporary. Backend restart resets to default model.
          </p>

          <p className="mb-2">
            Current model :
            <span className="text-purple-400 ml-2 font-semibold">
            {loading ? "Loading..." : currentModel}
          </span>
          </p>

          <button
              onClick={() => setShowDetails(true)}
              className="text-sm text-purple-400 hover:underline mb-4"
          >
            Show model details
          </button>

          <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search model..."
              className="w-full p-2 bg-slate-800 rounded mb-4 outline-none focus:ring-2 focus:ring-purple-600"
          />

          {loading && (
              <p className="text-sm text-gray-400 mb-2">Updating model...</p>
          )}

          <div className="max-h-40 overflow-y-auto rounded">
            {models.length === 0 && search && (
                <p className="text-gray-400 text-sm p-2">No models found</p>
            )}

            {models.map((m) => (
                <div
                    key={m}
                    onClick={() => handleSelect(m)}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center
                ${
                        m === currentModel
                            ? "bg-purple-700 text-white"
                            : "hover:bg-slate-700"
                    }
              `}
                >
                  <span>{m}</span>

                  {m === currentModel && (
                      <span className="text-green-300 text-sm">✓ Active</span>
                  )}
                </div>
            ))}
          </div>

          <button
              onClick={onClose}
              disabled={loading}
              className="mt-6 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        {showDetails && (
            <ModelDetailsModal
                model={currentModel}
                onClose={() => setShowDetails(false)}
            />
        )}
      </div>
  );
}

export default ModelModal;