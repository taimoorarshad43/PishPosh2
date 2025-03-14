import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const Login = () => {
  // Define state for form fields and any validation errors.
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data to your API (using fetch/axios).
    console.log('Submitting form:', formData);

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
