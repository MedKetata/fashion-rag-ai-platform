from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.core.mongo import client as mongo_client
from src.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import CORS_ORIGINS_LIST


from src.observability.phoenix_server import start_phoenix

tracer = start_phoenix()


from src.data.data_loader import load_datasets
from src.metadata.metadata_values import build_values

from src.vector_db.create_schema import create_schema
from src.vector_db.ingest_data import ingest_data

from src.auth.routes import router as auth_router
from src.api.chat_api import router as chat_router
from src.api.system_api import router as system_router

from src.auth.init_admin import create_admin_if_not_exists


@asynccontextmanager
async def lifespan(app: FastAPI):

    # reset database (dev mode)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    create_admin_if_not_exists()




    products_data, faq_data = load_datasets()


    build_values(products_data)

    create_schema()

    ingest_data()

    yield

    mongo_client.close()


app = FastAPI(
    title="RAG Clothing Assistant API",
    version="1.0",
    lifespan=lifespan
)

if CORS_ORIGINS_LIST:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS_LIST,
        allow_credentials=True,
        allow_methods=["*"], #en production : allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"], #en production : allow_headers=["Authorization", "Content-Type"],
    )
app.include_router(chat_router)
app.include_router(system_router,prefix="/system")
app.include_router(auth_router)