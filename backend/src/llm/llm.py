import ollama
import src.core.config as config

clientOllama = ollama.Client(host=config.OLLAMA_URL)

def generate_with_single_input(
        prompt: str,
        role: str = "user",
        temperature: float = 0.7,
        top_p: float = 0.9,
        max_tokens: int = 500,
        model: str = None
):

    if model is None:
        model = config.CURRENT_MODEL

    response = clientOllama.chat(
        model=model,
        messages=[
            {
                "role": role,
                "content": prompt
            }
        ],
        options={
            "temperature": temperature,
            "top_p": top_p,
            "num_predict": max_tokens
        },
        stream=False
    )

    return response