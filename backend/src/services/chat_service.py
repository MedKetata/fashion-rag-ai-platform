from src.pipelines.global_pipeline import answer_query
from src.llm.llm import generate_with_single_input
from src.services.product_image_service import get_product_images
from src.observability.phoenix_server import tracer
from opentelemetry.trace import Status, StatusCode


def generate_answer(query):
    with tracer.start_as_current_span(
        "generate_answer",
        openinference_span_kind="chain"
    ) as span:

        span.set_input({"query": query})

        kwargs, tokens = answer_query(query)

        span.set_attribute("routing.total_tokens", tokens)

        with tracer.start_as_current_span(
            "final_llm_call",
            openinference_span_kind="llm"
        ) as llm_span:

            llm_span.set_input(kwargs)

            try:
                response = generate_with_single_input(**kwargs)

            except Exception as error:
                llm_span.record_exception(error)
                llm_span.set_status(Status(StatusCode.ERROR))
                raise

            else:
                prompt_tokens = response.get("prompt_eval_count", 0)
                completion_tokens = response.get("eval_count", 0)
                total_tokens = prompt_tokens + completion_tokens

                llm_span.set_attribute("llm.token_count.prompt", prompt_tokens)
                llm_span.set_attribute("llm.token_count.completion", completion_tokens)
                llm_span.set_attribute("llm.token_count.total", total_tokens)
                llm_span.set_attribute("llm.model_name", kwargs.get("model"))
                llm_span.set_attribute("llm.provider", "ollama")
                llm_span.set_output(response)
                llm_span.set_status(Status(StatusCode.OK))

        answer = response["message"]["content"]
        products = get_product_images(answer)

        span.set_output({
            "answer": answer,
            "products_count": len(products)
        })
        span.set_status(Status(StatusCode.OK))

        return answer, products