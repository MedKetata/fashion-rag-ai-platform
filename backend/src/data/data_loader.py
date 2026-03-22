import joblib
import pandas as pd

image_map = {}

def load_datasets():

    global image_map

    products_data = joblib.load("dataset/clothes_json.joblib")
    faq_data = joblib.load("dataset/faq.joblib")

    images_df = pd.read_csv("dataset/images.csv")
    print(images_df.columns)
    print(images_df.head())

    images_df['id'] = images_df['filename'].str.replace('.jpg','').astype(int)

    image_map.clear()
    image_map.update(dict(zip(images_df['id'], images_df['link'])))

    print("Images loaded:", len(image_map))

    return products_data, faq_data