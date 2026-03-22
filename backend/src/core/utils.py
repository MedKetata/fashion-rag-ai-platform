from src.observability.phoenix_server import tracer
from src.metadata.metadata import generate_metadata_from_query
from src.core.config import OLLAMA_MODEL
from weaviate.classes.query import Filter
import json





@tracer.tool
def generate_faq_layout(faq_dict):

    t = ""

    for f in faq_dict:
        t += f"Question: {f['question']} Answer: {f['answer']} Type: {f['type']}\n"

    return t
    
@tracer.tool    
def get_params_for_task(task):
  
    PARAMETERS_DICT = {
            "creative": {"top_p": 0.9, "temperature": 1},
            "technical": {"top_p": 0.7, "temperature": 0.3},
        }

    if task == "technical":
        param_dict = PARAMETERS_DICT["technical"]

    elif task == "creative":
        param_dict = PARAMETERS_DICT["creative"]

    else:
        param_dict = {"top_p": 0.5, "temperature": 1}

    return param_dict

@tracer.tool
def parse_json_output(llm_output):
  

    try:
        
        llm_output = (
            llm_output
            .replace("\n", "")
            .replace("'", "")
            .replace("}}", "}")
            .replace("{{", "{")
        )

        # parsing JSON
        parsed_json = json.loads(llm_output)

        return parsed_json

    except json.JSONDecodeError as e:

        print(f"JSON parsing failed: {e}")

        return None

@tracer.tool
def get_filter_by_metadata(json_output: dict | None = None):
   

    if json_output is None:
        return None

    valid_keys = (
        "gender",
        "masterCategory",
        "articleType",
        "baseColour",
        "price",
        "usage",
        "season",
    )

    filters = []

    for key, value in json_output.items():

        if key not in valid_keys:
            continue

        if key == "price":

            if not isinstance(value, dict):
                continue

            min_price = value.get("min")
            max_price = value.get("max")

            if min_price is None or max_price is None:
                continue

            if min_price <= 0 or max_price == "inf":
                continue

            filters.append(Filter.by_property(key).greater_than(min_price))
            filters.append(Filter.by_property(key).less_than(max_price))

        else:

            filters.append(
                Filter.by_property(key).contains_any(value)
            )

    return filters  

@tracer.tool
def generate_filters_from_query(query):

    json_string, total_tokens = generate_metadata_from_query(query)

    json_output = parse_json_output(json_string)

    filters = get_filter_by_metadata(json_output)

    return filters, total_tokens


@tracer.tool
def generate_items_context(results):
   

    t = ""

    for item in results:

        item = item.properties

        t += (
            f"Product ID: {item.get('product_id')}. "
            f"Product name: {item.get('productDisplayName')}. "
            f"Product Category: {item.get('masterCategory')}. "
            f"Product usage: {item.get('usage')}. "
            f"Product gender: {item.get('gender')}. "
            f"Product Type: {item.get('articleType')}. "
            f"Product SubCategory: {item.get('subCategory')}. "
            f"Product Color: {item.get('baseColour')}. "
            f"Product Season: {item.get('season')}. "
            f"Product Year: {item.get('year')}.\n"
        )

    return t


