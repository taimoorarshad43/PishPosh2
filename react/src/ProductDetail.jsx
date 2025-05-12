import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

import toastService from './services/toastservice';

const ProductDetail = () => {
  // Extract the product id from the URL
  const { productid } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

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

  // Fetch related products when the component mounts or productid changes
  useEffect(() => {
    const fetchRelatedProduct = async () => {
      try {
        const response = await axios.post(`http://127.0.0.1:5000/product/${productid}/related`, {}, {withCredentials: true});
        if (response) {
          const data = await response.data;
          console.log(data)
          setRelatedProducts(data.RelatedProducts);
        } else {
          console.error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchRelatedProduct();
  }, [productid]);


  // Handler to add product to the cart using a POST request.
  const handleAddToCart = async () => {
    try{
      const response = await axios.post(`http://127.0.0.1:5000/product/${productid}/addtocart`, {}, {withCredentials: true});
      console.log(response);
      if (response.data.status === 'success') {
        // We'll console.log as well as show a toast message based on the message we receive from the backend
        console.log('Product added to cart');
        toastService[response.data.status](response.data.message);
      } else {
        console.log('Failed to add product to cart');
        toastService.error("Failed to add product to cart");
      }
    }catch{
      console.log('Catch Block, failed to add product to cart')
      toastService.error("Failed to add product to cart - Please Login")
    }
  };

  // Handler to remove product from the cart using a POST request.
  const handleRemoveFromCart = async () => {
    try{
      const response = await axios.post(`http://127.0.0.1:5000/product/${productid}/removefromcart`, {}, {withCredentials: true});
      console.log(response);
      if (response.data.status === 'success') {
        // We'll console.log as well as show a toast message based on the message we receive from the backend
        console.log('Product removed to cart');
        toastService[response.data.status](response.data.message);
      } else {
        console.error('Failed to remove product to cart');
        toastService.error("Failed to remove product from cart");
      }
    }catch{
      console.log('Catch Block, failed to remove product from cart')
      toastService.error("Failed to remove product from cart - Please Login")
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

      {/* <Container>
      <div className="text-center mt-5">
        <h2>Product Suggestions</h2>
        <p>Suggestions will be displayed here.</p>
      </div>
      </Container> */}

      {/* Product Suggestions Section */}

      <Container className="mt-5">
        <div className="text-center mb-4">
          <h2>Product Suggestions</h2>
        </div>
        <Row>
          {Object.values(relatedProducts).map((p) => (
            <Col key={p.id} md={3} className="d-flex flex-column align-items-center mb-4">
              <Image
                src={`data:image/jpeg;base64,${p.image}`}
                alt={p.productname}
                rounded
                fluid
                style={{ maxHeight: '150px', objectFit: 'cover' }}
                className="mb-2"
              />
              <h6 className="text-center">{p.productname}</h6>
              <Button
                as={Link}
                to={`/product/${p.productid}`}
                variant="outline-primary"
                className="mt-auto"
              >
                View Product
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
  
      {/*       */}

    </>
  );
};

export default ProductDetail;
