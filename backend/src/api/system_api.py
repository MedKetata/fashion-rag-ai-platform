from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel
import requests
import time
import os
import phoenix as px

session = px.Client()

from src.auth.dependencies import require_admin
from src.core import config
from src.core.config import (
    PHOENIX_HOST,
    PHOENIX_TRACE_PORT,
    OLLAMA_HOST,
    OLLAMA_PORT,
    PROMPT_TOKEN_COST,
    COMPLETION_TOKEN_COST,
)



router = APIRouter(
    dependencies=[Depends(require_admin)]
)



OLLAMA_MODELS_CACHE = []
CACHE_TIMESTAMP = 0
CACHE_DURATION = 30


def fetch_ollama_models():
    global OLLAMA_MODELS_CACHE
    global CACHE_TIMESTAMP

    now = time.time()

    if now - CACHE_TIMESTAMP < CACHE_DURATION and OLLAMA_MODELS_CACHE:
        return OLLAMA_MODELS_CACHE

    response = requests.get(f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/api/tags")

    data = response.json()

    models = [m["name"] for m in data.get("models", [])]

    OLLAMA_MODELS_CACHE = models
    CACHE_TIMESTAMP = now

    return models




class ModelSelection(BaseModel):
    model: str


class CostUpdate(BaseModel):
    prompt_token_cost: float
    completion_token_cost: float


@router.get("/phoenix/costs")
def get_model_costs():

    return {
        "model": config.CURRENT_MODEL,
        "prompt_token_cost": PROMPT_TOKEN_COST,
        "completion_token_cost": COMPLETION_TOKEN_COST
    }


@router.post("/phoenix/costs")
def update_model_costs(cost: CostUpdate):

    session.set_model_cost(
        model_name=config.CURRENT_MODEL,
        prompt_token_cost=cost.prompt_token_cost,
        completion_token_cost=cost.completion_token_cost
    )

    return {
        "message": "Costs updated successfully",
        "model": config.CURRENT_MODEL,
        "prompt_token_cost": cost.prompt_token_cost,
        "completion_token_cost": cost.completion_token_cost
    }



@router.get("/ollama/models")
def list_ollama_models(query: str = Query(default="")):

    models = fetch_ollama_models()

    if query:
        models = [m for m in models if query.lower() in m.lower()]

    return {
        "models": models
    }



@router.post("/ollama/model")
def select_model(selection: ModelSelection):

    config.CURRENT_MODEL = selection.model

    return {
        "message": "Model updated successfully",
        "current_model": config.CURRENT_MODEL
    }


@router.get("/ollama/model")
def get_current_model():

    return {
        "model": config.CURRENT_MODEL
    }

@router.get("/ollama/model/details")
def get_model_details(model: str):

    try:

        response = requests.post(
            f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/api/show",
            json={"name": model},
            timeout=10
        )

        if response.status_code != 200:
            return {"error": "Failed to fetch model details"}

        data = response.json()

        parameters = data.get("parameters", "")

        context_length = None
        if isinstance(parameters, str) and "num_ctx" in parameters:
            context_length = parameters.split()[-1]

        return {
            "name": model,
            "architecture": data.get("details", {}).get("family"),
            "parameters": data.get("details", {}).get("parameter_size"),
            "quantization": data.get("details", {}).get("quantization_level"),
            "context_length": context_length
        }

    except requests.exceptions.RequestException:
        return {"error": "Ollama service unreachable"}