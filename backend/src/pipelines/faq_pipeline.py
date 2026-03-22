from src.core.utils import  generate_faq_layout
from src.llm.llm_utils import generate_params_dict
from src.vector_db.weaviate_server import client
from src.observability.phoenix_server import tracer
from opentelemetry.trace import Status, StatusCode

def query_on_faq(query, **kwargs):
   

    with tracer.start_as_current_span(
        "query_on_faq",
        openinference_span_kind="tool"
    ) as span:

        span.set_input({"query": query})

        faq_collection = client.collections.get("Faq")

        with tracer.start_as_current_span(
            "retrieve_faq_questions",
            openinference_span_kind="retriever"
        ) as retrieve_span:

            # récupérer les 5 FAQ les plus pertinentes
            results = faq_collection.query.near_text(
                query=query,
                limit=5
            )

            for i, document in enumerate(results.objects):
                retrieve_span.set_attribute(
                    f"retrieval.documents.{i}.document.id",
                    str(document.uuid)
                )
                retrieve_span.set_attribute(
                    f"retrieval.documents.{i}.document.content",
                    str(document.properties)
                )

        # transformer les résultats
        results = [x.properties for x in results.objects]

        # mettre les plus pertinents à la fin du prompt
        results.reverse()

        faq_layout = generate_faq_layout(results)

        PROMPT = f"""
You will be provided with relevant FAQ from a clothing store.

Answer the query using the provided FAQ.
You may combine multiple FAQ answers if needed.
Do not mention that you have access to an FAQ.

<FAQ>
{faq_layout}
</FAQ>

Query: {query}
"""

        span.set_attribute("prompt", PROMPT)

        params = generate_params_dict(
            PROMPT,
            **kwargs
        )

        span.set_output(str(params))
        span.set_status(Status(StatusCode.OK))

        return params