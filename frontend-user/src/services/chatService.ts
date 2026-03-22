import { apiClient } from "./apiClient";

export const sendMessage = async (message: string) => {
    const data = await apiClient("/chat", {
        method: "POST",
        body: JSON.stringify({ query: message })
    });

    return data;
};

export const getChatHistory = async () => {
    const data = await apiClient("/chat/history", {
        method: "GET"
    });

    return data.messages || [];
};