import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import IndexPage from './Index'
import Signup from './Signup'
import Login from './Login'
import Cart from './Cart'
import ProductDetail from './ProductDetail'
import UserDetail from './UserDetail'
import User from './User'
import AIUpload from './AIUpload'
import CheckoutComponent from './CheckoutComponent';
import PaymentConfirmation from './PaymentConfirmation';

const stripePromise = loadStripe('pk_test_51QIZ5VGS3ixkvINIJUDHhSJtcl3I5rpMFX4JEt228TH9Mw5vtM3yXryMfcnnOisTAt7rslzRbZDdBcPcxyIruU5400GeH1HxJH');
// Loading stripe public key outside App component to avoid reinitializing it on every render

/* Only use useEffect if theres a logout* */

function App() {

  const [user, setUser] = useState(null);
  const [clientSecret, setClientSecret] = useState(''); //Initiializing client secret
  const location = useLocation(); // Using this to change locations and force rerender from when we use Login.jsx
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // To prevent a race condition with logging in and logging out functionality DEPRECATE

  // Will use this to get the client secret from the backend and pass to CheckoutComponent
  useEffect(() => {
    axios.post('http://127.0.0.1:5000/stripe_key', {}, {withCredentials: true})
      .then(response => {
        setClientSecret(response.data);
        // console.log("From App.jsx - The client secret we got back was ", response.data);
      });
  }, [location]);

  // Will use this to logout the user - no need for a dedicated component
  const logout = async () => {
    setIsLoggingOut(true); // Set logging out state to true
    await axios.post(`http://127.0.0.1:5000/logout`, {}, {withCredentials: true});
    setUser(null);
    console.log('From App.jsx - Logging out');
    navigate('/', {replace: true});
  }

  // Will use this to see if the user is logged in or not as well as pass in user details to other components
  useEffect(() => {
    
    if(isLoggingOut) return; // Prevent fetching user data if logging out // DEPRECATE

    const getUser = async () => {
      const response = await axios.get(`http://127.0.0.1:5000/@me`, {withCredentials: true});
      if (response) {
          // Response will either be a userid or not authorized
          const data = await response.data.user;
          console.log("From App useEffect() - the data is", data);
          setUser(data);
      }else{
          console.error('Error fetching user data');
      }
    }
    getUser();
  }
  , [location]);
  
  // This will be used to check if the user is logged in or not
  useEffect(() => {
    if(user){
      setIsLoggingOut(false); // Reset logging out state
    }
  }, [user]);

  console.log("From App.jsx - The userid we got back was ", user);
  console.log("From App.jsx - The location was ", location);

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
          <Route path = "/userdetail" element = {<UserDetail {...user} />}></Route>
          <Route path = "/upload/:userid/ai" element = {<AIUpload {...user} />}></Route>
          <Route path="/checkout" element={
            <Elements stripe={stripePromise} options={{ clientSecret }}> {/*Stripe Component*/}
              <CheckoutComponent/>
            </Elements>}/>
          <Route path = "/confirmation" element = {<PaymentConfirmation/>}></Route>
        </Routes>
      {/* </BrowserRouter> */}
    </div>
  )
}

export default App;
