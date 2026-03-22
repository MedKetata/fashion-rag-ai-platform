import re
from src.data.data_loader import image_map


def extract_product_ids(text: str):
    pattern = r"(?:Product\s+)?ID:\s*(\d+(?:\.\d+)?)"
    matches = re.findall(pattern, text)
    return [int(float(x)) for x in matches]


def get_product_images(answer_text: str):

    product_ids = extract_product_ids(answer_text)

    products = []

    for pid in product_ids:

        image_url = image_map.get(pid)

        if image_url:

            products.append({
                "product_id": pid,
                "image_url": image_url
            })

    return products