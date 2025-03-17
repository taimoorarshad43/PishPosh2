// import { useState } from 'react'

import { BrowserRouter, Link, Route, Routes, Router, Outlet } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

import IndexPage from './Index'
import Signup from './Signup'
import Login from './Login'
import Cart from './Cart'
import ProductDetail from './ProductDetail'

function App() {

  const user = null; // temp until we can get user data

  return (
    <div className = "App">
      <BrowserRouter>
        <Navbar bg="primary" variant="light" className="justify-content-between">
          <Container>
            <Navbar.Brand as={Link} to="/" className = "text-light">PishPosh</Navbar.Brand>
            <Nav className="ms-auto">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/cart" className = "text-light">View Cart</Nav.Link>
                  <Nav.Link as={Link} to="/userdetail" className = "text-light">View Profile</Nav.Link>
                  <Nav.Link as={Link} to="/logout" className = "text-light">Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className = "text-light">Login</Nav.Link>
                  <Nav.Link as={Link} to="/signup" className = "text-light">Sign Up</Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
        <Routes>
          <Route path = "/" element = {<IndexPage/>}></Route>
          <Route path = "/login" element = {<Login/>}></Route>
          <Route path = "/signup" element = {<Signup/>}></Route>
          <Route path = "/cart" element = {<Cart/>}></Route>
          <Route path = "/product/:productid" element = {<ProductDetail/>}></Route>
          {/* <Route path = "/userdetail" element = {<UserDetail/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
