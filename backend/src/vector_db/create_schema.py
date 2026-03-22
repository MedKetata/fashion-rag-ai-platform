from src.vector_db.weaviate_server import client
import weaviate.classes as wvc

def create_schema():


    if not client.collections.exists("Products"):

        client.collections.create(
            name="Products",
            vector_config=wvc.config.Configure.Vectors.text2vec_transformers()
        )

        print("Products collection created")

    else:
        print("Products collection already exists")


    if not client.collections.exists("Faq"):

        client.collections.create(
            name="Faq",
            vector_config=wvc.config.Configure.Vectors.text2vec_transformers()
        )

        print("Faq collection created")

    else:
        print("Faq collection already exists")