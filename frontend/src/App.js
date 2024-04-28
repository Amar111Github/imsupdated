
import { Fragment } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from "./pages/Home"
import { Routes, Route, useLocation } from 'react-router-dom';
import RegisterUser from './pages/RegisterUser';
import ForgotPassword from './pages/ForgotPassword';
export const URL =process.env.REACT_APP_SERVER_URL

function App() {
  const location = useLocation();
  const loginRegister = ()=>{
    return(
      <>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/Register" element={<RegisterUser/>} />
        <Route path="/Forgot" element={<ForgotPassword/>} />
        
      </Routes>
      </>
    )
  }

  return (

    
    <Fragment>
      {location.pathname==="/" || location.pathname==="/Register"||location.pathname==="/Forgot"?loginRegister():<Home/>}

    </Fragment>
  );
}

export default App;
