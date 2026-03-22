from src.llm.llm_utils import generate_params_dict
from src.observability.phoenix_server import tracer
from src.routing.router import decide_task_nature
from src.retrieval.product_search import get_relevant_products_from_query
from src.core.utils import get_params_for_task, generate_items_context


@tracer.tool
def query_on_products(query):
   

    total_tokens = 0

    query_label, tokens = decide_task_nature(query)

    total_tokens += tokens

    parameters_dict = get_params_for_task(query_label)

    relevant_products, tokens = get_relevant_products_from_query(query)

    total_tokens += tokens

    context = generate_items_context(relevant_products)

    PROMPT = (
        f"Given the available set of clothing products given by:\n"
        f"CLOTHING PRODUCTS AVAILABLE:\n{context}\n"
        f"Answer the question that follows.\n"
        f"Never use more than 5 clothing products available below to compose your answer.\n"
        f"Provide the item ID in your answers.\n"
        f"The other information might be provided but not necessarily all of them, pick only the relevant ones for the given query.\n"
        f"\nQUERY: {query}"
    )

    kwargs = generate_params_dict(
        PROMPT,
        role="user",
        **parameters_dict
    )

    return kwargs, total_tokens
