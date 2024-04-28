import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.css";
import { base_Url } from './api';

const Login = () => {
  const navigate = useNavigate();

  const userVerifyHandler = async () => {
    try {
      const response = await axios.post("/user/loginUser", data);
      console.log(response)

      if (response) {
        alert("User logged in successfully");
        navigate("/home");
      }

    } catch (error) {
      alert(error.response.data.message || "An error occurred during login");
    }
  };

  const [data, setData] = useState({
    userEmail: "",
    userPass: ""
  });

  const submitHandler = (e) => {
    e.preventDefault();
    if(data.userEmail==="" || data.userPass===""){
      alert("please fill all the fields");
return;
    } 
    userVerifyHandler();
  };

  return (
    <div className='login'>
      <form onSubmit={submitHandler}>
        <h3>Login Form</h3>
        <input type='email' placeholder='Email' value={data.userEmail} onChange={(e) => setData((prev) => ({ ...prev, userEmail: e.target.value }))} />
        <input type='password' autoComplete='on' placeholder='Password' value={data.userPass} onChange={(e) => setData((prev) => ({ ...prev, userPass: e.target.value }))} />
        <button type='submit'>Login</button>
        <p>Don't have an account? <Link to="/Register"><span> Sign Up</span></Link></p>
        <p><Link to="/Forgot"><span> Forgot Password? </span></Link></p>

      </form>
    </div>
  
  );
};

export default Login;
