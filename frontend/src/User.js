import React, { useState } from 'react';
import {user} from "./data";
import "./App.css"
import { useNavigate } from 'react-router-dom';

const User = () => {
    let navigate = useNavigate();
    let [name,setName] = useState("");
    let [phoneNo, setPhoneNo] = useState("");
    let [email,setEmail] = useState("");
    let [password, setPassword] = useState("");
    const addHandler = (e)=>{
       e.preventDefault();
       user.push({name,phoneNo, email, password});
        navigate("/");
        
        
    }
    console.log(user);
  return (
    <form className='container mt-5' onSubmit={addHandler}>
        <h2>Add User</h2>
        <input id='name' name='name' value={name} placeholder='name' type='text' onChange={e=>{setName(e.target.value)}}/>
        <input type="tel" name="phone" value={phoneNo} id="phone" onChange={e=>{setPhoneNo(e.target.value)}} placeholder='Mobile No.'  />
        <input id='email' name='email' value={email} placeholder='email' onChange={e=>{setEmail(e.target.value)}} type='email'/>
        <input id='password' name='password' value={password} placeholder='password' onChange={e=>{setPassword(e.target.value)}} type='password'/>
        <button className='add' type='submit' >Add</button>
    </form>
  )
}

export default User