from flask import Blueprint, session, render_template, redirect, flash, request, jsonify
from models import User, db
from forms import SignUpForm, ProductUploadForm
from sqlalchemy.exc import IntegrityError

userroutes = Blueprint("userroutes", __name__)

############################################################### User Routes ###############################################################

@userroutes.route('/user/<int:userid>')
def profile(userid):

    user = User.query.get_or_404(userid)

    userproducts = []

    for product in user.products: # Get all user products to list on page
        userproducts.append(product)

    return render_template('profile.html', user = user, products = userproducts)

@userroutes.route('/userdetail')
def userdetail():

    userid = session.get('userid', None)

    productform = ProductUploadForm()

    if userid:

        user = User.query.get_or_404(session.get('userid', -1))     # Should only be able to get here if you are logged in
        userproducts = []

        for product in user.products: # Get all user products to list on page
            userproducts.append(product)

        # Adding errors from the '/upload/userid' route to this form after a redirect
        # We need to validate the form object to do this
        productform.validate()
        productform.image.errors.append(session.pop("ProductFileError", ""))
        productform.name.errors.append(session.pop("ProductNameError", ""))
        productform.description.errors.append(session.pop("ProductDescriptionError", ""))
        productform.price.errors.append(session.pop("ProductPriceError", ""))

        return render_template('userdetail.html', user = user, products = userproducts, form = productform)
    
    else:

        flash('Please login to view your profile', 'btn-info')
        return redirect('/')

# @userroutes.route('/signup', methods = ['GET', 'POST'])
# def signup():

#     signinform = SignUpForm()

#     if signinform.validate_on_submit(): # Handles our POST requests
#         username = signinform.username.data
#         password = signinform.password.data
#         firstname = signinform.firstname.data
#         lastname = signinform.lastname.data

#         ####################### Validation of user input #################################
#         if len(username) < 4:
#             signinform.username.errors.append("Username must be at least 4 characters long")
#             return render_template('signup.html', form = signinform)
#         if len(password) <= 6:
#             signinform.password.errors.append("Password must be at least 6 characters long")
#             return render_template('signup.html', form = signinform)
#         if len(firstname) == 0:
#             signinform.firstname.errors.append("You need to add your first name")
#             return render_template('signup.html', form = signinform)
#         ##################################################################################

#         user = User.hashpassword(username, password, firstname, lastname)

#         db.session.add(user)
#         try:                            # Handles the possibility that the username is already taken
#             db.session.commit()
#         except IntegrityError:
#             signinform.username.errors.append("Username already taken")
#             return render_template('signup.html', form = signinform) # Return to GET route of signin

#         session['userid'] = user.id
#         session['username'] = user.username
#         session['userfirstname'] = user.firstname
#         session['userlastname']= user.lastname

#         flash("Sign Up Successful!", 'btn-success')

#         return redirect('/')

#     else:                              # Handles our GET requests
#         return render_template('signup.html', form = signinform)
    
@userroutes.route('/signup', methods = ['POST'])
def signup():

    """
    Will add a new user with username and hashed password.

    If username is taken or there are issues with the inputted  field, will return an array of errors
    and no user.
    """

    data = request.get_json()
    username = data['username']
    password = data['password']
    firstname = data['firstname']
    lastname = data['lastname']

    # Blank array of errors to append to if there are any issues with the inputted fields
    errors = {
        "firstname": [],
        "lastname": [],
        "username": [],
        "password": []
    }

    ####################### Validation of user input #################################
    if len(username) < 4:
        errors['username'].append("Username must be at least 4 characters long")
    if len(password) <= 6:
        errors['password'].append("Password must be at least 6 characters long")
    if len(firstname) == 0:
        errors['firstname'].append("You need to add your first name")
    ##################################################################################

    if errors['username'] or errors['password'] or errors['firstname']: # If any of our errors are populated then return with errors and no user
        output = {
            "user": False,
            "errors": errors
        }
        return jsonify(output)

    user = User.hashpassword(username, password, firstname, lastname)

    db.session.add(user)
    try:                            # Handles the possibility that the username is already taken
        db.session.commit()
        payload = user.username
    except IntegrityError:
        errors['username'].append("Username already taken")
        payload = False

    output = {
        "user": payload,
        "errors": errors
    }

    return jsonify(output)
    

@userroutes.route('/login', methods = ['POST'])
def login():

    """
    Gets a username and password from the form and authenticates.

    Returns a user if the user is authenticated, otherwise returns False.
    """
    data = request.get_json()
    username = data['username']
    password = data['password']

    # If we have a valid user, then we will return the user's username otherwise it will return False
    user = User.authenticate(username, password)
    if(user):
        user = user.username

    return jsonify(user)

    
@userroutes.route('/logout')
def logout():

    # When you log out, remove userid from session and clear cart from session

    session.pop('userid', None)
    session.pop('username', None)
    session.pop('userfirstname', None)
    session.pop('userlastname', None)
    session.pop('cart', None)

    # Trying to remove everything from session after logout

    session.clear()

    flash("You are no longer logged in", 'btn-success')

    return redirect('/')
    
# TODO: Delete User route - need to test this
    
@userroutes.route('/user/<int:userid>/delete')
def deleteuser(userid):

    User.query.get(userid).delete()
    db.session.commit()

    # Should delete all products associated with user as well

    # Should remove userid from session as well.

    session.pop['username', None]

    return redirect('/')

################################################################################################################################################