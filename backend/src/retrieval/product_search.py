from src.observability.phoenix_server import tracer
from src.core.utils import generate_filters_from_query
from src.vector_db.weaviate_server import products_collection
from weaviate.classes.query import Filter
from opentelemetry.trace import Status, StatusCode
from src.data.data_loader import image_map

def enrich_product(document):

    product_id = document.properties.get("product_id")
    document.properties["image_url"] = image_map.get(product_id)

    return document

@tracer.tool
def get_relevant_products_from_query(query):
    

    with tracer.start_as_current_span(
        "get_relevant_products_from_query",
        openinference_span_kind="retriever"
    ) as span:

        span.set_input({"query": query})

        
        filters, total_tokens = generate_filters_from_query(query)

       
        if filters is None or len(filters) == 0:

            span.set_attribute("retrieval.filters", "")

            results = products_collection.query.near_text(
                query=query,
                limit=20
            )

            for i, document in enumerate(results.objects):
                document = enrich_product(document)
                span.set_attribute(
                    f"retrieval.documents.{i}.document.id",
                    str(document.uuid)
                )

                span.set_attribute(
                    f"retrieval.documents.{i}.document.metadata",
                    str(document.metadata)
                )

                span.set_attribute(
                    f"retrieval.documents.{i}.document.content",
                    str(document.properties)
                )

            span.set_output({"results": results.objects})
            span.set_status(Status(StatusCode.OK))

            return results.objects, total_tokens

      
        span.set_attribute("retrieval.filters", str(filters))

        results = products_collection.query.near_text(
            query=query,
            filters=Filter.all_of(filters),
            limit=20
        )

        span.set_attribute("retrieval.len", len(results.objects))

        for i, document in enumerate(results.objects):

            document = enrich_product(document)

            span.set_attribute(
                f"retrieval.documents.{i}.document.id",
                str(document.uuid)
            )

            span.set_attribute(
                f"retrieval.documents.{i}.document.metadata",
                str(document.metadata)
            )

            span.set_attribute(
                f"retrieval.documents.{i}.document.content",
                str(document.properties)
            )

        importance_order = [
            "baseColour",
            "masterCategory",
            "usage",
            "masterCategory",
            "season",
            "articleType",
            "gender",
        ]

        if len(results.objects) < 10:

            for i in range(len(importance_order)):

                with tracer.start_as_current_span(
                    f"refilter_{i}",
                    openinference_span_kind="chain"
                ) as refilter_span:

                    filtered_filters = [
                        x for x in filters
                        if x.target in importance_order[i+1:]
                    ]

                    refilter_span.set_input(str(filtered_filters))

                    results = products_collection.query.near_text(
                        query=query,
                        filters=Filter.all_of(filtered_filters),
                        limit=20
                    )

                    for j, document in enumerate(results.objects):

                        document = enrich_product(document)

                        refilter_span.set_attribute(
                            f"retrieval.documents.{j}.document.id",
                            str(document.uuid)
                        )

                        refilter_span.set_attribute(
                            f"retrieval.documents.{j}.document.metadata",
                            str(document.metadata)
                        )

                        refilter_span.set_attribute(
                            f"retrieval.documents.{j}.document.content",
                            str(document.properties)
                        )

                    if len(results.objects) >= 5:

                        refilter_span.set_output(results.objects)
                        refilter_span.set_status(Status(StatusCode.OK))

                        span.set_output(results.objects)
                        span.set_status(Status(StatusCode.OK))

                        return results.objects, total_tokens

        span.set_output(results.objects)
        span.set_status(Status(StatusCode.OK))

        return results.objects, total_tokens
    