from src.observability.phoenix_server import tracer
from src.routing.router import check_if_faq_or_product
from src.pipelines.faq_pipeline import query_on_faq
from src.pipelines.product_pipeline import query_on_products
import src.core.config as config

@tracer.tool
def answer_query(query, model=None):
    
    if model is None:
        model = config.CURRENT_MODEL

    total_tokens = 0

    label, tokens = check_if_faq_or_product(query)

    total_tokens += tokens

    if label not in ["FAQ", "Product"]:
        return {
            "role": "assistant",
            "prompt": (
                f"User provided a question that does not fit FAQ or Product-related categories. "
                f"Answer it based on the context you already have. "
                f"Query: {query}"
            ),
            "model": model
        }, total_tokens

    if label == "FAQ":

        kwargs = query_on_faq(query)

    elif label == "Product":

        try:

            kwargs, tokens = query_on_products(query)

            total_tokens += tokens

        except Exception:

            return {
                "role": "assistant",
                "prompt": (
                    "User provided a question that broke the querying system. "
                    "Ask them to rephrase it."
                    f" Query: {query}"
                ),
                "model": model
            }, total_tokens

    kwargs["model"] = model

    return kwargs, total_tokens