import { apiClient } from "./apiClient";

/* ---------------- CURRENT MODEL ---------------- */
export const getCurrentModel = async () => {
    return await apiClient("/system/ollama/model", {
        method: "GET"
    });
};

/* ---------------- UPDATE MODEL ---------------- */
export const updateModel = async (model: string) => {
    return await apiClient("/system/ollama/model", {
        method: "POST",
        body: JSON.stringify({ model })
    });
};

/* ---------------- MODEL COST ---------------- */
export const getModelCost = async () => {
    return await apiClient("/system/phoenix/costs", {
        method: "GET"
    });
};

export const updateModelCost = async (
    prompt_token_cost: number,
    completion_token_cost: number
) => {
    return await apiClient("/system/phoenix/costs", {
        method: "POST",
        body: JSON.stringify({
            prompt_token_cost,
            completion_token_cost
        })
    });
};

/* ---------------- MODEL SEARCH ---------------- */
export const searchModels = async (query: string) => {
    const data = await apiClient(`/system/ollama/models?query=${query}`, {
        method: "GET"
    });

    return data.models;
};

export const getModelDetails = async (model: string) => {
    return await apiClient(`/system/ollama/model/details?model=${model}`, {
        method: "GET"
    });
};