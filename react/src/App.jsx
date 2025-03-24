// import { useState } from 'react'

import { BrowserRouter, Link, Route, Routes, Router, Outlet, useLocation, useNavigate, replace } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

import IndexPage from './Index'
import Signup from './Signup'
import Login from './Login'
import Cart from './Cart'
import ProductDetail from './ProductDetail'
import UserDetail from './UserDetail'
import User from './User'

function App() {

  const [user, setUser] = useState(null);
  const location = useLocation(); // Using this to change locations and force rerender from when we use Login.jsx
  const navigate = useNavigate();

  // Will use this to logout the user - no need for a dedicated component
  const logout = async () => {
    await axios.post(`http://127.0.0.1:5000/logout`, {}, {withCredentials: true});
<<<<<<< HEAD
    setUserid(null);                  // Will set the userid to null and rerender the page
=======
    setUser(null);
>>>>>>> user_object_login
    navigate('/', {replace: true});
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`http://127.0.0.1:5000/@me`, {withCredentials: true});
      if (response) {
<<<<<<< HEAD
          // Response will either be a user object or null
          const data = await response.data.id;
=======
          // Response will either be a userid or not authorized
          const data = await response.data.user;
>>>>>>> user_object_login
          console.log(`From App useEffect() - the data is ${data}`);
          setUser(data);
      }else{
          console.error('Error fetching user data');
      }
    }
    getUser();
  }
  , [location]);

  console.log(`From App.jsx - The userid we got back was ${user}`);

  return (
    <div className = "App">
      {/* <BrowserRouter> */}
        <Navbar bg="primary" variant="light" className="justify-content-between">
          <Container>
            <Navbar.Brand as={Link} to="/" className = "text-light">PishPosh</Navbar.Brand>
            <Nav className="ms-auto">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/cart" className = "text-light">View Cart</Nav.Link>
                  <Nav.Link as={Link} to="/userdetail" className = "text-light">View Profile</Nav.Link>
                  <Nav.Link as={Link} onClick={logout} className="text-light">Logout</Nav.Link>
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
          <Route path = "/cart" element = {<Cart {...user}/>}></Route>
          <Route path = "/product/:productid" element = {<ProductDetail/>}></Route>
          <Route path = "/user/:userid" element = {<User/>}></Route>
          <Route path = "/userdetail" element = {<UserDetail/>}></Route>
        </Routes>
      {/* </BrowserRouter> */}
    </div>
  )
}

export default App;
