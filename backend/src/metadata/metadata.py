from src.llm.llm import generate_with_single_input
from src.observability.phoenix_server import tracer
from opentelemetry.trace import Status, StatusCode
from src.metadata.metadata_values import values
from src.llm.llm_utils  import generate_params_dict
def generate_metadata_from_query(query):


    PROMPT = f"""
One query will be provided. For the given query, there will be a call on vector database to query relevant clothing items.

Generate a JSON with useful metadata to filter the products in the query. Possible values for each feature is in the following json: {values}

Provide a JSON with the features that best fit in the query (can be more than one, write in a list). Also, if present, add a price key, saying if there is a price range.

Only return the JSON, nothing more. price key must be a JSON with "min" and "max" values (0 if no lower bound and inf if no upper bound).

Always include gender, masterCategory, articleType, baseColour, price, usage and season as keys.

If there is no price set, add min = 0 and max = inf.

Only include values that are given in the json above.

Example of expected JSON:

{{
"gender": ["Women"],
"masterCategory": ["Apparel"],
"articleType": ["Dresses"],
"baseColour": ["Blue"],
"price": {{"min": 0, "max": "inf"}},
"usage": ["Formal"],
"season": ["All seasons"]
}}

Query: {query}
"""
    with tracer.start_as_current_span(
        "generate_metadata_from_query",
        openinference_span_kind="tool"
    ) as span:

        span.set_input(query)

        with tracer.start_as_current_span(
            "llm_call",
            openinference_span_kind="llm"
        ) as metadata_span:

            kwargs = generate_params_dict(
                PROMPT,
                temperature=0,
                max_tokens=1500
            )

            metadata_span.set_input(kwargs)

            try:
                response = generate_with_single_input(**kwargs)

            except Exception as error:

                metadata_span.record_exception(error)
                metadata_span.set_status(Status(StatusCode.ERROR))
                raise

            else:

                prompt_tokens = response.get("prompt_eval_count", 0)
                completion_tokens = response.get("eval_count", 0)
                total_tokens = prompt_tokens + completion_tokens

                metadata_span.set_attribute(
                    "llm.token_count.prompt",
                    prompt_tokens
                )

                metadata_span.set_attribute(
                    "llm.token_count.completion",
                    completion_tokens
                )

                metadata_span.set_attribute(
                    "llm.token_count.total",
                    total_tokens
                )

                metadata_span.set_attribute(
                    "llm.model_name",
                    kwargs["model"]
                )

                metadata_span.set_attribute(
                    "llm.provider",
                    "ollama"
                )

                metadata_span.set_output(response)
                metadata_span.set_status(Status(StatusCode.OK))

        # hors du span LLM (comme dans le TP)

        content = response["message"]["content"]

        prompt_tokens = response.get("prompt_eval_count", 0)
        completion_tokens = response.get("eval_count", 0)
        total_tokens = prompt_tokens + completion_tokens

        span.set_output({
            "content": content,
            "total_tokens": total_tokens
        })

        span.set_status(Status(StatusCode.OK))

    return content, total_tokens