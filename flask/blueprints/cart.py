from flask import Blueprint, session, render_template, redirect, flash, jsonify
from models import Product
from flask_cors import cross_origin

cartroutes = Blueprint("cartroutes", __name__)

############################################################## Cart Routes #####################################################################

# TODO: Add quantities to cart

@cartroutes.route('/cart')
@cross_origin(supports_credentials=True)
def cart():

    """
    Route that returns the products in the cart session object.
    """

    userid = session.get('userid', None)

    # If we don't have a userid, then they're not logged in and can't view this route.
    if not userid:
        productid = session['lastviewedproduct']
        return jsonify({'status': 'error', 'message': 'Please log in to view your cart'}), 401


    # Retrieve all product ids that are in the cart session object, if any.
    try:
        productids = session['cart']
    except:
        productids = []

    products = []
    subtotal = 0

    # Get all product objects and derive other features
    for productid in productids:
        product = Product.query.get(productid)

        if product is None:                 # Check to see if a productid doesn't exist for whatever reason - it shouldn't be in the cart session
            productids = session['cart']
            productids.remove(productid)
            session['cart'] = productids
            continue                        # Go on to the next product

        products.append(product)
        subtotal += product.price
        session['cart_subtotal'] = subtotal

    productoutput = {}

    # Serializing the product to send as JSON
    for product in products:
        productoutput[product.productid] = {
            'productid': product.productid,
            'productname': product.productname,
            'productdescription': product.productdescription,
            'price': product.price,
            'image': product.decode_image()
        }

    productoutput['cart_subtotal'] = subtotal

    # print("From /cart route products are", products)
    # print("From /cart route product output is", productoutput)
    
    return jsonify(productoutput), 200

@cartroutes.route('/product/<int:productid>/addtocart', methods = ['POST'])
@cross_origin(supports_credentials=True)
def addtocart(productid):

    userid = session.get('userid', None)

    print("From /addtocart route, userid is: ", userid)

    if userid:                              # If user is logged in, then they can add to cart
        try:                                # Because we will have nothing in the cart initially, we'll just initialize it in the except block
            products = session['cart']
            products.append(productid)
            session['cart'] = products
        except:
            session['cart'] = [productid]

        return jsonify({'status': 'success', 'message': 'Added to Cart!'}), 200

    else:                                   # If not logged in, they get a message and redirect

        return jsonify({'status': 'error', 'message': 'Please login to add items to your cart'}), 401


@cartroutes.route('/product/<int:productid>/removefromcart', methods = ['POST'])
@cross_origin(supports_credentials=True)
def removefromcart(productid):

    """
    Route that removes product from session cart object."""

    try:                                    # If theres nothing to remove from the cart, then we don't need to do anything
        products = session['cart']
        products.remove(productid)
        session['cart'] = products
        return jsonify({'status': 'success', 'message': 'Removed from Cart!'}), 200
    except:
        return jsonify ({'status': 'error', 'message': 'Not in Cart'}), 401

################################################################################################################################################
