import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const Signup = () => {
  // Define state for form fields and errors.
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Generic onChange handler for controlled components.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
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
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Submitting form:', formData);
  };

  return (
    <Container className="ml-5 mt-2">
      <h1 className="ml-5 mt-2">Sign Up</h1>
      <Form onSubmit={handleSubmit} className="ml-5 mt-2">
        {/* If you need a CSRF token or any hidden inputs, include them here as hidden fields */}
        {/* <Form.Control type="hidden" name="csrf_token" value={csrfToken} /> */}

        {/* Username Field */}
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

        {/* Email Field */}
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </Form.Group>

        {/* Password Field */}
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
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
