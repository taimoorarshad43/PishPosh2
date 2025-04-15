import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Define state for form fields and any validation errors.
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  // Set error fields.
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Update state on input change.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear previous errors.
    setErrors({});
    
    // Simple client-side validation.
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';

    // Will append errors to the form and return if we're missing any fields.
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data to API using axios.
    axios.post('http://127.0.0.1:5000/login', formData, {withCredentials:true})
    .then((response) => {
      if(response.data !== "null"){
        // Redirect to the homepage after login if user is authenticated.
        console.log(`From Login.jsx - Logging in with ${response.data}`);
        navigate('/', {replace: true});
      }else{
        // Handle any errors here, such as displaying a notification to the user.
        setErrors({username: 'Invalid Username or Password', password: 'Invalid Username or Password'});
      }

    }
    ).catch((error) => {
      console.error('Error:', error);
      // Handle any errors here, such as displaying a notification to the user.
    });

  };

  return (
    <Container className="ml-5 mt-2">
      <h1 className="ml-5 mt-2">Login</h1>
      <Form onSubmit={handleSubmit} className="ml-5 mt-2">
        {/* If needed, include hidden inputs (e.g. CSRF token) here */}
        
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
