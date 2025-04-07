import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cart = (props) => {

  const username = props.username;
  const firstname = props.firstname;
  const subtotal = 0;                               //temp for now until we get subtotal from backend.
  const [products, setProducts] = useState([]);

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

console.log("From Cart.jsx - The products we got back were ", products);

  return (
    <Container className="mt-3 ml-3">
      <h1 className="ml-3 mt-3">
        {firstname ? `${firstname}'s Cart` : 'Cart'}
      </h1>
      {products ? (
        <>
          <Row className="text-center">
            <Col md={8}>
              {Object.values(products).map(product => ( // loop through the product dictionary's values and go from there
                <div key={product.productid} className="mt-5">
                  {product.image && (
                    <>
                      <Image
                        src={`data:image/jpeg;base64,${product.image}`}
                        alt={product.productname}
                        fluid
                      />
                      <br />
                      <Link to={`/product/${product.productid}`}>
                        {product.productname}
                      </Link>
                      <span className="ml-3">
                        <Badge variant="primary">
                          Price: ${product.price}.00
                        </Badge>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </Col>
            <Col md={4}>
              <Badge pill variant="primary">
                Subtotal: ${subtotal}.00
              </Badge>
            </Col>
          </Row>
          <Row className="text-center">
            <Col className="mt-5">
              <Button variant="info" as={Link} to="/checkout">
                Checkout
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <h4 className="display-4 text-center">Nothing in Cart</h4>
      )}
    </Container>
  );
};

export default Cart;
