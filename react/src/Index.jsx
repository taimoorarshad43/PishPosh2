import axios from 'axios';
import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';

// // Temp product data
// const test_products = [
//   {
//     productid: 1,
//     productname: 'Example Product',
//     image: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBgYFxgYGBgYGhgYFxgYGBcYFxgYHSggGBolHRgVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUt'
//   }]

const IndexPage = () => {

  // Function to get products from our Flask API
  const getProducts = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:5000/v1/products');
      const data  = await response.data;
      console.log(data);
      return data;
    } catch (error)
    {
      console.log(error);
    }
  }

  let products = getProducts();

  console.log(products);

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
                <Button variant="primary" href={`/product/${product.productid}`}>
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
            <Button variant="primary" className="mr-5" href="/?page=previous">
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
