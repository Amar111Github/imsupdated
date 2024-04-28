import React, { useState } from 'react';
import axios from 'axios';
import "./login.css";
import { Link, useNavigate } from 'react-router-dom';
import { base_Url } from './api';

const RegisterUser = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    userName: "",
    userEmail: "",
    contactNo: "",
    userPass: ""
  });

  const userVerifyHandler = async () => {
    try {
      const response = await axios.post("/user/create_user", data);
      console.log(response.data); 
      navigate("/home");
    } catch (error) {
      console.error("Error:", error.response.data.message);
     
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if(data.userName==="" || data.userEmail===""|| data.contactNo===""|| data.userPass===""){
      alert("please fill all the fields");
return;
    } 
    userVerifyHandler();
  };

  return (
    <div className='login'>
      <form onSubmit={submitHandler}>
        <h3>Register Form</h3>
        <input type='text' placeholder='username' value={data.userName} onChange={(e) => setData((prev) => ({ ...prev, userName: e.target.value }))} />
        <input type='email' autoComplete='on' placeholder='Email' value={data.userEmail} onChange={(e) => setData((prev) => ({ ...prev, userEmail: e.target.value }))} />
        <input type='text' placeholder='phone No' value={data.contactNo} onChange={(e) => setData((prev) => ({ ...prev, contactNo: e.target.value }))} />
        <input type='password' autoComplete='on' placeholder='Password' value={data.userPass} onChange={(e) => setData((prev) => ({ ...prev, userPass: e.target.value }))} />
        <button type='submit'>Register</button>
        <p>Already have an account? <Link to="/"><span> Login</span></Link></p>
      </form>
    </div>
  );
};

export default RegisterUser;
