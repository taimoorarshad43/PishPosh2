import axios from 'axios';
import React, { useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { data } from 'react-router-dom';

const IndexPage = () => {

  // Set products to be an empty array that we'll populate with an axios.get() call
  const [products, setProducts] = useState([]);

  // Function to get products from our Flask API
  const getProducts = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:5000/v1/productimages');
      const data  = await response.data;
      setProducts(data.Products);
    } catch (error)
    {
      console.log(error);
    }
  }
  getProducts();

  // Return JSX that lists the products from our database. 
  // I'll need to figure out pagination for this however.
  return (
    <>
      <h1 className="text-center mt-3">Welcome to PishPosh (Beta)</h1>
      <Container>
        <Row className="text-center">
          {products && products.length > 0 ? (
            products.map(product => (
              <Col md={3} className="mt-5" key={product.productid}>
                {product.image && (
                  <>
                    <Image 
                      src={`data:image/jpeg;base64,${product.image}`} 
                      alt={product.name} 
                      fluid 
                    />
                    <br />
                  </>
                )}
                <Button className = "mt-4" variant="primary" href={`/product/${product.productid}`}>
                  {product.productname}
                </Button>
              </Col>
            ))
          ) : (
            <Container>
              <h4 className="display-4 text-center">No More Products</h4>
            </Container>
          )}
        </Row>
      </Container>

      <Container className="text-center mt-5 mb-5">
        {products && products.length > 0 ? (
          <span>
            <Button variant="primary" className="mr-5" href="/?page=previous"> {/* Might need to put the full URL here for pagination to work */}
              Previous Page
            </Button>
            <Button variant="primary" className="ml-5" href="/?page=next">
              Next Page
            </Button>
          </span>
        ) : (
          <span>
            <Button variant="primary" className="mr-5" href="/?page=previous">
              Previous Page
            </Button>
          </span>
        )}
      </Container>
    </>
  );
};

export default IndexPage;
