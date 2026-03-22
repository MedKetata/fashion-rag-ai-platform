import { useEffect, useState } from "react";
import { getModelCost, updateModelCost } from "../../services/systemService";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

function CostModal({ onClose }: Props) {
  const [promptCost, setPromptCost] = useState(0);
  const [completionCost, setCompletionCost] = useState(0);

  const [newPrompt, setNewPrompt] = useState(0);
  const [newCompletion, setNewCompletion] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCost();
  }, []);

  const loadCost = async () => {
    try {
      setLoading(true);

      const data = await getModelCost();

      setPromptCost(data.prompt_token_cost);
      setCompletionCost(data.completion_token_cost);
    } catch {
      toast.error("Failed to load model costs");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateModelCost(newPrompt, newCompletion);

      toast.success("Model costs updated");

      setPromptCost(newPrompt);
      setCompletionCost(newCompletion);
    } catch {
      toast.error("Failed to update costs");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="bg-slate-900 p-8 rounded-xl w-[500px]">
          <h2 className="text-2xl mb-4">Model Costs</h2>

          <p>
            Prompt cost :
            <span className="ml-2 text-purple-400">
            {loading ? "Loading..." : promptCost}
          </span>
          </p>

          <p className="mb-4">
            Completion cost :
            <span className="ml-2 text-purple-400">
            {loading ? "Loading..." : completionCost}
          </span>
          </p>

          <input
              type="number"
              placeholder="New prompt cost"
              onChange={(e) => setNewPrompt(Number(e.target.value))}
              className="w-full p-2 bg-slate-800 mb-3"
          />

          <input
              type="number"
              placeholder="New completion cost"
              onChange={(e) => setNewCompletion(Number(e.target.value))}
              className="w-full p-2 bg-slate-800"
          />

          <div className="flex gap-4 mt-6">
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-purple-600 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Updating costs..." : "Update"}
            </button>

            <button
                onClick={onClose}
                className="bg-gray-700 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
  );
}

export default CostModal;