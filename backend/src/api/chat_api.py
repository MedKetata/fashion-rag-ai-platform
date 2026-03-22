from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.services.chat_history_service import save_message
from src.services.chat_service import generate_answer
from src.auth.dependencies import get_current_user
from src.services.chat_history_service import get_user_history
from src.observability.phoenix_server import tracer
from opentelemetry.trace import Status, StatusCode
router = APIRouter()


class ChatRequest(BaseModel):
    query: str


@router.post("/chat")
def chat_endpoint(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):
    with tracer.start_as_current_span(
        "chat_endpoint",
        openinference_span_kind="chain"
    ) as span:

        span.set_input({
            "user_id": current_user.id,
            "query": request.query
        })

        user_id = current_user.id

        save_message(user_id, "user", request.query)

        answer, products = generate_answer(request.query)

        save_message(user_id, "assistant", {
            "answer": answer,
            "products": products
        })

        output = {
            "query": request.query,
            "answer": answer,
            "products": products
        }

        span.set_output(output)
        span.set_status(Status(StatusCode.OK))

        return output

"""

@router.post("/chat")
def chat_endpoint(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):

    user_id = current_user.id

    save_message(user_id, "user", request.query)

    answer, products = generate_answer(request.query)

    save_message(user_id, "assistant", {
        "answer": answer,
        "products": products
    })

    return {
        "query": request.query,
        "answer": answer,
        "products": products
    }
"""
@router.get("/chat/history")
def get_history(current_user = Depends(get_current_user)):

    history = get_user_history(current_user.id)

    return {
        "messages": history
    }
