import React, { useState } from 'react';
import axios from 'axios';

const AIUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [price, setPrice] = useState('');
  const [showFields, setShowFields] = useState(false);

  // Handle file input change: update preview and send file for processing.
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview using FileReader.
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Prepare form data for uploading.
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send file to the backend endpoint for AI processing.
      const response = await axios.post('/upload/aiprocess', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Populate product fields with the response data.
      setProductTitle(response.data.title || '');
      setProductDesc(response.data.description || '');
      setShowFields(true);
    } catch (error) {
      console.error('Upload failed:', error);
      // Optionally, handle the error state and notify the user.
    }
  };

  // Handle final form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gather form data. You might need to add additional form fields if required.
    const data = {
      productTitle,
      productDesc,
      price,
      // Include other fields as necessary.
    };
    try {
      // Replace the URL with your final submission endpoint.
      const res = await axios.post(`/upload/${userId}`, data);
      console.log('Final submission successful:', res.data);
    } catch (error) {
      console.error('Final submission failed:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-3 mb-5">Use AI to Describe Your Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group text-center">
          <h2 className="mt-5 mb-5 text-primary">Upload a Picture</h2>
          <input
            id="upload-file"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {imagePreview && (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <img
              className="img-fluid"
              src={imagePreview}
              alt="Image Preview"
              style={{ maxWidth: '300px', maxHeight: '300px' }}
            />
          </div>
        )}

        {showFields && (
          <>
            <div className="form-group mt-3">
              <label htmlFor="product-title" className="btn btn-primary">
                Product Name
              </label>
              <input
                type="text"
                id="product-title"
                className="form-control product-field"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="product-desc" className="btn btn-primary">
                Product Description
              </label>
              <textarea
                id="product-desc"
                className="form-control product-field"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="product-price" className="btn btn-primary">
                Product Price
              </label>
              <input
                type="text"
                id="product-price"
                className="form-control product-field"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="text-center">
              <button id="submit-btn" type="submit" className="btn btn-primary mt-2">
                Confirm?
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AIUpload;
