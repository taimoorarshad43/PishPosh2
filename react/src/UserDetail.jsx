import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch user products when the component mounts.
  useEffect(() => {
    const getProducts = async () => {
        const response = await axios.get(`http://localhost:5000/v1/users/${userId}/products`);
        if(response){
            // Set products with response data.
            const data = await response.data.User.products;
            console.log(data);
            setProducts(data);
        }else{
            console.error('Error fetching user data:');
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
    data.append('productPrice', formData.productPrice);
    if (formData.productImage) {
      data.append('productImage', formData.productImage);
    }
    axios
      .post(`/upload/${user.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        // Optionally refresh product list after successful upload
        return axios.get(`/api/user/${userId}`);
      })
      .then(res => {
        setProducts(res.data.products);
        // Clear form fields after successful submission
        setFormData({
          productName: '',
          productPrice: '',
          productImage: null,
        });
      })
      .catch(err => {
        console.error('Error uploading product:', err);
        // Update errors state if needed
        setErrors({ submit: 'There was an error submitting the form.' });
      });
  };

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
                        <a href={`/product/${product.productid}/delete`}>Delete?</a>
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
                {errors.productName && <div>{errors.productName}</div>}
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
                {errors.productDescription && <div>{errors.productDescription}</div>}
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
                {errors.productPrice && <div>{errors.productPrice}</div>}
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
                {errors.productImage && <div>{errors.productImage}</div>}
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
