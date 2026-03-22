from src.llm.llm import generate_with_single_input
from src.llm.llm_utils import generate_params_dict
from src.observability.phoenix_server import tracer
from opentelemetry.trace import Status, StatusCode

def check_if_faq_or_product(query: str):

    PROMPT = f"""Label the following instruction as an FAQ related answer or a product related answer for a clothing store.

Product related answers are answers specific about product information or that needs to use the products to give an answer.

Examples:
Is there a refund for incorrectly bought clothes? Label: FAQ
Where are your stores located?: Label: FAQ
Tell me about the cheapest T-shirts that you have. Label: Product
Do you have blue T-shirts under 100 dollars? Label: Product
What are the available sizes for the t-shirts? Label: FAQ
How can I contact you via phone? Label: FAQ
How can I find the promotions? Label: FAQ
Give me ideas for a sunny look. Label: Product

Return only one of the two labels: FAQ or Product, nothing more.

Query to classify: {query}
"""

    with tracer.start_as_current_span(
        "routing_faq_or_product",
        openinference_span_kind="tool"
    ) as span:

        span.set_input({"query": query})

        kwargs = generate_params_dict(
            PROMPT,
            temperature=0,
            max_tokens=10
        )

        with tracer.start_as_current_span(
            "router_call",
            openinference_span_kind="llm"
        ) as router_span:

            router_span.set_input(kwargs)

            try:
                response = generate_with_single_input(**kwargs)

            except Exception as error:

                router_span.record_exception(error)
                router_span.set_status(Status(StatusCode.ERROR))
                raise

            else:

                prompt_tokens = response.get("prompt_eval_count", 0)
                completion_tokens = response.get("eval_count", 0)
                total_tokens = prompt_tokens + completion_tokens

                router_span.set_attribute(
                    "llm.token_count.prompt",
                    prompt_tokens
                )

                router_span.set_attribute(
                    "llm.token_count.completion",
                    completion_tokens
                )

                router_span.set_attribute(
                    "llm.token_count.total",
                    total_tokens
                )

                router_span.set_attribute(
                    "llm.model_name",
                    kwargs.get("model", "llama3.2:3b")
                )

                router_span.set_attribute(
                    "llm.provider",
                    "ollama"
                )

                router_span.set_output(response)
                router_span.set_status(Status(StatusCode.OK))

        # extraction de la réponse (hors span LLM)
        label = response["message"]["content"]
        total_tokens = (
            response.get("prompt_eval_count", 0)
            + response.get("eval_count", 0)
        )

        span.set_output({
            "label": label,
            "total_tokens": total_tokens
        })

        span.set_status(Status(StatusCode.OK))

        # sécurisation du label
        label = label.strip().lower()

        if "faq" in label:
            label = "FAQ"
        elif "product" in label:
            label = "Product"
        else:
            label = "undefined"

        return label, total_tokens






def decide_task_nature(query):

    PROMPT = f"""Decide if the following query is a query that requires creativity 
(creating, composing, making new things) or technical 
(information about products, prices etc.).

Examples:
Give me suggestions on a nice look for a nightclub. Label: creative
What are the blue dresses you have available? Label: technical
Give me three Tshirts for summer. Label: technical
Give me a look for attending a wedding party. Label: creative
Give me suggestions on clothes that match a green Tshirt. Label: creative
I would like a suggestion on which products match a green Tshirt I already have. Label: creative

Query to be analyzed: {query}

Return only one word:
creative or technical
"""

    with tracer.start_as_current_span(
        "decide_task_nature",
        openinference_span_kind="tool"
    ) as span:

        span.set_input({"query": query})

        kwargs = generate_params_dict(
            PROMPT,
            temperature=0,
            max_tokens=1
        )

        with tracer.start_as_current_span(
            "router_call",
            openinference_span_kind="llm"
        ) as router_span:

            router_span.set_input(kwargs)

            try:
                response = generate_with_single_input(**kwargs)

            except Exception as error:
                router_span.record_exception(error)
                router_span.set_status(Status(StatusCode.ERROR))
                raise

            else:
                prompt_tokens = response.get("prompt_eval_count", 0)
                completion_tokens = response.get("eval_count", 0)
                total_tokens = prompt_tokens + completion_tokens

                router_span.set_attribute("llm.token_count.prompt", prompt_tokens)
                router_span.set_attribute("llm.token_count.completion", completion_tokens)
                router_span.set_attribute("llm.token_count.total", total_tokens)

                router_span.set_attribute(
                    "llm.model_name",
                    kwargs.get("model", "llama3.2:3b")
                )

                router_span.set_attribute("llm.provider", "ollama")

                router_span.set_output(response)
                router_span.set_status(Status(StatusCode.OK))

        # extraction de la réponse (en dehors du span LLM)
        label = response["message"]["content"]
        label = label.strip().lower()

        span.set_output({
            "label": label,
            "total_tokens": total_tokens
        })

        span.set_status(Status(StatusCode.OK))

        return label, total_tokens

