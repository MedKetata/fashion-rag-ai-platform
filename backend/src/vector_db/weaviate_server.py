import weaviate
from src.core.config import WEAVIATE_HOST, WEAVIATE_PORT, WEAVIATE_GRPC_PORT

client = weaviate.connect_to_custom(
    http_host=WEAVIATE_HOST,
    http_port=int(WEAVIATE_PORT),
    http_secure=False,

    grpc_host=WEAVIATE_HOST,
    grpc_port=int(WEAVIATE_GRPC_PORT),
    grpc_secure=False
)

products_collection = client.collections.get("Products")
faq_collection = client.collections.get("Faq")