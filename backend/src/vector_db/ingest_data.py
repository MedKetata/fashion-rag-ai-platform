from src.vector_db.weaviate_server import client
from src.data.data_loader import load_datasets


def ingest_data():

    products_collection = client.collections.get("Products")
    faq_collection = client.collections.get("Faq")

    # vérifier si les collections contiennent déjà des données
    products_count = products_collection.aggregate.over_all(total_count=True).total_count
    faq_count = faq_collection.aggregate.over_all(total_count=True).total_count

    if products_count > 0 and faq_count > 0:
        print("Weaviate already contains data, skipping ingestion.")
        return

    print("Loading datasets...")
    products_data, faq_data = load_datasets()

    print("Inserting products...")

    for product in products_data:
        products_collection.data.insert(product)

    print("Products inserted")

    print("Inserting FAQ...")

    for faq in faq_data:
        faq_collection.data.insert(faq)

    print("FAQ inserted")