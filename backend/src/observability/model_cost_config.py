import src.core.config as config

def configure_models(session):

    models = [
        {
            "model_name": config.CURRENT_MODEL,
            "prompt_token_cost":config.PROMPT_TOKEN_COST,
            "completion_token_cost":config.COMPLETION_TOKEN_COST
        }
    ]

    for m in models:
        session.set_model_cost(**m)