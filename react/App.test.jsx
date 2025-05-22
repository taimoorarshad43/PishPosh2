import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { test } from "vitest";

import App from "./src/App";
import ProductDetail from "./src/ProductDetail"
import UserDetail from "./src/UserDetail"
import Login from "./src/Login"
import Signup from "./src/Signup"
import Cart from "./src/Cart"

// Doing a standard battery of smoke tests

test('Main app component renders without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  //   expect(screen.getByText(/vite/i)).toBeInTheDocument(); // adjust based on your App's content
});

test('Product Detail renders without crashing', () => {
    render(<ProductDetail/>);
})

test('UserDetail renders without crashing', () =>{
  render(
    // <BrowserRouter>
      <UserDetail />
    // </BrowserRouter>
  );})

test('Login renders without crashing', () =>{
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );})

test('Signup renders without crashing', () =>{
  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
})

test('Cart renders without crashing', () =>{
  render(
    // <BrowserRouter>
      <Cart />
    // </BrowserRouter>  
    );
})

