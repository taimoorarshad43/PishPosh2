import json

from flask import Blueprint, session, jsonify
from stripe_payment import create_payment_intent

productcheckout = Blueprint("checkout", __name__)


@productcheckout.route('/stripe_key', methods = ['POST'])
def stripe_key():
    """
    Route that returns the Stripe API key to the frontend.
    """
    payment_data = {"amount" : session['cart_subtotal']}

    amount = int(payment_data['amount'])
    intent = create_payment_intent(amount)                          # Intent returns a response object
    intent_data = json.loads(intent.get_data().decode('utf-8'))

    return jsonify(intent_data['clientSecret'])
