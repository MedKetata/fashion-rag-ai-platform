import phoenix as px
from phoenix.otel import register

from src.core.config import (
    PHOENIX_HOST,
    PHOENIX_TRACE_PORT,
    PHOENIX_PROJECT_NAME
)

tracer = None


def make_url(endpoint=None):
    base = f"http://{PHOENIX_HOST}:{PHOENIX_TRACE_PORT}"
    url = f"{base}{endpoint}" if endpoint else base
    print(f"FOLLOW THIS URL TO OPEN THE UI: {url}")


def start_phoenix():

    global tracer

    tracer_provider = register(
        project_name=PHOENIX_PROJECT_NAME,
        endpoint=f"http://{PHOENIX_HOST}:{PHOENIX_TRACE_PORT}/v1/traces"
    )

    tracer = tracer_provider.get_tracer(__name__)

    return tracer