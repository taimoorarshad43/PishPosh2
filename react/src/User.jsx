import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const User = () => {
  // Local state to store the user information and products list.
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const { userid } = useParams();

  // Fetch user details and products when the component mounts.
  useEffect(() => {
    const getUser = async () => {
        const response = await axios.get(`http://localhost:5000/v1/users/${userid}`)
        if (response) {
            // Set user with response data.
            const data = await response.data.User;
            console.log(data);
            setUser(data);
        }else{
            console.error('Error fetching user data:');
        }
    }

    const getProducts = async () => {
        const response = await axios.get(`http://localhost:5000/v1/users/${userid}/products`);
        if(response){
            // Set products with response data.
            const data = await response.data.User.products;
            console.log(data);
            setProducts(data);
        }else{
            console.error('Error fetching user data:');
        }
    }
    getUser();
    getProducts();

  }, [userid]);


  // Render a loading state while the data is being fetched.
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="ml-3 mt-3 mb-5">{user.firstname}'s Profile Page</h1>
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <h2 className="mb-5">{user.firstname} {user.lastname}'s Products</h2>
            {products.map(product => (
              <div key={product.productid} className="mb-5">
                {product.image && (
                  <>
                    <img 
                      src={`data:image/jpeg;base64,${product.image}`} 
                      alt={product.name} 
                    /><br></br>
                    <a className="btn btn-primary mt-4" href={`/product/${product.productid}`}>
                      {product.productname}
                    </a>
                    <span className="badge ml-3">
                      Price: ${product.price}.00
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
