import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

const UserDetail = (props) => {

  console.log("From UserDetail.jsx - The props we got back were ", props);

  const [products, setProducts] = useState([]);
  // Form state for new product listing
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    productDescription: '',
    productImage: null,
  });
  const [errors, setErrors] = useState({});
  const userId = props.id;
  const user = props;                                 // Will be passing user object from App.jsx
  const username = props.username;
  const toastId = React.useRef(null);
  const navigate = useNavigate();
  
  
    // If we're not logged in, then we don't have a username and we need to be redirected to index
    // Send a Toast message saying we're not logged in
    useEffect(() =>{
      if(!username){
        navigate('/', {replace : true});
        if(! toast.isActive(toastId.current)) {     // Doing this to prevent duplicate Toast messages
          toastId.current = toast.info("Please Log In to view your profile");
        }
      }
    })

  // Fetch user products when the component mounts.
  useEffect(() => {
    const getProducts = async () => {
      if (userId){
        const response = await axios.get(`http://localhost:5000/v1/users/${userId}/products`);
        if(response){
            // Set products with response data.
            const data = await response.data.User.products;
            console.log(data);
            setProducts(data);
        }else{
            console.error('Error fetching user data');
        }
      }else{
        console.log("From UserDetail.jsx - Waiting on userId");
      }
    }
    getProducts();
  }, [userId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission to add a new product
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('productDescription', formData.productDescription);
    data.append('productPrice', formData.productPrice);
    if (formData.productImage) {
      data.append('productImage', formData.productImage);
    }
    axios
      .post(`http://127.0.0.1:5000/upload/${userId}`, data, {withCredentials: true})
      .then(response => {
        // Refresh the product list after successful upload or update error fields if we got any.
        console.log("From UserDetail.jsx - The response we got back was ", response);
        return axios.get(`http://localhost:5000/v1/users/${userId}/products`);
      })
      .then(res => {
        setProducts(res.data.products);
        // Clear form fields after successful submission
        setFormData({
          productName: '',
          productPrice: '',
          productDescription: '',
          productImage: null,
        });
      })
      .catch(err => {   // We'll get a HTTP 400 if any fields are missing. From there we'll set error messages from the API.
        console.error('Error uploading product:', err);
        setErrors(err.response.data.error);
      });
  };

  // Handle product deletion
  const handleDelete = (productId) => {
    axios
      .delete(`http://127.0.0.1:5000/product/${productId}/delete`, null, {withCredentials: true})
      .then(response => {
        console.log("From UserDetail.jsx - The response we got back was ", response);
        setProducts(products.filter(product => product.productid !== productId));           // Deleting product from state
        toastService[response.data.status](response.data.message);
      })
      .catch(err => {
        console.error('Error deleting product:', err);
        toastService.error("Error deleting product");
      });
  }

  return (
    <div>
      <h1 className="ml-3 mt-3 mb-5">{user.firstname}'s Profile Page</h1>
      <div className="container">
        <div className="row text-center">
          {/* Left column: User's products */}
          <div className="col-6">
            <h2 className="mb-5">{user.firstname} {user.lastname}'s Products</h2>
            {products.map(product => (
              <div key={product.productid} className="mb-5">
                {product.image && (
                  <>
                    <img 
                      src={`data:image/jpeg;base64,${product.image}`} 
                      alt={product.name} 
                    /><br />
                    <div className = "mt-4">
                      <a className="btn btn-primary" href={`/product/${product.productid}`}>
                        {product.productname}
                      </a>
                      <span className="badge ml-3">Price: ${product.price}.00</span>
                      <span className="badge ml-3">
                        {/* <a href={`/product/${product.productid}/delete`}>Delete?</a> */}
                        <a href="#" onClick={(e) => {
                            e.preventDefault();                                 // Have this do a POST request to the delete endpoint
                            handleDelete(product.productid);}}>Delete?</a>
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Right column: New product listing form */}
          <div className="col-6 text-left">
            <h2 className="mb-5">Add New Product Listing?</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div>
                <label className="btn-primary mb-3" htmlFor="productName">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  value={formData.productName}
                  onChange={handleChange}
                />
                {errors.productName && <span className = 'text-primary float-right'>{errors.productName}</span>}
              </div>
              <div>
                <label className="btn-primary mb-3" htmlFor="productDescription">
                  Product Description
                </label>
                <input
                  type="text"
                  name="productDescription"
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                />
                {errors.productDescription && <span className = 'text-primary float-right'>{errors.productDescription}</span>}
              </div>
              <div>
                <label className="btn-primary mb-3" htmlFor="productPrice">
                  Product Price
                </label>
                <input
                  type="number"
                  name="productPrice"
                  id="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                />
                {errors.productPrice && <span className = 'text-primary float-right'>{errors.productPrice}</span>}
              </div>
              <div>
                <label className="btn-primary mb-3" htmlFor="productImage">
                  Product Image
                </label>
                <input
                  type="file"
                  name="productImage"
                  id="productImage"
                  onChange={handleChange}
                />
                {errors.productImage && <span className = 'text-primary float-right'>{errors.productImage}</span>}
              </div>
              <input
                className="submit-button btn btn-primary mt-3"
                type="submit"
                value="Confirm?"
              />
              {errors.submit && <div className="error">{errors.submit}</div>}
              <span><a className="ml-3 mt-3 btn btn-primary" href={`/upload/${user.id}/ai`}>
              Add AI description?
            </a></span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
