import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  // Extract the product id from the URL
  const { productid } = useParams();
  const [product, setProduct] = useState(null);

  // Fetch product data when the component mounts or productid changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/v1/productsimages/${productid}`, {withCredentials: true});
        if (response) {
          const data = await response.data;
          console.log(data)
          setProduct(data.Product);
        } else {
          console.error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [productid]);


  // Handler to add product to the cart using a POST request.
  const handleAddToCart = async () => {
    const response = await axios.post(`http://127.0.0.1:5000/product/${productid}/addtocart`, {}, {withCredentials: true});
    console.log(response);
    if (response) {
      console.log('Product added to cart');
      // Optionally update state or notify the user
    } else {
      console.error('Failed to add product to cart');
    }
  };

  // Handler to remove product from the cart using a POST request.
  const handleRemoveFromCart = async () => {
      const response = await axios.post(`http://127.0.0.1:5000/product/${productid}/removefromcart`, {}, {withCredentials: true});
      console.log(response);
      if (response) {
        console.log('Product removed from cart');
        // Optionally update state or notify the user
      } else {
        console.error('Failed to remove product from cart');
      }

  };

  // If product data hasn't loaded yet, display a loading message.
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="ml-3 mt-3">{product.productname}</h1>
      <Container>
        <Row className="text-center">
          <Col md={6}>
            <Image
              className="mt-5"
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.productname}
              fluid
            />
          </Col>
          <Col md={6}>
            <h5 className="mb-5">{product.productdescription}</h5>
            <h6 className="mb-5">
              <Link to={`/user/${product.user_id}`}>By: {product.username}</Link>
            </h6>
            <h6 className="mb-5">Price: ${product.price}.00</h6>
            <Button variant="primary" className="mb-3" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <br />
            <Button variant="secondary" className="mb-3" onClick={handleRemoveFromCart}>
              Remove From Cart
            </Button>
            <br />
            <Button as={Link} to="/cart" variant="info">
              View Cart
            </Button>
          </Col>
        </Row>
      </Container>

      {/*        */}

      <Container>
      <div className="text-center mt-5">
        <h2>Product Suggestions</h2>
        <p>Suggestions will be displayed here.</p>
      </div>
      </Container>
  
      {/*       */}

    </>
  );
};

export default ProductDetail;
