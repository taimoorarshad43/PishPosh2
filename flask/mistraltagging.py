import os
from time import sleep

from mistralai import Mistral
from sqlalchemy import func
from app import app

from models import Product

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

def get_product_tag(desc):

    prompt = f"Give me a list of tags for this product description: {desc}. Please give them in a comma separated list and only 5-10. Do not add any other text."


    chat_response = client.chat.complete(
        model = model,
        messages = [
            {
                "role": "user",
                "content": prompt,
            },
        ]
    )

    # For debugging purposes
    print(chat_response.choices[0].message.content)
    print("-===============================================-")

    output = chat_response.choices[0].message.content

    return output

def get_random_product_description():
    """
    Fetches one random product description from the Product model
    using Flask-SQLAlchemy's `Product.query`.
    :return: A single description string, or None if no products exist.
    """
    random_func = func.random()  # Getting a random number

    with app.app_context():
        result = (
            Product.query
                .with_entities(Product.productname)
                .order_by(random_func)
                .limit(1)
                .first()
        )
    # .first() returns a tuple like ('description',) or None
    return result[0] if result else None

def testing(sample = 1):
    """
    Test function to get a random product description and generate tags and see how this works
    """
    for x in range(sample):

        desc = get_random_product_description()
        if desc:
            print(f"Random Product Description: {desc}")
            get_product_tag(desc)                           # This function prints the tags
        else:
            print("No product descriptions found.")

        sleep(5)  # Sleep to avoid rate limits

# testing(5)