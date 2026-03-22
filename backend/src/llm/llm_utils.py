import src.core.config as config

def generate_params_dict(
        prompt: str,
        temperature: float = 1.0,
        role: str = "user",
        top_p: float = 1.0,
        max_tokens: int = 500,
        model: str = None
) -> dict:
    if model is None:
        model = config.CURRENT_MODEL

    params = {
        "prompt": prompt,
        "role": role,
        "temperature": temperature,
        "top_p": top_p,
        "max_tokens": max_tokens,
        "model": model
    }

    return params