values = {}


def build_values(products_data):

    global values

    values = {}

    for d in products_data:
        for key, val in d.items():

            if key in ('product_id', 'price', 'productDisplayName', 'subCategory', 'year'):
                continue

            if key not in values:
                values[key] = set()

            values[key].add(val)

    return values