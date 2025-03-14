import React from 'react';
import { Container, Row, Col, Badge, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cart = ({ user, products, subtotal }) => {
  return (
    <Container className="mt-3 ml-3">
      <h1 className="ml-3 mt-3">
        {user && user.firstname ? `${user.firstname}'s Cart` : 'Cart'}
      </h1>
      {products && products.length > 0 ? (
        <>
          <Row className="text-center">
            <Col md={8}>
              {products.map(product => (
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
