// CheckoutComponent.js
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutComponent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState([]);

  const subtotal = 0; // Temp until we can get that from backend

  // Get product data from cart endpoint and set products
  useEffect(() => {
    const getProducts = async () => {
      const response = await axios.get('http://127.0.0.1:5000/cart', { withCredentials: true });
      const data = await response.data;
      console.log("From Cart.jsx - the data is", data);
        if(data){
          setProducts(data);
        }else{
          console.error('Error fetching cart data');
        }
      }
    
    getProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    // We then want to clear the cart via this endpoint
    axios.post("http://127.0.0.1:5000/cart/clearall", {}, {withCredentials: true})
    .then(response => {console.log("From CheckoutComponent.jsx - The response we got back was ", response);})
    .catch(error => {console.log("From CheckoutComponent.jsx - The error we got back was ", error);})

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Replace with your actual return URL.
        return_url: 'http://127.0.0.1:5173/confirmation',
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    // On success, Stripe will redirect to the return_url.
  };

  return (
    <div className="container">
      <div className="mt-5 row text-center">
        <div className="col-8">
      {products &&
            Object.values(products).map((product) => (
              <div className="mt-5" key={product.productid}>
                {product.image && (
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.productname}
                  />
                )}
                <br />
                <a href={`/product/${product.productid}`}>{product.productname}</a>
                <span className="badge ml-3">Price: ${product.price}.00</span>
              </div>
            ))}
          {subtotal && (
            <p className="badge badge-pill badge-primary mt-5">Subtotal: ${subtotal}.00</p>
          )}
        </div>
        <div className="col-4">
          <form id="payment-form" onSubmit={handleSubmit}>
            {/* Render Stripe's Payment Element */}
            <PaymentElement id="payment-element" />
            <button type="submit" className="mt-4 btn btn-primary" disabled={!stripe}>
              Submit
            </button>
            <a href="/cart" className="mt-4 btn btn-secondary">
              Cancel
            </a>
          </form>
          {errorMessage && (
            <div className="text-danger text-center" id="error-message">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
