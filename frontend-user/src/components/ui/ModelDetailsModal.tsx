import { useEffect, useState } from "react";
import { getModelDetails } from "../../services/systemService";

interface Props {
    model: string;
    onClose: () => void;
}

interface ModelDetails {
    name?: string;
    architecture?: string;
    parameters?: string;
    quantization?: string;
    context_length?: string;
    error?: string;
}

function ModelDetailsModal({ model, onClose }: Props) {
    const [details, setDetails] = useState<ModelDetails | null>(null);

    useEffect(() => {
        const loadDetails = async () => {
            const data = await getModelDetails(model);
            setDetails(data);
        };

        loadDetails();
    }, [model]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-slate-900 p-8 rounded-xl w-[500px]">
                <h2 className="text-2xl mb-4">Model Details</h2>

                {!details && <p>Loading...</p>}

                {details && (
                    <div className="space-y-2">
                        <p>
                            <b>Name :</b> {details.name}
                        </p>
                        <p>
                            <b>Architecture :</b> {details.architecture}
                        </p>
                        <p>
                            <b>Parameters :</b> {details.parameters}
                        </p>
                        <p>
                            <b>Quantization :</b> {details.quantization}
                        </p>
                        <p>
                            <b>Context length :</b> {details.context_length}
                        </p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 bg-purple-600 px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ModelDetailsModal;